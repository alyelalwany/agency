import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "./prisma";

export async function getClaudeClient(): Promise<Anthropic | null> {
  const settings = await prisma.settings.findUnique({
    where: { id: "singleton" },
  });
  if (!settings?.apiKey) return null;
  return new Anthropic({ apiKey: settings.apiKey });
}
