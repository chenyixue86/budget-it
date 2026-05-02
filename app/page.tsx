import LandingNavbar from "./components/LandingNavbar";
import BugReportForm from "./components/BugReportForm";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-200">
      <LandingNavbar />
      <Hero />
      <Features />
      <HowItWorks />
      <BugReport />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 pt-40 pb-28 relative overflow-hidden">
      <div className="hero-blob absolute top-1/3 left-1/2 w-[600px] h-[400px] bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="hero-badge inline-flex items-center gap-2 bg-green-500/10 dark:bg-green-400/10 border border-green-500/20 dark:border-green-400/20 text-green-600 dark:text-green-400 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
        <span className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
        100% gratis, altijd
      </div>

      <h1 className="hero-h1 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] max-w-3xl mb-6 text-gray-900 dark:text-white">
        Jouw budget,<br />
        <span className="text-green-500 dark:text-green-400">onder controle.</span>
      </h1>

      <p className="hero-sub text-gray-500 dark:text-white/50 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
        Voer je inkomsten, uitgaves en vaste lasten in.
        budget-it berekent alles automatisch en geeft je een helder overzicht.
      </p>

      <div className="hero-cta flex flex-col sm:flex-row gap-3">
        <a
          href="/register"
          className="btn-primary text-black font-semibold px-7 py-3.5 rounded-xl text-sm"
        >
          Begin nu →
        </a>
        <a
          href="#how-it-works"
          className="btn-secondary text-gray-600 dark:text-white/70 font-medium px-7 py-3.5 rounded-xl text-sm"
        >
          Hoe het werkt
        </a>
      </div>

      {/* Dashboard mockup */}
      <div className="hero-mockup mt-20 w-full max-w-5xl mx-auto px-4" style={{ perspective: "1200px" }}>
        <div
          className="mockup-float rounded-2xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)] border border-gray-200 dark:border-white/10"
          style={{ transformOrigin: "center top" }}
        >
          <div className="flex bg-[#f5f6f8]" style={{ minHeight: "420px" }}>
            <div className="w-44 bg-white border-r border-gray-100 flex flex-col py-4 shrink-0">
              <div className="px-4 mb-5">
                <span className="text-sm font-bold text-gray-900">budget<span className="text-[#52b788]">-it</span></span>
              </div>
              {[
                { label: "Home", active: true },
                { label: "Inkomsten", active: false },
                { label: "Uitgaves", active: false },
                { label: "Vaste Lasten", active: false },
                { label: "Overzicht", active: false },
                { label: "Instellingen", active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`mx-2 px-3 py-2 rounded-lg text-xs mb-0.5 ${
                    item.active ? "bg-[#f0faf4] text-[#2d6a4f] font-medium" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="h-10 bg-white border-b border-gray-100 flex items-center justify-between px-5">
                <span className="text-xs text-gray-400">Home</span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#52b788] flex items-center justify-center text-white text-[9px] font-bold">K</div>
                  <span className="text-xs text-gray-600 font-medium">Kevin</span>
                </div>
              </div>

              <div className="flex-1 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Hallo, Kevin 👋</h2>
                    <p className="text-xs text-gray-400">Welkom bij je budget overzicht.</p>
                  </div>
                  <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
                    {["Jan","Feb","Mar","Apr","Mei","Jun"].map((m) => (
                      <div key={m} className={`px-2 py-1 text-[10px] rounded-md font-medium ${m === "Apr" ? "bg-[#2d6a4f] text-white" : "text-gray-400"}`}>{m}</div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Inkomsten", value: "€ 3.200", trend: "+5.2%", color: "text-green-600", bg: "bg-green-50" },
                    { label: "Vaste Lasten", value: "€ 1.450", trend: "45.3%", color: "text-orange-500", bg: "bg-orange-50" },
                    { label: "Vrij besteedbaar", value: "€ 1.750", trend: "54.7%", color: "text-blue-500", bg: "bg-blue-50" },
                  ].map((c) => (
                    <div key={c.label} className="bg-white rounded-xl border border-gray-100 p-3">
                      <p className="text-[10px] text-gray-400 mb-1">{c.label}</p>
                      <p className="text-base font-bold text-gray-900 mb-1.5">{c.value}</p>
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${c.bg} ${c.color}`}>↑ {c.trend}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl border border-gray-100 p-3">
                    <p className="text-[10px] font-semibold text-gray-700 mb-2">Uitgaves deze maand</p>
                    {[
                      { label: "Boodschappen", pct: 78 },
                      { label: "Uit eten", pct: 54 },
                      { label: "Transport", pct: 33 },
                      { label: "Kleding", pct: 24 },
                    ].map((item) => (
                      <div key={item.label} className="mb-1.5">
                        <div className="flex justify-between text-[9px] text-gray-400 mb-0.5">
                          <span>{item.label}</span>
                        </div>
                        <div className="h-1 bg-gray-100 rounded-full">
                          <div className="h-full bg-[#52b788] rounded-full" style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 p-3">
                    <p className="text-[10px] font-semibold text-gray-700 mb-2">Budget verdeling</p>
                    <div className="flex items-center gap-3">
                      <svg width="64" height="64" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="24" fill="none" stroke="#f0f0f0" strokeWidth="8" />
                        <circle cx="32" cy="32" r="24" fill="none" stroke="#fca5a5" strokeWidth="8"
                          strokeDasharray="68 151" strokeLinecap="round" transform="rotate(-90 32 32)" />
                        <circle cx="32" cy="32" r="24" fill="none" stroke="#52b788" strokeWidth="8"
                          strokeDasharray="83 151" strokeLinecap="round" transform="rotate(62 32 32)" />
                        <text x="32" y="35" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#111">54.7%</text>
                      </svg>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#52b788]" /><span className="text-[9px] text-gray-500">Vrij besteedbaar</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-300" /><span className="text-[9px] text-gray-500">Vaste lasten</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent pointer-events-none" />
    </section>
  );
}

function Features() {
  const items = [
    { icon: "💰", title: "Inkomsten", desc: "Voeg al je inkomensbronnen toe. Salaris, freelance, bijbaan — alles op één plek." },
    { icon: "💸", title: "Uitgaves", desc: "Registreer je variabele kosten per maand. Boodschappen, uit eten, kleding." },
    { icon: "🏠", title: "Vaste Lasten", desc: "Huur, verzekeringen, abonnementen. De vaste posten die elke maand terugkomen." },
    { icon: "📊", title: "Overzicht", desc: "Zie in één oogopslag hoeveel je overhoudt en waar je geld naartoe gaat." },
  ];

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-green-600 dark:text-green-400 text-sm font-medium mb-3">Features</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Alles wat je nodig hebt
          </h2>
          <p className="text-gray-400 dark:text-white/40 mt-4 max-w-lg mx-auto">
            Simpel, snel en overzichtelijk. Geen gedoe, geen verborgen kosten.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="feature-card bg-gray-50 dark:bg-[#111111] border border-gray-100 dark:border-white/5 rounded-2xl p-6 hover:border-green-500/20 dark:hover:border-green-400/20"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 dark:text-white/40 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Vul in", desc: "Voer je inkomsten en alle uitgaves in. Eenmalig instellen, altijd up-to-date." },
    { num: "02", title: "Berekenen", desc: "budget-it doet de som automatisch. Geen rekenmachine nodig." },
    { num: "03", title: "Overzicht", desc: "Zie precies hoeveel je overhoudt en waar je op kunt besparen." },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 border-t border-gray-100 dark:border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-green-600 dark:text-green-400 text-sm font-medium mb-3">Hoe het werkt</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            In 3 stappen klaar
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 dark:bg-green-400/10 border border-green-500/20 dark:border-green-400/20 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-lg mb-6">
                {step.num}
              </div>
              <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-white">{step.title}</h3>
              <p className="text-gray-400 dark:text-white/40 text-sm leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BugReport() {
  return (
    <section id="bugs" className="py-24 px-6 border-t border-gray-100 dark:border-white/5">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <p className="text-green-600 dark:text-green-400 text-sm font-medium mb-3">Feedback</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">
            Bug gevonden?
          </h2>
          <p className="text-gray-400 dark:text-white/40 text-sm leading-relaxed">
            Dit is een persoonlijk project. Zie je iets niet kloppen of heb je een suggestie? Laat het weten.
          </p>
        </div>
        <BugReportForm />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-white/5 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          budget<span className="text-green-500 dark:text-green-400">-it</span>
        </span>
        <p className="text-gray-400 dark:text-white/30 text-sm">
          Gemaakt voor iedereen die grip wil op hun geld.
        </p>
        <p className="text-gray-300 dark:text-white/20 text-xs">© 2025 budget-it</p>
      </div>
    </footer>
  );
}
