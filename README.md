# Adventurer Route

> Gerenciador de tarefas gamificado com progressão RPG — complete tarefas, ganhe XP e ouro, suba de nível e conquiste missões.

🔗 Ver ao vivo: [link]

---

## 📖 Sobre o projeto

Adventurer Route transforma produtividade pessoal em uma aventura de RPG. Cada tarefa concluída concede experiência e ouro ao jogador, que avança de nível, completa missões diárias e semanais, desbloqueia conquistas e gerencia um inventário de itens. O objetivo é manter o hábito de conclusão de tarefas ao tornar o processo intrinsecamente recompensador.

---

## 🖼 Demo

<!-- adicionar aqui screenshot ou GIF do dashboard em uso -->

---

## ✅ Funcionalidades

- **Autenticação** — login com e-mail/senha ou Google OAuth; registro de novos usuários
- **Kanban de tarefas** — criação, edição, exclusão e conclusão de tarefas com dificuldade FÁCIL / MÉDIO / DIFÍCIL, organizadas por dia
- **Sistema de progressão** — XP e ouro ganhos ao concluir tarefas; level-up automático ao atingir limites de XP; vida do personagem com penalidades por tarefas atrasadas e inatividade
- **Missões (Quests)** — missões diárias e semanais geradas automaticamente; recompensas ao cumprir os objetivos
- **Conquistas** — desbloqueio baseado em marcos (tarefas totais, streak, ouro acumulado, nível atingido)
- **Loja & Inventário** — compra de poções com ouro; uso de itens para recuperar vida
- **Histórico** — registro de tarefas concluídas ao longo do tempo
- **Upload de avatar** — foto de perfil armazenada no Cloudinary
- **Interface temática** — design de pergaminho, animações com Framer Motion e HUD de status do jogador

---

## 🛠 Stack

**Frontend**
- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Framer Motion 12](https://www.framer.com/motion/)

**Backend**
- Next.js API Routes (REST)
- [NextAuth v4](https://next-auth.js.org/) — autenticação com JWT
- [Zod 4](https://zod.dev/) — validação de schemas
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — hash de senhas

**Banco de dados**
- [PostgreSQL](https://www.postgresql.org/) (hospedado no Neon)
- [Prisma 7](https://www.prisma.io/) ORM com adapter PG nativo

**Serviços externos**
- [Cloudinary](https://cloudinary.com/) — upload e armazenamento de imagens

---

## 🗂 Arquitetura

O projeto segue uma estrutura orientada a **features** dentro do App Router do Next.js:

```
src/
├── app/
│   ├── (public)/          # Rotas públicas: landing page, login
│   ├── (panel)/           # Rotas protegidas: dashboard e sub-rotas
│   └── api/               # API Routes REST organizadas por domínio
├── components/
│   ├── animations/        # Wrappers Framer Motion reutilizáveis
│   └── ui/                # Componentes base (Button, Input, Modal...)
├── features/              # Módulos por domínio (tasks, quests, shop...)
│   └── [feature]/
│       ├── components/    # *Feature.tsx (entry point) + *Client.tsx
│       ├── schemas/       # Schemas Zod
│       └── types/
├── lib/                   # Utilitários: auth helpers, prisma client, cloudinary
└── server/
    ├── game/              # Lógica de jogo: XP, level-up, quests, penalidades
    └── services/          # Camada de serviço por domínio (sem lógica no handler)
```

**Padrões adotados:**
- Componentes `*Feature.tsx` são entry points que compõem os `*Client.tsx` interativos
- Toda lógica de negócio fica em `server/services/` — os API handlers apenas validam e delegam
- Mecânicas de jogo isoladas em `server/game/` (progressão, quests, penalidades, conquistas)
- Middleware do Next.js protege rotas `/dashboard/*` e endpoints de API

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 20+
- PostgreSQL acessível (local ou Neon)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/adventurer-route.git
cd adventurer-route

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais (veja a seção abaixo)

# 4. Execute as migrations e gere o cliente Prisma
npx prisma migrate deploy
npx prisma generate

# 5. (Opcional) Popule o banco com dados iniciais
npx ts-node prisma/seed.ts

# 6. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## 🔑 Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de dados
DATABASE_URL=postgresql://usuario:senha@host:5432/nome_do_banco

# NextAuth
NEXTAUTH_SECRET=sua_chave_secreta_aleatoria
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (console.cloud.google.com)
AUTH_GOOGLE_ID=seu_client_id
AUTH_GOOGLE_SECRET=seu_client_secret

# Cloudinary (cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
```

---

## 📜 Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento com hot-reload |
| `npm run build` | Gera o cliente Prisma, executa migrations e faz o build de produção |
| `npm run start` | Inicia o servidor em modo produção (requer `build` antes) |
| `npx prisma migrate dev` | Cria e aplica uma nova migration em desenvolvimento |
| `npx prisma studio` | Abre o Prisma Studio para inspecionar o banco visualmente |
| `npx ts-node prisma/seed.ts` | Popula o banco com dados iniciais |

---

## 🗺 Roadmap

- [ ] Página de Adventure Mode completa
- [ ] Sistema de grupos / guildas para competição entre usuários
- [ ] Notificações de tarefas pendentes
- [ ] Modo offline com sincronização posterior
- [ ] Testes automatizados (unitários e integração)
- [ ] Dark mode / temas alternativos de interface
