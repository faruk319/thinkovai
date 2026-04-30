"use client";

import { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import CustomNode from "./CustomNode";
import Toolbar from "./Toolbar";

const nodeTypes = { customNode: CustomNode };

interface MindMapEditorProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  onMapChange?: (nodes: Node[], edges: Edge[]) => void;
}

function MindMapEditorInner({
  initialNodes,
  initialEdges,
  onMapChange,
}: MindMapEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const idCounter = useRef(initialNodes.length + 1);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            style: { stroke: "#a1a1aa", strokeWidth: 2 },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onSelectionChange = useCallback(
    ({ nodes: selected }: { nodes: Node[] }) => {
      setSelectedNodes(selected.map((n) => n.id));
    },
    []
  );

  const handleNodesChange: typeof onNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      // Trigger save callback after changes settle
      setTimeout(() => {
        onMapChange?.(nodes, edges);
      }, 100);
    },
    [onNodesChange, onMapChange, nodes, edges]
  );

  const handleAddNode = useCallback(() => {
    const newId = `node_${idCounter.current++}`;
    const newNode: Node = {
      id: newId,
      type: "customNode",
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { label: "New Node", nodeType: "leaf" },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedNodes.length === 0) return;
    setNodes((nds) => nds.filter((n) => !selectedNodes.includes(n.id)));
    setEdges((eds) =>
      eds.filter(
        (e) =>
          !selectedNodes.includes(e.source) &&
          !selectedNodes.includes(e.target)
      )
    );
    setSelectedNodes([]);
  }, [selectedNodes, setNodes, setEdges]);

  return (
    <div className="w-full h-full relative">
      <Toolbar
        onAddNode={handleAddNode}
        onDeleteSelected={handleDeleteSelected}
        onZoomIn={() => zoomIn()}
        onZoomOut={() => zoomOut()}
        onFitView={() => fitView({ padding: 0.2 })}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        className="bg-[#fbfcfa]"
        defaultEdgeOptions={{
          style: { stroke: "#a1a1aa", strokeWidth: 2 },
          animated: false,
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#e4e4e7"
        />
        <MiniMap
          nodeColor={() => "#e4e4e7"}
          maskColor="rgba(255, 255, 255, 0.7)"
          className="!bg-white !border-zinc-200 !rounded-xl shadow-sm"
          pannable
          zoomable
        />
        <Controls className="!bg-white !border-zinc-200 !rounded-xl shadow-sm [&>button]:!bg-white [&>button]:!border-zinc-200 [&>button]:!text-zinc-500 [&>button:hover]:!bg-zinc-50" />
      </ReactFlow>
    </div>
  );
}

export default function MindMapEditor(props: MindMapEditorProps) {
  return (
    <ReactFlowProvider>
      <MindMapEditorInner {...props} />
    </ReactFlowProvider>
  );
}
