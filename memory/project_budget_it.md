---
name: project-budget-it
description: Next.js budgettool, stack en huidige status
metadata:
  type: project
---

# budget-it project status

**Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS 4, Supabase (auth + database met RLS), Vercel
**Branch workflow:** main = productie, user committet en pusht zelf

## Voltooide features
- Dashboard met inkomsten/vaste lasten/vrij besteedbaar/spaardoel cards
- Overzicht pagina met progress bar
- Dark mode, NL/EN taalondersteuning (auto browsertaal, toggle in header)
- Spaardoel feature — instellingen + dashboard 4e card
- Uitgaves + Vaste Lasten samengevoegd op één pagina met tabs (Variabel | Vast)
- Inline edit voor alle items (inkomsten, variabel, vast)
- **Globale maand context** — elke maand is eigen omgeving:
  - `lib/month-context.tsx` — MonthProvider + useMonth hook
  - `< Mei 2026 >` nav altijd zichtbaar in DashboardHeader
  - Inkomsten, vaste lasten, uitgaves, overzicht allemaal per maand gefilterd
  - Vaste lasten: auto-kopieer van vorige maand voor toekomstige maanden
  - Spaardoel forward-only via `spaardoel_history` tabel

## Supabase tabellen
- `inkomsten` — id, user_id, naam, bedrag, maand (YYYY-MM), created_at
- `vaste_lasten` — id, user_id, naam, bedrag, categorie, maand (YYYY-MM), created_at
- `uitgaves` — id, user_id, naam, bedrag, categorie, maand (YYYY-MM), created_at
- `user_settings` — user_id, spaardoel (legacy, niet meer actief gebruikt)
- `spaardoel_history` — id, user_id, maand, bedrag, UNIQUE(user_id, maand), RLS enabled
- `bug_reports` — publiek via API route + service role

## Architectuur: i18n
- `lib/i18n.tsx` — LanguageProvider in root layout, useLanguage() hook
- Elke component die tekst toont MOET useLanguage() aanroepen (ook child functies)
- TypeScript inferred types van `translations.nl` — NL en EN moeten identieke structuur hebben

## Architectuur: maand context
- `lib/month-context.tsx` — MonthProvider wrapping DashboardShell in dashboard/layout.tsx
- `useMonth()` geeft: activeYear, activeMonthIdx, activeMaandStr, isCurrentMonth, setActiveMonth(), goToPrev(), goToNext()
- Auto-copy: alleen voor toekomstige maanden (`activeMaandStr > NOW_MAAND`)
- Spaardoel query: `.lte("maand", activeMaandStr).order("maand", {ascending: false}).limit(1).maybeSingle()`

**Why:** Elke maand = eigen snapshot. Spaardoel forward-only zodat historische data niet wordt geraakt.
**How to apply:** Nieuwe pagina's met maand-data: gebruik useMonth() en filter op activeMaandStr.

## Voltooide features (vervolg)
- Samenvatting pagina — 6-maands overzicht met bar chart en detail tabel
- CSV export op overzicht pagina (UTF-8 BOM, bestandsnaam `budget-YYYY-MM.csv`)

## Roadmap — volgorde afgesproken met Kevin
1. ~~Landing page~~ ✅
2. **Financiële doelen (doelpot)** — spaar voor vakantie/laptop/auto, eigen voortgangsbalk + einddatum (Monarch/Mint premium feature)
3. **Budgetlimieten per categorie** — max per categorie, waarschuwing bij overschrijding
4. **Onboarding** — empty states voor nieuwe gebruikers
5. **Email reminders** — als laatste, want dat is de grote game changer
