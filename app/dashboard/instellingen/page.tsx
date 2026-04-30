"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function InstellingenPage() {
  const supabase = createClient();

  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentEmail(user?.email ?? "");
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
      setEmailMsg({ text: "Bevestigingsmail verstuurd naar je nieuwe e-mailadres.", ok: true });
      setNewEmail("");
    }
    setEmailLoading(false);
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: "Wachtwoorden komen niet overeen.", ok: false });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: "Minimaal 6 tekens vereist.", ok: false });
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg(null);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordMsg({ text: error.message, ok: false });
    } else {
      setPasswordMsg({ text: "Wachtwoord succesvol gewijzigd.", ok: true });
      setNewPassword("");
      setConfirmPassword("");
    }
    setPasswordLoading(false);
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Instellingen</h1>
        <p className="text-gray-400 mt-1 text-sm">Beheer je account gegevens.</p>
      </div>

      <div className="max-w-lg space-y-5">

        {/* Current account info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-3">Huidig account</h3>
          <div className="flex items-center gap-3 py-2.5 px-3 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#52b788] flex items-center justify-center text-white text-sm font-bold shrink-0">
              {currentEmail.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-600">{currentEmail}</span>
          </div>
        </div>

        {/* Change email */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">E-mailadres wijzigen</h3>
          <form onSubmit={handleEmail} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Nieuw e-mailadres</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="nieuw@mail.com"
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#52b788] transition-colors"
              />
            </div>
            {emailMsg && (
              <p className={`text-xs px-3 py-2 rounded-lg ${emailMsg.ok ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                {emailMsg.text}
              </p>
            )}
            <button
              type="submit"
              disabled={emailLoading}
              className="w-full bg-[#2d6a4f] text-white font-medium py-2.5 rounded-xl text-sm hover:bg-[#1f4d39] transition-colors disabled:opacity-50"
            >
              {emailLoading ? "Opslaan..." : "E-mail wijzigen →"}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Wachtwoord wijzigen</h3>
          <form onSubmit={handlePassword} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Nieuw wachtwoord</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#52b788] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Bevestig wachtwoord</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#52b788] transition-colors"
              />
            </div>
            {passwordMsg && (
              <p className={`text-xs px-3 py-2 rounded-lg ${passwordMsg.ok ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                {passwordMsg.text}
              </p>
            )}
            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-[#2d6a4f] text-white font-medium py-2.5 rounded-xl text-sm hover:bg-[#1f4d39] transition-colors disabled:opacity-50"
            >
              {passwordLoading ? "Opslaan..." : "Wachtwoord wijzigen →"}
            </button>
          </form>
        </div>

      </div>
    </>
  );
}
