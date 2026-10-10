import { prisma } from "@/lib/prisma";
import { createAmenitySchema } from "@/lib/validators";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const amenities = await prisma.amenity.findMany({
      where: { unitId: id },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(amenities);
  } catch (error) {
    console.error("Failed to fetch amenities:", error);
    return Response.json(
      { error: "Failed to fetch amenities" },
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
    const parsed = createAmenitySchema.safeParse(body);

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

    const amenity = await prisma.amenity.create({
      data: {
        ...parsed.data,
        unitId: id,
      },
    });

    return Response.json(amenity, { status: 201 });
  } catch (error) {
    console.error("Failed to create amenity:", error);
    return Response.json(
      { error: "Failed to create amenity" },
      { status: 500 }
    );
  }
}
