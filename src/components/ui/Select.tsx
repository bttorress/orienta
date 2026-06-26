import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export function Select({ className, label, error, id, ...props }: SelectProps) {
  const select = (
    <select
      id={id}
      className={cn(
        "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-950 outline-none transition duration-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50 dark:hover:border-slate-600 dark:focus:border-emerald-500 dark:focus:ring-emerald-950",
        className,
      )}
      {...props}
    />
  );

  if (!label) return select;

  return (
    <label className="grid gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor={id}>
      {label}
      {select}
      {error ? <span className="text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}
