import { NavLink, Outlet, useLocation } from "react-router-dom";
import { BarChart3, ChevronDown, CircleDollarSign, Goal, LayoutDashboard, LogOut, Settings, Tags, WalletCards } from "lucide-react";
import { Button } from "../ui/Button";
import { ThemeSwitch } from "../ui/ThemeSwitch";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transacoes", label: "Transacoes", icon: WalletCards },
  { to: "/categorias", label: "Categorias", icon: Tags },
  { to: "/metas", label: "Metas", icon: Goal },
  { to: "/relatorios", label: "Relatorios", icon: BarChart3 },
];

const pageMeta: Record<string, { title: string; description: string }> = {
  "/dashboard": { title: "Dashboard", description: "Resumo da sua vida financeira" },
  "/transacoes": { title: "Transacoes", description: "Gerencie receitas, despesas e historico" },
  "/categorias": { title: "Categorias", description: "Organize suas movimentacoes por tipo" },
  "/metas": { title: "Metas", description: "Acompanhe seus objetivos financeiros" },
  "/relatorios": { title: "Relatorios", description: "Graficos e analises inteligentes" },
};

export function AppLayout() {
  const { signOut, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const currentPage = pageMeta[location.pathname] ?? pageMeta["/dashboard"];
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "BT";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-950 dark:bg-[#0F172A] dark:text-slate-50">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-slate-800 bg-[#111827] px-5 py-6 text-white shadow-[18px_0_60px_-48px_rgba(15,23,42,0.85)] lg:flex lg:flex-col">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 dark:bg-emerald-500 dark:text-emerald-950">
            <CircleDollarSign size={26} />
          </div>
          <div>
            <p className="text-xl font-black tracking-tight">Orienta</p>
            <p className="text-xs font-medium text-slate-400">Controle financeiro</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex min-h-12 items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-300 transition duration-200 hover:bg-white/10 hover:text-white",
                  isActive &&
                    "bg-emerald-500/15 text-emerald-300 shadow-sm ring-1 ring-emerald-500/20",
                )
              }
            >
              <Icon size={22} />
              {label}
            </NavLink>
          ))}
          <button className="flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-300 transition duration-200 hover:bg-white/10 hover:text-white">
            <Settings size={22} />
            Configuracoes
          </button>
        </nav>

        <div className="mt-auto border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-white/10">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500 text-sm font-black text-emerald-950">{initials}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">Bruna Torres</p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
            <ChevronDown size={20} className="text-slate-400" />
          </div>
          <Button variant="secondary" className="mt-3 w-full justify-start border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800" onClick={signOut}>
            <LogOut size={20} />
            Sair
          </Button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-white/90 px-3 py-2.5 backdrop-blur dark:border-slate-800 dark:bg-[#0F172A]/90 sm:px-4 sm:py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-base font-black tracking-tight sm:text-lg lg:hidden">Orienta</p>
              <p className="hidden truncate text-xl font-black tracking-tight lg:block">{currentPage.title}</p>
              <p className="max-w-[220px] truncate text-[11px] leading-4 text-slate-500 dark:text-slate-400 sm:max-w-none sm:text-xs">
                <span className="lg:hidden">Seu dinheiro, metas e historico.</span>
                <span className="hidden lg:inline">{currentPage.description}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitch theme={theme} onToggle={toggleTheme} />
              <Button variant="ghost" className="h-10 min-h-10 w-10 px-0 lg:hidden" onClick={signOut} aria-label="Sair">
                <LogOut size={20} />
              </Button>
            </div>
          </div>

        </header>

        <main className="mx-auto w-full max-w-7xl px-3 pb-24 pt-5 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>

        <nav className="fixed inset-x-3 bottom-3 z-20 grid grid-cols-5 gap-1 rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 shadow-[0_18px_60px_-28px_rgba(15,23,42,0.55)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:inset-x-5 lg:hidden">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "grid min-h-14 place-items-center rounded-xl px-1 text-[10px] font-bold text-slate-500 transition duration-200 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                  isActive && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                )
              }
            >
              <Icon size={22} />
              <span className="max-w-full truncate">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
