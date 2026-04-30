"use client";

import { Plus, Trash2, ZoomIn, ZoomOut, Maximize } from "lucide-react";

interface ToolbarProps {
  onAddNode: () => void;
  onDeleteSelected: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
}

export default function Toolbar({
  onAddNode,
  onDeleteSelected,
  onZoomIn,
  onZoomOut,
  onFitView,
}: ToolbarProps) {
  const buttonClass =
    "p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200 shadow-lg shadow-black/10";

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/30 backdrop-blur-xl rounded-2xl px-3 py-2 border border-white/10 shadow-2xl">
      <button
        onClick={onAddNode}
        className={buttonClass}
        title="Add Node"
      >
        <Plus size={18} />
      </button>
      <button
        onClick={onDeleteSelected}
        className={buttonClass}
        title="Delete Selected"
      >
        <Trash2 size={18} />
      </button>

      <div className="w-px h-6 bg-white/20 mx-1" />

      <button
        onClick={onZoomIn}
        className={buttonClass}
        title="Zoom In"
      >
        <ZoomIn size={18} />
      </button>
      <button
        onClick={onZoomOut}
        className={buttonClass}
        title="Zoom Out"
      >
        <ZoomOut size={18} />
      </button>
      <button
        onClick={onFitView}
        className={buttonClass}
        title="Fit to Screen"
      >
        <Maximize size={18} />
      </button>
    </div>
  );
}
