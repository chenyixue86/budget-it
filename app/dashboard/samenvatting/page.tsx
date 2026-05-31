"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n";
import { getCurrentMaandStr, getPrevMaandStr } from "@/lib/month-context";

type MaandData = {
  maand: string;
  inkomsten: number;
  vasteLasten: number;
  variabel: number;
};

function getLast6Months(): string[] {
  const result: string[] = [];
  let current = getCurrentMaandStr();
  for (let i = 0; i < 6; i++) {
    result.unshift(current);
    current = getPrevMaandStr(current);
  }
  return result;
}

function fmt(n: number) {
  return n.toLocaleString("nl-NL", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function SamenvattingPage() {
  const supabase = createClient();
  const { t, lang } = useLanguage();
  const s = t.samenvatting;

  const [data, setData] = useState<MaandData[]>([]);
  const [loading, setLoading] = useState(true);

  const months = useMemo(() => getLast6Months(), []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const oldest = months[0];
      const newest = months[months.length - 1];

      const [inkRes, vlRes, uitRes] = await Promise.all([
        supabase.from("inkomsten").select("maand, bedrag").gte("maand", oldest).lte("maand", newest),
        supabase.from("vaste_lasten").select("maand, bedrag").gte("maand", oldest).lte("maand", newest),
        supabase.from("uitgaves").select("maand, bedrag").gte("maand", oldest).lte("maand", newest),
      ]);

      const result: MaandData[] = months.map((maand) => ({
        maand,
        inkomsten: (inkRes.data ?? []).filter((r) => r.maand === maand).reduce((sum, r) => sum + r.bedrag, 0),
        vasteLasten: (vlRes.data ?? []).filter((r) => r.maand === maand).reduce((sum, r) => sum + r.bedrag, 0),
        variabel: (uitRes.data ?? []).filter((r) => r.maand === maand).reduce((sum, r) => sum + r.bedrag, 0),
      }));

      setData(result);
      setLoading(false);
    }
    load();
  }, [supabase, months]);

  function maandKort(maand: string) {
    const [y, m] = maand.split("-").map(Number);
    return new Intl.DateTimeFormat(lang === "nl" ? "nl-NL" : "en-US", { month: "short" }).format(new Date(y, m - 1));
  }

  function maandLang(maand: string) {
    const [y, m] = maand.split("-").map(Number);
    return new Intl.DateTimeFormat(lang === "nl" ? "nl-NL" : "en-US", { month: "long", year: "numeric" }).format(new Date(y, m - 1));
  }

  const withData = data.filter((d) => d.inkomsten > 0 || d.vasteLasten > 0 || d.variabel > 0);
  const gemInkomsten = withData.length > 0 ? withData.reduce((s, d) => s + d.inkomsten, 0) / withData.length : 0;
  const gemUitgegeven = withData.length > 0 ? withData.reduce((s, d) => s + d.vasteLasten + d.variabel, 0) / withData.length : 0;
  const gemOver = gemInkomsten - gemUitgegeven;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600 dark:text-white/60 text-sm">{s.laden}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{s.title}</h1>
        <p className="text-gray-400 dark:text-white/40 mt-1 text-sm">{s.subtitle}</p>
      </div>

      <div className="max-w-2xl space-y-4">

        {/* Gem. stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {([
            { label: s.gemInkomsten, value: gemInkomsten, positive: true },
            { label: s.gemUitgegeven, value: gemUitgegeven, positive: false },
            { label: s.gemiddeld, value: gemOver, positive: gemOver >= 0 },
          ] as const).map(({ label, value, positive }) => (
            <div key={label} className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-4 transition-colors duration-200">
              <p className="text-xs text-gray-500 dark:text-white/40 mb-1 leading-tight">{label}</p>
              <p className={`text-base font-bold ${positive ? "text-[#2d6a4f] dark:text-[#52b788]" : "text-red-400"}`}>
                € {fmt(Math.abs(value))}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-white/30 mt-0.5">{s.perMaand}</p>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-5 transition-colors duration-200">
          <p className="text-sm font-semibold text-gray-800 dark:text-white/80 mb-4">{s.bestedPct}</p>
          <div className="flex items-end gap-2">
            {data.map(({ maand, inkomsten, vasteLasten, variabel }) => {
              const totaalUit = vasteLasten + variabel;
              const pct = inkomsten > 0 ? Math.min((totaalUit / inkomsten) * 100, 100) : 0;
              const hasData = inkomsten > 0 || totaalUit > 0;
              const barColor = pct > 90 ? "bg-red-400" : pct > 70 ? "bg-orange-400" : "bg-[#52b788]";
              return (
                <div key={maand} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full relative rounded-lg bg-gray-100 dark:bg-white/10 overflow-hidden" style={{ height: "80px" }}>
                    {hasData && (
                      <div
                        className={`absolute bottom-0 left-0 right-0 ${barColor} transition-all`}
                        style={{ height: `${Math.max(pct, 4)}%` }}
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-white/40 capitalize">{maandKort(maand)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50 dark:border-white/5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#52b788]" />
              <span className="text-[10px] text-gray-400 dark:text-white/30">&lt; 70%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-[10px] text-gray-400 dark:text-white/30">70–90%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-[10px] text-gray-400 dark:text-white/30">&gt; 90%</span>
            </div>
          </div>
        </div>

        {/* Detail per maand */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden transition-colors duration-200">
          <div className="px-5 py-4 border-b border-gray-50 dark:border-white/5">
            <p className="text-sm font-semibold text-gray-800 dark:text-white/80">{s.detailTitle}</p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-white/5">
            {[...data].reverse().map(({ maand, inkomsten, vasteLasten, variabel }) => {
              const totaalUit = vasteLasten + variabel;
              const over = inkomsten - totaalUit;
              const hasData = inkomsten > 0 || totaalUit > 0;
              return (
                <div key={maand} className={`px-5 py-3.5 ${!hasData ? "opacity-40" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700 dark:text-white/70 capitalize">
                      {maandLang(maand)}
                    </span>
                    {hasData ? (
                      <span className={`text-sm font-bold ${over >= 0 ? "text-[#2d6a4f] dark:text-[#52b788]" : "text-red-400"}`}>
                        {over >= 0 ? "+" : "−"} € {fmt(Math.abs(over))}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-white/30">{s.geenData}</span>
                    )}
                  </div>
                  {hasData && (
                    <div className="flex gap-4 text-xs text-gray-500 dark:text-white/40">
                      <span>
                        {s.inkomsten}:{" "}
                        <span className="text-gray-700 dark:text-white/60 font-medium">€ {fmt(inkomsten)}</span>
                      </span>
                      <span>
                        {s.vasteLasten}:{" "}
                        <span className="text-gray-700 dark:text-white/60 font-medium">€ {fmt(vasteLasten)}</span>
                      </span>
                      <span>
                        {s.variabel}:{" "}
                        <span className="text-gray-700 dark:text-white/60 font-medium">€ {fmt(variabel)}</span>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </>
  );
}
