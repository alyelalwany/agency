import { prisma } from "@/lib/prisma";
import { updateUnitSchema } from "@/lib/validators";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const unit = await prisma.realEstateUnit.findUnique({
      where: { id },
      include: {
        tenants: true,
        amenities: true,
        processes: true,
        agent: true,
        tasks: {
          include: { messages: true },
        },
      },
    });

    if (!unit) {
      return Response.json({ error: "Unit not found" }, { status: 404 });
    }

    return Response.json(unit);
  } catch (error) {
    console.error("Failed to fetch unit:", error);
    return Response.json({ error: "Failed to fetch unit" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateUnitSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const unit = await prisma.realEstateUnit.update({
      where: { id },
      data: parsed.data,
      include: {
        tenants: true,
        amenities: true,
        processes: true,
        agent: true,
      },
    });

    return Response.json(unit);
  } catch (error) {
    console.error("Failed to update unit:", error);
    return Response.json({ error: "Failed to update unit" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.realEstateUnit.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete unit:", error);
    return Response.json({ error: "Failed to delete unit" }, { status: 500 });
  }
}
