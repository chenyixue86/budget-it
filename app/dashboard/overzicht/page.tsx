"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Item = { id: string; naam: string; bedrag: number };

export default function OverzichtPage() {
  const supabase = createClient();
  const router = useRouter();
  const [inkomsten, setInkomsten] = useState<Item[]>([]);
  const [uitgaves, setUitgaves] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
    });

    Promise.all([
      supabase.from("inkomsten").select("id, naam, bedrag").order("bedrag", { ascending: false }),
      supabase.from("uitgaves").select("id, naam, bedrag").order("bedrag", { ascending: false }),
    ]).then(([ink, uit]) => {
      if (ink.data) setInkomsten(ink.data);
      if (uit.data) setUitgaves(uit.data);
      setLoading(false);
    });
  }, [supabase, router]);

  const totaalInkomsten = inkomsten.reduce((s, i) => s + i.bedrag, 0);
  const totaalUitgaves = uitgaves.reduce((s, i) => s + i.bedrag, 0);
  const over = totaalInkomsten - totaalUitgaves;
  const uitPct = totaalInkomsten > 0 ? Math.min((totaalUitgaves / totaalInkomsten) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Laden...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Overzicht</h1>
        <p className="text-gray-400 mt-1 text-sm">Jouw inkomsten en uitgaves in één overzicht.</p>
      </div>

      {/* Big summary card */}
      <div className={`rounded-2xl p-8 mb-6 ${over >= 0 ? "bg-[#f0faf4] border border-[#52b788]/30" : "bg-red-50 border border-red-200"}`}>
        <p className="text-sm font-medium text-gray-500 mb-2">Wat je overhoudt deze maand</p>
        <p className={`text-5xl font-bold mb-4 ${over >= 0 ? "text-[#2d6a4f]" : "text-red-500"}`}>
          {over >= 0 ? "+" : ""}€ {Math.abs(over).toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>

        {/* Progress bar: hoeveel van inkomen is uitgegeven */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>{uitPct.toFixed(0)}% van inkomen uitgegeven</span>
            <span>{(100 - uitPct).toFixed(0)}% over</span>
          </div>
          <div className="h-3 bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${uitPct > 90 ? "bg-red-400" : uitPct > 70 ? "bg-orange-400" : "bg-[#52b788]"}`}
              style={{ width: `${uitPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two columns: inkomsten + uitgaves */}
      <div className="grid grid-cols-2 gap-5">

        {/* Inkomsten */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-800 text-sm">Inkomsten</h3>
            <span className="text-sm font-bold text-[#2d6a4f]">
              € {totaalInkomsten.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
            </span>
          </div>
          {inkomsten.length === 0 ? (
            <p className="text-sm text-gray-300 text-center py-6">Geen inkomsten toegevoegd.</p>
          ) : (
            <div className="space-y-2">
              {inkomsten.map((item) => {
                const pct = totaalInkomsten > 0 ? (item.bedrag / totaalInkomsten) * 100 : 0;
                return (
                  <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#52b788]" />
                      <span className="text-sm text-gray-700">{item.naam}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{pct.toFixed(0)}%</span>
                      <span className="text-sm font-semibold text-gray-900">
                        € {item.bedrag.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Uitgaves */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-800 text-sm">Uitgaves</h3>
            <span className="text-sm font-bold text-orange-500">
              € {totaalUitgaves.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
            </span>
          </div>
          {uitgaves.length === 0 ? (
            <p className="text-sm text-gray-300 text-center py-6">Geen uitgaves toegevoegd.</p>
          ) : (
            <div className="space-y-2">
              {uitgaves.map((item) => {
                const pct = totaalUitgaves > 0 ? (item.bedrag / totaalUitgaves) * 100 : 0;
                return (
                  <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-300" />
                      <span className="text-sm text-gray-700">{item.naam}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{pct.toFixed(0)}%</span>
                      <span className="text-sm font-semibold text-gray-900">
                        € {item.bedrag.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
