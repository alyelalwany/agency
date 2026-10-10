"use client";

import { useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { Building2, Plus, Users, Cog } from "lucide-react";
import type { UnitWithRelations } from "@/types";
import UnitNode from "@/components/flow/nodes/unit-node";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const nodeTypes = { unit: UnitNode };

export default function DashboardFlow() {
  const router = useRouter();
  const { data: units, error, isLoading } = useSWR<UnitWithRelations[]>("/api/units", fetcher);

  const { computedNodes, computedEdges, stats } = useMemo(() => {
    if (!units || !Array.isArray(units) || units.length === 0) {
      return { computedNodes: [] as Node[], computedEdges: [] as Edge[], stats: { totalUnits: 0, totalTenants: 0, activeProcesses: 0 } };
    }

    const columns = Math.ceil(Math.sqrt(units.length));
    const spacingX = 350;
    const spacingY = 250;

    let totalTenants = 0;
    let activeProcesses = 0;

    const nodes: Node[] = units.map((unit, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      totalTenants += unit.tenants.length;
      activeProcesses += unit.processes.filter((p: { status: string }) => p.status === "in_progress").length;

      return {
        id: unit.id,
        type: "unit",
        position: { x: col * spacingX + 50, y: row * spacingY + 100 },
        data: {
          name: unit.name,
          address: unit.address,
          type: unit.type,
          status: unit.status,
          tenantCount: unit.tenants.length,
          unitId: unit.id,
        },
      };
    });

    return {
      computedNodes: nodes,
      computedEdges: [] as Edge[],
      stats: {
        totalUnits: units.length,
        totalTenants,
        activeProcesses,
      },
    };
  }, [units]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    setNodes(computedNodes);
    setEdges(computedEdges);
  }, [computedNodes, computedEdges, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      router.push(`/units/${node.id}`);
    },
    [router]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading units...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 font-medium">Failed to load units</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Stats bar */}
      <div className="absolute top-4 left-4 z-10 flex gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{stats.totalUnits}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Units</span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center gap-2">
          <Users className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{stats.totalTenants}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Tenants</span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center gap-2">
          <Cog className="h-4 w-4 text-orange-600" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{stats.activeProcesses}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Active Processes</span>
        </div>
      </div>

      {/* Add Unit button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => router.push("/units/new")}
          className="bg-blue-600 text-white rounded-lg shadow-sm px-4 py-2 flex items-center gap-2 hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Unit
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <MiniMap
          nodeStrokeColor="#e5e7eb"
          nodeColor="#dbeafe"
          nodeBorderRadius={8}
        />
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} className="!bg-gray-50 dark:!bg-gray-950" />
      </ReactFlow>
    </div>
  );
}
