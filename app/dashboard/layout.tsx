import DashboardShell from "./components/DashboardShell";
import { MonthProvider } from "@/lib/month-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <MonthProvider>
      <DashboardShell>{children}</DashboardShell>
    </MonthProvider>
  );
}
