"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type Inkomen = { id: string; naam: string; bedrag: number };

export default function InkomstenPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Inkomen[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [naam, setNaam] = useState("");
  const [bedrag, setBedrag] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("inkomsten")
      .select("id, naam, bedrag")
      .order("created_at");
    if (data) setItems(data);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
    load();
  }, [load, supabase]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!naam.trim() || !bedrag || !userId) return;
    setSaving(true);
    await supabase.from("inkomsten").insert({
      user_id: userId,
      naam: naam.trim(),
      bedrag: parseFloat(bedrag),
    });
    setNaam("");
    setBedrag("");
    setSaving(false);
    load();
  }

  async function remove(id: string) {
    await supabase.from("inkomsten").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const totaal = items.reduce((s, i) => s + i.bedrag, 0);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inkomsten</h1>
        <p className="text-gray-400 mt-1 text-sm">Voeg je maandelijkse inkomensbronnen toe.</p>
      </div>

      {/* Total */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <p className="text-sm text-gray-400 mb-1">Totaal per maand</p>
        <p className="text-4xl font-bold text-gray-900">
          € {totaal.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Add form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Inkomen toevoegen</h3>
          <form onSubmit={add} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Omschrijving</label>
              <input
                type="text"
                value={naam}
                onChange={(e) => setNaam(e.target.value)}
                placeholder="Salaris"
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#52b788] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Bedrag per maand (€)</label>
              <input
                type="number"
                value={bedrag}
                onChange={(e) => setBedrag(e.target.value)}
                placeholder="2500"
                min="0"
                step="0.01"
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#52b788] transition-colors"
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

        {/* List */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Inkomensbronnen</h3>
          {items.length === 0 ? (
            <p className="text-sm text-gray-300 text-center py-8">Nog geen inkomsten toegevoegd.</p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-700">{item.naam}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900">
                      € {item.bedrag.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
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
