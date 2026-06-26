import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

type FeedbackProps = {
  type: "loading" | "success" | "error" | "empty";
  title: string;
  description?: string;
  className?: string;
};

const styles = {
  loading: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  error: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200",
  empty: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200",
};

export function Feedback({ type, title, description, className }: FeedbackProps) {
  const Icon = type === "loading" ? Loader2 : type === "error" ? AlertCircle : CheckCircle2;

  return (
    <div className={cn("flex items-start gap-3 rounded-xl border p-4 text-sm", styles[type], className)}>
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", type === "loading" && "animate-spin")} />
      <div>
        <p className="font-bold">{title}</p>
        {description ? <p className="mt-1 opacity-80">{description}</p> : null}
      </div>
    </div>
  );
}
