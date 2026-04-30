"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brain, Plus, Search, MoreVertical, LogOut, Trash2, Edit3, Share2, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase";
import type { MindMap } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [maps, setMaps] = useState<MindMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchMaps();
  }, []);

  const fetchMaps = async () => {
    try {
      const res = await fetch("/api/maps");
      const data = await res.json();
      setMaps(data.maps || []);
    } catch (err) {
      console.error("Error fetching maps:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMap = async () => {
    try {
      const res = await fetch("/api/maps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled Map" }),
      });
      const data = await res.json();
      if (data.map) router.push(`/map/${data.map.id}`);
    } catch (err) {
      console.error("Error creating map:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/maps/${id}`, { method: "DELETE" });
      setMaps((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Error deleting map:", err);
    }
    setOpenMenu(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const filteredMaps = maps.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#fbfcfa] font-sans text-zinc-900">
      {/* Top Navbar */}
      <nav className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-zinc-100 border border-zinc-200">
              <Brain size={20} className="text-zinc-900" />
            </div>
            <span className="text-lg font-bold tracking-tight">Thinkovai</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">My Maps</h1>
            <p className="text-zinc-500 text-sm mt-1 font-medium">{maps.length} maps created</p>
          </div>
          <button onClick={handleNewMap} className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-all hover:shadow-md">
            <Plus size={18} /> New Map
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-10">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search maps..." 
            className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 shadow-sm rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100 transition-all font-medium" 
          />
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-white border border-zinc-200 p-6 animate-pulse shadow-sm">
                <div className="h-28 bg-zinc-100 rounded-xl mb-5" />
                <div className="h-4 bg-zinc-100 rounded w-2/3 mb-3" />
                <div className="h-3 bg-zinc-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && maps.length === 0 && (
          <div className="text-center py-24 border border-dashed border-zinc-300 rounded-3xl bg-white/50">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-100 flex items-center justify-center mb-4 border border-zinc-200">
              <Brain size={32} className="text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-zinc-900 tracking-tight">No maps yet</h3>
            <p className="text-zinc-500 text-sm mb-6 font-medium">Create your first mind map to get started.</p>
            <button onClick={handleNewMap} className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl text-sm font-semibold shadow-sm text-zinc-900 transition-all">
              <Plus size={18} /> Create Map
            </button>
          </div>
        )}

        {/* Map Grid */}
        {!loading && filteredMaps.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaps.map((map) => (
              <div key={map.id} className="group relative rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all duration-300">
                {/* Preview area */}
                <Link href={`/map/${map.id}`} className="block p-5 pb-4">
                  <div className="h-32 rounded-xl bg-[#fbfcfa] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] border border-zinc-100 flex items-center justify-center mb-4 transition-colors group-hover:bg-zinc-50">
                    <Brain size={28} className="text-zinc-300" />
                  </div>
                  <h3 className="font-semibold text-base tracking-tight text-zinc-900 truncate mb-1">{map.title}</h3>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
                    <Clock size={12} />
                    <span>{formatDate(map.updated_at)}</span>
                    {map.is_public && (
                      <span className="ml-2 flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100"><Share2 size={10} /> Shared</span>
                    )}
                  </div>
                </Link>
                {/* Menu */}
                <div className="absolute top-3 right-3">
                  <button onClick={() => setOpenMenu(openMenu === map.id ? null : map.id)} className="p-2 rounded-lg bg-white/80 backdrop-blur-sm text-zinc-400 border border-transparent hover:border-zinc-200 hover:text-zinc-900 hover:bg-white hover:shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                    <MoreVertical size={16} />
                  </button>
                  {openMenu === map.id && (
                    <div className="absolute right-0 top-10 w-40 bg-white border border-zinc-200 rounded-xl shadow-lg py-1.5 z-20">
                      <Link href={`/map/${map.id}`} className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 font-medium">
                        <Edit3 size={14} /> Edit
                      </Link>
                      <button onClick={() => handleDelete(map.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium text-left">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
