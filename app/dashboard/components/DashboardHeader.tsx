"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const BREADCRUMBS: Record<string, string> = {
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

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      const fullName = user?.user_metadata?.full_name as string | undefined;
      setName(fullName || user?.email?.split("@")[0] || "");
    });
  }, [supabase]);

  const initial = name.charAt(0).toUpperCase();
  const label = BREADCRUMBS[pathname] ?? "Dashboard";

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <BellIcon />
        </button>
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 font-medium">
          <div className="w-5 h-5 rounded-full bg-[#52b788] flex items-center justify-center text-white text-xs font-bold">
            {initial}
          </div>
          {name}
          <ChevronIcon />
        </div>
      </div>
    </header>
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
