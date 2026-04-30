import Link from "next/link";
import {
  Brain,
  Sparkles,
  FileText,
  MessageSquare,
  ArrowRight,
  Zap,
  Upload,
  Share2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-hidden font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-zinc-100 border border-zinc-200">
              <Brain size={20} className="text-zinc-900" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">
              Thinkovai
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <a href="#features" className="hover:text-zinc-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-zinc-900 transition-colors">
              How it Works
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg transition-colors shadow-sm"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="relative max-w-4xl mx-auto text-center mt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-medium mb-8">
            <Sparkles size={14} className="text-zinc-900" />
            <span>AI-Powered Mind Mapping</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6 text-zinc-900">
            Turn any idea into a <br />
            <span className="text-zinc-400">visual workspace.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Just type a topic, upload a document, or chat with AI. Thinkovai
            instantly creates clean, interactive mind maps to structure your thoughts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="group flex items-center gap-2 px-6 py-3.5 text-base font-medium bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl transition-all shadow-sm hover:shadow-md"
            >
              Start Mapping
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-6 py-3.5 text-base font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl transition-all shadow-sm"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Demo preview placeholder */}
        <div className="relative max-w-5xl mx-auto mt-24">
          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-2xl shadow-zinc-200/50">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 bg-zinc-50/50">
              <div className="w-3 h-3 rounded-full bg-zinc-300" />
              <div className="w-3 h-3 rounded-full bg-zinc-300" />
              <div className="w-3 h-3 rounded-full bg-zinc-300" />
              <div className="ml-3 px-2 py-1 rounded bg-white border border-zinc-200 text-zinc-400 text-xs font-medium flex-1 max-w-sm flex items-center gap-2">
                <span>🔒</span> thinkovai.com/map/demo
              </div>
            </div>
            <div className="h-[400px] flex items-center justify-center bg-[#fbfcfa] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
              <div className="text-center space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200">
                  <Brain size={24} className="text-zinc-900" />
                </div>
                <p className="text-zinc-500 font-medium text-sm">
                  Interactive mind map demo
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Built for clarity.
            </h2>
            <p className="text-zinc-500 text-lg max-w-xl">
              Powerful AI features that transform how you organize ideas,
              study, and brainstorm without the clutter.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap size={20} />,
                title: "Text to Mind Map",
                desc: "Type any topic and AI generates a comprehensive, beautifully laid-out mind map in seconds.",
              },
              {
                icon: <Upload size={20} />,
                title: "PDF & Image to Map",
                desc: "Upload documents or images and our AI extracts key information into an organized structure.",
              },
              {
                icon: <MessageSquare size={20} />,
                title: "Chat with Your Map",
                desc: "Ask the AI to expand nodes, explain connections, or suggest new branches.",
              },
              {
                icon: <FileText size={20} />,
                title: "Auto-Save",
                desc: "Your maps are automatically saved every 30 seconds for complete peace of mind.",
              },
              {
                icon: <Share2 size={20} />,
                title: "Instant Sharing",
                desc: "Generate a shareable link in one click. Anyone can view your mind map instantly.",
              },
              {
                icon: <Sparkles size={20} />,
                title: "Smart Suggestions",
                desc: "AI suggests related topics and connections to help you discover new perspectives.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all duration-300"
              >
                <div
                  className="w-10 h-10 rounded-lg bg-zinc-100 text-zinc-900 border border-zinc-200 flex items-center justify-center mb-6"
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3 tracking-tight text-zinc-900">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              How it works
            </h2>
            <p className="text-zinc-500 text-lg">
              Three simple steps to visualize any idea.
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Enter your topic",
                desc: "Type any topic, paste text, or upload a document. The AI understands context and structure.",
              },
              {
                step: "02",
                title: "AI generates your map",
                desc: "In seconds, a beautifully organized mind map is created with nodes, branches, and connections.",
              },
              {
                step: "03",
                title: "Edit, expand & share",
                desc: "Drag nodes, add branches, chat with AI to expand, and share your map with anyone via a link.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-zinc-900 font-bold">
                  {item.step}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-semibold mb-2 tracking-tight text-zinc-900">{item.title}</h3>
                  <p className="text-zinc-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-zinc-900">
            Ready to think visually?
          </h2>
          <p className="text-zinc-500 text-lg mb-10 max-w-lg mx-auto font-medium">
            Join thousands of students and professionals who use Thinkovai to
            organize their ideas effectively.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Get Started — It's Free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-zinc-100 border border-zinc-200">
              <Brain size={16} className="text-zinc-900" />
            </div>
            <span className="text-sm font-bold tracking-tight text-zinc-900">Thinkovai</span>
          </div>
          <p className="text-zinc-400 font-medium text-sm">
            © 2026 Thinkovai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
