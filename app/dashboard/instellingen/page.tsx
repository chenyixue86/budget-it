"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n";

export default function InstellingenPage() {
  const supabase = createClient();
  const { t } = useLanguage();
  const i = t.instellingen;

  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [spaardoel, setSpaardoel] = useState("");
  const [spaardoelMsg, setSpaardoelMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [spaardoelLoading, setSpaardoelLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentEmail(user?.email ?? "");
    });

    supabase.from("user_settings").select("spaardoel").single().then(({ data }) => {
      if (data?.spaardoel) setSpaardoel(String(data.spaardoel));
    });
  }, [supabase]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim() || newEmail === currentEmail) return;
    setEmailLoading(true);
    setEmailMsg(null);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      setEmailMsg({ text: error.message, ok: false });
    } else {
      setEmailMsg({ text: i.bevestigingsmail, ok: true });
      setNewEmail("");
    }
    setEmailLoading(false);
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: i.wachtwoordMatch, ok: false });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: i.wachtwoordMinLength, ok: false });
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg(null);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordMsg({ text: error.message, ok: false });
    } else {
      setPasswordMsg({ text: i.wachtwoordSuccess, ok: true });
      setNewPassword("");
      setConfirmPassword("");
    }
    setPasswordLoading(false);
  }

  async function handleSpaardoel(e: React.FormEvent) {
    e.preventDefault();
    const bedrag = parseFloat(spaardoel);
    if (isNaN(bedrag) || bedrag < 0) return;
    setSpaardoelLoading(true);
    setSpaardoelMsg(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("user_settings").upsert(
      { user_id: user.id, spaardoel: bedrag },
      { onConflict: "user_id" }
    );

    if (error) {
      setSpaardoelMsg({ text: error.message, ok: false });
    } else {
      setSpaardoelMsg({ text: i.spaardoelSuccess, ok: true });
    }
    setSpaardoelLoading(false);
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{i.title}</h1>
        <p className="text-gray-600 dark:text-white/60 mt-1 text-sm">{i.subtitle}</p>
      </div>

      <div className="max-w-lg space-y-5">

        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-6 transition-colors duration-200">
          <h3 className="font-semibold text-gray-800 dark:text-white/80 text-sm mb-3">{i.account}</h3>
          <div className="flex items-center gap-3 py-2.5 px-3 bg-gray-50 dark:bg-white/5 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#52b788] flex items-center justify-center text-white text-sm font-bold shrink-0">
              {currentEmail.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-600 dark:text-white/60">{currentEmail}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-6 transition-colors duration-200">
          <h3 className="font-semibold text-gray-800 dark:text-white/80 text-sm mb-4">{i.spaardoelTitle}</h3>
          <p className="text-xs text-gray-500 dark:text-white/40 mb-4">{i.spaardoelSub}</p>
          <form onSubmit={handleSpaardoel} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 dark:text-white/70 mb-1.5">{i.spaardoelLabel}</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={spaardoel}
                onChange={(e) => setSpaardoel(e.target.value)}
                placeholder={i.spaardoelPlaceholder}
                required
                className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-white/20 focus:outline-none focus:border-[#52b788] transition-colors"
              />
            </div>
            {spaardoelMsg && (
              <p className={`text-sm px-3 py-2 rounded-lg ${spaardoelMsg.ok ? "bg-green-50 dark:bg-green-400/10 text-green-600 dark:text-green-400" : "bg-red-50 dark:bg-red-400/10 text-red-500 dark:text-red-400"}`}>
                {spaardoelMsg.text}
              </p>
            )}
            <button
              type="submit"
              disabled={spaardoelLoading}
              className="w-full bg-[#2d6a4f] text-white font-medium py-2.5 rounded-xl text-sm hover:bg-[#1f4d39] transition-colors disabled:opacity-50"
            >
              {spaardoelLoading ? i.opslaan : i.spaardoelBtn}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-6 transition-colors duration-200">
          <h3 className="font-semibold text-gray-800 dark:text-white/80 text-sm mb-4">{i.emailWijzigen}</h3>
          <form onSubmit={handleEmail} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 dark:text-white/70 mb-1.5">{i.nieuwEmail}</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="nieuw@mail.com"
                required
                className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-white/20 focus:outline-none focus:border-[#52b788] transition-colors"
              />
            </div>
            {emailMsg && (
              <p className={`text-sm px-3 py-2 rounded-lg ${emailMsg.ok ? "bg-green-50 dark:bg-green-400/10 text-green-600 dark:text-green-400" : "bg-red-50 dark:bg-red-400/10 text-red-500 dark:text-red-400"}`}>
                {emailMsg.text}
              </p>
            )}
            <button
              type="submit"
              disabled={emailLoading}
              className="w-full bg-[#2d6a4f] text-white font-medium py-2.5 rounded-xl text-sm hover:bg-[#1f4d39] transition-colors disabled:opacity-50"
            >
              {emailLoading ? i.opslaan : i.emailBtn}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/10 p-6 transition-colors duration-200">
          <h3 className="font-semibold text-gray-800 dark:text-white/80 text-sm mb-4">{i.wachtwoordWijzigen}</h3>
          <form onSubmit={handlePassword} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 dark:text-white/70 mb-1.5">{i.nieuwWachtwoord}</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-white/20 focus:outline-none focus:border-[#52b788] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-white/70 mb-1.5">{i.bevestigWachtwoord}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-white/20 focus:outline-none focus:border-[#52b788] transition-colors"
              />
            </div>
            {passwordMsg && (
              <p className={`text-sm px-3 py-2 rounded-lg ${passwordMsg.ok ? "bg-green-50 dark:bg-green-400/10 text-green-600 dark:text-green-400" : "bg-red-50 dark:bg-red-400/10 text-red-500 dark:text-red-400"}`}>
                {passwordMsg.text}
              </p>
            )}
            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-[#2d6a4f] text-white font-medium py-2.5 rounded-xl text-sm hover:bg-[#1f4d39] transition-colors disabled:opacity-50"
            >
              {passwordLoading ? i.opslaan : i.wachtwoordBtn}
            </button>
          </form>
        </div>

      </div>
    </>
  );
}
