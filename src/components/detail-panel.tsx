"use client";

import { X, Edit, Trash2, User, Dumbbell, Cog } from "lucide-react";
import type { Node } from "@xyflow/react";
import { cn } from "@/lib/utils";

interface DetailPanelProps {
  node: Node | null;
  onClose: () => void;
  onEdit: (node: Node) => void;
  onDelete: (node: Node) => void;
}

export default function DetailPanel({ node, onClose, onEdit, onDelete }: DetailPanelProps) {
  if (!node) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      <div className="fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto animate-slide-in">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {node.type === "tenant" && "Tenant Details"}
            {node.type === "amenity" && "Amenity Details"}
            {node.type === "process" && "Process Details"}
            {node.type === "agent" && "Agent Details"}
            {node.type === "unit" && "Unit Details"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4">
          {node.type === "tenant" && <TenantDetails data={node.data} />}
          {node.type === "amenity" && <AmenityDetails data={node.data} />}
          {node.type === "process" && <ProcessDetails data={node.data} />}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex gap-3">
          <button
            onClick={() => onEdit(node)}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(node)}
            className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-medium"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

function TenantDetails({ data }: { data: Record<string, unknown> }) {
  const rentStatusColors: Record<string, string> = {
    paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    partial: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{data.name as string}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{data.email as string}</p>
        </div>
      </div>
      <div className="space-y-3">
        <DetailRow label="Rent Amount" value={`$${(data.rentAmount as number).toLocaleString()}/mo`} />
        <DetailRow
          label="Payment Status"
          value={
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                rentStatusColors[data.rentStatus as string]
              )}
            >
              {data.rentStatus as string}
            </span>
          }
        />
      </div>
    </div>
  );
}

function AmenityDetails({ data }: { data: Record<string, unknown> }) {
  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    inactive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    maintenance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
          <Dumbbell className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{data.name as string}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{data.type as string}</p>
        </div>
      </div>
      <div className="space-y-3">
        <DetailRow
          label="Status"
          value={
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                statusColors[data.status as string]
              )}
            >
              {data.status as string}
            </span>
          }
        />
      </div>
    </div>
  );
}

function ProcessDetails({ data }: { data: Record<string, unknown> }) {
  const statusColors: Record<string, string> = {
    pending: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  };

  const statusLabel = (data.status as string) === "in_progress" ? "In Progress" : ((data.status as string).charAt(0).toUpperCase() + (data.status as string).slice(1));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
          <Cog className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{data.title as string}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{data.type as string}</p>
        </div>
      </div>
      <div className="space-y-3">
        <DetailRow
          label="Status"
          value={
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                statusColors[data.status as string]
              )}
            >
              {statusLabel}
            </span>
          }
        />
        {data.dueDate != null && (
          <DetailRow
            label="Due Date"
            value={new Date(data.dueDate as string).toLocaleDateString()}
          />
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
}
