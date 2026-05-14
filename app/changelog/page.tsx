import LandingNavbar from "../components/LandingNavbar";

const UPCOMING: { title: string; description: string }[] = [];

const RELEASES: {
  version: string;
  date: string;
  label?: string;
  changes: { type: "new" | "fix" | "improvement"; text: string }[];
}[] = [
  {
    version: "v0.1.1",
    date: "15 Mei 2026",
    changes: [
      { type: "new", text: "Vaste Lasten pagina — voeg je maandelijkse vaste kosten toe zoals huur, abonnementen en verzekeringen" },
      { type: "new", text: "Categorieën bij vaste lasten" },
      { type: "new", text: "NL/EN taalondersteuning — automatisch op basis van browsertaal" },
    ],
  },
  {
    version: "v0.1.0",
    date: "Mei 2026",
    label: "Eerste release",
    changes: [
      { type: "new", text: "Dashboard met inkomsten, uitgaves en vrij besteedbaar overzicht" },
      { type: "new", text: "Overzicht pagina met totalen en progress bar" },
      { type: "new", text: "Dark mode" },
    ],
  },
];

const TYPE_STYLES = {
  new: "bg-green-50 dark:bg-green-400/10 text-green-600 dark:text-green-400",
  fix: "bg-red-50 dark:bg-red-400/10 text-red-500 dark:text-red-400",
  improvement: "bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400",
};

const TYPE_LABELS = {
  new: "Nieuw",
  fix: "Fix",
  improvement: "Verbeterd",
};

export default function ChangelogPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-200">
      <LandingNavbar />

      <div className="max-w-2xl mx-auto px-6 pt-36 pb-24 w-full">
        <div className="mb-14">
          <span className="inline-flex items-center gap-2 bg-green-500/10 dark:bg-green-400/10 border border-green-500/20 dark:border-green-400/20 text-green-600 dark:text-green-400 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full" />
            Changelog
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
            Updates &amp; Roadmap
          </h1>
          <p className="text-gray-500 dark:text-white/50 text-base">
            Wat er nieuw is en wat er aankomt voor budget-it.
          </p>
        </div>

        {/* Upcoming */}
        {UPCOMING.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Binnenkort</h2>
              <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
            </div>
            <div className="space-y-4">
              {UPCOMING.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]"
                >
                  <span className="mt-0.5 shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 dark:bg-orange-400/10 text-orange-500 dark:text-orange-400 border border-orange-200 dark:border-orange-400/20">
                    BINNENKORT
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/80">{item.title}</p>
                    <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Releases */}
        <section className="space-y-12">
          {RELEASES.map((release) => (
            <div key={release.version}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{release.version}</span>
                  {release.label && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#52b788]/10 text-[#2d6a4f] dark:text-[#52b788] border border-[#52b788]/20">
                      {release.label}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 dark:text-white/30">{release.date}</span>
                </div>
                <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
              </div>
              <ul className="space-y-2.5">
                {release.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`shrink-0 mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded ${TYPE_STYLES[change.type]}`}>
                      {TYPE_LABELS[change.type]}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-white/60">{change.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>

      <footer className="border-t border-gray-100 dark:border-white/5 py-8 text-center text-xs text-gray-400 dark:text-white/30">
        © {new Date().getFullYear()} budget-it
      </footer>
    </main>
  );
}
