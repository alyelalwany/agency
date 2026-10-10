"use client";

import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "max-w-[75%] rounded-lg px-4 py-2.5",
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
        )}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
        {timestamp && (
          <p
            className={cn(
              "mt-1 text-xs",
              isUser ? "text-blue-200" : "text-gray-500 dark:text-gray-400"
            )}
          >
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}
