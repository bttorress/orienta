import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { useFinanceData } from "../hooks/useFinanceData";
import { formatCurrency } from "../lib/utils";

export function ReportsPage() {
  const { transactions, chartData } = useFinanceData();

  const expensesByCategory = transactions
    .filter((item) => item.type === "expense")
    .reduce<Record<string, { name: string; value: number; color: string }>>((acc, item) => {
      const name = item.categories?.name ?? "Sem categoria";
      acc[name] ??= { name, value: 0, color: item.categories?.color ?? "#64748b" };
      acc[name].value += item.amount;
      return acc;
    }, {});
  const pieData = Object.values(expensesByCategory);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 sm:text-sm">Analise</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Relatorios</h1>
        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Analise receitas, despesas e categorias.</p>
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-black">Receitas x despesas</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dbe3ef" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `R$${value}`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="receitas" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesas" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-black">Despesas por categoria</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={3}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {pieData.length === 0 && (
            <EmptyState icon={BarChart3} title="Sem dados para exibir" description="Cadastre despesas para visualizar o grafico." className="mt-4" />
          )}
        </Card>
      </section>
    </div>
  );
}
