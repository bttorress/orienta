import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Chrome, CircleDollarSign, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { ThemeSwitch } from "../components/ui/ThemeSwitch";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const authSchema = z.object({
  email: z.string().email("Informe um e-mail valido."),
  password: z.string().min(6, "Use pelo menos 6 caracteres."),
});

type AuthForm = z.infer<typeof authSchema>;

export function AuthPage() {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { signIn, signUp, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? "/dashboard";
  const form = useForm<AuthForm>({ resolver: zodResolver(authSchema) });

  if (user) return <Navigate to={from} replace />;

  async function onSubmit(values: AuthForm) {
    setMessage(null);
    try {
      if (mode === "signIn") {
        await signIn(values.email, values.password);
      } else {
        await signUp(values.email, values.password);
        setMessage({ type: "success", text: "Cadastro criado. Confirme seu e-mail se a confirmacao estiver ativa no Supabase." });
      }
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Nao foi possivel autenticar." });
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,_#dcfce7,_transparent_34%),linear-gradient(135deg,_#f8fafc,_#eefcf5)] px-4 py-8 dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_32%),linear-gradient(135deg,_#020617,_#0f172a)]">
      <ThemeSwitch theme={theme} onToggle={toggleTheme} className="fixed right-4 top-4" />

      <Card className="w-full max-w-md border-white/80 bg-white/95 p-6 shadow-[0_24px_80px_-36px_rgba(5,150,105,0.55)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:p-7">
        <div className="mb-7 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-900/25 dark:bg-emerald-500 dark:text-emerald-950">
            <CircleDollarSign size={28} />
          </div>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-950 dark:text-white">Orienta</h1>
          <p className="mt-1 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">Controle financeiro pessoal com uma experiência limpa e segura.</p>
        </div>

        <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100">
          <div className="flex items-center gap-2 font-bold">
            <ShieldCheck size={20} />
            Acesso protegido
          </div>
          <p className="mt-1 text-emerald-800/80 dark:text-emerald-100/75">Entre para visualizar apenas seus proprios dados financeiros.</p>
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${mode === "signIn" ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-950 dark:text-emerald-300" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
            onClick={() => setMode("signIn")}
            type="button"
          >
            Entrar
          </button>
          <button
            className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${mode === "signUp" ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-950 dark:text-emerald-300" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
            onClick={() => setMode("signUp")}
            type="button"
          >
            Cadastrar
          </button>
        </div>

        <Button
          type="button"
          variant="secondary"
          className="mb-5 w-full"
          onClick={() => setMessage({ type: "error", text: "Login com Google nao esta configurado neste projeto." })}
        >
          <Chrome size={20} />
          Entrar com Google
        </Button>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">E-mail</span>
            <Input type="email" placeholder="voce@email.com" {...form.register("email")} />
            {form.formState.errors.email && <span className="text-xs text-rose-600">{form.formState.errors.email.message}</span>}
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Senha</span>
            <Input type="password" placeholder="Sua senha" {...form.register("password")} />
            {form.formState.errors.password && <span className="text-xs text-rose-600">{form.formState.errors.password.message}</span>}
          </label>
          {message && (
            <div
              className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${
                message.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                  : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200"
              }`}
            >
              {message.type === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5" /> : <AlertCircle className="mt-0.5 h-5 w-5" />}
              <span>{message.text}</span>
            </div>
          )}
          <Button type="submit" className="w-full text-base" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 size={20} className="animate-spin" /> : null}
            {mode === "signIn" ? "Entrar" : "Criar conta"}
          </Button>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            {mode === "signIn" ? "Ainda nao tem conta?" : "Ja tem uma conta?"}{" "}
            <button
              type="button"
              className="font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
              onClick={() => {
                setMessage(null);
                setMode(mode === "signIn" ? "signUp" : "signIn");
              }}
            >
              {mode === "signIn" ? "Criar conta" : "Entrar"}
            </button>
          </p>
        </form>
      </Card>
    </main>
  );
}
