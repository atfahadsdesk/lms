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
