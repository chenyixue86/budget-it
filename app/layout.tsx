import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider } from "@/lib/i18n";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "budget-it — Grip op je geld",
  description: "Gratis budgettool voor iedereen. Voer je inkomsten, uitgaves en vaste lasten in en zie direct hoeveel je overhoudt. Geen abonnement, geen kosten.",
  keywords: ["budget app", "gratis budget tool", "inkomsten bijhouden", "uitgaves bijhouden", "persoonlijke financiën", "budget overzicht"],
  authors: [{ name: "budget-it" }],
  metadataBase: new URL("https://budget-it-blond.vercel.app"),
  openGraph: {
    title: "budget-it — Grip op je geld",
    description: "Gratis budgettool. Voer je inkomsten en uitgaves in, budget-it berekent alles automatisch.",
    url: "https://budget-it-blond.vercel.app",
    siteName: "budget-it",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "budget-it — Grip op je geld",
    description: "Gratis budgettool. Voer je inkomsten en uitgaves in, budget-it berekent alles automatisch.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "OdFReFaTnHdk85uVAsxMy9CYYXJLHk-wfqRGdbbNlcY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider><ThemeProvider>{children}</ThemeProvider></LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
