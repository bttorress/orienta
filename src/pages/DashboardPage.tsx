import { ArrowDownCircle, ArrowUpCircle, PiggyBank, Plus, ReceiptText, Target, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../components/ui/Card";
import { Feedback } from "../components/ui/Feedback";
import { EmptyState } from "../components/ui/EmptyState";
import { useFinanceData } from "../hooks/useFinanceData";
import { formatCurrency, formatDate } from "../lib/utils";

export function DashboardPage() {
  const { summary, transactions, goals, chartData, loading, error } = useFinanceData();

  if (loading) return <Feedback type="loading" title="Carregando dashboard" description="Buscando suas receitas, despesas e metas." />;
  if (error) return <Feedback type="error" title="Nao foi possivel carregar o dashboard" description={error} />;

  const cards = [
    { label: "Saldo", value: summary.balance, icon: Wallet, tone: "text-slate-700 dark:text-slate-200" },
    { label: "Receitas", value: summary.income, icon: ArrowUpCircle, tone: "text-emerald-600" },
    { label: "Despesas", value: summary.expenses, icon: ArrowDownCircle, tone: "text-rose-600" },
    { label: "Resultado do mes", value: summary.monthlyBalance, icon: PiggyBank, tone: "text-cyan-600" },
  ];

  return (
    <div className="space-y-6 lg:space-y-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 sm:text-sm">Visao geral</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Resumo das suas movimentacoes financeiras.</p>
        </div>
        <Link
          to="/transacoes"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-emerald-900/20 transition duration-200 hover:bg-emerald-700 active:scale-[0.98] md:w-auto dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
        >
          <Plus size={20} />
          Nova transacao
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label} className="overflow-hidden p-5 sm:p-6">
            <div className="flex min-h-24 items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{formatCurrency(value)}</p>
              </div>
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <Icon size={26} className={tone} />
              </div>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <h2 className="mb-1 text-lg font-black">Fluxo dos ultimos 6 meses</h2>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Compare receitas e despesas recentes.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dbe3ef" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `R$${value}`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="receitas" stroke="#059669" fill="#34d399" />
                <Area type="monotone" dataKey="despesas" stroke="#e11d48" fill="#fb7185" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black">Movimentacoes recentes</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Ultimos lancamentos cadastrados.</p>
            </div>
            <ReceiptText size={22} className="text-emerald-600" />
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 6).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{item.description}</p>
                  <p className="text-xs text-slate-500">{formatDate(item.transaction_date)}</p>
                </div>
                <p className={`text-sm font-bold ${item.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                  {item.type === "income" ? "+" : "-"} {formatCurrency(item.amount)}
                </p>
              </div>
            ))}
            {transactions.length === 0 && (
              <EmptyState icon={Wallet} title="Nenhuma transacao encontrada" description="Adicione sua primeira receita ou despesa para preencher o dashboard." />
            )}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {goals.length > 0 ? (
          <div className="md:col-span-3 flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
            <Target size={22} className="text-emerald-600" />
            Metas em andamento
          </div>
        ) : null}
        {goals.slice(0, 3).map((goal) => {
          const progress = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
          return (
            <Card key={goal.id}>
              <p className="font-semibold">{goal.name}</p>
              <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-sm text-slate-500">{progress}% de {formatCurrency(goal.target_amount)}</p>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
