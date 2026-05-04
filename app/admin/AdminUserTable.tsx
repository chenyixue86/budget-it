"use client";

import { useState } from "react";
import { sendPasswordReset, deleteUser } from "./actions";

type User = {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at?: string;
};

function fmt(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("nl-NL", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function AdminUserTable({ users }: { users: User[] }) {
  const [status, setStatus] = useState<Record<string, { msg: string; ok: boolean } | null>>({});
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleReset(email: string, id: string) {
    setStatus((s) => ({ ...s, [id]: null }));
    try {
      await sendPasswordReset(email);
      setStatus((s) => ({ ...s, [id]: { msg: "Reset e-mail verstuurd", ok: true } }));
    } catch {
      setStatus((s) => ({ ...s, [id]: { msg: "Mislukt", ok: false } }));
    }
  }

  async function handleDelete(id: string, email?: string) {
    if (!confirm(`Weet je zeker dat je ${email ?? "dit account"} wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`)) return;
    setDeleting(id);
    try {
      await deleteUser(id);
    } catch {
      setStatus((s) => ({ ...s, [id]: { msg: "Verwijderen mislukt", ok: false } }));
      setDeleting(null);
    }
  }

  const sorted = [...users].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/5 text-white/50 text-xs uppercase tracking-wider">
            <th className="text-left px-5 py-3 font-medium">E-mail</th>
            <th className="text-left px-5 py-3 font-medium">Aangemaakt</th>
            <th className="text-left px-5 py-3 font-medium">Laatste login</th>
            <th className="text-right px-5 py-3 font-medium">Acties</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {sorted.map((user) => (
            <tr key={user.id} className={`bg-[#111111] transition-opacity ${deleting === user.id ? "opacity-40 pointer-events-none" : ""}`}>
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#52b788] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(user.email ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white/80 font-medium">{user.email ?? "—"}</span>
                  {user.email === "kevinxue60@gmail.com" && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#52b788]/20 text-[#52b788] font-medium">Admin</span>
                  )}
                </div>
              </td>
              <td className="px-5 py-4 text-white/50">{fmt(user.created_at)}</td>
              <td className="px-5 py-4 text-white/50">{fmt(user.last_sign_in_at)}</td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-2">
                  {status[user.id] && (
                    <span className={`text-xs ${status[user.id]!.ok ? "text-green-400" : "text-red-400"}`}>
                      {status[user.id]!.msg}
                    </span>
                  )}
                  <button
                    onClick={() => handleReset(user.email!, user.id)}
                    disabled={!user.email}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors disabled:opacity-30"
                  >
                    Reset wachtwoord
                  </button>
                  {user.email !== "kevinxue60@gmail.com" && (
                    <button
                      onClick={() => handleDelete(user.id, user.email)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                    >
                      Verwijder
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
