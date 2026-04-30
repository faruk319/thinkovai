# 🧠 Thinkovai.com — Complete MVP Document

> **AI-Powered Mind Map Web App**
> Version: 1.0 MVP | Stack: Next.js + Supabase + OpenRouter API using Claude models + React Flow

---

## 📌 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Database Schema](#4-database-schema)
5. [Features — MVP Scope](#5-features--mvp-scope)
6. [AI Integration](#6-ai-integration)
7. [Pages & UI](#7-pages--ui)
8. [API Routes](#8-api-routes)
9. [Authentication Flow](#9-authentication-flow)
10. [Deployment Plan](#10-deployment-plan)
11. [Claude Code Prompts](#11-claude-code-prompts)
12. [Cost Estimation](#12-cost-estimation)
13. [Timeline](#13-timeline)
14. [Future Phases](#14-future-phases)

---

## 1. Project Overview

**Thinkovai** ek AI-powered mind map web app hai jahan user:
- Koi bhi topic type kare → AI automatically mind map banata hai
- PDF ya Image upload kare → AI us se mind map generate kare
- Map ko edit, save, aur share kar sake
- Chatbot se mind map ke nodes explore kare

### Target Users
- Students jo notes banate hain
- Professionals jo brainstorming karte hain
- Writers jo story planning karte hain
- Researchers jo data organize karte hain

---

## 2. Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| **Frontend** | Next.js 14 (App Router) | Full-stack, free on Vercel |
| **Mind Map UI** | React Flow | Best free mind map library |
| **Styling** | Tailwind CSS | Fast UI development |
| **Database** | Supabase (PostgreSQL) | Free tier, realtime ready |
| **Auth** | Supabase Auth | Google + Email login free |
| **AI — Text → Map** | Claude Sonnet via OpenRouter | Best structured JSON output with OpenRouter response_format |
| **AI — Image/PDF** | Claude multimodal model via OpenRouter | Same OpenRouter API, multimodal Claude model |
| **AI — Fast Suggestions** | Groq (Llama 3) | Free tier, ultra fast |
| **File Storage** | Supabase Storage | Free 1GB storage |
| **Deployment** | Vercel | Free hosting + CI/CD |
| **Domain** | Thinkovai.com | Already decided ✅ |

---

## 3. Folder Structure

```
thinkovai/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx        # All maps list
│   │   ├── map/[id]/page.tsx         # Single map editor
│   │   └── layout.tsx
│   ├── api/
│   │   ├── generate-map/route.ts     # AI: Text → Mind Map
│   │   ├── upload-file/route.ts      # AI: PDF/Image → Mind Map
│   │   ├── chat/route.ts             # AI: Chat with map
│   │   ├── maps/route.ts             # CRUD: Save/Get maps
│   │   └── share/route.ts            # Share link generate
│   ├── share/[token]/page.tsx        # Public shared map view
│   ├── layout.tsx
│   └── page.tsx                      # Landing page
├── components/
│   ├── MindMap/
│   │   ├── MindMapEditor.tsx         # React Flow canvas
│   │   ├── CustomNode.tsx            # Map node component
│   │   ├── Toolbar.tsx               # Map toolbar
│   │   └── Sidebar.tsx               # Chat + options panel
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   └── Layout/
│       ├── Navbar.tsx
│       └── DashboardNav.tsx
├── lib/
│   ├── supabase.ts                   # Supabase client
│   ├── openrouter.ts                 # OpenRouter client for Claude models
│   ├── groq.ts                       # Groq API client
│   └── utils.ts
├── types/
│   └── index.ts                      # TypeScript types
├── .env.local                        # Environment variables
└── package.json
```

---

## 4. Database Schema

### Table: `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',         -- free | pro
  maps_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `mindmaps`
```sql
CREATE TABLE mindmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Map',
  data JSONB NOT NULL DEFAULT '{}',  -- React Flow nodes + edges
  is_public BOOLEAN DEFAULT FALSE,
  share_token TEXT UNIQUE,           -- random token for sharing
  thumbnail_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `map_versions`
```sql
CREATE TABLE map_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map_id UUID REFERENCES mindmaps(id) ON DELETE CASCADE,
  data JSONB NOT NULL,               -- snapshot of map
  version_number INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `chat_history`
```sql
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map_id UUID REFERENCES mindmaps(id) ON DELETE CASCADE,
  role TEXT NOT NULL,                -- user | assistant
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)
```sql
-- Users can only access their own maps
ALTER TABLE mindmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own maps"
ON mindmaps FOR ALL
USING (auth.uid() = user_id);

-- Public maps accessible to everyone
CREATE POLICY "Public maps readable"
ON mindmaps FOR SELECT
USING (is_public = TRUE);
```

---

## 5. Features — MVP Scope

### ✅ Feature 1: Text → Mind Map Generation
- User ek topic type karta hai (e.g., "Machine Learning")
- OpenRouter API Claude model se JSON format mein nodes + edges return karta hai
- React Flow canvas pe automatically render hota hai
- User nodes drag, resize, rename kar sakta hai

### ✅ Feature 2: PDF / Image Upload → Mind Map
- User PDF ya image upload karta hai
- File Supabase Storage mein save hoti hai
- OpenRouter ke Claude multimodal model se content extract karke mind map banata hai
- Same React Flow canvas pe render

### ✅ Feature 3: Chat with Map
- Right sidebar mein chatbot hoga
- User map ke baare mein sawaal pooch sakta hai
- "Is node ko aur expand karo" jaisi commands bhi dega
- OpenRouter ke Claude model chat history ke saath respond karega

### ✅ Feature 4: Save & Auto-Save
- Map automatically har 30 second mein save hoga
- Manual save button bhi hoga
- Version history (last 5 versions)

### ✅ Feature 5: Share Map
- "Share" button se public link generate hoga
- Link se koi bhi map dekh sakta hai (edit nahi)
- Link disable karne ka option bhi hoga

### ✅ Feature 6: Authentication
- Email/Password signup
- Google OAuth login
- Protected routes — bina login dashboard nahi dikhega

### ✅ Feature 7: Dashboard
- Saare saved maps ki list/grid view
- Map banane ka button
- Map delete, rename karna
- Last updated time dikhana

### ❌ MVP mein NAHI hoga (Phase 2 ke liye)
- Real-time collaboration
- Export PNG/PDF
- Team workspace
- Paid plans

---

## 6. AI Integration

### Model Routing Logic

```typescript
// lib/ai-router.ts

export async function generateMindMap(input: string, type: 'text' | 'image' | 'pdf') {
  
  if (type === 'text') {
    // Claude Sonnet via OpenRouter — best for structured JSON
    return await callOpenRouterClaude(input, process.env.OPENROUTER_TEXT_MODEL)
  }
  
  if (type === 'image' || type === 'pdf') {
    // Claude multimodal model via OpenRouter
    return await callOpenRouterClaude(input, process.env.OPENROUTER_VISION_MODEL)
  }
}

export async function getQuickSuggestion(nodeText: string) {
  // Groq (Llama 3) — free + fast for simple suggestions
  return await callGroq(nodeText)
}
```

### OpenRouter Claude Prompt — Text to Mind Map

Use OpenRouter chat completions endpoint `https://openrouter.ai/api/v1/chat/completions` with bearer auth from `OPENROUTER_API_KEY`. For reliable JSON, use OpenRouter `response_format` / structured outputs when the selected Claude model supports it.

```typescript
const systemPrompt = `
You are a mind map generator. 
When user gives a topic, return ONLY valid JSON.
Format:
{
  "title": "Topic Name",
  "nodes": [
    { "id": "1", "label": "Main Topic", "type": "root" },
    { "id": "2", "label": "Subtopic 1", "type": "branch" },
    { "id": "3", "label": "Subtopic 2", "type": "branch" },
    { "id": "4", "label": "Detail 1", "type": "leaf" }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2" },
    { "id": "e1-3", "source": "1", "target": "3" },
    { "id": "e2-4", "source": "2", "target": "4" }
  ]
}
Return ONLY JSON. No explanation. No markdown.
`
```

### Expected JSON → React Flow Conversion

```typescript
// lib/mapConverter.ts

export function convertToReactFlow(aiData: AIMapData) {
  const nodes = aiData.nodes.map((node, index) => ({
    id: node.id,
    type: 'customNode',
    position: calculatePosition(node.type, index),  // auto layout
    data: { label: node.label, nodeType: node.type }
  }))

  const edges = aiData.edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    animated: false,
    style: { stroke: '#6366f1' }
  }))

  return { nodes, edges }
}
```

---

## 7. Pages & UI

### Page 1: Landing Page (`/`)
```
[ Navbar: Logo | Features | Pricing | Login ]

Hero Section:
  "Turn any idea into a visual mind map"
  "Powered by AI — just type a topic"
  [ Try for Free ] [ Watch Demo ]

Demo Section:
  Animated GIF/Video of app working

Features Section:
  - Text to Map
  - PDF to Map  
  - AI Chat

CTA Section:
  [ Get Started Free ]

Footer
```

### Page 2: Dashboard (`/dashboard`)
```
[ Sidebar: Logo | My Maps | Settings | Logout ]

Main Area:
  [ + New Mind Map ] button
  
  Search bar
  
  Grid of Maps:
    [ Map Card ]  [ Map Card ]  [ Map Card ]
    Title         Title         Title
    Last edited   Last edited   Last edited
    [ Open ] [⋮]  [ Open ] [⋮]  [ Open ] [⋮]
```

### Page 3: Map Editor (`/map/[id]`)
```
[ Top Bar: Back | Title (editable) | Save | Share | ⋮ ]

Left Panel:
  [ Generate from Text ] tab
  [ Upload PDF/Image ] tab
  [ Input box + Generate button ]

Center Canvas (React Flow):
  [ Mind Map Nodes ]
  [ Zoom controls ]
  [ Fit to screen ]

Right Panel (toggle):
  [ Chat with AI ]
  [ Chat messages ]
  [ Input + Send ]
```

---

## 8. API Routes

### `POST /api/generate-map`
```typescript
// Input
{ topic: string }

// Output
{ 
  success: boolean,
  mapData: { nodes: [], edges: [] }
}
```

### `POST /api/upload-file`
```typescript
// Input
FormData { file: File }

// Output
{ 
  success: boolean,
  mapData: { nodes: [], edges: [] }
}
```

### `POST /api/chat`
```typescript
// Input
{ 
  mapId: string,
  message: string,
  history: ChatMessage[]
}

// Output
{ 
  reply: string,
  updatedNodes?: Node[]  // agar map update ho
}
```

### `GET /api/maps`
```typescript
// Output
{ maps: MindMap[] }
```

### `POST /api/maps`
```typescript
// Input
{ title: string, data: ReactFlowData }

// Output
{ map: MindMap }
```

### `PATCH /api/maps/[id]`
```typescript
// Input
{ title?: string, data?: ReactFlowData, is_public?: boolean }

// Output
{ map: MindMap }
```

### `POST /api/share/[id]`
```typescript
// Output
{ shareUrl: string, token: string }
```

---

## 9. Authentication Flow

```
User visits thinkovai.com
        ↓
Not logged in? → Redirect to /login
        ↓
Login options:
  [Continue with Google]  →  Supabase OAuth  →  Dashboard
  [Email + Password]      →  Supabase Auth   →  Dashboard
        ↓
Session stored in cookies (Supabase handles automatically)
        ↓
Protected routes check session on every request (middleware.ts)
```

### Environment Variables (`.env.local`)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# AI APIs
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_TEXT_MODEL=anthropic/claude-sonnet-4.5
OPENROUTER_VISION_MODEL=anthropic/claude-sonnet-4.5
GROQ_API_KEY=your_groq_key

# App
NEXT_PUBLIC_APP_URL=https://thinkovai.com
```

---

## 10. Deployment Plan

### Step 1: Local Development
```bash
npx create-next-app@latest thinkovai
cd thinkovai
npm install @supabase/supabase-js reactflow openai groq-sdk
npm run dev
```

### Step 2: Supabase Setup
1. [supabase.com](https://supabase.com) pe account banao
2. New project create karo
3. SQL editor mein schema run karo (Section 4 se)
4. Authentication → Enable Google OAuth
5. Storage → `uploads` bucket banao

### Step 3: Deploy to Vercel
```bash
# Vercel CLI se
npm install -g vercel
vercel

# Ya GitHub se:
# GitHub pe push karo → Vercel connect karo → Auto deploy
```

### Step 4: Environment Variables (Vercel Dashboard)
- Vercel Dashboard → Project → Settings → Environment Variables
- Saare `.env.local` variables add karo

### Step 5: Domain Connect
```
Vercel Dashboard → Domains → Add "thinkovai.com"
DNS settings mein CNAME record add karo
```

---

## 11. Claude Code Prompts

### Prompt 1: Project Setup
```
Create a Next.js 14 app called "thinkovai" with:
- App Router
- Tailwind CSS
- TypeScript
- Supabase client setup (auth + database)
- React Flow installed
- OpenAI SDK installed for OpenRouter-compatible API calls
- Groq SDK installed
- Basic folder structure as provided
- middleware.ts for protected routes
```

### Prompt 2: Mind Map Generator
```
Create an API route at /api/generate-map that:
1. Takes a "topic" string from POST body
2. Calls Nvidia chat completions with model meta/llama-3.1-70b-instruct and system prompt to return JSON of nodes and edges
3. Uses Nvidia response_format / structured outputs when supported by the selected model
4. Parses the JSON response
5. Returns nodes and edges formatted for React Flow
Include error handling and TypeScript types.
```

### Prompt 3: React Flow Canvas
```
Create a MindMapEditor component using React Flow that:
1. Takes initialNodes and initialEdges as props
2. Uses a custom node component with editable labels
3. Has auto-layout (dagre or elkjs)
4. Includes zoom controls and fit-to-screen
5. Calls onMapChange callback when nodes/edges change
6. Has a floating toolbar with: Add Node, Delete, Undo, Redo
Style with Tailwind, dark theme optional.
```

### Prompt 4: File Upload Feature
```
Create an API route at /api/upload-file that:
1. Accepts multipart form data with a file (PDF or image)
2. Uploads file to Supabase Storage "uploads" bucket
3. If image: passes base64 to OpenRouter Claude multimodal model
4. If PDF: extracts text first, then passes to OpenRouter Claude model
5. OpenRouter Claude model generates mind map JSON from the content
6. Returns React Flow nodes and edges
```

### Prompt 5: AI Chat Sidebar
```
Create a ChatSidebar component that:
1. Shows chat messages (user + AI)
2. Has an input box at the bottom
3. Calls /api/chat with message + map context + history
4. OpenRouter Claude model responds as a mind map assistant
5. If Claude model suggests new nodes, offers "Add to Map" button
6. Smooth scroll to latest message
Style with Tailwind, fits in right sidebar panel.
```

### Prompt 6: Dashboard Page
```
Create a dashboard page at /dashboard that:
1. Fetches all maps for logged-in user from Supabase
2. Shows maps in a responsive grid (3 cols desktop, 1 col mobile)
3. Each card shows: title, last updated, preview thumbnail
4. "New Mind Map" button creates blank map and redirects
5. Three-dot menu on each card: Rename, Delete, Share
6. Loading skeleton while fetching
Use Tailwind for styling.
```

### Prompt 7: Share Feature
```
Create a share feature where:
1. Map editor has a "Share" button in top bar
2. Clicking generates a unique token and saves to mindmaps.share_token
3. Sets is_public = true
4. Shows copyable link: thinkovai.com/share/[token]
5. Create /share/[token] page that shows read-only React Flow map
6. Option to disable sharing (sets is_public = false)
```

---

## 12. Cost Estimation

### Free Tier (0-100 users)

| Service | Free Limit | Cost |
|---------|-----------|------|
| Vercel | Unlimited deploys | $0 |
| Supabase | 500MB DB + 1GB storage | $0 |
| Groq API | 14,400 requests/day | $0 |
| OpenRouter Claude model | Pay per use | Usage based |

**Agar 100 users, 10 maps each = 1000 maps**
**OpenRouter Claude model cost usage ke hisaab se calculate hoga. Pricing selected Claude model par depend karegi.**

### Growth Tier (100-1000 users)

| Service | Plan | Cost/month |
|---------|------|-----------|
| Vercel | Pro | $20 |
| Supabase | Pro | $25 |
| OpenRouter Claude model | Usage based | Depends on selected Claude model |
| Groq API | Free | $0 |
| **Total** | | **Depends on selected OpenRouter model usage** |

---

## 13. Timeline

### Week 1: Foundation
- [ ] Next.js project setup
- [ ] Supabase database + auth setup
- [ ] Google OAuth working
- [ ] Basic dashboard UI
- [ ] Landing page

### Week 2: Core Feature
- [ ] Text → Mind Map (Nvidia model
- [ ] React Flow canvas working
- [ ] Save map to Supabase
- [ ] Auto-save every 30 seconds
- [ ] Map editor page

### Week 3: Extra Features
- [ ] PDF/Image upload → Mind Map
- [ ] AI Chat sidebar
- [ ] Share link feature
- [ ] Map version history

### Week 4: Polish & Deploy
- [ ] Responsive design (mobile)
- [ ] Error handling + loading states
- [ ] Deploy to Vercel
- [ ] Connect thinkovai.com domain
- [ ] Basic testing + bug fixes

**Total: 4 weeks MVP ready** 🎯

---

## 14. Future Phases

### Phase 2 (Month 2)
- Real-time collaboration (Supabase Realtime)
- Export as PNG / PDF
- Map templates library
- Better node styling (colors, icons, shapes)
- Keyboard shortcuts

### Phase 3 (Month 3) — Monetization
- Free plan: 5 maps, no PDF upload
- Pro plan ($9/month): Unlimited maps, PDF/Image, collaboration
- Stripe payment integration
- Team workspace
- Admin dashboard

### Phase 4 — Scale
- Mobile app (React Native)
- API access for developers
- Zapier / n8n integrations
- Enterprise plan

---

## 🚀 Quick Start Checklist

```
[ ] Thinkovai.com domain register karo
[ ] GitHub account + repository banao
[ ] Supabase account banao (supabase.com)
[ ] OpenRouter API key lo (openrouter.ai)
[ ] Groq API key lo (console.groq.com)
[ ] Vercel account banao (vercel.com)
[ ] Claude Code install karo
[ ] Upar diye prompts se coding start karo!
```

---

*Document version: 1.0 | Project: Thinkovai | Date: April 2026*
