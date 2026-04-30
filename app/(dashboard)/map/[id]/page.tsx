"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, ArrowLeft, Share2, MessageSquare, Loader2, Save, FileUp, Sparkles, AlertCircle } from "lucide-react";
import MindMapEditor from "@/components/MindMap/MindMapEditor";
import Sidebar from "@/components/MindMap/Sidebar";
import type { Node, Edge } from "@xyflow/react";

export default function MapEditorPage() {
  const params = useParams();
  const router = useRouter();
  const mapId = params.id as string;

  const [title, setTitle] = useState("Loading...");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Fetch initial map data
  useEffect(() => {
    const fetchMap = async () => {
      try {
        const res = await fetch(`/api/maps/${mapId}`);
        if (!res.ok) throw new Error("Failed to load map");
        const data = await res.json();
        
        setTitle(data.map.title);
        setNodes(data.map.data?.nodes || []);
        setEdges(data.map.data?.edges || []);
        if (data.map.share_token) setShareToken(data.map.share_token);
        setLastSaved(new Date(data.map.updated_at));
      } catch (err) {
        console.error(err);
        setError("Could not load the mind map.");
      } finally {
        setLoading(false);
      }
    };
    fetchMap();
  }, [mapId]);

  // Save map data
  const saveMap = useCallback(async (newNodes: Node[], newEdges: Edge[], newTitle: string) => {
    setSaving(true);
    try {
      await fetch(`/api/maps/${mapId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          data: { nodes: newNodes, edges: newEdges }
        }),
      });
      setLastSaved(new Date());
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  }, [mapId]);

  // Handle map changes from React Flow
  const handleMapChange = useCallback((updatedNodes: Node[], updatedEdges: Edge[]) => {
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, []);

  // Handle manual save
  const handleManualSave = () => {
    saveMap(nodes, edges, title);
  };

  // Generate Map from Text
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError("");
    
    try {
      const res = await fetch("/api/generate-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: prompt }),
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) throw new Error(data.error || "Generation failed");
      
      setNodes(data.mapData.nodes);
      setEdges(data.mapData.edges);
      
      if (title === "Untitled Map") {
        setTitle(data.title);
      }
      
      // Auto save after generation
      saveMap(data.mapData.nodes, data.mapData.edges, data.title || title);
      setPrompt("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setGenerating(true);
    setError("");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-file", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) throw new Error(data.error || "Upload failed");
      
      setNodes(data.mapData.nodes);
      setEdges(data.mapData.edges);
      setTitle(data.title);
      saveMap(data.mapData.nodes, data.mapData.edges, data.title);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  // Handle Share
  const handleShare = async () => {
    try {
      const res = await fetch(`/api/share/${mapId}`, { method: "POST" });
      const data = await res.json();
      if (data.token) {
        setShareToken(data.token);
        setShowShareModal(true);
      }
    } catch (err) {
      console.error("Failed to share:", err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#fbfcfa]">
        <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
      </div>
    );
  }

  // Convert map to text context for AI Chat
  const mapContext = `Map Title: ${title}\nNodes: ${nodes.map(n => n.data.label).join(", ")}`;

  return (
    <div className="h-screen flex flex-col bg-[#fbfcfa] font-sans text-zinc-900 overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-4 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-900 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="w-px h-4 bg-zinc-200" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => saveMap(nodes, edges, title)}
            className="bg-transparent text-sm font-semibold border-none outline-none focus:ring-2 focus:ring-zinc-200 rounded-md px-2 py-1 transition-all text-zinc-900 placeholder:text-zinc-400"
          />
          {lastSaved && (
            <span className="text-xs text-zinc-400 hidden md:inline-block font-medium">
              {saving ? "Saving..." : `Saved at ${lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualSave}
            className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
            title="Save Map"
          >
            <Save size={16} />
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors text-sm font-medium"
          >
            <Share2 size={16} /> <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium border ${
              isSidebarOpen ? "bg-zinc-100 border-zinc-200 text-zinc-900" : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            <MessageSquare size={16} /> <span className="hidden sm:inline">AI Chat</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Editor Area */}
        <div className="flex-1 relative flex flex-col">
          {/* AI Generation Tools */}
          <div className="absolute top-4 left-4 z-10 w-80 bg-white/95 backdrop-blur-xl border border-zinc-200 rounded-2xl p-4 shadow-lg">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Generate with AI</h3>
            
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Topic (e.g. Machine Learning)"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-300 focus:bg-white transition-colors pr-10 text-zinc-900 placeholder:text-zinc-400 font-medium"
                  disabled={generating}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button
                  onClick={handleGenerate}
                  disabled={generating || !prompt.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 transition-colors text-white"
                >
                  {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px bg-zinc-100 flex-1" />
                <span className="text-xs text-zinc-400 font-medium">OR</span>
                <div className="h-px bg-zinc-100 flex-1" />
              </div>

              <label className="flex items-center justify-center gap-2 w-full py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 border-dashed rounded-xl cursor-pointer transition-colors">
                <FileUp size={16} className="text-zinc-500" />
                <span className="text-sm text-zinc-600 font-medium">Upload PDF or Image</span>
                <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileUpload} disabled={generating} />
              </label>

              {error && (
                <div className="flex items-start gap-2 text-red-600 text-xs bg-red-50 p-2.5 rounded-lg border border-red-100">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span className="font-medium">{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* React Flow Canvas */}
          <div className="flex-1">
            <MindMapEditor
              initialNodes={nodes}
              initialEdges={edges}
              onMapChange={handleMapChange}
            />
          </div>
        </div>

        {/* AI Chat Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          mapContext={mapContext}
        />
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Share Map</h2>
              <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500">×</button>
            </div>
            
            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl mb-6">
              <p className="text-sm text-zinc-600 font-medium">Anyone with this link can view your mind map. They will not be able to edit it.</p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/share/${shareToken}`}
                className="flex-1 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-700 font-medium outline-none focus:border-zinc-300"
              />
              <button
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/share/${shareToken}`)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
