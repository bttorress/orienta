import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.45)] transition duration-200 dark:border-slate-800 dark:bg-[#111827] dark:shadow-black/20 sm:p-5",
        className,
      )}
      {...props}
    />
  );
}
