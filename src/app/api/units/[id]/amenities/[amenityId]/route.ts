import { prisma } from "@/lib/prisma";
import { updateAmenitySchema } from "@/lib/validators";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; amenityId: string }> }
) {
  try {
    const { id, amenityId } = await params;
    const body = await request.json();
    const parsed = updateAmenitySchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const existing = await prisma.amenity.findFirst({
      where: { id: amenityId, unitId: id },
    });
    if (!existing) {
      return Response.json({ error: "Amenity not found" }, { status: 404 });
    }

    const amenity = await prisma.amenity.update({
      where: { id: amenityId },
      data: parsed.data,
    });

    return Response.json(amenity);
  } catch (error) {
    console.error("Failed to update amenity:", error);
    return Response.json(
      { error: "Failed to update amenity" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; amenityId: string }> }
) {
  try {
    const { id, amenityId } = await params;

    const existing = await prisma.amenity.findFirst({
      where: { id: amenityId, unitId: id },
    });
    if (!existing) {
      return Response.json({ error: "Amenity not found" }, { status: 404 });
    }

    await prisma.amenity.delete({ where: { id: amenityId } });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete amenity:", error);
    return Response.json(
      { error: "Failed to delete amenity" },
      { status: 500 }
    );
  }
}
