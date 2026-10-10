import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/validators";

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: "singleton" },
    });

    return Response.json({
      hasApiKey: !!settings?.apiKey,
    });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return Response.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const settings = await prisma.settings.upsert({
      where: { id: "singleton" },
      update: { apiKey: parsed.data.apiKey },
      create: { id: "singleton", apiKey: parsed.data.apiKey },
    });

    return Response.json({ hasApiKey: !!settings.apiKey });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return Response.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
