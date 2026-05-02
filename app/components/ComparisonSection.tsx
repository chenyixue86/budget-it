"use client";

import { useState } from "react";

const FEATURES = [
  { label: "Inkomsten bijhouden",    budgetit: "Gratis",  andere: "€ 3.99 / maand" },
  { label: "Uitgaves registreren",   budgetit: "Gratis",  andere: "€ 3.99 / maand" },
  { label: "Vaste lasten beheren",   budgetit: "Gratis",  andere: "€ 2.99 / maand" },
  { label: "Maandelijks overzicht",  budgetit: "Gratis",  andere: "€ 2.99 / maand" },
  { label: "Dark mode",              budgetit: "Gratis",  andere: "€ 1.99 / maand" },
  { label: "Geen advertenties",      budgetit: "Gratis",  andere: "€ 1.99 / maand" },
  { label: "Onbeperkte data",        budgetit: "Gratis",  andere: "€ 2.99 / maand" },
];

const TOTAAL_ANDERE = "€ 20.93 / maand";

export default function ComparisonSection() {
  const [tab, setTab] = useState<"budgetit" | "andere">("budgetit");
  const isBudgetit = tab === "budgetit";

  return (
    <section className="py-24 px-6 border-t border-gray-100 dark:border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <p className="text-green-600 dark:text-green-400 text-sm font-medium mb-3">Vergelijking</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight text-gray-900 dark:text-white mb-5">
              Ga lean en bespaar<br />
              <span className="text-green-500 dark:text-green-400">op je budgetapp.</span>
            </h2>
            <p className="text-gray-500 dark:text-white/50 text-base leading-relaxed mb-8 max-w-md">
              Andere budgetapps rekenen je voor elke feature apart. Bij budget-it betaal je niets — nooit. Geen abonnement, geen verborgen kosten.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-600 dark:text-green-400">
                    <CheckIcon />
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">100% gratis</span>
                </div>
                <p className="text-gray-400 dark:text-white/40 text-sm pl-6">Alle features, altijd, voor iedereen.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-600 dark:text-green-400">
                    <CheckIcon />
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">Geen creditcard nodig</span>
                </div>
                <p className="text-gray-400 dark:text-white/40 text-sm pl-6">Gewoon registreren en beginnen.</p>
              </div>
            </div>
          </div>

          {/* Right — comparison card */}
          <div className="bg-gray-50 dark:bg-[#111111] rounded-3xl p-2 border border-gray-100 dark:border-white/5">
            {/* Tabs */}
            <div className="flex gap-2 mb-2 p-1 bg-white dark:bg-white/5 rounded-2xl">
              <button
                onClick={() => setTab("budgetit")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isBudgetit
                    ? "bg-[#2d6a4f] text-white shadow-sm"
                    : "text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/50"
                }`}
              >
                budget-it
              </button>
              <button
                onClick={() => setTab("andere")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  !isBudgetit
                    ? "bg-[#7c2d12] text-white shadow-sm"
                    : "text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/50"
                }`}
              >
                Andere apps
              </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#0f0f0f] rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5">
              {/* Header */}
              <div className="grid grid-cols-2 border-b-2 border-green-500/60 dark:border-green-400/40 px-5 py-3 bg-gray-50 dark:bg-white/3">
                <span className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wide">Feature</span>
                <span className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wide">
                  {isBudgetit ? "Kosten bij budget-it" : "Kosten bij anderen"}
                </span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-50 dark:divide-white/5">
                {FEATURES.map((f) => (
                  <div key={f.label} className="grid grid-cols-2 px-5 py-3.5 hover:bg-gray-50/60 dark:hover:bg-white/3 transition-colors">
                    <span className="text-sm text-gray-600 dark:text-white/60">{f.label}</span>
                    <span className={`text-sm font-medium ${
                      isBudgetit
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-700 dark:text-white/70"
                    }`}>
                      {isBudgetit ? f.budgetit : f.andere}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="grid grid-cols-2 px-5 py-4 border-t border-gray-100 dark:border-white/8 bg-gray-50 dark:bg-white/3">
                <span className="text-sm font-bold text-gray-800 dark:text-white/80">Totaal</span>
                <span className={`text-xl font-bold ${isBudgetit ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                  {isBudgetit ? "€ 0 / maand" : TOTAAL_ANDERE}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}
