# Expense Manager (Next.js + shadcn/ui + Express + MongoDB)

Minimal, clean expense management app.

## Project structure

```
/run/media/wadi1/Projects/TEST_API/
├── backend/         # Express API (TypeScript)
└── frontend/        # Next.js web app (TypeScript)
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB running locally on mongodb://127.0.0.1:27017

## Backend (API)

Env vars in `backend/.env`:

```
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/expense_db
FRONTEND_ORIGIN=http://localhost:3000
JWT_SECRET=replace_with_a_long_random_string
```

Install, build, start:

```
cd /run/media/wadi1/Projects/TEST_API/backend
npm install
npm run build
npm start
```

Health: GET http://localhost:4000/health

Auth endpoints:

- POST /api/auth/register { email, password }
- POST /api/auth/login { email, password }

Expenses endpoints are JWT-protected with `Authorization: Bearer <token>`

## Frontend (Web)

Env in `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Run dev:

```
cd /run/media/wadi1/Projects/TEST_API/frontend
npm install
npm run dev
```

Open http://localhost:3000

- Pages: `/login`, `/register`
- After login/register, token is stored in `localStorage` and used automatically.

## Features

- List/add/edit/delete expenses (per-user)
- Clean UI with shadcn/ui and sonner toasts
- Zod validation on API, JWT auth
