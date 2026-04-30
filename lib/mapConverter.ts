import dagre from "dagre";
import type { AIMapData, ReactFlowNode, ReactFlowEdge, ReactFlowData } from "@/types";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;

/**
 * Converts AI-generated map data into React Flow format with auto-layout using dagre.
 */
export function convertToReactFlow(aiData: AIMapData): ReactFlowData {
  // Create a dagre graph for automatic layout
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: "TB", // Top to Bottom layout
    nodesep: 60,
    ranksep: 100,
    edgesep: 30,
  });

  // Add nodes to dagre
  aiData.nodes.forEach((node) => {
    dagreGraph.setNode(String(node.id), { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Add edges to dagre
  aiData.edges.forEach((edge) => {
    dagreGraph.setEdge(String(edge.source), String(edge.target));
  });

  // Run the layout algorithm
  dagre.layout(dagreGraph);

  // Convert to React Flow nodes
  const nodes: ReactFlowNode[] = aiData.nodes.map((node) => {
    const dagreNode = dagreGraph.node(String(node.id));
    return {
      id: String(node.id),
      type: "customNode",
      position: {
        x: dagreNode.x - NODE_WIDTH / 2,
        y: dagreNode.y - NODE_HEIGHT / 2,
      },
      data: {
        label: node.label,
        nodeType: node.type,
      },
    };
  });

  // Color palette for edges based on source node type
  const edgeColors: Record<string, string> = {
    root: "#71717a",   // zinc-500
    branch: "#a1a1aa",  // zinc-400
    leaf: "#e4e4e7",    // zinc-200
  };

  // Convert to React Flow edges
  const edges: ReactFlowEdge[] = aiData.edges.map((edge) => {
    const sourceNode = aiData.nodes.find((n) => String(n.id) === String(edge.source));
    const color = edgeColors[sourceNode?.type || "branch"];

    return {
      id: String(edge.id),
      source: String(edge.source),
      target: String(edge.target),
      animated: false,
      style: { stroke: color, strokeWidth: "2" },
    };
  });

  return { nodes, edges };
}
