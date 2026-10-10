import { prisma } from "@/lib/prisma";
import { createProcessSchema } from "@/lib/validators";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const processes = await prisma.process.findMany({
      where: { unitId: id },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(processes);
  } catch (error) {
    console.error("Failed to fetch processes:", error);
    return Response.json(
      { error: "Failed to fetch processes" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = createProcessSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const unit = await prisma.realEstateUnit.findUnique({ where: { id } });
    if (!unit) {
      return Response.json({ error: "Unit not found" }, { status: 404 });
    }

    const process = await prisma.process.create({
      data: {
        ...parsed.data,
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
        unitId: id,
      },
    });

    return Response.json(process, { status: 201 });
  } catch (error) {
    console.error("Failed to create process:", error);
    return Response.json(
      { error: "Failed to create process" },
      { status: 500 }
    );
  }
}
