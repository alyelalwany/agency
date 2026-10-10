"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Dumbbell, Car, Waves, Trees, Coffee, Shield, Wifi, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AmenityNodeData = {
  name: string;
  type: string;
  status: "active" | "inactive" | "maintenance";
};

const amenityIcons: Record<string, LucideIcon> = {
  gym: Dumbbell,
  parking: Car,
  pool: Waves,
  garden: Trees,
  lounge: Coffee,
  security: Shield,
  wifi: Wifi,
};

const statusStyles: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
  maintenance: "bg-yellow-100 text-yellow-800",
};

function AmenityNode({ data }: NodeProps) {
  const { name, type, status } = data as unknown as AmenityNodeData;
  const Icon = amenityIcons[type.toLowerCase()] || Coffee;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 border-l-4 border-l-purple-500 w-[260px] cursor-pointer hover:shadow-lg transition-shadow">
      <Handle type="target" position={Position.Top} className="!bg-purple-500 !w-3 !h-3" />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-4 w-4 text-purple-600" />
          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
            {name}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{type}</span>
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
              statusStyles[status]
            )}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(AmenityNode);
