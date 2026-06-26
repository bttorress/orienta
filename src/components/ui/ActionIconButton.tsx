import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type ActionIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone: "edit" | "delete" | "neutral";
  children: ReactNode;
};

const tones = {
  edit: "text-[#60A5FA] hover:bg-blue-50 dark:text-[#60A5FA] dark:hover:bg-blue-950/70",
  delete: "text-[#F87171] hover:bg-rose-50 dark:text-[#F87171] dark:hover:bg-rose-950/70",
  neutral: "text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
};

export function ActionIconButton({ tone, className, children, ...props }: ActionIconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-transparent p-0 transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
