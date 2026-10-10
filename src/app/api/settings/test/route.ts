import { NextResponse } from "next/server";
import { getClaudeClient } from "@/lib/claude";

export async function POST() {
  try {
    const client = await getClaudeClient();
    if (!client) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 400 }
      );
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 10,
      messages: [{ role: "user", content: "Hi" }],
    });

    if (response.content.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Connection successful! API key is valid.",
      });
    }

    return NextResponse.json(
      { error: "Unexpected response from API" },
      { status: 500 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Connection failed: ${message}` },
      { status: 500 }
    );
  }
}
