"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Cog } from "lucide-react";
import { cn } from "@/lib/utils";

type ProcessNodeData = {
  title: string;
  type: string;
  status: "pending" | "in_progress" | "completed";
  dueDate?: string;
};

const statusStyles: Record<string, string> = {
  pending: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

function ProcessNode({ data }: NodeProps) {
  const { title, type, status, dueDate } = data as unknown as ProcessNodeData;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 border-l-4 border-l-orange-500 w-[260px] cursor-pointer hover:shadow-lg transition-shadow">
      <Handle type="target" position={Position.Top} className="!bg-orange-500 !w-3 !h-3" />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Cog
            className={cn(
              "h-4 w-4 text-orange-600",
              status === "in_progress" && "animate-spin"
            )}
          />
          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
            {title}
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{type}</span>
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              statusStyles[status]
            )}
          >
            {status === "in_progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        {dueDate && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Due: {new Date(dueDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

export default memo(ProcessNode);
