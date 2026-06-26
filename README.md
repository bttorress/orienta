# Controle Financeiro Pessoal

Aplicativo web de controle financeiro pessoal feito com React, TypeScript, Vite, Tailwind CSS e Supabase.

## Funcionalidades

- Autenticacao por e-mail e senha com Supabase Auth
- Rotas protegidas com React Router
- Dashboard com saldo, receitas, despesas e metas
- Cadastro e exclusao de receitas, despesas, categorias e metas
- Relatorios com graficos usando Recharts
- Tema claro/escuro
- Layout responsivo
- Row Level Security para cada usuario acessar apenas os proprios dados

## Tecnologias

- React + TypeScript + Vite
- Tailwind CSS
- Supabase
- React Router
- React Hook Form
- Zod
- Recharts

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Crie um projeto no Supabase e execute o SQL em `supabase/schema.sql` no SQL Editor.

3. Copie as variaveis de ambiente:

```bash
cp .env.example .env
```

4. Preencha o `.env` com a URL e a chave publica do seu projeto Supabase:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-anon-ou-publishable
```

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Estrutura

```text
src/
  components/      Componentes reutilizaveis, layout e UI
  contexts/        Providers de autenticacao e tema
  hooks/           Hooks de carregamento de dados
  lib/             Cliente Supabase, formatadores e calculos
  pages/           Telas da aplicacao
  schemas/         Validacoes Zod dos formularios
  services/        Operacoes de leitura e escrita no Supabase
  types/           Tipos do banco
supabase/
  schema.sql       Tabelas, indices, grants e politicas RLS
```

## Observacoes de seguranca

O frontend usa somente a chave publica do Supabase. O isolamento dos dados fica nas politicas RLS do arquivo `supabase/schema.sql`, sempre combinando `to authenticated` com `auth.uid() = user_id`.
