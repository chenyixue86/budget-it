"use client";

import { useState } from "react";
import SignOutButton from "@/app/components/SignOutButton";

const NAV_ITEMS = [
  { icon: HomeIcon, label: "Home", active: true },
  { icon: InkomenIcon, label: "Inkomsten", active: false },
  { icon: UitgavesIcon, label: "Uitgaves", active: false },
  { icon: VasteLastenIcon, label: "Vaste Lasten", active: false },
  { icon: OverzichtIcon, label: "Overzicht", active: false },
  { icon: InstellingenIcon, label: "Instellingen", active: false },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

const UITGAVES = [
  { category: "Boodschappen", amount: 380, pct: 26 },
  { category: "Uit eten", amount: 210, pct: 14 },
  { category: "Transport", amount: 160, pct: 11 },
  { category: "Kleding", amount: 120, pct: 8 },
  { category: "Entertainment", amount: 95, pct: 6 },
];

export default function Dashboard() {
  const [activeMonth, setActiveMonth] = useState("Apr");

  return (
    <div className="flex h-screen bg-[#f5f6f8] font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          {/* Greeting */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hallo, Kevin 👋</h1>
              <p className="text-gray-400 mt-1 text-sm">Welkom bij je budget overzicht.</p>
            </div>
            {/* Month filter */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
              {MONTHS.map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMonth(m)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    activeMonth === m
                      ? "bg-[#2d6a4f] text-white"
                      : "text-gray-400 hover:text-gray-700"
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
              value="€ 3.200"
              sub="deze maand"
              trend="+5.2%"
              positive
            />
            <StatCard
              label="Vaste Lasten"
              value="€ 1.450"
              sub="maandelijks"
              trend="45.3% van inkomen"
              positive={false}
            />
            <StatCard
              label="Vrij besteedbaar"
              value="€ 1.750"
              sub="resterend"
              trend="54.7% van inkomen"
              positive
            />
          </div>

          {/* Bottom section */}
          <div className="grid grid-cols-2 gap-5">
            <UitgavesCard />
            <BudgetHealth />
          </div>
        </main>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col py-6 shrink-0">
      {/* Logo */}
      <div className="px-6 mb-8">
        <span className="text-xl font-bold tracking-tight text-gray-900">
          budget<span className="text-[#52b788]">-it</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              item.active
                ? "bg-[#f0faf4] text-[#2d6a4f] font-medium"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <item.icon active={item.active} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 mt-4">
        <SignOutButton />
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>Home</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <BellIcon />
        </button>
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 font-medium">
          <div className="w-5 h-5 rounded-full bg-[#52b788] flex items-center justify-center text-white text-xs font-bold">K</div>
          Kevin
          <ChevronIcon />
        </div>
      </div>
    </header>
  );
}

function StatCard({
  label,
  value,
  sub,
  trend,
  positive,
}: {
  label: string;
  value: string;
  sub: string;
  trend: string;
  positive: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
        <span>{label}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            positive
              ? "bg-green-50 text-green-600"
              : "bg-orange-50 text-orange-500"
          }`}
        >
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
              <div
                className="h-full bg-[#52b788] rounded-full"
                style={{ width: `${item.pct * 3}%` }}
              />
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
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-800 text-sm">Budget verdeling</h3>
      </div>
      <div className="flex items-center gap-8">
        {/* Donut chart */}
        <div className="relative shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="46" fill="none" stroke="#f0f0f0" strokeWidth="12" />
            {/* Vaste lasten */}
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke="#fca5a5"
              strokeWidth="12"
              strokeDasharray={`${(vasteLasten / 100) * 289} 289`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            {/* Vrij besteedbaar */}
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke="#52b788"
              strokeWidth="12"
              strokeDasharray={`${(healthy / 100) * 289} 289`}
              strokeLinecap="round"
              transform={`rotate(${-90 + (vasteLasten / 100) * 360} 60 60)`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-gray-900">{healthy}%</span>
            <span className="text-xs text-gray-400">vrij</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3 flex-1">
          <LegendItem color="bg-[#52b788]" label="Vrij besteedbaar" value="54.7%" />
          <LegendItem color="bg-red-300" label="Vaste lasten" value="45.3%" />
          <div className="pt-2 border-t border-gray-100 text-xs text-gray-400">
            Inkomen: € 3.200 / maand
          </div>
        </div>
      </div>
    </div>
  );
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

// Icons
function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#2d6a4f" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  );
}

function InkomenIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#2d6a4f" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function UitgavesIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#2d6a4f" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function VasteLastenIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#2d6a4f" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function OverzichtIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#2d6a4f" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function InstellingenIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#2d6a4f" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6,9 12,15 18,9" />
    </svg>
  );
}
