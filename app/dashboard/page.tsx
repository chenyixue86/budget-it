"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

type UitgaveItem = { id: string; naam: string; bedrag: number };

const SEGMENT_COLORS = ["#fca5a5", "#fdba74", "#fde68a", "#93c5fd", "#c4b5fd", "#f9a8d4"];

export default function Dashboard() {
  const supabase = createClient();
  const [activeMonth, setActiveMonth] = useState("Apr");
  const [inkomstenTotaal, setInkomstenTotaal] = useState<number | null>(null);
  const [uitgaves, setUitgaves] = useState<UitgaveItem[]>([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      const full = user?.user_metadata?.full_name as string | undefined;
      setUserName(full?.split(" ")[0] || user?.email?.split("@")[0] || "");
    });

    supabase.from("inkomsten").select("bedrag").then(({ data }) => {
      if (data) setInkomstenTotaal(data.reduce((s: number, i: { bedrag: number }) => s + i.bedrag, 0));
    });

    supabase.from("uitgaves").select("id, naam, bedrag").order("created_at").then(({ data }) => {
      if (data) setUitgaves(data);
    });
  }, [supabase]);

  const inkStr = inkomstenTotaal === null
    ? "..."
    : "€ " + inkomstenTotaal.toLocaleString("nl-NL", { minimumFractionDigits: 0 });

  return (
    <>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hallo{userName ? `, ${userName}` : ""} 👋
          </h1>
          <p className="text-gray-400 dark:text-white/40 mt-1 text-sm">Welkom bij je budget overzicht.</p>
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl p-1">
          {MONTHS.map((m) => (
            <button
              key={m}
              onClick={() => setActiveMonth(m)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeMonth === m
                  ? "bg-[#2d6a4f] text-white"
                  : "text-gray-400 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/60"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        <StatCard label="Inkomsten" value={inkStr} sub="per maand" trend="totaal inkomen" positive />
        <StatCard label="Vaste Lasten" value="€ —" sub="maandelijks" trend="nog in te vullen" positive={false} />
        <StatCard label="Vrij besteedbaar" value="€ —" sub="resterend" trend="nog in te vullen" positive />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <UitgavesCard items={uitgaves} />
        <BudgetHealth uitgaves={uitgaves} inkomstenTotaal={inkomstenTotaal ?? 0} />
      </div>
    </>
  );
}

function StatCard({ label, value, sub, trend, positive }: {
  label: string; value: string; sub: string; trend: string; positive: boolean;
}) {
  return (
    <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-6 transition-colors duration-200">
      <div className="text-gray-400 dark:text-white/40 text-sm mb-4">{label}</div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{value}</p>
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          positive
            ? "bg-green-50 dark:bg-green-400/10 text-green-600 dark:text-green-400"
            : "bg-orange-50 dark:bg-orange-400/10 text-orange-500 dark:text-orange-400"
        }`}>
          {positive ? "↑" : "→"} {trend}
        </span>
        <span className="text-gray-400 dark:text-white/30 text-xs">{sub}</span>
      </div>
    </div>
  );
}

function UitgavesCard({ items }: { items: UitgaveItem[] }) {
  const totaal = items.reduce((s, i) => s + i.bedrag, 0);
  return (
    <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-6 transition-colors duration-200">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-800 dark:text-white/80 text-sm">Uitgaves deze maand</h3>
        <span className="text-xs text-gray-400 dark:text-white/30">
          Totaal: € {totaal.toLocaleString("nl-NL", { minimumFractionDigits: 0 })}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-300 dark:text-white/20 text-center py-8">Nog geen uitgaves toegevoegd.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const pct = totaal > 0 ? Math.round((item.bedrag / totaal) * 100) : 0;
            return (
              <div key={item.id}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-gray-600 dark:text-white/60">{item.naam}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-800 dark:text-white/80 font-medium">
                      € {item.bedrag.toLocaleString("nl-NL", { minimumFractionDigits: 0 })}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-white/30 w-8 text-right">{pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#52b788] rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BudgetHealth({ uitgaves, inkomstenTotaal }: { uitgaves: UitgaveItem[]; inkomstenTotaal: number }) {
  const C = 2 * Math.PI * 46;
  const totaalUitgaves = uitgaves.reduce((s, i) => s + i.bedrag, 0);

  const segments = uitgaves.map((item, i) => ({
    naam: item.naam,
    pct: totaalUitgaves > 0 ? (item.bedrag / totaalUitgaves) * 100 : 0,
    color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
  }));

  let cumPct = 0;
  const segmentsWithStart = segments.map((seg) => {
    const startPct = cumPct;
    cumPct += seg.pct;
    return { ...seg, startPct };
  });

  const noData = inkomstenTotaal === 0 && uitgaves.length === 0;

  return (
    <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-6 transition-colors duration-200">
      <h3 className="font-semibold text-gray-800 dark:text-white/80 text-sm mb-5">Budget verdeling</h3>
      <div className="flex items-center gap-8">
        <div className="relative shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="46" fill="none" stroke="#f0f0f0" strokeWidth="12" className="dark:opacity-10" />
            {noData ? (
              <circle cx="60" cy="60" r="46" fill="none" stroke="#e5e7eb" strokeWidth="12" />
            ) : (
              segmentsWithStart.map((seg, i) =>
                seg.pct > 0 ? (
                  <circle
                    key={i}
                    cx="60" cy="60" r="46"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="12"
                    strokeDasharray={`${(seg.pct / 100) * C} ${C}`}
                    strokeLinecap="butt"
                    transform={`rotate(${-90 + (seg.startPct / 100) * 360} 60 60)`}
                  />
                ) : null
              )
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-400 dark:text-white/30 text-center leading-tight">
              {noData ? "—" : `${uitgaves.length} posten`}
            </span>
          </div>
        </div>

        <div className="space-y-2.5 flex-1">
          {noData ? (
            <p className="text-sm text-gray-300 dark:text-white/20">Voeg inkomsten en uitgaves toe.</p>
          ) : (
            segmentsWithStart.map((seg, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                  <span className="text-sm text-gray-500 dark:text-white/50 truncate">{seg.naam}</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-white/70 ml-2 shrink-0">
                  {seg.pct.toFixed(0)}%
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
