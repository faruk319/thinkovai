"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brain, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push("/dashboard");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center px-4">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl animated-gradient"><Brain size={24} className="text-white" /></div>
            <span className="text-2xl font-bold">Think<span className="gradient-text">ovai</span></span>
          </Link>
          <p className="text-white/40 text-sm mt-3">Welcome back! Sign in to continue.</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
          <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium text-white/80 mb-6">
            <User size={18} /> Continue with Google
          </button>
          <div className="flex items-center gap-3 mb-6"><div className="flex-1 h-px bg-white/10" /><span className="text-white/30 text-xs">or</span><div className="flex-1 h-px bg-white/10" /></div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50" required />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>
            {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
            <button type="submit" disabled={loading} className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-semibold shadow-lg shadow-violet-600/25 disabled:opacity-50">{loading ? "Signing in..." : "Sign In"}</button>
          </form>
          <p className="text-center text-sm text-white/40 mt-6">Don&apos;t have an account? <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-medium">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}
