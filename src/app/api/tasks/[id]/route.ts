import { prisma } from "@/lib/prisma";
import { updateTaskSchema } from "@/lib/validators";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        agent: true,
        unit: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!task) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    return Response.json(task);
  } catch (error) {
    console.error("Failed to fetch task:", error);
    return Response.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const task = await prisma.task.update({
      where: { id },
      data: parsed.data,
      include: {
        agent: true,
        unit: true,
      },
    });

    return Response.json(task);
  } catch (error) {
    console.error("Failed to update task:", error);
    return Response.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.task.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete task:", error);
    return Response.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
