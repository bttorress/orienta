import { useState } from "react";
import { CheckCircle2, Loader2, Package, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { ActionIconButton } from "../components/ui/ActionIconButton";
import { EmptyState } from "../components/ui/EmptyState";
import { useFinanceData } from "../hooks/useFinanceData";
import type { Category } from "../types/database";

const categorySchema = z.object({
  name: z.string().min(2, "Informe um nome."),
  type: z.enum(["income", "expense"]),
  color: z.string().min(4),
});

type CategoryForm = z.infer<typeof categorySchema>;

export function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useFinanceData();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const form = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: { type: "expense", color: "#10b981" },
  });

  function startEditing(category: Category) {
    setFeedback(null);
    setEditingCategory(category);
    form.reset({
      name: category.name,
      type: category.type,
      color: category.color,
    });
  }

  function cancelEditing() {
    setEditingCategory(null);
    setFeedback(null);
    form.reset({ name: "", type: "expense", color: "#10b981" });
  }

  async function onSubmit(values: CategoryForm) {
    setFeedback(null);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, values);
        setEditingCategory(null);
        setFeedback({ type: "success", text: "Categoria atualizada com sucesso." });
      } else {
        await addCategory(values);
        setFeedback({ type: "success", text: "Categoria adicionada com sucesso." });
      }

      form.reset({ name: "", type: "expense", color: "#10b981" });
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "Nao foi possivel salvar a categoria." });
    }
  }

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(`Excluir a categoria "${category.name}"? Esta acao nao pode ser desfeita.`);
    if (!confirmed) return;

    setFeedback(null);
    try {
      await deleteCategory(category.id);
      if (editingCategory?.id === category.id) {
        cancelEditing();
      }
      setFeedback({ type: "success", text: "Categoria excluida com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "Nao foi possivel excluir a categoria." });
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[380px_1fr] lg:gap-6">
      <section>
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 sm:text-sm">Organizacao</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Categorias</h1>
        <p className="mb-5 mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Organize seus lancamentos por tipo.</p>
        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black">{editingCategory ? "Editar categoria" : "Nova categoria"}</h2>
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                {editingCategory ? "Edite os dados e salve as alteracoes." : "Crie categorias para organizar seus lancamentos."}
              </p>
            </div>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {editingCategory ? <Pencil size={20} /> : <Plus size={20} />}
            </div>
          </div>

          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nome</span>
              <Input {...form.register("name")} placeholder="Ex.: Alimentacao" />
              {form.formState.errors.name && <span className="text-xs font-medium text-rose-600">{form.formState.errors.name.message}</span>}
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tipo</span>
              <Select {...form.register("type")}>
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </Select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Cor</span>
              <Input type="color" className="p-1" {...form.register("color")} />
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
              {form.formState.isSubmitting ? <Loader2 size={20} className="animate-spin" /> : editingCategory ? <Save size={20} /> : <Plus size={20} />}
              {editingCategory ? "Salvar alteracoes" : "Adicionar categoria"}
            </Button>
            {editingCategory ? (
              <Button type="button" variant="secondary" className="w-full text-slate-600 dark:text-slate-300" onClick={cancelEditing} title="Cancelar edicao">
                <X size={20} />
                Cancelar edicao
              </Button>
            ) : null}
          </form>
        </Card>
      </section>

      <section className="grid content-start gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: category.color }} />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{category.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{category.type === "income" ? "Receita" : "Despesa"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ActionIconButton tone="edit" onClick={() => startEditing(category)} aria-label="Editar categoria" title="Editar">
                  <Pencil size={20} />
                </ActionIconButton>
                <ActionIconButton tone="delete" onClick={() => handleDelete(category)} aria-label="Excluir categoria" title="Excluir">
                  <Trash2 size={20} />
                </ActionIconButton>
              </div>
            </div>
          </Card>
        ))}
        {categories.length === 0 && (
          <EmptyState icon={Package} title="Nenhuma categoria cadastrada" description="Crie categorias para classificar receitas e despesas." />
        )}
      </section>
    </div>
  );
}
