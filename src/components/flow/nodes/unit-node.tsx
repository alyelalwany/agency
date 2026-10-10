"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type UnitNodeData = {
  name: string;
  address: string;
  type: "residential" | "commercial" | "mixed";
  status: "active" | "maintenance" | "inactive";
  tenantCount: number;
  unitId: string;
};

const statusColors: Record<string, string> = {
  active: "bg-green-500",
  maintenance: "bg-yellow-500",
  inactive: "bg-red-500",
};

const typeBadgeColors: Record<string, string> = {
  residential: "bg-blue-100 text-blue-800",
  commercial: "bg-amber-100 text-amber-800",
  mixed: "bg-purple-100 text-purple-800",
};

function UnitNode({ data }: NodeProps) {
  const { name, address, type, status, tenantCount } = data as unknown as UnitNodeData;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 border-l-4 border-l-blue-500 w-[260px] cursor-pointer hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate max-w-[140px]">
              {name}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={cn("w-2 h-2 rounded-full", statusColors[status])} />
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate">{address}</p>
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
              typeBadgeColors[type]
            )}
          >
            {type}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {tenantCount} {tenantCount === 1 ? "tenant" : "tenants"}
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !w-3 !h-3" />
    </div>
  );
}

export default memo(UnitNode);
