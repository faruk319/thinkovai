"use client";

import { memo, useState, useCallback } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

interface CustomNodeData {
  label: string;
  nodeType: "root" | "branch" | "leaf";
  [key: string]: unknown;
}

const nodeStyles: Record<string, string> = {
  root: "bg-zinc-900 text-white border-zinc-800 shadow-md min-w-[180px] text-base font-bold",
  branch:
    "bg-white text-zinc-900 border-zinc-200 shadow-sm min-w-[160px] text-sm font-semibold",
  leaf: "bg-zinc-50 text-zinc-600 border-zinc-200 min-w-[140px] text-sm font-medium",
};

function CustomNode({ data, selected }: NodeProps) {
  const nodeData = data as CustomNodeData;
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(nodeData.label);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    nodeData.label = label;
  }, [label, nodeData]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        setIsEditing(false);
        nodeData.label = label;
      }
    },
    [label, nodeData]
  );

  const style = nodeStyles[nodeData.nodeType] || nodeStyles.leaf;

  return (
    <div
      className={`
        px-4 py-3 rounded-xl border-2 transition-all duration-200
        ${style}
        ${selected ? "ring-2 ring-zinc-400/50 ring-offset-2 ring-offset-transparent scale-105" : ""}
        hover:scale-[1.02] cursor-pointer
      `}
      onDoubleClick={handleDoubleClick}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-zinc-300 !border-zinc-400 !w-3 !h-3 !-top-1.5"
      />

      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none text-inherit w-full text-center"
          autoFocus
        />
      ) : (
        <div className="text-center leading-snug">{label}</div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-zinc-300 !border-zinc-400 !w-3 !h-3 !-bottom-1.5"
      />
    </div>
  );
}

export default memo(CustomNode);
