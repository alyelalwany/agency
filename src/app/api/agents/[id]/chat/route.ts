import { prisma } from "@/lib/prisma";
import { getClaudeClient } from "@/lib/claude";
import { buildSystemPrompt } from "@/lib/agent-prompts";
import { chatMessageSchema } from "@/lib/validators";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = chatMessageSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // 1. Load Claude client (requires API key in Settings)
    const client = await getClaudeClient();
    if (!client) {
      return Response.json(
        { error: "API key not configured. Please set your Anthropic API key in Settings." },
        { status: 503 }
      );
    }

    // 2. Load agent with full unit context
    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        unit: {
          include: {
            tenants: true,
            amenities: true,
            processes: true,
          },
        },
      },
    });

    if (!agent) {
      return Response.json({ error: "Agent not found" }, { status: 404 });
    }

    // 3. Load conversation history
    const history = await prisma.chatMessage.findMany({
      where: { agentId: id, taskId: parsed.data.taskId ?? undefined },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    // 4. Save user message to DB
    await prisma.chatMessage.create({
      data: {
        role: "user",
        content: parsed.data.message,
        agentId: id,
        taskId: parsed.data.taskId ?? undefined,
      },
    });

    // 5. Build system prompt
    const systemPrompt = buildSystemPrompt({ agent });

    // 6. Build messages array from history
    const messages = [
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: parsed.data.message },
    ];

    // 7. Stream response using SSE
    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const messageStream = client.messages.stream({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4096,
            system: systemPrompt,
            messages,
          });

          messageStream.on("text", (text) => {
            fullResponse += text;
            const data = JSON.stringify({ type: "text", content: text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          });

          await messageStream.finalMessage();

          // 8. Save complete assistant response
          await prisma.chatMessage.create({
            data: {
              role: "assistant",
              content: fullResponse,
              agentId: id,
              taskId: parsed.data.taskId ?? undefined,
            },
          });

          const doneData = JSON.stringify({ type: "done", content: fullResponse });
          controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          const errData = JSON.stringify({
            type: "error",
            content: "An error occurred during streaming",
          });
          controller.enqueue(encoder.encode(`data: ${errData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json({ error: "Chat request failed" }, { status: 500 });
  }
}
