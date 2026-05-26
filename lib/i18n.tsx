"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "nl" | "en";

const translations = {
  nl: {
    // Sidebar
    nav: {
      home: "Home",
      inkomsten: "Inkomsten",
      uitgaves: "Uitgaves",
      vasteLasten: "Vaste Lasten",
      overzicht: "Overzicht",
      instellingen: "Instellingen",
      comingSoon: "binnenkort",
    },
    // Dashboard home
    dashboard: {
      greeting: "Hallo",
      subtitle: "Welkom bij je budget overzicht.",
      inkomsten: "Inkomsten",
      vasteLasten: "Vaste Lasten",
      vrijBesteedbaar: "Vrij besteedbaar",
      perMaand: "per maand",
      maandelijks: "maandelijks",
      resterend: "resterend",
      totaalInkomen: "totaal inkomen",
      vasteKosten: "vaste kosten",
      naVasteLasten: "na vaste lasten",
      nogInTeVullen: "nog in te vullen",
      laden: "laden...",
      uitgavesDezeMaand: "Uitgaves deze maand",
      totaal: "Totaal:",
      nogGeenUitgaves: "Nog geen uitgaves toegevoegd.",
      budgetVerdeling: "Budget verdeling",
      spaardoel: "Spaardoel",
      spaardoelNietIngesteld: "niet ingesteld",
      opSchema: "op schema",
      nietOpSchema: "niet op schema",
      maanddoel: "maanddoel",
      months: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
    },
    // Inkomsten page
    inkomsten: {
      title: "Inkomsten",
      subtitle: "Voeg je maandelijkse inkomensbronnen toe.",
      totaalPerMaand: "Totaal per maand",
      toevoegen: "Inkomen toevoegen",
      omschrijving: "Omschrijving",
      placeholder: "Salaris",
      bedragLabel: "Bedrag per maand (€)",
      opslaan: "Opslaan...",
      toevoegenBtn: "Toevoegen →",
      bronnen: "Inkomensbronnen",
      leeg: "Nog geen inkomsten toegevoegd.",
    },
    // Uitgaves page
    uitgaves: {
      title: "Uitgaves",
      subtitle: "Voeg je maandelijkse uitgaves toe.",
      totaalPerMaand: "Totaal per maand",
      toevoegen: "Uitgave toevoegen",
      omschrijving: "Omschrijving",
      placeholder: "Boodschappen",
      categorie: "Categorie",
      bedragLabel: "Bedrag per maand (€)",
      opslaan: "Opslaan...",
      toevoegenBtn: "Toevoegen →",
      lijst: "Uitgaven",
      leeg: "Nog geen uitgaves toegevoegd.",
      categories: ["Huur", "Boodschappen", "Transport", "Entertainment", "Abonnementen", "Gezondheid", "Kleding", "Overig"],
    },
    // Vaste Lasten page
    vasteLasten: {
      title: "Vaste Lasten",
      subtitle: "Voeg je vaste maandelijkse kosten toe.",
      totaalPerMaand: "Totaal per maand",
      toevoegen: "Vaste last toevoegen",
      omschrijving: "Omschrijving",
      placeholder: "Huur",
      categorie: "Categorie",
      bedragLabel: "Bedrag per maand (€)",
      opslaan: "Opslaan...",
      toevoegenBtn: "Toevoegen →",
      lijst: "Vaste lasten",
      leeg: "Nog geen vaste lasten toegevoegd.",
      categories: ["Huur/Hypotheek", "Verzekering", "Abonnementen", "Internet/TV", "Energie", "Belasting", "Overig"],
    },
    // Overzicht page
    overzicht: {
      title: "Overzicht",
      subtitle: "Jouw inkomsten en uitgaves in één overzicht.",
      laden: "Laden...",
      inkomsten: "Inkomsten",
      vasteLasten: "Vaste Lasten",
      uitgaves: "Uitgaves",
      geenInkomsten: "Geen inkomsten toegevoegd.",
      geenVasteLasten: "Geen vaste lasten toegevoegd.",
      geenUitgaves: "Geen uitgaves toegevoegd.",
      watJeOverhoudt: "Wat je overhoudt",
      vanInkomenBesteed: "% van inkomen besteed",
      over: "% over",
    },
    // Landing page
    landing: {
      badge: "100% gratis, altijd",
      heroTitle: "Jouw budget,",
      heroAccent: "onder controle.",
      heroSub: "Voer je inkomsten, uitgaves en vaste lasten in. budget-it berekent alles automatisch en geeft je een helder overzicht.",
      loginBtn: "Login →",
      howItWorksBtn: "Hoe het werkt",
      howItWorksLabel: "Hoe het werkt",
      howItWorksTitle: "In 3 stappen klaar",
      steps: [
        { num: "01", title: "Vul in", desc: "Voer je inkomsten en alle uitgaves in. Eenmalig instellen, altijd up-to-date." },
        { num: "02", title: "Berekenen", desc: "budget-it doet de som automatisch. Geen rekenmachine nodig." },
        { num: "03", title: "Overzicht", desc: "Zie precies hoeveel je overhoudt en waar je op kunt besparen." },
      ],
      feedbackLabel: "Feedback",
      bugTitle: "Bug gevonden?",
      bugSub: "Dit is een persoonlijk project. Zie je iets niet kloppen of heb je een suggestie? Laat het weten.",
      footerTagline: "Gemaakt voor iedereen die grip wil op hun geld.",
    },
    comparison: {
      label: "Vergelijking",
      title: "Ga lean en bespaar",
      titleAccent: "op je budgetapp.",
      sub: "Andere budgetapps rekenen je voor elke feature apart. Bij budget-it betaal je niets — nooit. Geen abonnement, geen verborgen kosten.",
      free: "100% gratis",
      freeSub: "Alle features, altijd, voor iedereen.",
      noCard: "Geen creditcard nodig",
      noCardSub: "Gewoon registreren en beginnen.",
      otherApps: "Andere apps",
      colFeature: "Feature",
      colCost: "Kosten bij budget-it",
      colCostOther: "Kosten bij anderen",
      total: "Totaal",
      gratis: "Gratis",
      perMonth: "maand",
      features: [
        { label: "Inkomsten bijhouden" },
        { label: "Uitgaves registreren" },
        { label: "Vaste lasten beheren" },
        { label: "Maandelijks overzicht" },
        { label: "Dark mode" },
        { label: "Geen advertenties" },
        { label: "Onbeperkte data" },
      ],
    },
    bugForm: {
      nameLabel: "Naam",
      optional: "(optioneel)",
      namePlaceholder: "naam",
      messageLabel: "Wat ging er mis?",
      messagePlaceholder: "Beschrijf de bug of je feedback. Wat deed je, wat verwachtte je, wat gebeurde er?",
      sending: "Versturen...",
      send: "Verstuur →",
      successTitle: "Bedankt voor je feedback!",
      successSub: "We nemen het zo snel mogelijk door.",
      verifyError: "Verificatie mislukt. Probeer opnieuw.",
      genericError: "Er is iets misgegaan.",
    },
    // Instellingen
    instellingen: {
      title: "Instellingen",
      subtitle: "Beheer je account gegevens.",
      account: "Huidig account",
      emailWijzigen: "E-mailadres wijzigen",
      nieuwEmail: "Nieuw e-mailadres",
      emailBtn: "E-mail wijzigen →",
      bevestigingsmail: "Bevestigingsmail verstuurd naar je nieuwe e-mailadres.",
      wachtwoordWijzigen: "Wachtwoord wijzigen",
      nieuwWachtwoord: "Nieuw wachtwoord",
      bevestigWachtwoord: "Bevestig wachtwoord",
      wachtwoordBtn: "Wachtwoord wijzigen →",
      wachtwoordMatch: "Wachtwoorden komen niet overeen.",
      wachtwoordMinLength: "Minimaal 6 tekens vereist.",
      wachtwoordSuccess: "Wachtwoord succesvol gewijzigd.",
      opslaan: "Opslaan...",
      spaardoelTitle: "Spaardoel",
      spaardoelSub: "Stel in hoeveel je per maand wilt sparen.",
      spaardoelLabel: "Bedrag per maand (€)",
      spaardoelPlaceholder: "200",
      spaardoelBtn: "Opslaan →",
      spaardoelSuccess: "Spaardoel opgeslagen.",
    },
    // Changelog
    changelog: {
      badge: "Changelog",
      title: "Updates & Roadmap",
      subtitle: "Wat er nieuw is en wat er aankomt voor budget-it.",
      binnenkort: "Binnenkort",
      binnenkortBadge: "BINNENKORT",
      typeLabels: { new: "Nieuw", fix: "Fix", improvement: "Verbeterd" },
      upcoming: [],
      releases: [
        {
          version: "v0.1.2",
          date: "26 Mei 2026",
          label: "",
          changes: [
            { type: "new", text: "Spaardoel — stel in hoeveel je per maand wilt sparen en zie direct op het dashboard of je op schema ligt" },
          ],
        },
        {
          version: "v0.1.1",
          date: "15 Mei 2026",
          label: "",
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
      ],
    },
    // Common
    common: {
      verwijder: "Verwijder",
    },
  },

  en: {
    nav: {
      home: "Home",
      inkomsten: "Income",
      uitgaves: "Expenses",
      vasteLasten: "Fixed Costs",
      overzicht: "Overview",
      instellingen: "Settings",
      comingSoon: "coming soon",
    },
    dashboard: {
      greeting: "Hello",
      subtitle: "Welcome to your budget overview.",
      inkomsten: "Income",
      vasteLasten: "Fixed Costs",
      vrijBesteedbaar: "Freely spendable",
      perMaand: "per month",
      maandelijks: "monthly",
      resterend: "remaining",
      totaalInkomen: "total income",
      vasteKosten: "fixed costs",
      naVasteLasten: "after fixed costs",
      nogInTeVullen: "yet to fill in",
      laden: "loading...",
      uitgavesDezeMaand: "Expenses this month",
      totaal: "Total:",
      nogGeenUitgaves: "No expenses added yet.",
      budgetVerdeling: "Budget breakdown",
      spaardoel: "Savings goal",
      spaardoelNietIngesteld: "not set",
      opSchema: "on track",
      nietOpSchema: "not on track",
      maanddoel: "monthly goal",
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    },
    inkomsten: {
      title: "Income",
      subtitle: "Add your monthly income sources.",
      totaalPerMaand: "Total per month",
      toevoegen: "Add income",
      omschrijving: "Description",
      placeholder: "Salary",
      bedragLabel: "Amount per month (€)",
      opslaan: "Saving...",
      toevoegenBtn: "Add →",
      bronnen: "Income sources",
      leeg: "No income added yet.",
    },
    uitgaves: {
      title: "Expenses",
      subtitle: "Add your monthly expenses.",
      totaalPerMaand: "Total per month",
      toevoegen: "Add expense",
      omschrijving: "Description",
      placeholder: "Groceries",
      categorie: "Category",
      bedragLabel: "Amount per month (€)",
      opslaan: "Saving...",
      toevoegenBtn: "Add →",
      lijst: "Expenses",
      leeg: "No expenses added yet.",
      categories: ["Rent", "Groceries", "Transport", "Entertainment", "Subscriptions", "Health", "Clothing", "Other"],
    },
    vasteLasten: {
      title: "Fixed Costs",
      subtitle: "Add your fixed monthly costs.",
      totaalPerMaand: "Total per month",
      toevoegen: "Add fixed cost",
      omschrijving: "Description",
      placeholder: "Rent",
      categorie: "Category",
      bedragLabel: "Amount per month (€)",
      opslaan: "Saving...",
      toevoegenBtn: "Add →",
      lijst: "Fixed costs",
      leeg: "No fixed costs added yet.",
      categories: ["Rent/Mortgage", "Insurance", "Subscriptions", "Internet/TV", "Energy", "Tax", "Other"],
    },
    overzicht: {
      title: "Overview",
      subtitle: "Your income and expenses in one overview.",
      laden: "Loading...",
      inkomsten: "Income",
      vasteLasten: "Fixed Costs",
      uitgaves: "Expenses",
      geenInkomsten: "No income added.",
      geenVasteLasten: "No fixed costs added.",
      geenUitgaves: "No expenses added.",
      watJeOverhoudt: "What you keep",
      vanInkomenBesteed: "% of income spent",
      over: "% left",
    },
    // Landing page
    landing: {
      badge: "100% free, always",
      heroTitle: "Your budget,",
      heroAccent: "under control.",
      heroSub: "Enter your income, expenses and fixed costs. budget-it calculates everything automatically and gives you a clear overview.",
      loginBtn: "Login →",
      howItWorksBtn: "How it works",
      howItWorksLabel: "How it works",
      howItWorksTitle: "Ready in 3 steps",
      steps: [
        { num: "01", title: "Fill in", desc: "Enter your income and all expenses. Set up once, always up-to-date." },
        { num: "02", title: "Calculate", desc: "budget-it does the math automatically. No calculator needed." },
        { num: "03", title: "Overview", desc: "See exactly how much you have left and where you can save." },
      ],
      feedbackLabel: "Feedback",
      bugTitle: "Found a bug?",
      bugSub: "This is a personal project. See something wrong or have a suggestion? Let us know.",
      footerTagline: "Made for everyone who wants control over their money.",
    },
    comparison: {
      label: "Comparison",
      title: "Go lean and save",
      titleAccent: "on your budget app.",
      sub: "Other budget apps charge you for every feature separately. With budget-it you pay nothing — ever. No subscription, no hidden costs.",
      free: "100% free",
      freeSub: "All features, always, for everyone.",
      noCard: "No credit card needed",
      noCardSub: "Just register and start.",
      otherApps: "Other apps",
      colFeature: "Feature",
      colCost: "Cost at budget-it",
      colCostOther: "Cost at others",
      total: "Total",
      gratis: "Free",
      perMonth: "month",
      features: [
        { label: "Track income" },
        { label: "Register expenses" },
        { label: "Manage fixed costs" },
        { label: "Monthly overview" },
        { label: "Dark mode" },
        { label: "No ads" },
        { label: "Unlimited data" },
      ],
    },
    bugForm: {
      nameLabel: "Name",
      optional: "(optional)",
      namePlaceholder: "name",
      messageLabel: "What went wrong?",
      messagePlaceholder: "Describe the bug or your feedback. What did you do, what did you expect, what happened?",
      sending: "Sending...",
      send: "Send →",
      successTitle: "Thanks for your feedback!",
      successSub: "We'll review it as soon as possible.",
      verifyError: "Verification failed. Please try again.",
      genericError: "Something went wrong.",
    },
    instellingen: {
      title: "Settings",
      subtitle: "Manage your account details.",
      account: "Current account",
      emailWijzigen: "Change email address",
      nieuwEmail: "New email address",
      emailBtn: "Change email →",
      bevestigingsmail: "Confirmation email sent to your new email address.",
      wachtwoordWijzigen: "Change password",
      nieuwWachtwoord: "New password",
      bevestigWachtwoord: "Confirm password",
      wachtwoordBtn: "Change password →",
      wachtwoordMatch: "Passwords do not match.",
      wachtwoordMinLength: "Minimum 6 characters required.",
      wachtwoordSuccess: "Password changed successfully.",
      opslaan: "Saving...",
      spaardoelTitle: "Savings goal",
      spaardoelSub: "Set how much you want to save per month.",
      spaardoelLabel: "Amount per month (€)",
      spaardoelPlaceholder: "200",
      spaardoelBtn: "Save →",
      spaardoelSuccess: "Savings goal saved.",
    },
    changelog: {
      badge: "Changelog",
      title: "Updates & Roadmap",
      subtitle: "What's new and what's coming to budget-it.",
      binnenkort: "Coming soon",
      binnenkortBadge: "COMING SOON",
      typeLabels: { new: "New", fix: "Fix", improvement: "Improved" },
      upcoming: [],
      releases: [
        {
          version: "v0.1.2",
          date: "26 May 2026",
          label: "",
          changes: [
            { type: "new", text: "Savings goal — set how much you want to save per month and see on the dashboard if you're on track" },
          ],
        },
        {
          version: "v0.1.1",
          date: "15 May 2026",
          label: "",
          changes: [
            { type: "new", text: "Fixed Costs page — add your monthly fixed costs like rent, subscriptions and insurance" },
            { type: "new", text: "Categories for fixed costs" },
            { type: "new", text: "NL/EN language support — automatically based on browser language" },
          ],
        },
        {
          version: "v0.1.0",
          date: "May 2026",
          label: "First release",
          changes: [
            { type: "new", text: "Dashboard with income, expenses and freely spendable overview" },
            { type: "new", text: "Overview page with totals and progress bar" },
            { type: "new", text: "Dark mode" },
          ],
        },
      ],
    },
    common: {
      verwijder: "Delete",
    },
  },
};

export type Translations = typeof translations.nl;

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "nl",
  setLang: () => {},
  t: translations.nl,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("nl");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "nl" || saved === "en") {
      setLangState(saved);
    } else {
      const browser = navigator.language.slice(0, 2).toLowerCase();
      setLangState(browser === "nl" ? "nl" : "en");
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("lang", l);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
