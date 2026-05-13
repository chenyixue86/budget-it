"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

type UitgaveItem = { id: string; naam: string; bedrag: number; categorie: string };

const SEGMENT_COLORS = ["#fca5a5", "#fdba74", "#fde68a", "#93c5fd", "#c4b5fd", "#f9a8d4"];

function fmt(n: number) {
  return "€ " + n.toLocaleString("nl-NL", { minimumFractionDigits: 0 });
}

export default function Dashboard() {
  const supabase = createClient();
  const [activeMonth, setActiveMonth] = useState("Apr");
  const [inkomstenTotaal, setInkomstenTotaal] = useState<number | null>(null);
  const [vasteLastenTotaal, setVasteLastenTotaal] = useState<number | null>(null);
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

    supabase.from("vaste_lasten").select("bedrag").then(({ data }) => {
      if (data) setVasteLastenTotaal(data.reduce((s: number, i: { bedrag: number }) => s + i.bedrag, 0));
    });

    supabase.from("uitgaves").select("id, naam, bedrag, categorie").order("created_at").then(({ data }) => {
      if (data) setUitgaves(data);
    });
  }, [supabase]);

  const inkStr = inkomstenTotaal === null ? "..." : fmt(inkomstenTotaal);
  const vlStr = vasteLastenTotaal === null ? "..." : fmt(vasteLastenTotaal);
  const vrijStr = inkomstenTotaal === null || vasteLastenTotaal === null
    ? "..."
    : fmt(Math.max(0, inkomstenTotaal - vasteLastenTotaal));

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hallo{userName ? `, ${userName}` : ""} 👋
          </h1>
          <p className="text-gray-600 dark:text-white/60 mt-1 text-sm">Welkom bij je budget overzicht.</p>
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl p-1 overflow-x-auto">
          {MONTHS.map((m) => (
            <button
              key={m}
              onClick={() => setActiveMonth(m)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeMonth === m
                  ? "bg-[#2d6a4f] text-white"
                  : "text-gray-500 dark:text-white/50 hover:text-gray-800 dark:hover:text-white/80"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-4 md:mb-6">
        <StatCard label="Inkomsten" value={inkStr} sub="per maand" trend="totaal inkomen" positive />
        <StatCard label="Vaste Lasten" value={vlStr} sub="maandelijks" trend={vasteLastenTotaal === null ? "laden..." : vasteLastenTotaal === 0 ? "nog in te vullen" : "vaste kosten"} positive={false} />
        <StatCard label="Vrij besteedbaar" value={vrijStr} sub="resterend" trend={inkomstenTotaal && vasteLastenTotaal ? "na vaste lasten" : "nog in te vullen"} positive />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
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
      <div className="text-gray-600 dark:text-white/60 text-sm mb-4">{label}</div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{value}</p>
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          positive
            ? "bg-green-50 dark:bg-green-400/10 text-green-600 dark:text-green-400"
            : "bg-orange-50 dark:bg-orange-400/10 text-orange-500 dark:text-orange-400"
        }`}>
          {positive ? "↑" : "→"} {trend}
        </span>
        <span className="text-gray-500 dark:text-white/50 text-xs">{sub}</span>
      </div>
    </div>
  );
}

function UitgavesCard({ items }: { items: UitgaveItem[] }) {
  const totaal = items.reduce((s, i) => s + i.bedrag, 0);

  const groepen = Object.entries(
    items.reduce<Record<string, number>>((acc, item) => {
      acc[item.categorie] = (acc[item.categorie] || 0) + item.bedrag;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-6 transition-colors duration-200">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-800 dark:text-white/80 text-sm">Uitgaves per categorie</h3>
        <span className="text-xs text-gray-500 dark:text-white/50">
          Totaal: € {totaal.toLocaleString("nl-NL", { minimumFractionDigits: 0 })}
        </span>
      </div>
      {groepen.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-white/50 text-center py-8">Nog geen uitgaves toegevoegd.</p>
      ) : (
        <div className="space-y-3">
          {groepen.map(([cat, bedrag]) => {
            const pct = totaal > 0 ? Math.round((bedrag / totaal) * 100) : 0;
            return (
              <div key={cat}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-gray-600 dark:text-white/60">{cat}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-800 dark:text-white/80 font-medium">
                      € {bedrag.toLocaleString("nl-NL", { minimumFractionDigits: 0 })}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-white/50 w-8 text-right">{pct}%</span>
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

  const groepen = Object.entries(
    uitgaves.reduce<Record<string, number>>((acc, item) => {
      acc[item.categorie] = (acc[item.categorie] || 0) + item.bedrag;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const segments = groepen.map(([naam, bedrag], i) => ({
    naam,
    pct: totaalUitgaves > 0 ? (bedrag / totaalUitgaves) * 100 : 0,
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
        </div>

        <div className="space-y-2.5 flex-1">
          {noData ? (
            <p className="text-sm text-gray-500 dark:text-white/50">Voeg inkomsten en uitgaves toe.</p>
          ) : (
            segmentsWithStart.map((seg, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                  <span className="text-sm text-gray-700 dark:text-white/70 truncate">{seg.naam}</span>
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
