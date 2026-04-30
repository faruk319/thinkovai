"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Brain, ArrowRight, Loader2 } from "lucide-react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ReactFlowProvider,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "@/components/MindMap/CustomNode";

const nodeTypes = { customNode: CustomNode };

export default function SharedMapPage() {
  const params = useParams();
  const token = params.token as string;

  const [title, setTitle] = useState("Loading Map...");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSharedMap = async () => {
      try {
        // We need a specific API route to fetch by share_token, 
        // For MVP we'll construct a direct Supabase query since it's client-side, 
        // but normally this should go through an API route to keep RLS secure.
        const { createClient } = await import("@/lib/supabase");
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from("mindmaps")
          .select("*")
          .eq("share_token", token)
          .eq("is_public", true)
          .single();

        if (error || !data) {
          throw new Error("Map not found or is no longer public.");
        }

        setTitle(data.title);
        setNodes(data.data?.nodes || []);
        setEdges(data.data?.edges || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedMap();
  }, [token]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#08080f]">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#08080f] text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <Brain size={24} className="text-white/30" />
        </div>
        <h1 className="text-xl font-bold mb-2">Map Not Found</h1>
        <p className="text-white/50 text-sm mb-8">{error}</p>
        <Link href="/" className="px-6 py-3 bg-violet-600 rounded-xl text-sm font-semibold">
          Create Your Own Map
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#08080f]">
      {/* Read-only Header */}
      <nav className="h-14 border-b border-white/5 bg-[#0d0d1a]/80 backdrop-blur-md flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
          <Brain size={20} className="text-violet-400" />
          <h1 className="text-sm font-semibold">{title}</h1>
          <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-white/40 uppercase tracking-wider font-bold">Read Only</span>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-violet-600/20 text-violet-300 hover:bg-violet-600 hover:text-white transition-colors text-sm font-medium"
        >
          Create your own <ArrowRight size={14} />
        </Link>
      </nav>

      {/* Read-only Canvas */}
      <div className="flex-1 relative">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            proOptions={{ hideAttribution: true }}
            className="bg-[#08080f]"
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#ffffff08" />
            <Controls showInteractive={false} className="!bg-[#0d0d1a] !border-white/10 !rounded-xl [&>button]:!bg-[#0d0d1a] [&>button]:!border-white/10 [&>button]:!text-white/60 [&>button:hover]:!bg-white/10" />
            <MiniMap maskColor="rgba(0, 0, 0, 0.7)" className="!bg-[#0d0d1a] !border-white/10 !rounded-xl" />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
}
