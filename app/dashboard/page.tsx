"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

const UITGAVES = [
  { category: "Boodschappen", amount: 380, pct: 26 },
  { category: "Uit eten", amount: 210, pct: 14 },
  { category: "Transport", amount: 160, pct: 11 },
  { category: "Kleding", amount: 120, pct: 8 },
  { category: "Entertainment", amount: 95, pct: 6 },
];

export default function Dashboard() {
  const supabase = createClient();
  const [activeMonth, setActiveMonth] = useState("Apr");
  const [inkomstenTotaal, setInkomstenTotaal] = useState<number | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      const full = user?.user_metadata?.full_name as string | undefined;
      setUserName(full?.split(" ")[0] || user?.email?.split("@")[0] || "");
    });

    supabase.from("inkomsten").select("bedrag").then(({ data }) => {
      if (data) setInkomstenTotaal(data.reduce((s: number, i: { bedrag: number }) => s + i.bedrag, 0));
    });
  }, [supabase]);

  const inkStr = inkomstenTotaal === null
    ? "..."
    : "€ " + inkomstenTotaal.toLocaleString("nl-NL", { minimumFractionDigits: 0 });

  return (
    <>
      {/* Greeting */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hallo{userName ? `, ${userName}` : ""} 👋
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Welkom bij je budget overzicht.</p>
        </div>
        {/* Month filter */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {MONTHS.map((m) => (
            <button
              key={m}
              onClick={() => setActiveMonth(m)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeMonth === m ? "bg-[#2d6a4f] text-white" : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <StatCard
          label="Inkomsten"
          value={inkStr}
          sub="per maand"
          trend="totaal inkomen"
          positive
        />
        <StatCard
          label="Vaste Lasten"
          value="€ —"
          sub="maandelijks"
          trend="nog in te vullen"
          positive={false}
        />
        <StatCard
          label="Vrij besteedbaar"
          value="€ —"
          sub="resterend"
          trend="nog in te vullen"
          positive
        />
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-2 gap-5">
        <UitgavesCard />
        <BudgetHealth />
      </div>
    </>
  );
}

function StatCard({ label, value, sub, trend, positive }: {
  label: string; value: string; sub: string; trend: string; positive: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="text-gray-400 text-sm mb-4">{label}</div>
      <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          positive ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-500"
        }`}>
          {positive ? "↑" : "→"} {trend}
        </span>
        <span className="text-gray-400 text-xs">{sub}</span>
      </div>
    </div>
  );
}

function UitgavesCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-800 text-sm">Uitgaves deze maand</h3>
        <span className="text-xs text-gray-400">Totaal: € 965</span>
      </div>
      <div className="space-y-3">
        {UITGAVES.map((item) => (
          <div key={item.category}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-gray-600">{item.category}</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-800 font-medium">€ {item.amount}</span>
                <span className="text-xs text-gray-400 w-8 text-right">{item.pct}%</span>
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#52b788] rounded-full" style={{ width: `${item.pct * 3}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetHealth() {
  const healthy = 54.7;
  const vasteLasten = 45.3;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-800 text-sm mb-5">Budget verdeling</h3>
      <div className="flex items-center gap-8">
        <div className="relative shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="46" fill="none" stroke="#f0f0f0" strokeWidth="12" />
            <circle cx="60" cy="60" r="46" fill="none" stroke="#fca5a5" strokeWidth="12"
              strokeDasharray={`${(vasteLasten / 100) * 289} 289`} strokeLinecap="round" transform="rotate(-90 60 60)" />
            <circle cx="60" cy="60" r="46" fill="none" stroke="#52b788" strokeWidth="12"
              strokeDasharray={`${(healthy / 100) * 289} 289`} strokeLinecap="round"
              transform={`rotate(${-90 + (vasteLasten / 100) * 360} 60 60)`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-gray-900">{healthy}%</span>
            <span className="text-xs text-gray-400">vrij</span>
          </div>
        </div>
        <div className="space-y-3 flex-1">
          <LegendItem color="bg-[#52b788]" label="Vrij besteedbaar" value="54.7%" />
          <LegendItem color="bg-red-300" label="Vaste lasten" value="45.3%" />
          <div className="pt-2 border-t border-gray-100 text-xs text-gray-400">
            Inkomen: {inkomstenTotaalDisplay()}
          </div>
        </div>
      </div>
    </div>
  );
}

function inkomstenTotaalDisplay() {
  return "zie Inkomsten tab";
}

function LegendItem({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <span className="text-sm font-medium text-gray-700">{value}</span>
    </div>
  );
}
