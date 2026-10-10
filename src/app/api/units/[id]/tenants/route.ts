import { prisma } from "@/lib/prisma";
import { createTenantSchema } from "@/lib/validators";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenants = await prisma.tenant.findMany({
      where: { unitId: id },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(tenants);
  } catch (error) {
    console.error("Failed to fetch tenants:", error);
    return Response.json(
      { error: "Failed to fetch tenants" },
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
    const parsed = createTenantSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Verify unit exists
    const unit = await prisma.realEstateUnit.findUnique({ where: { id } });
    if (!unit) {
      return Response.json({ error: "Unit not found" }, { status: 404 });
    }

    const tenant = await prisma.tenant.create({
      data: {
        ...parsed.data,
        leaseStart: new Date(parsed.data.leaseStart),
        leaseEnd: new Date(parsed.data.leaseEnd),
        unitId: id,
      },
    });

    return Response.json(tenant, { status: 201 });
  } catch (error) {
    console.error("Failed to create tenant:", error);
    return Response.json(
      { error: "Failed to create tenant" },
      { status: 500 }
    );
  }
}
