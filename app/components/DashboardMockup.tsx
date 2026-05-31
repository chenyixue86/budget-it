"use client";

import { useEffect, useRef } from "react";

export default function DashboardMockup() {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!innerRef.current) return;
      const progress = Math.min(window.scrollY / 500, 1);
      const rotateX = 18 * (1 - progress);
      const scale = 0.92 + 0.08 * progress;
      innerRef.current.style.transform = `rotateX(${rotateX}deg) scale(${scale})`;
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="hero-mockup mt-20 w-full max-w-5xl mx-auto px-4 hidden md:block"
      style={{ perspective: "1200px" }}
    >
      <div
        ref={innerRef}
        className="rounded-2xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)] border border-gray-200 dark:border-white/10"
        style={{ transformOrigin: "center top", willChange: "transform" }}
      >
        <div className="flex bg-[#f5f6f8]" style={{ height: "420px" }}>

          {/* Sidebar */}
          <div className="hidden lg:flex w-44 bg-white border-r border-gray-100 flex-col py-4 shrink-0">
            <div className="px-4 mb-5">
              <span className="text-sm font-bold text-gray-900">budget<span className="text-[#52b788]">-it</span></span>
            </div>
            {[
              { label: "Home", active: true },
              { label: "Inkomsten", active: false },
              { label: "Uitgaves", active: false },
              { label: "Overzicht", active: false },
              { label: "Samenvatting", active: false },
              { label: "Instellingen", active: false },
            ].map((item) => (
              <div
                key={item.label}
                className={`mx-2 px-3 py-2 rounded-lg text-xs mb-0.5 ${
                  item.active ? "bg-[#f0faf4] text-[#2d6a4f] font-medium" : "text-gray-400"
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* Topbar */}
            <div className="h-10 bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">Home</span>
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1">
                  <span className="text-[9px] text-gray-400">‹</span>
                  <span className="text-[9px] font-medium text-gray-700 mx-1">Mei 2026</span>
                  <span className="text-[9px] text-gray-300">›</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#52b788] flex items-center justify-center text-white text-[9px] font-bold">K</div>
                <span className="text-xs text-gray-600 font-medium">Kevin</span>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Hallo, Kevin 👋</h2>
                  <p className="text-xs text-gray-400">Welkom bij je budget overzicht.</p>
                </div>
                <div className="flex gap-0.5 bg-white border border-gray-200 rounded-lg p-0.5">
                  {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"].map((m) => (
                    <div
                      key={m}
                      className={`px-1.5 py-1 text-[9px] rounded-md font-medium ${
                        m === "Mei" ? "bg-[#2d6a4f] text-white" : "text-gray-400"
                      }`}
                    >
                      {m}
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 cards — 2x2 grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                {[
                  { label: "Inkomsten", value: "€ 3.200", badge: "+ 100%", color: "text-[#2d6a4f]", badgeBg: "bg-green-50 text-green-600" },
                  { label: "Vaste Lasten", value: "€ 1.450", badge: "45.3%", color: "text-orange-500", badgeBg: "bg-orange-50 text-orange-500" },
                  { label: "Vrij besteedbaar", value: "€ 1.550", badge: "48.4%", color: "text-blue-500", badgeBg: "bg-blue-50 text-blue-500" },
                  { label: "Spaardoel", value: "€ 200", badge: "op schema", color: "text-[#2d6a4f]", badgeBg: "bg-green-50 text-green-600" },
                ].map((c) => (
                  <div key={c.label} className="bg-white rounded-xl border border-gray-100 p-2.5">
                    <p className="text-[9px] text-gray-400 mb-1 truncate">{c.label}</p>
                    <p className={`text-sm font-bold mb-1.5 ${c.color}`}>{c.value}</p>
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${c.badgeBg}`}>{c.badge}</span>
                  </div>
                ))}
              </div>

              {/* Bottom: expense list */}
              <div className="bg-white rounded-xl border border-gray-100 p-3">
                <p className="text-[10px] font-semibold text-gray-700 mb-2">Uitgaves deze maand</p>
                {[
                  { label: "Boodschappen", pct: 78 },
                  { label: "Uit eten", pct: 54 },
                  { label: "Transport", pct: 33 },
                  { label: "Kleding", pct: 24 },
                ].map((item) => (
                  <div key={item.label} className="mb-1.5">
                    <div className="flex justify-between text-[9px] text-gray-400 mb-0.5">
                      <span>{item.label}</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full">
                      <div className="h-full bg-[#52b788] rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
