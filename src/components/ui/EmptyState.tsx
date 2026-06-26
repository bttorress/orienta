import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-5 py-10 text-center dark:border-slate-800 dark:bg-slate-950/70",
        className,
      )}
    >
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm dark:bg-slate-900 dark:text-emerald-400">
        <Icon size={26} />
      </div>
      <p className="mt-4 text-sm font-black text-slate-900 dark:text-white">{title}</p>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
