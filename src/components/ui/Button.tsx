import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variants = {
  primary:
    "bg-emerald-600 text-white shadow-sm shadow-emerald-900/20 hover:bg-emerald-700 active:scale-[0.98] focus-visible:ring-emerald-500 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400",
  secondary:
    "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-950 active:scale-[0.98] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
  danger: "bg-rose-600 text-white shadow-sm shadow-rose-900/20 hover:bg-rose-700 active:scale-[0.98] focus-visible:ring-rose-500",
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-950",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
