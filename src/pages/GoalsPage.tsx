import { useState } from "react";
import { CheckCircle2, Loader2, Pencil, Plus, Save, Target, Trash2, X } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { ActionIconButton } from "../components/ui/ActionIconButton";
import { EmptyState } from "../components/ui/EmptyState";
import { useFinanceData } from "../hooks/useFinanceData";
import { formatCurrency } from "../lib/utils";
import type { Goal } from "../types/database";

const goalSchema = z.object({
  name: z.string().min(2, "Informe um nome."),
  target_amount: z.coerce.number().positive("Informe uma meta maior que zero."),
  current_amount: z.coerce.number().min(0, "O valor atual nao pode ser negativo."),
  due_date: z.string().optional(),
});

type GoalFormInput = z.input<typeof goalSchema>;
type GoalFormOutput = z.output<typeof goalSchema>;

export function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal, updateGoalProgress } = useFinanceData();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const form = useForm<GoalFormInput, unknown, GoalFormOutput>({
    resolver: zodResolver(goalSchema),
    defaultValues: { current_amount: 0 },
  });

  function startEditing(goal: Goal) {
    setFeedback(null);
    setEditingGoal(goal);
    form.reset({
      name: goal.name,
      target_amount: goal.target_amount,
      current_amount: goal.current_amount,
      due_date: goal.due_date ?? "",
    });
  }

  function cancelEditing() {
    setEditingGoal(null);
    setFeedback(null);
    form.reset({
      name: "",
      target_amount: undefined,
      current_amount: 0,
      due_date: "",
    });
  }

  async function onSubmit(values: GoalFormOutput) {
    setFeedback(null);
    try {
      const payload = { ...values, due_date: values.due_date || null };

      if (editingGoal) {
        await updateGoal(editingGoal.id, payload);
        setEditingGoal(null);
        setFeedback({ type: "success", text: "Meta atualizada com sucesso." });
      } else {
        await addGoal(payload);
        setFeedback({ type: "success", text: "Meta adicionada com sucesso." });
      }

      form.reset({ name: "", target_amount: undefined, current_amount: 0, due_date: "" });
    } catch (error) {
      console.error("Erro ao salvar meta:", error);
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "Nao foi possivel salvar a meta." });
    }
  }

  async function handleDelete(goal: Goal) {
    const confirmed = window.confirm(`Excluir a meta "${goal.name}"? Esta acao nao pode ser desfeita.`);
    if (!confirmed) return;

    setFeedback(null);
    try {
      await deleteGoal(goal.id);
      if (editingGoal?.id === goal.id) {
        cancelEditing();
      }
      setFeedback({ type: "success", text: "Meta excluida com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir meta:", error);
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "Nao foi possivel excluir a meta." });
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[380px_1fr] lg:gap-6">
      <section>
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 sm:text-sm">Planejamento</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Metas</h1>
        <p className="mb-5 mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Acompanhe objetivos financeiros.</p>
        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black">{editingGoal ? "Editar meta" : "Nova meta"}</h2>
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                {editingGoal ? "Edite os dados e salve as alteracoes." : "Crie metas para acompanhar seu progresso."}
              </p>
            </div>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {editingGoal ? <Pencil size={20} /> : <Plus size={20} />}
            </div>
          </div>

          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nome</span>
              <Input {...form.register("name")} placeholder="Ex.: Reserva de emergencia" />
              {form.formState.errors.name && <span className="text-xs font-medium text-rose-600">{form.formState.errors.name.message}</span>}
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Valor alvo</span>
              <Input type="number" min="0" step="0.01" {...form.register("target_amount")} />
              {form.formState.errors.target_amount && <span className="text-xs font-medium text-rose-600">{form.formState.errors.target_amount.message}</span>}
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Valor atual</span>
              <Input type="number" min="0" step="0.01" {...form.register("current_amount")} />
              {form.formState.errors.current_amount && <span className="text-xs font-medium text-rose-600">{form.formState.errors.current_amount.message}</span>}
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Prazo</span>
              <Input type="date" {...form.register("due_date")} />
            </label>
            {feedback ? (
              <div
                className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-semibold ${
                  feedback.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                    : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200"
                }`}
              >
                {feedback.type === "success" ? <CheckCircle2 size={20} /> : null}
                <span>{feedback.text}</span>
              </div>
            ) : null}
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 size={20} className="animate-spin" /> : editingGoal ? <Save size={20} /> : <Plus size={20} />}
              {editingGoal ? "Salvar alteracoes" : "Adicionar meta"}
            </Button>
            {editingGoal ? (
              <Button type="button" variant="secondary" className="w-full text-slate-600 dark:text-slate-300" onClick={cancelEditing} title="Cancelar edicao">
                <X size={20} />
                Cancelar edicao
              </Button>
            ) : null}
          </form>
        </Card>
      </section>

      <section className="grid content-start gap-4 md:grid-cols-2">
        {goals.map((goal) => {
          const progress = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
          return (
            <Card key={goal.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-semibold">{goal.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatCurrency(goal.current_amount)} de {formatCurrency(goal.target_amount)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="rounded-xl bg-emerald-50 px-2 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {progress}%
                  </span>
                  <ActionIconButton tone="edit" onClick={() => startEditing(goal)} aria-label="Editar meta" title="Editar">
                    <Pencil size={20} />
                  </ActionIconButton>
                  <ActionIconButton tone="delete" onClick={() => handleDelete(goal)} aria-label="Excluir meta" title="Excluir">
                    <Trash2 size={20} />
                  </ActionIconButton>
                </div>
              </div>
              <div className="mt-4 h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-3 rounded-full bg-emerald-600" style={{ width: `${progress}%` }} />
              </div>
              <form
                className="mt-4 flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  const data = new FormData(event.currentTarget);
                  void updateGoalProgress(goal.id, Number(data.get("current_amount")));
                }}
              >
                <Input name="current_amount" type="number" min="0" step="0.01" defaultValue={goal.current_amount} />
                <Button variant="secondary">Atualizar</Button>
              </form>
            </Card>
          );
        })}
        {goals.length === 0 && <EmptyState icon={Target} title="Nenhuma meta cadastrada" description="Crie uma meta para acompanhar seu progresso financeiro." />}
      </section>
    </div>
  );
}
