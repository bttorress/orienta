import { Moon, Sun } from "lucide-react";
import { cn } from "../../lib/utils";

type ThemeSwitchProps = {
  theme: "light" | "dark";
  onToggle: () => void;
  className?: string;
};

export function ThemeSwitch({ theme, onToggle, className }: ThemeSwitchProps) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      title="Alternar tema"
      aria-label="Alternar tema"
      className={cn(
        "relative inline-flex h-9 w-[70px] items-center rounded-xl border border-slate-200 bg-slate-100 p-1 text-slate-500 shadow-inner transition duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-400 sm:h-10 sm:w-[172px]",
        className,
      )}
    >
      <span
        className={cn(
          "absolute left-1 top-1 grid h-7 w-7 place-items-center rounded-lg bg-white text-amber-500 shadow-sm transition-transform duration-200 dark:bg-slate-800 dark:text-blue-300 sm:h-8 sm:w-[80px]",
          isDark && "translate-x-[34px] sm:translate-x-[82px]",
        )}
      >
        <span className="flex items-center gap-1.5">
          {isDark ? <Moon size={22} /> : <Sun size={22} />}
          <span className="hidden text-xs font-bold sm:inline">{isDark ? "Escuro" : "Claro"}</span>
        </span>
      </span>
      <span className="flex flex-1 items-center justify-center gap-1 text-xs font-bold">
        <Sun size={22} className="text-amber-500/70" />
        <span className="hidden sm:inline">Claro</span>
      </span>
      <span className="flex flex-1 items-center justify-center gap-1 text-xs font-bold">
        <Moon size={22} className="text-blue-400/80" />
        <span className="hidden sm:inline">Escuro</span>
      </span>
    </button>
  );
}
