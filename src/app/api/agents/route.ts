import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      include: {
        unit: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(agents);
  } catch (error) {
    console.error("Failed to fetch agents:", error);
    return Response.json({ error: "Failed to fetch agents" }, { status: 500 });
  }
}
