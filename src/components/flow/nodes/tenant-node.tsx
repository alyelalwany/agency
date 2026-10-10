"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

type TenantNodeData = {
  name: string;
  email: string;
  rentAmount: number;
  rentStatus: "paid" | "overdue" | "pending" | "partial";
};

const rentStatusStyles: Record<string, string> = {
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  partial: "bg-blue-100 text-blue-800",
};

function TenantNode({ data }: NodeProps) {
  const { name, email, rentAmount, rentStatus } = data as unknown as TenantNodeData;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 border-l-4 border-l-green-500 w-[260px] cursor-pointer hover:shadow-lg transition-shadow">
      <Handle type="target" position={Position.Top} className="!bg-green-500 !w-3 !h-3" />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4 text-green-600" />
          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
            {name}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate">{email}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            ${rentAmount.toLocaleString()}/mo
          </span>
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
              rentStatusStyles[rentStatus]
            )}
          >
            {rentStatus}
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(TenantNode);
