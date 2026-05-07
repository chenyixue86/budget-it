"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Uitgave = { id: string; naam: string; bedrag: number; categorie: string };

export default function UitgavesPage() {
  const supabase = createClient();
  const router = useRouter();
  const [items, setItems] = useState<Uitgave[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [naam, setNaam] = useState("");
  const [bedrag, setBedrag] = useState("");
  const [categorie, setCategorie] = useState("Overig");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("uitgaves")
      .select("id, naam, bedrag, categorie")
      .order("created_at");
    if (data) setItems(data);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);
    });
    load();
  }, [load, supabase, router]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!naam.trim() || !bedrag || !userId) return;
    setSaving(true);
    await supabase.from("uitgaves").insert({
      user_id: userId,
      naam: naam.trim(),
      bedrag: parseFloat(bedrag),
      categorie,
    });
    setNaam("");
    setBedrag("");
    setCategorie("Overig");
    setSaving(false);
    load();
  }

  async function remove(id: string) {
    await supabase.from("uitgaves").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const totaal = items.reduce((s, i) => s + i.bedrag, 0);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Uitgaves</h1>
        <p className="text-gray-600 dark:text-white/60 mt-1 text-sm">Voeg je maandelijkse uitgaves toe.</p>
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-6 mb-6 transition-colors duration-200">
        <p className="text-sm text-gray-600 dark:text-white/60 mb-1">Totaal per maand</p>
        <p className="text-4xl font-bold text-gray-900 dark:text-white">
          € {totaal.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-6 transition-colors duration-200">
          <h3 className="font-semibold text-gray-800 dark:text-white/80 text-sm mb-4">Uitgave toevoegen</h3>
          <form onSubmit={add} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 dark:text-white/70 mb-1.5">Omschrijving</label>
              <input
                type="text"
                value={naam}
                onChange={(e) => setNaam(e.target.value)}
                placeholder="Boodschappen"
                required
                className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-white/20 focus:outline-none focus:border-[#52b788] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-white/70 mb-1.5">Categorie</label>
              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-[#52b788] transition-colors"
              >
                {["Huur", "Boodschappen", "Transport", "Entertainment", "Abonnementen", "Gezondheid", "Kleding", "Overig"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-white/70 mb-1.5">Bedrag per maand (€)</label>
              <input
                type="number"
                value={bedrag}
                onChange={(e) => setBedrag(e.target.value)}
                placeholder="150"
                min="0"
                step="0.01"
                required
                className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-white/20 focus:outline-none focus:border-[#52b788] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#2d6a4f] text-white font-medium py-2.5 rounded-xl text-sm hover:bg-[#1f4d39] transition-colors disabled:opacity-50"
            >
              {saving ? "Opslaan..." : "Toevoegen →"}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-6 transition-colors duration-200">
          <h3 className="font-semibold text-gray-800 dark:text-white/80 text-sm mb-4">Uitgaven</h3>
          {items.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-white/50 text-center py-8">Nog geen uitgaves toegevoegd.</p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2.5 px-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                  <div>
                    <span className="text-sm text-gray-700 dark:text-white/70">{item.naam}</span>
                    <span className="text-xs text-gray-400 dark:text-white/30 block">{item.categorie}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      € {item.bedrag.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-gray-400 dark:text-white/40 hover:text-red-400 transition-colors"
                      aria-label="Verwijder"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
