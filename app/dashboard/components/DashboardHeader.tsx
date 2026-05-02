"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/app/components/ThemeProvider";

const LABELS: Record<string, string> = {
  "/dashboard": "Home",
  "/dashboard/inkomsten": "Inkomsten",
  "/dashboard/uitgaves": "Uitgaves",
  "/dashboard/vaste-lasten": "Vaste Lasten",
  "/dashboard/overzicht": "Overzicht",
  "/dashboard/instellingen": "Instellingen",
};

export default function DashboardHeader() {
  const pathname = usePathname();
  const [name, setName] = useState("");
  const supabase = createClient();
  const { dark, toggle } = useTheme();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      const full = user?.user_metadata?.full_name as string | undefined;
      setName(full || user?.email?.split("@")[0] || "");
    });
  }, [supabase]);

  return (
    <header className="h-14 bg-white dark:bg-[#111111] border-b border-gray-100 dark:border-white/10 flex items-center justify-between px-8 shrink-0 transition-colors duration-200">
      <span className="text-sm text-gray-400 dark:text-white/40">{LABELS[pathname] ?? "Dashboard"}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70 transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
        <button className="text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 transition-colors">
          <BellIcon />
        </button>
        <div className="flex items-center gap-2 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-white/70 font-medium">
          <div className="w-5 h-5 rounded-full bg-[#52b788] flex items-center justify-center text-white text-xs font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          {name}
          <ChevronIcon />
        </div>
      </div>
    </header>
  );
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
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
