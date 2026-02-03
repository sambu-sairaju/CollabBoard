# CollabBoard

A real-time collaborative workspace with documents, kanban boards, chat, and video calling.

## 🏗️ Project Structure

```
CollabBoard/
├── apps/
│   ├── web/          # Next.js 14 frontend
│   └── server/       # Express.js backend
├── packages/
│   ├── types/        # Shared TypeScript types
│   └── utils/        # Shared utilities
├── docker-compose.yml
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### Installation

```bash
# Install dependencies
pnpm install

# Start databases (PostgreSQL + Redis)
docker compose up -d

# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Start development servers
pnpm dev
```

### Development URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Prisma Studio**: http://localhost:5555

## 📦 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express, TypeScript, Socket.IO
- **Database**: PostgreSQL, Redis
- **ORM**: Prisma
- **Auth**: JWT, OAuth (Google, GitHub)

## 📝 License

MIT
