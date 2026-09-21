# Student LMS (MERN)

A minimal MERN application for managing students, with sign up/sign in, a
course list, and per-course resource pages (slides, videos, docs, links).

## Stack

- **MongoDB** + Mongoose
- **Express** REST API (JWT auth)
- **React** (Vite) frontend with React Router

## Project structure

```
server/   Express API, MongoDB models, auth
client/   React frontend
```

## Setup

### 1. Backend

```bash
cd server
cp .env.example .env   # set MONGO_URI / JWT_SECRET as needed
npm install
npm run seed            # optional: seeds sample courses & resources
npm run dev              # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev              # starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000` (see
`client/vite.config.js`), so no CORS setup is needed in development.

## Features

- **Sign up / Sign in** — student accounts with hashed passwords (bcrypt)
  and JWT-based sessions stored in `localStorage`.
- **Courses page** (`/courses`) — lists all available courses, shows
  enrollment status, and lets a student enroll.
- **Course resources page** (`/courses/:id/resources`) — lists resources
  (slides, videos, documents, links) posted for a given course.

## API overview

| Method | Route                          | Description                         |
| ------ | ------------------------------ | ------------------------------------ |
| POST   | `/api/auth/signup`             | Create a student account             |
| POST   | `/api/auth/signin`             | Sign in and receive a JWT            |
| GET    | `/api/auth/me`                 | Get the current student (auth)       |
| GET    | `/api/courses`                 | List all courses (auth)              |
| GET    | `/api/courses/mine`            | List the student's enrolled courses  |
| POST   | `/api/courses/:id/enroll`      | Enroll the student in a course       |
| GET    | `/api/courses/:id/resources`   | List resources for a course (auth)   |

All `/api/courses` routes require an `Authorization: Bearer <token>` header.

## Deploying to the web

This repo is set up to deploy as three free-tier pieces: **MongoDB Atlas**
(database), **Render** (API), and **Vercel** (frontend). Repo files already
in place: `render.yaml` (API service config) and `client/vercel.json`
(SPA routing rewrite).

### 1. Database — MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/cloud/atlas/register.
2. Add a database user (username/password) and, under Network Access,
   allow access from anywhere (`0.0.0.0/0`) so Render can reach it.
3. Copy the connection string (Drivers → Node.js), e.g.
   `mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/lms`.

### 2. Backend — Render

1. Go to https://dashboard.render.com/ → **New** → **Blueprint**, and point
   it at this GitHub repo. Render will read `render.yaml` and create the
   `lms-server` web service (root dir `server/`, `npm install` / `npm start`).
2. Set the environment variables it asks for:
   - `MONGO_URI` — the Atlas connection string from step 1
   - `CLIENT_ORIGIN` — your Vercel URL once you have it, e.g.
     `https://your-app.vercel.app` (comma-separate multiple origins)
   - `JWT_SECRET` — Render can auto-generate this (already configured)
3. Deploy. Note the resulting API URL, e.g. `https://lms-server.onrender.com`.
4. Seed demo data once, from your machine, pointed at the live database:
   ```bash
   cd server
   MONGO_URI="<your Atlas URI>" npm run seed
   ```

### 3. Frontend — Vercel

1. Go to https://vercel.com/new and import this GitHub repo.
2. Set **Root Directory** to `client`.
3. Add an environment variable: `VITE_API_BASE_URL` =
   `https://lms-server.onrender.com/api` (use your actual Render URL).
4. Deploy. Vercel will build with `npm run build` and serve `dist/`
   automatically (framework preset "Vite").
5. Once you have the Vercel URL, go back to Render and update
   `CLIENT_ORIGIN` to match it exactly (no trailing slash), then redeploy
   the API so CORS allows requests from it.

After that, sign up on your live Vercel URL and it talks to the live
Render API and Atlas database.

### Alternative: single host / Docker

If you'd rather not split across three providers, the same `server/` and
`client/` folders work behind any Node host (a VPS, Railway, Fly.io,
etc.) — run the API as a normal Node process (`npm start`) with the same
env vars, `npm run build` the client and serve `client/dist/` as static
files (e.g. via Nginx or Express `express.static`), and point
`VITE_API_BASE_URL` at wherever the API ends up.
