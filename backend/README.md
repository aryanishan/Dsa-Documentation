# DSA Docs API

The backend is a standalone Express + TypeScript REST API. It consumes the shared Prisma schema in `../database/prisma/schema.prisma` and never exposes Judge0 credentials to browsers.

## Run locally

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run dev
```

Apply the shared database migration from `database/` before starting the API:

```bash
cd ../database
npm install
npm run migrate:deploy
```

The default API base URL is `http://localhost:4000/api/v1`. Health is available at `/health`.

## Key endpoints

- `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
- `GET/PATCH /users/me`, `GET/PATCH /users/me/settings`
- `GET/POST/DELETE /bookmarks`, `GET/PUT /progress`, `GET/POST /history`
- `GET /topics`, `GET /topics/:slug`, `GET /problems`, `POST /problems/:slug/run`, `POST /problems/:slug/submit`
- `POST /executions` (Judge0 proxy), `GET /search`
- `/admin/*` for role-protected content, user, and analytics operations
