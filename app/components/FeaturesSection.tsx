"use client";

import { useLanguage } from "@/lib/i18n";

const ICONS = [
  // Maandelijkse omgeving — calendar
  <svg key="cal" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>,
  // Samenvatting — trending up
  <svg key="trend" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>,
  // Spaardoel — target
  <svg key="target" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>,
  // CSV export — download
  <svg key="dl" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>,
  // Dark mode — moon
  <svg key="moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>,
  // NL/EN — globe
  <svg key="globe" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>,
];

export default function FeaturesSection() {
  const { t } = useLanguage();
  const f = t.features;

  return (
    <section className="py-24 px-6 bg-[#fafafa] dark:bg-[#0d0d0d] border-t border-gray-100 dark:border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold mb-3 dark:text-green-400" style={{ color: "#00ae3b" }}>{f.label}</p>
          <h2 className="landing-heading text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            {f.title}
          </h2>
          <p className="text-gray-600 dark:text-white/60 text-base max-w-md mx-auto">
            {f.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {f.items.map((item, i) => (
            <div
              key={item.title}
              className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-6 transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-green-500/10 dark:bg-green-400/10 border border-green-500/20 dark:border-green-400/20 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                {ICONS[i]}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">{item.title}</h3>
              <p className="text-gray-500 dark:text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
