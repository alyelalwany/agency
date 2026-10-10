"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { UserPlus, TreePalm, ClipboardList } from "lucide-react";
import type { UnitWithRelations, Tenant, Amenity, Process } from "@/types";
import { getLayoutedElements } from "@/components/flow/layout-utils";
import UnitNode from "@/components/flow/nodes/unit-node";
import TenantNode from "@/components/flow/nodes/tenant-node";
import AmenityNode from "@/components/flow/nodes/amenity-node";
import ProcessNode from "@/components/flow/nodes/process-node";
import AgentNode from "@/components/flow/nodes/agent-node";
import DetailPanel from "@/components/detail-panel";
import { TenantForm } from "@/components/forms/tenant-form";
import { AmenityForm } from "@/components/forms/amenity-form";
import { ProcessForm } from "@/components/forms/process-form";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const nodeTypes = {
  unit: UnitNode,
  tenant: TenantNode,
  amenity: AmenityNode,
  process: ProcessNode,
  agent: AgentNode,
};

export default function UnitDetailFlow({ unitId }: { unitId: string }) {
  const router = useRouter();
  const { data: unit, error, isLoading, mutate } = useSWR<UnitWithRelations>(
    `/api/units/${unitId}`,
    fetcher
  );
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [editingTenant, setEditingTenant] = useState<Partial<Tenant> | null>(null);
  const [editingAmenity, setEditingAmenity] = useState<Partial<Amenity> | null>(null);
  const [editingProcess, setEditingProcess] = useState<Partial<Process> | null>(null);
  const [showTenantForm, setShowTenantForm] = useState(false);
  const [showAmenityForm, setShowAmenityForm] = useState(false);
  const [showProcessForm, setShowProcessForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; name: string } | null>(null);

  const { layoutedNodes, layoutedEdges } = useMemo(() => {
    if (!unit || !unit.tenants) {
      return { layoutedNodes: [] as Node[], layoutedEdges: [] as Edge[] };
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    nodes.push({
      id: unit.id,
      type: "unit",
      position: { x: 0, y: 0 },
      data: {
        name: unit.name,
        address: unit.address,
        type: unit.type,
        status: unit.status,
        tenantCount: unit.tenants.length,
        unitId: unit.id,
      },
    });

    const parentId = unit.agent ? unit.agent.id : unit.id;

    if (unit.agent) {
      nodes.push({
        id: unit.agent.id,
        type: "agent",
        position: { x: 0, y: 0 },
        data: {
          name: unit.agent.name,
          unitId: unit.id,
        },
      });
      edges.push({
        id: `e-${unit.id}-${unit.agent.id}`,
        source: unit.id,
        target: unit.agent.id,
        type: "smoothstep",
        animated: true,
      });
    }

    unit.tenants.forEach((tenant: Tenant) => {
      nodes.push({
        id: tenant.id,
        type: "tenant",
        position: { x: 0, y: 0 },
        data: {
          id: tenant.id,
          name: tenant.name,
          email: tenant.email,
          phone: tenant.phone,
          leaseStart: tenant.leaseStart,
          leaseEnd: tenant.leaseEnd,
          rentAmount: tenant.rentAmount,
          rentStatus: tenant.rentStatus,
        },
      });
      edges.push({
        id: `e-${parentId}-${tenant.id}`,
        source: parentId,
        target: tenant.id,
        type: "smoothstep",
      });
    });

    unit.amenities.forEach((amenity: Amenity) => {
      nodes.push({
        id: amenity.id,
        type: "amenity",
        position: { x: 0, y: 0 },
        data: {
          id: amenity.id,
          name: amenity.name,
          type: amenity.type,
          status: amenity.status,
          description: amenity.description,
        },
      });
      edges.push({
        id: `e-${parentId}-${amenity.id}`,
        source: parentId,
        target: amenity.id,
        type: "smoothstep",
      });
    });

    unit.processes.forEach((process: Process) => {
      nodes.push({
        id: process.id,
        type: "process",
        position: { x: 0, y: 0 },
        data: {
          id: process.id,
          title: process.title,
          description: process.description,
          type: process.type,
          status: process.status,
          dueDate: process.dueDate,
        },
      });
      edges.push({
        id: `e-${parentId}-${process.id}`,
        source: parentId,
        target: process.id,
        type: "smoothstep",
      });
    });

    const { nodes: ln, edges: le } = getLayoutedElements(nodes, edges, "TB");
    return { layoutedNodes: ln, layoutedEdges: le };
  }, [unit]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === "agent" && unit) {
        router.push(`/units/${unit.id}/agent`);
        return;
      }
      if (node.type === "unit") {
        return;
      }
      setSelectedNode(node);
    },
    [router, unit]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleEdit = useCallback((node: Node) => {
    setSelectedNode(null);
    if (node.type === "tenant") {
      setEditingTenant(node.data as Partial<Tenant>);
      setShowTenantForm(true);
    } else if (node.type === "amenity") {
      setEditingAmenity(node.data as Partial<Amenity>);
      setShowAmenityForm(true);
    } else if (node.type === "process") {
      setEditingProcess(node.data as Partial<Process>);
      setShowProcessForm(true);
    }
  }, []);

  const handleDelete = useCallback((node: Node) => {
    const name = (node.data as Record<string, unknown>).name as string
      || (node.data as Record<string, unknown>).title as string
      || "this item";
    setDeleteConfirm({ type: node.type!, id: node.id, name });
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    const typeMap: Record<string, string> = {
      tenant: "tenants",
      amenity: "amenities",
      process: "processes",
    };
    const segment = typeMap[type];
    if (!segment) return;

    await fetch(`/api/units/${unitId}/${segment}/${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    setSelectedNode(null);
    mutate();
  }, [deleteConfirm, unitId, mutate]);

  const handleFormSave = useCallback(() => {
    mutate();
  }, [mutate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading unit details...</p>
        </div>
      </div>
    );
  }

  if (error || !unit) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 font-medium">Failed to load unit</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
        <button
          onClick={() => { setEditingTenant(undefined!); setShowTenantForm(true); }}
          className="bg-green-600 text-white rounded-lg shadow-md px-4 py-2 flex items-center gap-2 hover:bg-green-700 transition-colors text-sm font-medium"
        >
          <UserPlus className="h-4 w-4" />
          Add Tenant
        </button>
        <button
          onClick={() => { setEditingAmenity(undefined!); setShowAmenityForm(true); }}
          className="bg-purple-600 text-white rounded-lg shadow-md px-4 py-2 flex items-center gap-2 hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          <TreePalm className="h-4 w-4" />
          Add Amenity
        </button>
        <button
          onClick={() => { setEditingProcess(undefined!); setShowProcessForm(true); }}
          className="bg-orange-600 text-white rounded-lg shadow-md px-4 py-2 flex items-center gap-2 hover:bg-orange-700 transition-colors text-sm font-medium"
        >
          <ClipboardList className="h-4 w-4" />
          Add Process
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
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

      <DetailPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <TenantForm
        open={showTenantForm}
        onClose={() => { setShowTenantForm(false); setEditingTenant(null); }}
        onSave={handleFormSave}
        unitId={unitId}
        initialData={editingTenant ?? undefined}
      />

      <AmenityForm
        open={showAmenityForm}
        onClose={() => { setShowAmenityForm(false); setEditingAmenity(null); }}
        onSave={handleFormSave}
        unitId={unitId}
        initialData={editingAmenity ?? undefined}
      />

      <ProcessForm
        open={showProcessForm}
        onClose={() => { setShowProcessForm(false); setEditingProcess(null); }}
        onSave={handleFormSave}
        unitId={unitId}
        initialData={editingProcess ?? undefined}
      />

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-white dark:bg-gray-900 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
