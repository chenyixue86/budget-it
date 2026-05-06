"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function BugReportForm() {
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [bericht, setBericht] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) return;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    let token = "";
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (siteKey) {
      try {
        token = await new Promise<string>((resolve, reject) => {
          window.grecaptcha.ready(async () => {
            try {
              const t = await window.grecaptcha.execute(siteKey, { action: "bug_report" });
              resolve(t);
            } catch (err) {
              reject(err);
            }
          });
        });
      } catch {
        setError("Verificatie mislukt. Probeer opnieuw.");
        setStatus("error");
        return;
      }
    }

    const res = await fetch("/api/bug-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ naam, email, bericht, token }),
    });

    if (res.ok) {
      setStatus("success");
      setNaam("");
      setEmail("");
      setBericht("");
    } else {
      const data = await res.json();
      setError(data.error || "Er is iets misgegaan.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#52b788" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </div>
        <p className="text-gray-900 dark:text-white font-medium">Bedankt voor je feedback!</p>
        <p className="text-gray-500 dark:text-white/50 text-sm mt-1">We nemen het zo snel mogelijk door.</p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 dark:text-white/70 mb-2">
            Naam <span className="text-gray-400 dark:text-white/40">(optioneel)</span>
          </label>
          <input
            type="text"
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            placeholder="naam"
            className="w-full bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:border-green-500/40 dark:focus:border-green-400/40 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 dark:text-white/70 mb-2">
            Email <span className="text-gray-400 dark:text-white/40">(optioneel)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voorbeeld@email.com"
            className="w-full bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:border-green-500/40 dark:focus:border-green-400/40 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 dark:text-white/70 mb-2">Wat ging er mis?</label>
        <textarea
          required
          rows={5}
          value={bericht}
          onChange={(e) => setBericht(e.target.value)}
          placeholder="Beschrijf de bug of je feedback. Wat deed je, wat verwachtte je, wat gebeurde er?"
          className="w-full bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:border-green-500/40 dark:focus:border-green-400/40 transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-red-500 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full text-black font-semibold py-3.5 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Versturen..." : "Verstuur →"}
      </button>
    </form>
  );
}
