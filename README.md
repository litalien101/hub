# Guardian Hub — TEST_V1 (Stabilized)

This project is a **Next.js (App Router)** internal hub + task system with:
- **Contributor hub** at `/hub`
- **Admin kanban console** at `/admin` (drag & drop between columns)
- **NextAuth** authentication
- **Prisma + SQLite** database
- **Subtasks + activity timeline** (admin inspector panel)

---

## 1) Install

```bash
npm install
```

---

## 2) Environment

Create `.env`:

```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-me"
```

If you use an external IdP (Authentik), ensure your provider config matches your deployment URLs.

---

## 3) Database (Prisma)

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

> If you ever change `prisma/schema.prisma`, you **must** re-run `npx prisma generate`.
> Many TypeScript errors like “Property X does not exist on PrismaClient” happen when the client wasn’t regenerated.

---

## 4) Run

```bash
npm run dev
```

Open:
- http://localhost:3000/hub
- http://localhost:3000/admin

---

## API Endpoints (high level)

- `GET /api/admin/tasks` — admin: fetch all tasks
- `PATCH /api/tasks/:taskId/status` — update status + write activity
- `POST /api/tasks/:taskId/subtasks` — add a subtask
- `PATCH /api/subtasks/:subtaskId` — toggle subtask done

---

## Project Structure

- `app/(app)/hub/*` — contributor dashboard
- `app/(app)/admin/*` — admin console
- `app/api/*` — API routes (Next.js route handlers)
- `src/ui/*` — shared UI primitives (providers, shell, etc.)
- `prisma/*` — schema + seed

---

## Notes

- This repo defaults to **light theme** with a dark-mode toggle (ThemeProvider).
- The admin kanban uses **native HTML5 drag & drop** to avoid heavy dependencies.
