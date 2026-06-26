import { useState } from "react";
import { CheckCircle2, Loader2, Pencil, Plus, ReceiptText, Save, Trash2, Wallet, X } from "lucide-react";
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
import { formatCurrency, formatDate } from "../lib/utils";
import type { Transaction } from "../types/database";

const transactionSchema = z.object({
  description: z.string().min(2, "Informe uma descricao."),
  amount: z.coerce.number().positive("Informe um valor maior que zero."),
  type: z.enum(["income", "expense"]),
  transaction_date: z.string().min(1, "Informe a data."),
  category_id: z.string().optional(),
  notes: z.string().optional(),
});

type TransactionFormInput = z.input<typeof transactionSchema>;
type TransactionFormOutput = z.output<typeof transactionSchema>;

export function TransactionsPage() {
  const { transactions, categories, addTransaction, updateTransaction, deleteTransaction, loading } = useFinanceData();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const form = useForm<TransactionFormInput, unknown, TransactionFormOutput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      transaction_date: new Date().toISOString().slice(0, 10),
    },
  });
  const selectedType = form.watch("type");

  function startEditing(transaction: Transaction) {
    setFeedback(null);
    setEditingTransaction(transaction);
    form.reset({
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      transaction_date: transaction.transaction_date,
      category_id: transaction.category_id ?? "",
      notes: transaction.notes ?? "",
    });
  }

  function cancelEditing() {
    setEditingTransaction(null);
    setFeedback(null);
    form.reset({
      type: "expense",
      transaction_date: new Date().toISOString().slice(0, 10),
      description: "",
      amount: undefined,
      category_id: "",
      notes: "",
    });
  }

  async function onSubmit(values: TransactionFormOutput) {
    setFeedback(null);
    try {
      const payload = {
        ...values,
        category_id: values.category_id || null,
        notes: values.notes || null,
      };

      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, payload);
        setEditingTransaction(null);
        setFeedback({ type: "success", text: "Transacao atualizada com sucesso." });
      } else {
        await addTransaction(payload);
        setFeedback({ type: "success", text: "Transacao adicionada com sucesso." });
      }

      form.reset({
        type: "expense",
        transaction_date: new Date().toISOString().slice(0, 10),
        description: "",
        amount: undefined,
        category_id: "",
        notes: "",
      });
    } catch (error) {
      console.error("Erro ao salvar transacao:", error);
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "Nao foi possivel salvar a transacao." });
    }
  }

  async function handleDelete(transaction: Transaction) {
    const confirmed = window.confirm(`Excluir a transacao "${transaction.description}"? Esta acao nao pode ser desfeita.`);
    if (!confirmed) return;

    setFeedback(null);
    try {
      await deleteTransaction(transaction.id);
      if (editingTransaction?.id === transaction.id) {
        cancelEditing();
      }
      setFeedback({ type: "success", text: "Transacao excluida com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir transacao:", error);
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "Nao foi possivel excluir a transacao." });
    }
  }

  return (
    <div className="grid gap-5 lg:gap-6 xl:grid-cols-[430px_1fr]">
      <section>
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 sm:text-sm">Lancamentos</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Transacoes</h1>
        <p className="mb-5 mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Cadastre receitas e despesas sem sair do historico.</p>
        <Card className="sticky top-28">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black">{editingTransaction ? "Editar transacao" : "Nova transacao"}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {editingTransaction ? "Edite os dados e salve as alteracoes." : "Preencha os dados e clique no botao verde."}
              </p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {editingTransaction ? <Pencil size={20} /> : <Plus size={20} />}
            </div>
          </div>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <label className="block space-y-1">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Descricao</span>
              <Input {...form.register("description")} placeholder="Ex.: Mercado" />
              {form.formState.errors.description && <span className="text-xs text-rose-600">{form.formState.errors.description.message}</span>}
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Valor</span>
                <Input type="number" step="0.01" min="0" {...form.register("amount")} />
                {form.formState.errors.amount && <span className="text-xs text-rose-600">{form.formState.errors.amount.message}</span>}
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tipo</span>
                <Select {...form.register("type")}>
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                </Select>
              </label>
            </div>
            <label className="block space-y-1">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Categoria</span>
              <Select {...form.register("category_id")}>
                <option value="">Sem categoria</option>
                {categories
                  .filter((category) => category.type === selectedType)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </Select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Data</span>
              <Input type="date" {...form.register("transaction_date")} />
              {form.formState.errors.transaction_date && <span className="text-xs text-rose-600">{form.formState.errors.transaction_date.message}</span>}
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Observacoes</span>
              <Input {...form.register("notes")} placeholder="Opcional" />
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
            <Button type="submit" className="w-full text-base" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 size={20} className="animate-spin" /> : editingTransaction ? <Save size={20} /> : <Plus size={20} />}
              {editingTransaction ? "Salvar alteracoes" : "Adicionar transacao"}
            </Button>
            {editingTransaction ? (
              <Button type="button" variant="secondary" className="w-full text-slate-600 dark:text-slate-300" onClick={cancelEditing} title="Cancelar edicao">
                <X size={20} />
                Cancelar edicao
              </Button>
            ) : null}
          </form>
        </Card>
      </section>

      <section>
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black">Historico de transacoes</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{transactions.length} lancamento(s) encontrados.</p>
            </div>
            {loading ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <Loader2 size={20} className="animate-spin" />
                Atualizando
              </span>
            ) : (
              <ReceiptText size={22} className="text-emerald-600" />
            )}
          </div>
          <div className="space-y-3 md:hidden">
            {transactions.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-950 dark:text-white">{item.description}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{formatDate(item.transaction_date)}</p>
                    <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{item.categories?.name ?? "Sem categoria"}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`text-sm font-black ${item.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                      {formatCurrency(item.amount)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.type === "income" ? "Receita" : "Despesa"}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end gap-2">
                  <ActionIconButton tone="edit" onClick={() => startEditing(item)} aria-label="Editar transacao" title="Editar">
                    <Pencil size={20} />
                  </ActionIconButton>
                  <ActionIconButton tone="delete" onClick={() => handleDelete(item)} aria-label="Excluir transacao" title="Excluir">
                    <Trash2 size={20} />
                  </ActionIconButton>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2">Descricao</th>
                  <th>Categoria</th>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th className="text-right">Valor</th>
                  <th className="text-right">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950">
                    <td className="py-3 font-medium">{item.description}</td>
                    <td>{item.categories?.name ?? "Sem categoria"}</td>
                    <td>{formatDate(item.transaction_date)}</td>
                    <td>{item.type === "income" ? "Receita" : "Despesa"}</td>
                    <td className={`text-right font-bold ${item.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ActionIconButton
                          tone="edit"
                          onClick={() => startEditing(item)}
                          aria-label="Editar transacao"
                          title="Editar"
                        >
                          <Pencil size={20} />
                        </ActionIconButton>
                        <ActionIconButton
                          tone="delete"
                          onClick={() => handleDelete(item)}
                          aria-label="Excluir transacao"
                          title="Excluir"
                        >
                          <Trash2 size={20} />
                        </ActionIconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {transactions.length === 0 && (
            <EmptyState
              icon={Wallet}
              title="Nenhuma transacao encontrada"
              description="Adicione uma receita ou despesa no formulario ao lado para iniciar seu historico."
              className="my-4"
            />
          )}
        </Card>
      </section>
    </div>
  );
}
