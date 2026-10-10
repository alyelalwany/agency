import { prisma } from "@/lib/prisma";
import { createUnitSchema } from "@/lib/validators";

export async function GET() {
  try {
    const units = await prisma.realEstateUnit.findMany({
      include: {
        tenants: true,
        amenities: true,
        processes: true,
        agent: true,
        tasks: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(units);
  } catch (error) {
    console.error("Failed to fetch units:", error);
    return Response.json({ error: "Failed to fetch units" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createUnitSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const unit = await prisma.realEstateUnit.create({
      data: {
        ...parsed.data,
        agent: {
          create: {
            name: `${parsed.data.name} Assistant`,
            description: `AI property management assistant for ${parsed.data.name}`,
          },
        },
      },
      include: {
        tenants: true,
        amenities: true,
        processes: true,
        agent: true,
      },
    });

    return Response.json(unit, { status: 201 });
  } catch (error) {
    console.error("Failed to create unit:", error);
    return Response.json({ error: "Failed to create unit" }, { status: 500 });
  }
}
