"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidebarNav({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const NAV_ITEMS = [
    { href: "/dashboard", label: t.nav.home, Icon: HomeIcon, comingSoon: false },
    { href: "/dashboard/inkomsten", label: t.nav.inkomsten, Icon: InkomenIcon, comingSoon: false },
    { href: "/dashboard/uitgaves", label: t.nav.uitgaves, Icon: UitgavesIcon, comingSoon: false },
    { href: "/dashboard/vaste-lasten", label: t.nav.vasteLasten, Icon: VasteLastenIcon, comingSoon: false },
    { href: "/dashboard/overzicht", label: t.nav.overzicht, Icon: OverzichtIcon, comingSoon: false },
    { href: "/dashboard/instellingen", label: t.nav.instellingen, Icon: InstellingenIcon, comingSoon: false },
  ];

  return (
    <aside
      className={`
        fixed md:relative inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-[#111111] border-r border-gray-100 dark:border-white/10
        flex flex-col py-6 shrink-0 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <div className="px-6 mb-8 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          budget<span className="text-[#52b788]">-it</span>
        </Link>
        <button
          onClick={onClose}
          className="md:hidden text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70 transition-colors"
        >
          <CloseIcon />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, Icon, comingSoon }) => {
          const active = pathname === href;
          if (comingSoon) {
            return (
              <div
                key={href}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 dark:text-white/30 cursor-not-allowed select-none"
              >
                <Icon active={false} />
                {label}
                <span className="ml-auto text-[10px] font-medium text-gray-400 dark:text-white/30">{t.nav.comingSoon}</span>
              </div>
            );
          }
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-[#f0faf4] dark:bg-[#52b788]/10 text-[#2d6a4f] dark:text-[#52b788] font-medium"
                  : "text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white/90"
              }`}
            >
              <Icon active={active} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#52b788" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  );
}
function InkomenIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#52b788" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function UitgavesIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#52b788" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
function VasteLastenIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#52b788" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}
function OverzichtIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#52b788" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function InstellingenIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#52b788" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
