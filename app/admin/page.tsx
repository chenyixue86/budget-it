import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import AdminUserTable from "./AdminUserTable";

const ADMIN_EMAIL = "kevinxue60@gmail.com";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) redirect("/dashboard");

  const admin = createAdminClient();
  const { data: { users }, error } = await admin.auth.admin.listUsers();

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-red-400 text-sm">Kon gebruikers niet laden: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-10">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#52b788]/20 text-[#52b788] uppercase tracking-wider">Admin</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Gebruikersbeheer</h1>
            <p className="text-white/40 text-sm mt-1">{users.length} account{users.length !== 1 ? "s" : ""} geregistreerd</p>
          </div>
          <a
            href="/dashboard"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            ← Terug naar dashboard
          </a>
        </div>

        <AdminUserTable users={users} />

      </div>
    </div>
  );
}
