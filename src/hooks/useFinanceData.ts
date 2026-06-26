import { useCallback, useEffect, useMemo, useState } from 'react';
import { startOfMonth, subMonths } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Category, Goal, Transaction, TransactionType } from '../types/database';

export type TransactionInput = {
  description: string;
  amount: number;
  type: TransactionType;
  transaction_date: string;
  category_id?: string | null;
  notes?: string | null;
};

export type CategoryInput = {
  name: string;
  type: TransactionType;
  color: string;
};

export type GoalInput = {
  name: string;
  target_amount: number;
  current_amount: number;
  due_date?: string | null;
};

async function getAuthenticatedUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Erro ao buscar usuario autenticado no Supabase:", error);
    throw error;
  }

  if (!user) {
    throw new Error("Usuario nao autenticado");
  }

  return user;
}

export function useFinanceData() {
  const { user: sessionUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!sessionUser) {
      setTransactions([]);
      setCategories([]);
      setGoals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await getAuthenticatedUser();

      const [transactionsResult, categoriesResult, goalsResult] = await Promise.all([
        supabase
          .from('transactions')
          .select('*, categories(name, color)')
          .eq('user_id', user.id)
          .order('transaction_date', { ascending: false }),
        supabase.from('categories').select('*').eq('user_id', user.id).order('name'),
        supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);

      const firstError = transactionsResult.error ?? categoriesResult.error ?? goalsResult.error;
      if (firstError) {
        console.error("Erro ao carregar dados financeiros no Supabase:", firstError);
        setError(firstError.message);
      } else {
        setTransactions((transactionsResult.data ?? []) as Transaction[]);
        setCategories(categoriesResult.data ?? []);
        setGoals(goalsResult.data ?? []);
      }
    } catch (error) {
      console.error("Erro inesperado ao carregar dados financeiros:", error);
      setError(error instanceof Error ? error.message : "Erro ao carregar dados financeiros.");
    } finally {
      setLoading(false);
    }
  }, [sessionUser]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const summary = useMemo(() => {
    const income = transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
    const expenses = transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
    const monthStart = startOfMonth(new Date());
    const currentMonthTransactions = transactions.filter((item) => new Date(item.transaction_date) >= monthStart);
    const monthlyBalance = currentMonthTransactions.reduce(
      (sum, item) => sum + (item.type === 'income' ? item.amount : -item.amount),
      0,
    );

    return { income, expenses, balance: income - expenses, monthlyBalance };
  }, [transactions]);

  const chartData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, index) => startOfMonth(subMonths(new Date(), 5 - index)));
    return months.map((month) => {
      const monthKey = month.toISOString().slice(0, 7);
      const monthItems = transactions.filter((item) => item.transaction_date.startsWith(monthKey));
      return {
        month: month.toLocaleDateString('pt-BR', { month: 'short' }),
        receitas: monthItems.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0),
        despesas: monthItems.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0),
      };
    });
  }, [transactions]);

  async function addTransaction(input: TransactionInput) {
    const user = await getAuthenticatedUser();
    const { error: insertError } = await supabase.from('transactions').insert({
      ...input,
      user_id: user.id,
    });
    if (insertError) {
      console.error("Erro ao adicionar transacao no Supabase:", insertError);
      throw insertError;
    }
    await loadData();
  }

  async function deleteTransaction(id: string) {
    const user = await getAuthenticatedUser();
    const { error: deleteError } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id);
    if (deleteError) {
      console.error("Erro ao excluir transacao no Supabase:", deleteError);
      throw deleteError;
    }
    await loadData();
  }

  async function updateTransaction(id: string, input: TransactionInput) {
    const user = await getAuthenticatedUser();
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        ...input,
        user_id: user.id,
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (updateError) {
      console.error("Erro ao atualizar transacao no Supabase:", updateError);
      throw updateError;
    }

    await loadData();
  }

  async function addCategory(input: CategoryInput) {
    const user = await getAuthenticatedUser();
    const { error: insertError } = await supabase.from('categories').insert({
      ...input,
      user_id: user.id,
    });
    if (insertError) {
      console.error("Erro ao adicionar categoria no Supabase:", insertError);
      throw insertError;
    }
    await loadData();
  }

  async function updateCategory(id: string, input: CategoryInput) {
    const user = await getAuthenticatedUser();
    const { error: updateError } = await supabase
      .from('categories')
      .update({
        ...input,
        user_id: user.id,
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (updateError) {
      console.error("Erro ao atualizar categoria no Supabase:", updateError);
      throw updateError;
    }

    await loadData();
  }

  async function deleteCategory(id: string) {
    const user = await getAuthenticatedUser();
    const { error: deleteError } = await supabase.from('categories').delete().eq('id', id).eq('user_id', user.id);

    if (deleteError) {
      console.error("Erro ao excluir categoria no Supabase:", deleteError);
      throw deleteError;
    }

    await loadData();
  }

  async function addGoal(input: GoalInput) {
    const user = await getAuthenticatedUser();
    const { error: insertError } = await supabase.from('goals').insert({
      ...input,
      user_id: user.id,
    });
    if (insertError) {
      console.error("Erro ao adicionar meta no Supabase:", insertError);
      throw insertError;
    }
    await loadData();
  }

  async function updateGoal(id: string, input: GoalInput) {
    const user = await getAuthenticatedUser();
    const { error: updateError } = await supabase
      .from('goals')
      .update({
        ...input,
        user_id: user.id,
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (updateError) {
      console.error("Erro ao atualizar meta no Supabase:", updateError);
      throw updateError;
    }

    await loadData();
  }

  async function deleteGoal(id: string) {
    const user = await getAuthenticatedUser();
    const { error: deleteError } = await supabase.from('goals').delete().eq('id', id).eq('user_id', user.id);

    if (deleteError) {
      console.error("Erro ao excluir meta no Supabase:", deleteError);
      throw deleteError;
    }

    await loadData();
  }

  async function updateGoalProgress(id: string, currentAmount: number) {
    const user = await getAuthenticatedUser();
    const { error: updateError } = await supabase
      .from('goals')
      .update({ current_amount: currentAmount })
      .eq('id', id)
      .eq('user_id', user.id);
    if (updateError) {
      console.error("Erro ao atualizar meta no Supabase:", updateError);
      throw updateError;
    }
    await loadData();
  }

  return {
    transactions,
    categories,
    goals,
    summary,
    chartData,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addGoal,
    updateGoal,
    deleteGoal,
    updateGoalProgress,
    reload: loadData,
  };
}
