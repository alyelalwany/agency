.PHONY: install generate migrate seed setup dev build start lint clean reset

# Default target: full setup then start dev server
all: setup dev

# Install dependencies
install:
	npm install

# Generate Prisma client from schema
generate:
	npx prisma generate

# Push schema to database (creates tables without migration history)
migrate:
	npx prisma db push

# Seed the database with demo data
seed:
	npx prisma db seed

# Full first-time setup: install deps, generate client, push schema, seed
setup: install generate migrate seed

# Start the development server
dev:
	npm run dev

# Production build
build:
	npm run build

# Start production server (requires build first)
start:
	npm run start

# Run ESLint
lint:
	npm run lint

# Type-check without emitting
typecheck:
	npx tsc --noEmit

# Open Prisma Studio (database GUI)
studio:
	npx prisma studio

# Delete database and re-seed from scratch
reset:
	rm -f dev.db
	$(MAKE) migrate seed

# Remove generated files and database
clean:
	rm -f dev.db
	rm -rf src/generated
	rm -rf .next
