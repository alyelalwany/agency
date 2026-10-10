import { prisma } from "@/lib/prisma";
import { updateProcessSchema } from "@/lib/validators";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; processId: string }> }
) {
  try {
    const { id, processId } = await params;
    const body = await request.json();
    const parsed = updateProcessSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const existing = await prisma.process.findFirst({
      where: { id: processId, unitId: id },
    });
    if (!existing) {
      return Response.json({ error: "Process not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.dueDate) data.dueDate = new Date(parsed.data.dueDate);

    const process = await prisma.process.update({
      where: { id: processId },
      data,
    });

    return Response.json(process);
  } catch (error) {
    console.error("Failed to update process:", error);
    return Response.json(
      { error: "Failed to update process" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; processId: string }> }
) {
  try {
    const { id, processId } = await params;

    const existing = await prisma.process.findFirst({
      where: { id: processId, unitId: id },
    });
    if (!existing) {
      return Response.json({ error: "Process not found" }, { status: 404 });
    }

    await prisma.process.delete({ where: { id: processId } });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete process:", error);
    return Response.json(
      { error: "Failed to delete process" },
      { status: 500 }
    );
  }
}
