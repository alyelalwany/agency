import Link from "next/link";
import { ArrowLeft, Bot } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ChatInterface } from "@/components/chat/chat-interface";

export default async function AgentChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const unit = await prisma.realEstateUnit.findUnique({
    where: { id },
    include: { agent: true },
  });

  if (!unit) {
    notFound();
  }

  const agent = unit.agent;
  const agentName = agent?.name || "AI Agent";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <Link
          href={`/units/${id}`}
          className="rounded-md p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Back to unit"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Bot className="h-5 w-5 text-blue-600" />
        <div>
          <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
            {agentName}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {unit.name}
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {agent ? (
          <ChatInterface
            agentId={agent.id}
            unitId={id}
            agentName={agentName}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Bot className="mx-auto h-12 w-12 mb-3 opacity-50" />
              <p className="text-lg font-medium">No agent configured</p>
              <p className="mt-1 text-sm">
                This unit does not have an AI agent assigned yet.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
