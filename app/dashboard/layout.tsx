import { ThemeProvider } from "./components/ThemeProvider";
import SidebarNav from "./components/SidebarNav";
import DashboardHeader from "./components/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-[#f5f6f8] dark:bg-[#0a0a0a] font-sans overflow-hidden transition-colors duration-200">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
