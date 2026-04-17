# WTG Indicações

Sistema interno de gerenciamento de indicações da WTG Corretora de Seguros.

---

## Stack

- **React 18** + **Vite**
- **Supabase** (Auth + PostgreSQL + RLS)
- **React Router v6**

---

## Setup rápido

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Abra o `.env` e preencha:

```
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

A `anon key` está em: **Supabase Dashboard → Project Settings → API → anon public**

### 3. Aplicar SQL no Supabase

No **SQL Editor** do Supabase, execute o arquivo:

```
supabase/rls_e_triggers.sql
```

Isso criará:
- Políticas RLS nas tabelas `profiles` e `indications`
- Triggers de `created_by`, `data_indicacao`, `ultima_atualizacao`
- Trigger de criação automática de perfil ao cadastrar usuário

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

### 5. Build para produção

```bash
npm run build
```

---

## Estrutura de pastas

```
src/
├── componentes/
│   ├── BadgeStatus.jsx          # Badge colorido de status
│   ├── FiltrosIndicacoes.jsx    # Filtros da tabela (busca, status, produto)
│   ├── FormularioIndicacao.jsx  # Formulário de criar/editar
│   ├── Layout.jsx               # Sidebar + área de conteúdo
│   ├── Modal.jsx                # Modal genérico reutilizável
│   ├── Paginacao.jsx            # Paginação
│   ├── RotaProtegida.jsx        # Guard de rotas
│   └── TabelaIndicacoes.jsx     # Tabela com ações
├── contextos/
│   └── ContextoAuth.jsx         # Estado global de autenticação
├── estilos/
│   └── global.css               # Variáveis CSS + reset
├── hooks/
│   └── useIndicacoes.js         # Hook de CRUD + estado de indicações
├── paginas/
│   ├── PaginaDashboard.jsx      # Dashboard (admin e user)
│   ├── PaginaLogin.jsx          # Tela de login
│   ├── PaginaMinhasIndicacoes.jsx  # Indicações do usuário
│   └── PaginaTodasIndicacoes.jsx   # Todas as indicações (admin)
├── servicos/
│   ├── autenticacao.js          # Login, logout, perfil
│   └── indicacoes.js            # CRUD de indicações
├── App.jsx                      # Roteamento
├── constantes.js                # Produtos, status, rotas
├── main.jsx                     # Entry point
└── supabase.js                  # Cliente Supabase
```

---

## Perfis e acessos

| Perfil | E-mail | Acesso |
|--------|--------|--------|
| Admin  | admin@wtgseguros.com.br | Vê e edita tudo, vê valor consolidado |
| User   | qualquer outro | Vê e edita apenas as próprias indicações |

---

## Rotas

| Rota | Perfil | Descrição |
|------|--------|-----------|
| `/login` | Público | Tela de autenticação |
| `/dashboard` | Todos | Métricas e resumo |
| `/minhas-indicacoes` | User | CRUD das próprias indicações |
| `/todas-indicacoes` | Admin | CRUD de todas as indicações |

---

## Segurança

- RLS habilitado em todas as tabelas sensíveis
- `created_by` preenchido via trigger no backend (não confia no frontend)
- Admin identificado por e-mail fixo (`admin@wtgseguros.com.br`) — sem dependência de campo `role` manipulável no cliente
- Validações duplicadas: frontend (UX) + serviço (consistência)
