import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
        tasks: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!agent) {
      return Response.json({ error: "Agent not found" }, { status: 404 });
    }

    return Response.json(agent);
  } catch (error) {
    console.error("Failed to fetch agent:", error);
    return Response.json({ error: "Failed to fetch agent" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const agent = await prisma.agent.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        systemPrompt: body.systemPrompt,
      },
      include: {
        unit: true,
      },
    });

    return Response.json(agent);
  } catch (error) {
    console.error("Failed to update agent:", error);
    return Response.json({ error: "Failed to update agent" }, { status: 500 });
  }
}
