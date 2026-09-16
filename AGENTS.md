# AGENTS.md — IHAM University Backend

## Project Overview

Role-based university management backend API built with **Node.js, Express, TypeScript, MongoDB/Mongoose**. Modular architecture where each domain (auth, user, student, faculty, admin, course, semester, etc.) lives under `src/app/modules/<moduleName>/` with its own route, controller, service, model, interface, validation, and constants files.

## Quick Start

1. **Copy env**: `cp .env.example .env` and fill in all values (MongoDB Atlas URL, JWT secrets, SMTP, Cloudinary, etc.)
2. **Install deps**: `npm install`
3. **Dev server**: `npm run dev` (or `npm run start:dev`) — uses `ts-node-dev --respawn --transpile-only`
4. **Build**: `npx tsc` — compiles `src/` → `dist/`
5. **Prod start**: `npm run start:prod` → `node ./dist/server.js`

## Running the App

- **Base URL**: `http://localhost:5000/api/v1` (port from `.env` PORT)
- **CORS**: Allowed origins are `http://localhost:5173` and `http://192.168.56.1:5173` (configured in `src/app.ts`)
- **Super admin seed**: On startup, `src/app/DB/index.ts` auto-creates a super admin if none exists using `SUPER_ADMIN_PASS` from `.env`
- **Required env**: `.env` is gitignored — never commit it

## Module Structure

All modules follow the same pattern under `src/app/modules/<moduleName>/`:
- `<module>.route.ts` — Express router
- `<module>.controller.ts` — Request/response handling
- `<module>.service.ts` — Business logic
- `<module>.model.ts` — Mongoose schema
- `<module>.interface.ts` — TypeScript interfaces
- `<module>.validation.ts` — Zod validation schemas
- `<module>.constants.ts` — Module-specific constants (some modules)
- `<module>.utils.ts` — Utility functions (some modules)

Routes are registered in `src/app/routes/index.ts` under `/api/v1`.

## Adding a New Module

1. Create `src/app/modules/<moduleName>/` with all required files
2. Add entry to `src/app/routes/index.ts` in the `moduleRoutes` array
3. Export the router from `<module>.route.ts`

## Commands & Tools

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server with auto-reload |
| `npx tsc` | Type-check and build to `dist/` |
| `npx eslint .` | Lint source files |
| `npm run format` | Prettier format all src files |
| `npm run start:prod` | Start production build |

**⚠️ `npm run lint:fix` is broken** — it calls `npm run lint --fix` but there is no `lint` script defined in `package.json`. Use `npx eslint .` directly or `npx eslint . --fix` to fix lint issues.

**⚠️ No test suite exists** — `npm test` exits with error. There is no test framework configured.

## Key Architecture Notes

- **Auth flow**: JWT access token (Bearer header) + refresh token (httpOnly cookie). `auth` middleware (`src/app/middlewares/auth.ts`) guards routes with role-based access.
- **Error handling**: Custom `AppError` class + `globalErrorHandler` middleware. Specific handlers for Zod, validation, duplicate, and cast errors.
- **Validation**: Zod schemas in `<module>.validation.ts`, applied via `validateRequest` middleware.
- **Config**: All env vars loaded in `src/app/config/index.ts` via `dotenv.config()`.
- **Express Request extension**: `src/app/interfaces/index.d.ts` adds `req.user: JwtPayload` globally.

## Important Files

| File | Purpose |
|---|---|
| `src/server.ts` | Entry point — connects to MongoDB, seeds super admin, starts server |
| `src/app.ts` | Express app setup — middleware, routes, error handlers |
| `src/app/config/index.ts` | Environment configuration loader |
| `src/app/routes/index.ts` | Route registration for all modules |
| `src/app/DB/index.ts` | Super admin seeding logic |
| `.env.example` | Template for all required environment variables |
| `docs.md` | API documentation with route table and all module doc links |

## Environment Variables Required

See `.env.example` for all 17 required variables: `PORT`, `MONGO_URL`, `NODE_ENV`, `BCRYPT_SALT`, `DEFAULT_PASS`, `JWT_SECRET`, `JWT_SECRET_EXP`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_SECRET_EXP`, `SMTP_USER`, `SMTP_PASS`, `RESET_UI_LINK`, `CLOUDINARY_URL`, `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`, `SUPER_ADMIN_PASS`.

## Gotchas

- `tsconfig.json` has `"strict": true` and `"module": "commonjs"` — do not change without reason
- `dist/` and `.env` are gitignored — never commit them
- `package.json` `main` is `index.js` but the actual entry is `src/server.ts`
- The `futureUpdates.md` notes pending work: offered course scheduling constraints, profile picture updates, and mail function improvements
- MongoDB is a cloud Atlas cluster (see `.env.example` for connection string)
