"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("E-mail of wachtwoord klopt niet.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white">
            budget<span className="text-green-400">-it</span>
          </Link>
          <p className="text-white/65 text-sm mt-2">Inloggen bij je account</p>
        </div>

        <div className="bg-[#111111] border border-white/8 rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voorbeeld@email.com"
                className="w-full bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-400/40 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-white/70">Wachtwoord</label>
                <Link href="/forgot-password" className="text-xs text-green-400 hover:text-green-300 transition-colors">
                  Vergeten?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-400/40 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-black font-semibold py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Inloggen..." : "Inloggen →"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/55 text-sm mt-6">
          Nog geen account?{" "}
          <a href="/register" className="text-green-400 hover:text-green-300 transition-colors">
            Registreer hier
          </a>
        </p>

        <div className="text-center mt-4">
          <Link href="/" className="text-white/30 hover:text-white/60 text-xs transition-colors">
            ← Terug naar home
          </Link>
        </div>
      </div>
    </div>
  );
}
