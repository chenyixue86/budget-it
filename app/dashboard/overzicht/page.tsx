"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n";
import { useMonth } from "@/lib/month-context";

type Item = { id: string; naam: string; bedrag: number };

function fmt(n: number) {
  return n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function OverzichtPage() {
  const supabase = createClient();
  const router = useRouter();
  const { t } = useLanguage();
  const { activeMaandStr } = useMonth();

  const [inkomsten, setInkomsten] = useState<Item[]>([]);
  const [vasteLasten, setVasteLasten] = useState<Item[]>([]);
  const [uitgaves, setUitgaves] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
    });

    setLoading(true);
    Promise.all([
      supabase.from("inkomsten").select("id, naam, bedrag").eq("maand", activeMaandStr).order("bedrag", { ascending: false }),
      supabase.from("vaste_lasten").select("id, naam, bedrag").eq("maand", activeMaandStr).order("bedrag", { ascending: false }),
      supabase.from("uitgaves").select("id, naam, bedrag").eq("maand", activeMaandStr).order("bedrag", { ascending: false }),
    ]).then(([ink, vl, uit]) => {
      if (ink.data) setInkomsten(ink.data);
      if (vl.data) setVasteLasten(vl.data);
      if (uit.data) setUitgaves(uit.data);
      setLoading(false);
    });
  }, [supabase, router, activeMaandStr]);

  const totaalInkomsten = inkomsten.reduce((s, i) => s + i.bedrag, 0);
  const totaalVasteLasten = vasteLasten.reduce((s, i) => s + i.bedrag, 0);
  const totaalUitgaves = uitgaves.reduce((s, i) => s + i.bedrag, 0);
  const over = totaalInkomsten - totaalVasteLasten - totaalUitgaves;
  const uitgegeven = totaalVasteLasten + totaalUitgaves;
  const uitPct = totaalInkomsten > 0 ? Math.min((uitgegeven / totaalInkomsten) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600 dark:text-white/60 text-sm">{t.overzicht.laden}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.overzicht.title}</h1>
        <p className="text-gray-400 dark:text-white/40 mt-1 text-sm">{t.overzicht.subtitle}</p>
      </div>

      <div className="max-w-2xl space-y-3">

        {/* Inkomsten */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden transition-colors duration-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#52b788]" />
              <span className="text-sm font-semibold text-gray-800 dark:text-white/80">{t.overzicht.inkomsten}</span>
            </div>
            <span className="text-sm font-bold text-[#2d6a4f] dark:text-[#52b788]">+ € {fmt(totaalInkomsten)}</span>
          </div>
          {inkomsten.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-white/50 text-center py-6">{t.overzicht.geenInkomsten}</p>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-white/5">
              {inkomsten.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-gray-600 dark:text-white/60">{item.naam}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">€ {fmt(item.bedrag)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vaste Lasten */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden transition-colors duration-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-300" />
              <span className="text-sm font-semibold text-gray-800 dark:text-white/80">{t.overzicht.vasteLasten}</span>
            </div>
            <span className="text-sm font-bold text-red-400">− € {fmt(totaalVasteLasten)}</span>
          </div>
          {vasteLasten.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-white/50 text-center py-6">{t.overzicht.geenVasteLasten}</p>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-white/5">
              {vasteLasten.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-gray-600 dark:text-white/60">{item.naam}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">€ {fmt(item.bedrag)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Uitgaves */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden transition-colors duration-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-300" />
              <span className="text-sm font-semibold text-gray-800 dark:text-white/80">{t.overzicht.uitgaves}</span>
            </div>
            <span className="text-sm font-bold text-orange-500">− € {fmt(totaalUitgaves)}</span>
          </div>
          {uitgaves.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-white/50 text-center py-6">{t.overzicht.geenUitgaves}</p>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-white/5">
              {uitgaves.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-gray-600 dark:text-white/60">{item.naam}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">€ {fmt(item.bedrag)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t-2 border-dashed border-gray-200 dark:border-white/10 mx-1" />

        {/* Balance */}
        <div className={`rounded-2xl p-5 transition-colors duration-200 ${
          over >= 0
            ? "bg-[#f0faf4] dark:bg-[#52b788]/5 border border-[#52b788]/30 dark:border-[#52b788]/20"
            : "bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-600 dark:text-white/60">{t.overzicht.watJeOverhoudt}</p>
            <p className={`text-2xl font-bold ${over >= 0 ? "text-[#2d6a4f] dark:text-[#52b788]" : "text-red-500"}`}>
              {over >= 0 ? "+" : "−"} € {fmt(Math.abs(over))}
            </p>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-white/60 mb-1.5">
              <span>{uitPct.toFixed(0)}{t.overzicht.vanInkomenBesteed}</span>
              <span>{(100 - uitPct).toFixed(0)}{t.overzicht.over}</span>
            </div>
            <div className="h-2.5 bg-white/70 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${uitPct > 90 ? "bg-red-400" : uitPct > 70 ? "bg-orange-400" : "bg-[#52b788]"}`}
                style={{ width: `${uitPct}%` }}
              />
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
