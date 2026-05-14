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
