# WTG Indicações

Sistema interno de gestão de indicações de clientes para a **WTG Corretora de Seguros**.

Numa corretora, é comum um cliente atendido por um produto (ex: auto) ser um potencial comprador de outro (ex: saúde, vida, residencial). Esse tipo de oportunidade — a "indicação" de um cliente para outro produto — costumava ser passada informalmente entre colaboradores (WhatsApp, planilha, e-mail), sem rastreabilidade de quem indicou, para quem foi direcionada, em que status está e se virou negócio fechado.

O sistema resolve isso centralizando o cadastro, o acompanhamento de status e a apuração de resultados de cada indicação, com controle de acesso: cada colaborador só vê e edita as próprias indicações, enquanto o admin tem visão consolidada de toda a operação.

---

## O que o sistema faz

- **Login** (`/login`) — autenticação via Supabase Auth (e-mail/senha). Ao logar, o app carrega o perfil (`profiles`) do usuário e identifica se é admin (`admin@wtgseguros.com.br`, ver `src/constantes.js`).
- **Dashboard** (`/dashboard`, todos os perfis) — mostra cartões com total de indicações, quantas estão em andamento, realizadas e não realizadas, além de uma barra de taxa de conversão. Para o admin, soma também o volume financeiro (R$) das indicações realizadas e exibe uma tabela com o desempenho de cada colaborador (total, status e valor por pessoa).
- **Minhas Indicações** (`/minhas-indicacoes`, colaborador) — CRUD das indicações criadas pelo próprio usuário: cadastrar cliente, telefone, e-mail, produto de interesse, se já é cliente WTG, se tem consultor responsável, para quem foi direcionada e status atual.
- **Todas as Indicações** (`/todas-indicacoes`, apenas admin) — mesma listagem, mas com todas as indicações da corretora, com filtros por status, produto e busca por cliente/e-mail/telefone, e paginação.
- **Formulário de indicação** — valida campos obrigatórios (cliente, telefone, produto, direcionado para), formata valores em Real (`R$ 1.234,56`) e permite registrar um histórico de observações com data/hora, útil para acompanhar o andamento de uma negociação ao longo do tempo.
- **Troca de status** — cada indicação pode ser marcada como `em_andamento`, `realizado` ou `não realizado`, e isso alimenta as métricas do dashboard.
- **Controle de acesso por linha (RLS)** — não é apenas visual: as políticas de Row Level Security do Postgres (`supabase/rls_e_triggers.sql`) garantem no banco que um usuário comum só consegue ler, editar ou excluir as próprias indicações; o admin (identificado pelo e-mail fixo) tem acesso a todas. O campo `created_by` é preenchido por trigger no servidor, não confiando no valor enviado pelo frontend.
- **Automação via triggers** — ao cadastrar um novo usuário no Supabase Auth, um trigger cria automaticamente o registro correspondente em `profiles` (com `role` admin/user); outros triggers preenchem `data_indicacao` na criação e atualizam `ultima_atualizacao` a cada edição.

---

## Stack

- **React 18** + **Vite** — SPA
- **React Router v6** — roteamento e proteção de rotas (`RotaProtegida`, com variante `apenasAdmin`)
- **Supabase** — Auth (login por e-mail/senha), banco PostgreSQL e Row Level Security
- Sem biblioteca de UI/CSS externa: estilos escritos à mão em `src/estilos/global.css` e inline nos componentes

Estrutura principal:

```
src/
├── componentes/     # Layout, tabela, formulário, filtros, modal, badge de status, paginação, guard de rota
├── contextos/       # ContextoAuth — estado global de sessão/perfil
├── hooks/           # useIndicacoes — CRUD + estado de listagem
├── paginas/         # Login, Dashboard, Minhas Indicações, Todas Indicações
├── servicos/        # autenticacao.js e indicacoes.js — chamadas ao Supabase
├── utils/           # formatação de moeda (BRL) e datas (fuso de Brasília)
└── supabase.js      # cliente Supabase (URL fixa + anon key via variável de ambiente)

supabase/
└── rls_e_triggers.sql   # políticas de RLS e triggers do banco
```

---

## Como rodar localmente

### 1. Pré-requisitos

- Node.js 18+
- Um projeto no [Supabase](https://supabase.com) com as tabelas `profiles` e `indications`

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Preencha no `.env`:

```
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

A chave (anon/publishable) está em **Supabase Dashboard → Project Settings → API**.

### 4. Aplicar o SQL no Supabase

No **SQL Editor** do Supabase, execute `supabase/rls_e_triggers.sql`. Isso cria:

- Políticas de RLS nas tabelas `profiles` e `indications`
- Trigger que preenche `created_by` automaticamente no backend
- Triggers de `data_indicacao` e `ultima_atualizacao`
- Trigger que cria o perfil (`profiles`) automaticamente ao cadastrar um novo usuário no Auth

### 5. Rodar em desenvolvimento

```bash
npm run dev
```

### 6. Build para produção

```bash
npm run build
```

---

## Perfis e acessos

| Perfil | Identificação | Acesso |
|--------|----------------|--------|
| Admin  | e-mail fixo `admin@wtgseguros.com.br` | Vê e edita todas as indicações, vê volume financeiro e desempenho por colaborador |
| Colaborador | qualquer outro e-mail cadastrado | Vê e edita apenas as próprias indicações |

## Rotas

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/login` | Público | Autenticação |
| `/dashboard` | Autenticado | Métricas e resumo (escopo varia por perfil) |
| `/minhas-indicacoes` | Autenticado | CRUD das próprias indicações |
| `/todas-indicacoes` | Admin | CRUD de todas as indicações da corretora |

## Segurança

- RLS habilitado nas tabelas `profiles` e `indications` — o controle de acesso vive no banco, não só no frontend
- `created_by` preenchido por trigger no servidor (`SECURITY DEFINER`), não aceito diretamente do cliente
- Admin identificado por e-mail fixo verificado em `auth.users`, sem depender de um campo `role` manipulável pelo cliente
- Validação de formulário duplicada: no frontend (UX) e no serviço (`_validarDados`, consistência antes de qualquer escrita no banco)
