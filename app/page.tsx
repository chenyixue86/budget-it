"use client";

import LandingNavbar from "./components/LandingNavbar";
import BugReportForm from "./components/BugReportForm";
import ComparisonSection from "./components/ComparisonSection";
import DashboardMockup from "./components/DashboardMockup";
import { useLanguage } from "@/lib/i18n";

export default function Home() {
  const { t } = useLanguage();
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-200">
      <LandingNavbar />
      <Hero />
      <HowItWorks />
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
      <div className="hero-blob absolute top-1/3 left-1/2 w-[600px] h-[400px] bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="hero-badge inline-flex items-center gap-2 bg-green-500/10 dark:bg-green-400/10 border border-green-500/20 dark:border-green-400/20 text-green-600 dark:text-green-400 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
        <span className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
        {t.landing.badge}
      </div>

      <h1 className="hero-h1 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] max-w-3xl mb-6 text-gray-900 dark:text-white">
        {t.landing.heroTitle}<br />
        <span className="text-green-500 dark:text-green-400">{t.landing.heroAccent}</span>
      </h1>

      <p className="hero-sub text-gray-600 dark:text-white/65 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
        {t.landing.heroSub}
      </p>

      <div className="hero-cta flex flex-col sm:flex-row gap-3">
        <a
          href="/login"
          className="btn-primary text-black font-semibold px-7 py-3.5 rounded-xl text-sm"
        >
          {t.landing.loginBtn}
        </a>
        <a
          href="#how-it-works"
          className="btn-secondary text-gray-600 dark:text-white/70 font-medium px-7 py-3.5 rounded-xl text-sm"
        >
          {t.landing.howItWorksBtn}
        </a>
      </div>

      <DashboardMockup />

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent pointer-events-none" />
    </section>
  );
}

function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="py-24 px-6 border-t border-gray-100 dark:border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-green-600 dark:text-green-400 text-sm font-medium mb-3">{t.landing.howItWorksLabel}</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t.landing.howItWorksTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.landing.steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 dark:bg-green-400/10 border border-green-500/20 dark:border-green-400/20 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-lg mb-6">
                {step.num}
              </div>
              <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-white">{step.title}</h3>
              <p className="text-gray-600 dark:text-white/60 text-sm leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BugReport() {
  const { t } = useLanguage();
  return (
    <section id="bugs" className="py-24 px-6 border-t border-gray-100 dark:border-white/5">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <p className="text-green-600 dark:text-green-400 text-sm font-medium mb-3">{t.landing.feedbackLabel}</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">
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
