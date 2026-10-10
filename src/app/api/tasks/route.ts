import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const unitId = searchParams.get("unitId");
    const agentId = searchParams.get("agentId");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (unitId) where.unitId = unitId;
    if (agentId) where.agentId = agentId;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        agent: true,
        unit: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return Response.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: parsed.data,
      include: {
        agent: true,
        unit: true,
      },
    });

    return Response.json(task, { status: 201 });
  } catch (error) {
    console.error("Failed to create task:", error);
    return Response.json({ error: "Failed to create task" }, { status: 500 });
  }
}
