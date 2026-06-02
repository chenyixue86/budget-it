"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;

  if (score <= 1) return { score, label: "Zwak", color: "#ef4444" };
  if (score === 2) return { score, label: "Matig", color: "#f97316" };
  if (score === 3) return { score, label: "Goed", color: "#eab308" };
  return { score, label: "Sterk", color: "#52b788" };
}

function validate(pw: string): string[] {
  const errors: string[] = [];
  if (pw.length < 8) errors.push("Minimaal 8 tekens");
  if (!/[0-9]/.test(pw)) errors.push("Minimaal 1 cijfer");
  if (!/[^A-Za-z0-9]/.test(pw)) errors.push("Minimaal 1 speciaal teken (!@#$% enz.)");
  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getStrength(password), [password]);
  const pwErrors = useMemo(() => validate(password), [password]);
  const mismatch = confirm.length > 0 && password !== confirm;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (pwErrors.length > 0) {
      setError("Wachtwoord voldoet niet aan de eisen.");
      return;
    }
    if (password !== confirm) {
      setError("Wachtwoorden komen niet overeen.");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white">
            budget<span className="text-green-400">-it</span>
          </Link>
          <p className="text-white/40 text-sm mt-2">Maak een gratis account aan</p>
        </div>

        <div className="bg-[#111111] border border-white/8 rounded-2xl p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 mb-2">Naam</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="naam"
                className="w-full bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-400/40 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-2">E-mail</label>
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
              <label className="block text-xs text-white/40 mb-2">Wachtwoord</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-400/40 transition-colors"
              />

              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ backgroundColor: i <= strength.score ? strength.color : "#2a2a2a" }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      {pwErrors.map((e) => (
                        <p key={e} className="text-xs" style={{ color: "#ef4444" }}>✗ {e}</p>
                      ))}
                      {pwErrors.length === 0 && (
                        <p className="text-xs" style={{ color: "#52b788" }}>✓ Wachtwoord voldoet aan alle eisen</p>
                      )}
                    </div>
                    <span className="text-xs font-medium shrink-0 ml-2" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-2">Wachtwoord bevestigen</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-[#1a1a1a] border rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none transition-colors ${
                  mismatch ? "border-red-500/50 focus:border-red-500/60" : "border-white/8 focus:border-green-400/40"
                }`}
              />
              {mismatch && (
                <p className="text-xs mt-1.5" style={{ color: "#ef4444" }}>✗ Wachtwoorden komen niet overeen</p>
              )}
              {confirm.length > 0 && !mismatch && (
                <p className="text-xs mt-1.5" style={{ color: "#52b788" }}>✓ Wachtwoorden komen overeen</p>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Account aanmaken..." : "Account aanmaken →"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-sm mt-6">
          Al een account?{" "}
          <a href="/login" className="text-green-400 hover:text-green-300 transition-colors">
            Log hier in
          </a>
        </p>
      </div>
    </div>
  );
}
