"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface ChatInterfaceProps {
  agentId: string;
  unitId: string;
  agentName: string;
}

export function ChatInterface({
  agentId,
  unitId,
  agentName,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    // Attempt to load existing messages - API may not exist yet
    fetch(`/api/agents/${agentId}/chat`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMessages(
            data.map(
              (m: { id: string; role: string; content: string; createdAt?: string }) => ({
                id: m.id,
                role: m.role as "user" | "assistant",
                content: m.content,
                timestamp: m.createdAt
                  ? new Date(m.createdAt).toLocaleTimeString()
                  : undefined,
              })
            )
          );
        }
      })
      .catch(() => {
        // API not available yet - start with empty messages
      });
  }, [agentId]);

  const handleSend = useCallback(
    async (message: string) => {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: message,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const assistantId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      try {
        const res = await fetch(`/api/agents/${agentId}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });

        if (!res.ok) {
          const error = await res.json().catch(() => ({ error: "Request failed" }));
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: `Error: ${error.error || "Request failed"}` }
                : m
            )
          );
          setIsLoading(false);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: "Error: No response stream" }
                : m
            )
          );
          setIsLoading(false);
          return;
        }

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                break;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  accumulated += parsed.text;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? {
                            ...m,
                            content: accumulated,
                            timestamp: new Date().toLocaleTimeString(),
                          }
                        : m
                    )
                  );
                }
              } catch {
                // Skip malformed JSON chunks
              }
            }
          }
        }
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: `Error: ${err instanceof Error ? err.message : "Failed to send message"}`,
                }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [agentId]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium">
                Chat with {agentName}
              </p>
              <p className="mt-1 text-sm">
                Send a message to start the conversation.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
