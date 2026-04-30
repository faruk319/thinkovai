// ==========================================
// Thinkovai — TypeScript Types
// ==========================================

// ---- React Flow / Mind Map types ----

export interface AINode {
  id: string;
  label: string;
  type: 'root' | 'branch' | 'leaf';
}

export interface AIEdge {
  id: string;
  source: string;
  target: string;
}

export interface AIMapData {
  title: string;
  nodes: AINode[];
  edges: AIEdge[];
}

// ---- Database types ----

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  plan: 'free' | 'pro';
  maps_count: number;
  created_at: string;
}

export interface MindMap {
  id: string;
  user_id: string;
  title: string;
  data: ReactFlowData;
  is_public: boolean;
  share_token: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MapVersion {
  id: string;
  map_id: string;
  data: ReactFlowData;
  version_number: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  map_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// ---- React Flow data ----

export interface ReactFlowNodeData {
  label: string;
  nodeType: 'root' | 'branch' | 'leaf';
}

export interface ReactFlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: ReactFlowNodeData;
}

export interface ReactFlowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: Record<string, string>;
}

export interface ReactFlowData {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
}

// ---- API request / response types ----

export interface GenerateMapRequest {
  topic: string;
}

export interface GenerateMapResponse {
  success: boolean;
  mapData?: ReactFlowData;
  title?: string;
  error?: string;
}

export interface UploadFileResponse {
  success: boolean;
  mapData?: ReactFlowData;
  title?: string;
  error?: string;
}

export interface ChatRequest {
  mapId: string;
  message: string;
  history: { role: 'user' | 'assistant'; content: string }[];
  mapContext?: string;
}

export interface ChatResponse {
  reply: string;
  updatedNodes?: ReactFlowNode[];
  error?: string;
}
