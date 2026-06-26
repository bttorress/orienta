import { Link } from "react-router-dom";
export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center dark:bg-slate-950">
      <div>
        <p className="text-sm font-semibold text-emerald-600">404</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Pagina nao encontrada</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">O endereco acessado nao existe neste aplicativo.</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Voltar ao dashboard
        </Link>
      </div>
    </main>
  );
}
