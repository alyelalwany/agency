# Agency

Real estate management platform with an interactive node-based dashboard. Each property unit has an AI agent (Claude) that administrators can assign tasks to and chat with.

## Features

- **Interactive Dashboard** — React Flow graph showing all real estate units at a glance
- **Unit Detail View** — Click any unit to see its tenants, amenities, and processes as connected nodes
- **CRUD Operations** — Create, edit, and delete tenants, amenities, and processes inline
- **AI Agents** — Each unit has a dedicated Claude-powered agent for property management tasks
- **Agent Chat** — Stream conversations with unit agents via server-sent events
- **Dark/Light Mode** — Full theme support across all views

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **SQLite + Prisma 7** (with better-sqlite3 driver adapter)
- **React Flow** (@xyflow/react) for interactive node graphs
- **Tailwind CSS v4** with dark mode
- **Anthropic SDK** for Claude API integration
- **SWR** for client-side data fetching

## Getting Started

```bash
# Install dependencies
npm install

# Copy env file and configure
cp .env.example .env

# Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# Seed demo data (23 units with tenants, amenities, processes)
npx tsx prisma/seed.ts

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Claude API Setup

1. Go to Settings (gear icon in the header)
2. Enter your Anthropic API key
3. Click "Test Connection" to verify
4. Chat with any unit's agent from the unit detail page

## Project Structure

```
src/
  app/
    api/          # REST API routes (units, tenants, amenities, processes, agents, tasks, settings)
    units/[id]/   # Unit detail and agent chat pages
    settings/     # API key configuration
  components/
    flow/         # React Flow nodes and graph components
    forms/        # CRUD form dialogs
    layout/       # Header, sidebar, theme provider
    chat/         # Agent chat interface
  lib/            # Prisma client, Claude client, validators, utilities
prisma/
  schema.prisma   # Data model
  seed.ts         # Demo data seeder
```
