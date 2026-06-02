"use client";

import LandingNavbar from "./components/LandingNavbar";
import BugReportForm from "./components/BugReportForm";
import ComparisonSection from "./components/ComparisonSection";
import DashboardMockup from "./components/DashboardMockup";
import FeaturesSection from "./components/FeaturesSection";
import { useLanguage } from "@/lib/i18n";

export default function Home() {
  const { t } = useLanguage();
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-200">
      <LandingNavbar />
      <Hero />
      <FeaturesSection />
      <ComparisonSection />
      <BugReport />
      <Footer />
    </main>
  );
}

function Hero() {
  const { t } = useLanguage();
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 pt-28 md:pt-40 pb-16 md:pb-28 relative overflow-hidden">
      {/* Ecomflow-style dot pattern decorations */}
      <div
        className="absolute left-0 top-0 h-full w-72 pointer-events-none hidden md:block opacity-70 dark:opacity-15"
        style={{
          backgroundImage: "radial-gradient(circle, #00ae3b 1.5px, transparent 1.5px)",
          backgroundSize: "22px 22px",
          maskImage: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute right-0 top-0 h-full w-72 pointer-events-none hidden md:block opacity-70 dark:opacity-15"
        style={{
          backgroundImage: "radial-gradient(circle, #00ae3b 1.5px, transparent 1.5px)",
          backgroundSize: "22px 22px",
          maskImage: "linear-gradient(to left, rgba(0,0,0,0.5) 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.5) 0%, transparent 100%)",
        }}
      />

      <div className="hero-badge inline-flex items-center gap-2 border text-xs font-semibold px-3 py-1.5 rounded-full mb-8"
        style={{ background: "#EAFFEC", borderColor: "#b6f0c8", color: "#00ae3b" }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#00ae3b" }} />
        {t.landing.badge}
      </div>

      <h1 className="hero-h1 text-5xl md:text-7xl font-medium leading-[1.05] max-w-3xl mb-6 text-gray-900 dark:text-white">
        {t.landing.heroTitle}<br />
        <span style={{ color: "#00ae3b" }}>{t.landing.heroAccent}</span>
      </h1>

      <p className="hero-sub text-gray-500 dark:text-white/60 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
        {t.landing.heroSub}
      </p>

      <div className="hero-cta flex flex-col sm:flex-row gap-3">
        <a
          href="/login"
          className="btn-primary text-white font-semibold px-7 py-3.5 rounded-xl text-sm"
        >
          {t.landing.loginBtn}
        </a>
        <a
          href="#how-it-works"
          className="btn-secondary text-gray-700 dark:text-white/70 font-medium px-7 py-3.5 rounded-xl text-sm"
        >
          {t.landing.howItWorksBtn}
        </a>
      </div>

      <DashboardMockup />

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent pointer-events-none" />
    </section>
  );
}


function BugReport() {
  const { t } = useLanguage();
  return (
    <section id="bugs" className="py-24 px-6 border-t border-gray-100 dark:border-white/5">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-semibold mb-3 dark:text-green-400" style={{ color: "#00ae3b" }}>{t.landing.feedbackLabel}</p>
          <h2 className="landing-heading text-3xl md:text-4xl font-medium mb-2 text-gray-900 dark:text-white">
            {t.landing.bugTitle}
          </h2>
          <p className="text-gray-600 dark:text-white/60 text-sm leading-relaxed">
            {t.landing.bugSub}
          </p>
        </div>
        <BugReportForm />
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-gray-100 dark:border-white/5 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          budget<span className="text-green-500 dark:text-green-400">-it</span>
        </span>
        <div className="flex items-center gap-6 md:hidden">
          <a href="#how-it-works" className="text-sm text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors">{t.landing.howItWorksLabel}</a>
          <a href="/changelog" className="text-sm text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors">Changelog</a>
        </div>
        <p className="text-gray-500 dark:text-white/50 text-sm hidden md:block">
          {t.landing.footerTagline}
        </p>
        <p className="text-gray-400 dark:text-white/40 text-xs">© 2025 budget-it</p>
      </div>
    </footer>
  );
}
