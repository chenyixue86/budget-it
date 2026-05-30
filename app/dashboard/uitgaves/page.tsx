"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n";

type Item = { id: string; naam: string; bedrag: number; categorie: string };

function maandStr(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export default function UitgavesPage() {
  const supabase = createClient();
  const router = useRouter();
  const { t, lang } = useLanguage();

  const [activeTab, setActiveTab] = useState<"variabel" | "vast">("variabel");

  const now = new Date();
  const [activeYear, setActiveYear] = useState(now.getFullYear());
  const [activeMonthIdx, setActiveMonthIdx] = useState(now.getMonth());
  const activeMaand = maandStr(activeYear, activeMonthIdx);

  const [userId, setUserId] = useState<string | null>(null);

  // Variabel state
  const [varItems, setVarItems] = useState<Item[]>([]);
  const [varNaam, setVarNaam] = useState("");
  const [varBedrag, setVarBedrag] = useState("");
  const [varCategorie, setVarCategorie] = useState<string>(t.uitgaves.categories[7]);
  const [varSaving, setVarSaving] = useState(false);

  // Vast state
  const [vastItems, setVastItems] = useState<Item[]>([]);
  const [vastNaam, setVastNaam] = useState("");
  const [vastBedrag, setVastBedrag] = useState("");
  const [vastCategorie, setVastCategorie] = useState<string>(t.vasteLasten.categories[6]);
  const [vastSaving, setVastSaving] = useState(false);

  // Edit state (shared — only one item editable at a time)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNaam, setEditNaam] = useState("");
  const [editBedrag, setEditBedrag] = useState("");
  const [editCategorie, setEditCategorie] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const maandLabel = new Intl.DateTimeFormat(lang === "nl" ? "nl-NL" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(activeYear, activeMonthIdx));

  const isCurrentMonth = activeYear === now.getFullYear() && activeMonthIdx === now.getMonth();

  function prevMaand() {
    if (activeMonthIdx === 0) {
      setActiveYear((y) => y - 1);
      setActiveMonthIdx(11);
    } else {
      setActiveMonthIdx((m) => m - 1);
    }
  }

  function nextMaand() {
    if (isCurrentMonth) return;
    if (activeMonthIdx === 11) {
      setActiveYear((y) => y + 1);
      setActiveMonthIdx(0);
    } else {
      setActiveMonthIdx((m) => m + 1);
    }
  }

  const loadVar = useCallback(async () => {
    const { data } = await supabase
      .from("uitgaves")
      .select("id, naam, bedrag, categorie")
      .eq("maand", activeMaand)
      .order("created_at");
    if (data) setVarItems(data);
  }, [supabase, activeMaand]);

  const loadVast = useCallback(async () => {
    const { data } = await supabase
      .from("vaste_lasten")
      .select("id, naam, bedrag, categorie")
      .order("created_at");
    if (data) setVastItems(data);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);
    });
    loadVar();
    loadVast();
  }, [loadVar, loadVast, supabase, router]);

  async function addVar(e: React.FormEvent) {
    e.preventDefault();
    if (!varNaam.trim() || !varBedrag || !userId) return;
    setVarSaving(true);
    await supabase.from("uitgaves").insert({
      user_id: userId,
      naam: varNaam.trim(),
      bedrag: parseFloat(varBedrag),
      categorie: varCategorie,
      maand: activeMaand,
    });
    setVarNaam("");
    setVarBedrag("");
    setVarCategorie(t.uitgaves.categories[7]);
    setVarSaving(false);
    loadVar();
  }

  async function removeVar(id: string) {
    await supabase.from("uitgaves").delete().eq("id", id);
    setVarItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function addVast(e: React.FormEvent) {
    e.preventDefault();
    if (!vastNaam.trim() || !vastBedrag || !userId) return;
    setVastSaving(true);
    await supabase.from("vaste_lasten").insert({
      user_id: userId,
      naam: vastNaam.trim(),
      bedrag: parseFloat(vastBedrag),
      categorie: vastCategorie,
    });
    setVastNaam("");
    setVastBedrag("");
    setVastCategorie(t.vasteLasten.categories[6]);
    setVastSaving(false);
    loadVast();
  }

  async function removeVast(id: string) {
    await supabase.from("vaste_lasten").delete().eq("id", id);
    setVastItems((prev) => prev.filter((i) => i.id !== id));
  }

  function startEdit(item: Item) {
    setEditingId(item.id);
    setEditNaam(item.naam);
    setEditBedrag(String(item.bedrag));
    setEditCategorie(item.categorie);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEditVar(id: string) {
    if (!editNaam.trim() || !editBedrag) return;
    setEditSaving(true);
    await supabase.from("uitgaves").update({
      naam: editNaam.trim(),
      bedrag: parseFloat(editBedrag),
      categorie: editCategorie,
    }).eq("id", id);
    setEditSaving(false);
    setEditingId(null);
    loadVar();
  }

  async function saveEditVast(id: string) {
    if (!editNaam.trim() || !editBedrag) return;
    setEditSaving(true);
    await supabase.from("vaste_lasten").update({
      naam: editNaam.trim(),
      bedrag: parseFloat(editBedrag),
      categorie: editCategorie,
    }).eq("id", id);
    setEditSaving(false);
    setEditingId(null);
    loadVast();
  }

  const totaal = activeTab === "variabel"
    ? varItems.reduce((s, i) => s + i.bedrag, 0)
    : vastItems.reduce((s, i) => s + i.bedrag, 0);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.uitgaves.title}</h1>
        <p className="text-gray-600 dark:text-white/60 mt-1 text-sm">{t.uitgaves.subtitle}</p>
      </div>

      {/* Tabs + Month nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl p-1 self-start">
          <button
            onClick={() => { setActiveTab("variabel"); cancelEdit(); }}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "variabel"
                ? "bg-[#2d6a4f] text-white"
                : "text-gray-500 dark:text-white/50 hover:text-gray-800 dark:hover:text-white/80"
            }`}
          >
            {t.uitgaves.tabVariabel}
          </button>
          <button
            onClick={() => { setActiveTab("vast"); cancelEdit(); }}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "vast"
                ? "bg-[#2d6a4f] text-white"
                : "text-gray-500 dark:text-white/50 hover:text-gray-800 dark:hover:text-white/80"
            }`}
          >
            {t.uitgaves.tabVast}
          </button>
        </div>

        {activeTab === "variabel" && (
          <div className="flex items-center gap-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2">
            <button
              onClick={prevMaand}
              className="p-1 text-gray-500 dark:text-white/50 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <ChevronLeft />
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-white/70 w-32 text-center capitalize">
              {maandLabel}
            </span>
            <button
              onClick={nextMaand}
              disabled={isCurrentMonth}
              className="p-1 text-gray-500 dark:text-white/50 hover:text-gray-800 dark:hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Totaal */}
      <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-6 mb-6 transition-colors duration-200">
        <p className="text-sm text-gray-600 dark:text-white/60 mb-1">{t.uitgaves.totaalPerMaand}</p>
        <p className="text-4xl font-bold text-gray-900 dark:text-white">
          € {totaal.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Form + List grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {activeTab === "variabel" ? (
          <>
            <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-6 transition-colors duration-200">
              <h3 className="font-semibold text-gray-800 dark:text-white/80 text-sm mb-4">{t.uitgaves.toevoegen}</h3>
              <form onSubmit={addVar} className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-white/70 mb-1.5">{t.uitgaves.omschrijving}</label>
                  <input
                    type="text"
                    value={varNaam}
                    onChange={(e) => setVarNaam(e.target.value)}
                    placeholder={t.uitgaves.placeholder}
                    required
                    className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-white/20 focus:outline-none focus:border-[#52b788] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-white/70 mb-1.5">{t.uitgaves.categorie}</label>
                  <select
                    value={varCategorie}
                    onChange={(e) => setVarCategorie(e.target.value)}
                    className="w-full border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-[#52b788] transition-colors appearance-none cursor-pointer"
                  >
                    {t.uitgaves.categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-white/70 mb-1.5">{t.uitgaves.bedragLabel}</label>
                  <input
                    type="number"
                    value={varBedrag}
                    onChange={(e) => setVarBedrag(e.target.value)}
                    placeholder="150"
                    min="0"
                    step="0.01"
                    required
                    className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-white/20 focus:outline-none focus:border-[#52b788] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={varSaving}
                  className="w-full bg-[#2d6a4f] text-white font-medium py-2.5 rounded-xl text-sm hover:bg-[#1f4d39] transition-colors disabled:opacity-50"
                >
                  {varSaving ? t.uitgaves.opslaan : t.uitgaves.toevoegenBtn}
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-6 transition-colors duration-200">
              <h3 className="font-semibold text-gray-800 dark:text-white/80 text-sm mb-4">{t.uitgaves.lijst}</h3>
              {varItems.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-white/50 text-center py-8">{t.uitgaves.leeg}</p>
              ) : (
                <div className="space-y-2">
                  {varItems.map((item) =>
                    editingId === item.id ? (
                      <div key={item.id} className="py-2.5 px-3 bg-[#f0faf4] dark:bg-[#52b788]/5 rounded-xl border border-[#52b788]/20 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editNaam}
                            onChange={(e) => setEditNaam(e.target.value)}
                            className="flex-1 min-w-0 border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-lg px-2.5 py-1.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-[#52b788] transition-colors"
                          />
                          <input
                            type="number"
                            value={editBedrag}
                            onChange={(e) => setEditBedrag(e.target.value)}
                            min="0"
                            step="0.01"
                            className="w-24 border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-lg px-2.5 py-1.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-[#52b788] transition-colors"
                          />
                        </div>
                        <select
                          value={editCategorie}
                          onChange={(e) => setEditCategorie(e.target.value)}
                          className="w-full border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] rounded-lg px-2.5 py-1.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-[#52b788] transition-colors appearance-none cursor-pointer"
                        >
                          {t.uitgaves.categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <div className="flex gap-2 justify-end">
                          <button onClick={cancelEdit} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            {t.common.annuleren}
                          </button>
                          <button onClick={() => saveEditVar(item.id)} disabled={editSaving} className="text-xs px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white hover:bg-[#1f4d39] transition-colors disabled:opacity-50">
                            {editSaving ? "..." : t.common.opslaan}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div key={item.id} className="flex items-center justify-between py-2.5 px-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                        <div>
                          <span className="text-sm text-gray-700 dark:text-white/70">{item.naam}</span>
                          <span className="text-xs text-gray-400 dark:text-white/30 block">{item.categorie}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            € {item.bedrag.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                          </span>
                          <button onClick={() => startEdit(item)} className="text-gray-400 dark:text-white/40 hover:text-[#2d6a4f] dark:hover:text-[#52b788] transition-colors" aria-label={t.common.bewerken}>
                            <EditIcon />
                          </button>
                          <button onClick={() => removeVar(item.id)} className="text-gray-400 dark:text-white/40 hover:text-red-400 transition-colors" aria-label={t.common.verwijder}>
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-6 transition-colors duration-200">
              <h3 className="font-semibold text-gray-800 dark:text-white/80 text-sm mb-4">{t.vasteLasten.toevoegen}</h3>
              <form onSubmit={addVast} className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-white/70 mb-1.5">{t.vasteLasten.omschrijving}</label>
                  <input
                    type="text"
                    value={vastNaam}
                    onChange={(e) => setVastNaam(e.target.value)}
                    placeholder={t.vasteLasten.placeholder}
                    required
                    className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-white/20 focus:outline-none focus:border-[#52b788] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-white/70 mb-1.5">{t.vasteLasten.categorie}</label>
                  <select
                    value={vastCategorie}
                    onChange={(e) => setVastCategorie(e.target.value)}
                    className="w-full border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-[#52b788] transition-colors appearance-none cursor-pointer"
                  >
                    {t.vasteLasten.categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-white/70 mb-1.5">{t.vasteLasten.bedragLabel}</label>
                  <input
                    type="number"
                    value={vastBedrag}
                    onChange={(e) => setVastBedrag(e.target.value)}
                    placeholder="900"
                    min="0"
                    step="0.01"
                    required
                    className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-white/20 focus:outline-none focus:border-[#52b788] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={vastSaving}
                  className="w-full bg-[#2d6a4f] text-white font-medium py-2.5 rounded-xl text-sm hover:bg-[#1f4d39] transition-colors disabled:opacity-50"
                >
                  {vastSaving ? t.vasteLasten.opslaan : t.vasteLasten.toevoegenBtn}
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-6 transition-colors duration-200">
              <h3 className="font-semibold text-gray-800 dark:text-white/80 text-sm mb-4">{t.vasteLasten.lijst}</h3>
              {vastItems.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-white/50 text-center py-8">{t.vasteLasten.leeg}</p>
              ) : (
                <div className="space-y-2">
                  {vastItems.map((item) =>
                    editingId === item.id ? (
                      <div key={item.id} className="py-2.5 px-3 bg-[#f0faf4] dark:bg-[#52b788]/5 rounded-xl border border-[#52b788]/20 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editNaam}
                            onChange={(e) => setEditNaam(e.target.value)}
                            className="flex-1 min-w-0 border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-lg px-2.5 py-1.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-[#52b788] transition-colors"
                          />
                          <input
                            type="number"
                            value={editBedrag}
                            onChange={(e) => setEditBedrag(e.target.value)}
                            min="0"
                            step="0.01"
                            className="w-24 border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-lg px-2.5 py-1.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-[#52b788] transition-colors"
                          />
                        </div>
                        <select
                          value={editCategorie}
                          onChange={(e) => setEditCategorie(e.target.value)}
                          className="w-full border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] rounded-lg px-2.5 py-1.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-[#52b788] transition-colors appearance-none cursor-pointer"
                        >
                          {t.vasteLasten.categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <div className="flex gap-2 justify-end">
                          <button onClick={cancelEdit} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            {t.common.annuleren}
                          </button>
                          <button onClick={() => saveEditVast(item.id)} disabled={editSaving} className="text-xs px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white hover:bg-[#1f4d39] transition-colors disabled:opacity-50">
                            {editSaving ? "..." : t.common.opslaan}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div key={item.id} className="flex items-center justify-between py-2.5 px-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                        <div>
                          <span className="text-sm text-gray-700 dark:text-white/70">{item.naam}</span>
                          <span className="text-xs text-gray-400 dark:text-white/30 block">{item.categorie}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            € {item.bedrag.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                          </span>
                          <button onClick={() => startEdit(item)} className="text-gray-400 dark:text-white/40 hover:text-[#2d6a4f] dark:hover:text-[#52b788] transition-colors" aria-label={t.common.bewerken}>
                            <EditIcon />
                          </button>
                          <button onClick={() => removeVast(item.id)} className="text-gray-400 dark:text-white/40 hover:text-red-400 transition-colors" aria-label={t.common.verwijder}>
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15,18 9,12 15,6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9,18 15,12 9,6" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
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
