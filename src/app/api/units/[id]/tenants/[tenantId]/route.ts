import { prisma } from "@/lib/prisma";
import { updateTenantSchema } from "@/lib/validators";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; tenantId: string }> }
) {
  try {
    const { id, tenantId } = await params;
    const body = await request.json();
    const parsed = updateTenantSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Verify tenant belongs to unit
    const existing = await prisma.tenant.findFirst({
      where: { id: tenantId, unitId: id },
    });
    if (!existing) {
      return Response.json({ error: "Tenant not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.leaseStart) data.leaseStart = new Date(parsed.data.leaseStart);
    if (parsed.data.leaseEnd) data.leaseEnd = new Date(parsed.data.leaseEnd);

    const tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data,
    });

    return Response.json(tenant);
  } catch (error) {
    console.error("Failed to update tenant:", error);
    return Response.json(
      { error: "Failed to update tenant" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; tenantId: string }> }
) {
  try {
    const { id, tenantId } = await params;

    // Verify tenant belongs to unit
    const existing = await prisma.tenant.findFirst({
      where: { id: tenantId, unitId: id },
    });
    if (!existing) {
      return Response.json({ error: "Tenant not found" }, { status: 404 });
    }

    await prisma.tenant.delete({ where: { id: tenantId } });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete tenant:", error);
    return Response.json(
      { error: "Failed to delete tenant" },
      { status: 500 }
    );
  }
}
