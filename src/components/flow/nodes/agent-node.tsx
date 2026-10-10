"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Bot } from "lucide-react";

type AgentNodeData = {
  name: string;
  unitId: string;
};

function AgentNode({ data }: NodeProps) {
  const { name } = data as unknown as AgentNodeData;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-[2px] rounded-lg w-[260px] cursor-pointer hover:shadow-lg transition-shadow">
      <Handle type="target" position={Position.Top} className="!bg-purple-500 !w-3 !h-3" />
      <div className="bg-white dark:bg-gray-800 rounded-[6px] p-4">
        <div className="flex items-center gap-2 mb-1">
          <Bot className="h-4 w-4 text-purple-600" />
          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
            {name}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">AI Assistant</p>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !w-3 !h-3" />
    </div>
  );
}

export default memo(AgentNode);
