"use client";

import { useEffect, useRef } from "react";

export default function DashboardMockup() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stat1Ref = useRef<HTMLDivElement>(null); // Inkomsten
  const stat2Ref = useRef<HTMLDivElement>(null); // Vaste Lasten
  const stat3Ref = useRef<HTMLDivElement>(null); // Vrij besteedbaar
  const chart1Ref = useRef<HTMLDivElement>(null); // Uitgaves bars
  const chart2Ref = useRef<HTMLDivElement>(null); // Budget pie

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY;

      // Overall container: tilt from 22deg → 0deg over 600px scroll
      if (wrapperRef.current) {
        const progress = Math.min(scrollY / 600, 1);
        const rotateX = 22 * (1 - progress);
        const scale = 0.88 + 0.12 * progress;
        const shadowY = 60 - 30 * progress;
        const shadowBlur = 120 - 50 * progress;
        const shadowOpacity = 0.2 - 0.1 * progress;
        wrapperRef.current.style.transform = `rotateX(${rotateX}deg) scale(${scale})`;
        wrapperRef.current.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px -20px rgba(0,0,0,${shadowOpacity})`;
      }

      // Individual cards: staggered parallax — each at a different speed
      // Negative = moves up (toward viewer in rotated space), positive = lags behind
      const s = Math.min(scrollY, 600);
      if (stat1Ref.current)  stat1Ref.current.style.transform  = `translateY(${-s * 0.07}px)`;
      if (stat2Ref.current)  stat2Ref.current.style.transform  = `translateY(${-s * 0.03}px)`;
      if (stat3Ref.current)  stat3Ref.current.style.transform  = `translateY(${-s * 0.09}px)`;
      if (chart1Ref.current) chart1Ref.current.style.transform = `translateY(${-s * 0.04}px)`;
      if (chart2Ref.current) chart2Ref.current.style.transform = `translateY(${-s * 0.11}px)`;
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="mt-16 w-full max-w-5xl mx-auto px-4" style={{ perspective: "1400px", perspectiveOrigin: "50% 0%" }}>
      {/* Device frame */}
      <div
        ref={wrapperRef}
        className="rounded-2xl overflow-hidden border border-gray-200/80 dark:border-white/10"
        style={{
          transformOrigin: "center top",
          willChange: "transform",
          background: "#e8e9eb",
        }}
      >
        {/* Browser chrome bar */}
        <div className="flex items-center gap-2 px-4 h-10 bg-[#e8e9eb] shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 mx-3">
            <div className="bg-white/60 rounded-md h-5 max-w-xs mx-auto flex items-center justify-center">
              <span className="text-[10px] text-gray-400 font-medium">budget-it.vercel.app/dashboard</span>
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="flex bg-[#f5f6f8]" style={{ minHeight: "440px" }}>
          {/* Sidebar */}
          <div className="w-44 bg-white border-r border-gray-100 flex flex-col py-4 shrink-0">
            <div className="px-4 mb-5">
              <span className="text-sm font-bold text-gray-900">budget<span className="text-[#52b788]">-it</span></span>
            </div>
            {[
              { label: "Home", active: true },
              { label: "Inkomsten", active: false },
              { label: "Uitgaves", active: false },
              { label: "Vaste Lasten", active: false },
              { label: "Overzicht", active: false },
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

          {/* Main */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-10 bg-white border-b border-gray-100 flex items-center justify-between px-5">
              <span className="text-xs text-gray-400">Home</span>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#52b788] flex items-center justify-center text-white text-[9px] font-bold">K</div>
                <span className="text-xs text-gray-600 font-medium">Kevin</span>
              </div>
            </div>

            <div className="flex-1 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Hallo, Kevin 👋</h2>
                  <p className="text-xs text-gray-400">Welkom bij je budget overzicht.</p>
                </div>
                <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
                  {["Jan","Feb","Mar","Apr","Mei","Jun"].map((m) => (
                    <div key={m} className={`px-2 py-1 text-[10px] rounded-md font-medium ${m === "Apr" ? "bg-[#2d6a4f] text-white" : "text-gray-400"}`}>{m}</div>
                  ))}
                </div>
              </div>

              {/* Stat cards — each with its own ref for staggered parallax */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div ref={stat1Ref} className="bg-white rounded-xl border border-gray-100 p-3" style={{ willChange: "transform" }}>
                  <p className="text-[10px] text-gray-400 mb-1">Inkomsten</p>
                  <p className="text-base font-bold text-gray-900 mb-1.5">€ 3.200</p>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-green-50 text-green-600">↑ +5.2%</span>
                </div>
                <div ref={stat2Ref} className="bg-white rounded-xl border border-gray-100 p-3" style={{ willChange: "transform" }}>
                  <p className="text-[10px] text-gray-400 mb-1">Vaste Lasten</p>
                  <p className="text-base font-bold text-gray-900 mb-1.5">€ 1.450</p>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-500">↑ 45.3%</span>
                </div>
                <div ref={stat3Ref} className="bg-white rounded-xl border border-gray-100 p-3" style={{ willChange: "transform" }}>
                  <p className="text-[10px] text-gray-400 mb-1">Vrij besteedbaar</p>
                  <p className="text-base font-bold text-gray-900 mb-1.5">€ 1.750</p>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-500">↑ 54.7%</span>
                </div>
              </div>

              {/* Chart cards — also staggered */}
              <div className="grid grid-cols-2 gap-3">
                <div ref={chart1Ref} className="bg-white rounded-xl border border-gray-100 p-3" style={{ willChange: "transform" }}>
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

                <div ref={chart2Ref} className="bg-white rounded-xl border border-gray-100 p-3" style={{ willChange: "transform" }}>
                  <p className="text-[10px] font-semibold text-gray-700 mb-2">Budget verdeling</p>
                  <div className="flex items-center gap-3">
                    <svg width="64" height="64" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="24" fill="none" stroke="#f0f0f0" strokeWidth="8" />
                      <circle cx="32" cy="32" r="24" fill="none" stroke="#fca5a5" strokeWidth="8"
                        strokeDasharray="68 151" strokeLinecap="round" transform="rotate(-90 32 32)" />
                      <circle cx="32" cy="32" r="24" fill="none" stroke="#52b788" strokeWidth="8"
                        strokeDasharray="83 151" strokeLinecap="round" transform="rotate(62 32 32)" />
                      <text x="32" y="35" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#111">54.7%</text>
                    </svg>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#52b788]" /><span className="text-[9px] text-gray-500">Vrij besteedbaar</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-300" /><span className="text-[9px] text-gray-500">Vaste lasten</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
