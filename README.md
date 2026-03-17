# GeoTracker

GeoTracker is a full-stack IP geolocation app with a React frontend and a Laravel backend.

The backend now uses Laravel 12 with session authentication via Sanctum (cookie + CSRF flow), not JWT.

## Current Architecture

- Frontend: React (Create React App), React Router, Axios, Tailwind CSS
- Backend: Laravel 12, Sanctum, Eloquent, MySQL/PostgreSQL/SQLite via Laravel config
- External data source: ipinfo.io (queried from the frontend)
- Deployment: Railway config points to the Laravel Dockerfile and startup script

## Features

- Login/logout using Laravel session auth
- Authenticated session check via `/api/me`
- IP lookup for IPv4 and IPv6
- Interactive OpenStreetMap embed for searched IPs
- Local in-app search history management (client-side)

## Repository Layout

```text
JLabs3/
|- backend/
|  |- laravel-backend/       # Laravel application (API + auth)
|- frontend/                 # React client
|- railway.toml              # Railway root deploy config
```

## Backend Endpoints

- `GET /sanctum/csrf-cookie`
  - Initializes CSRF cookie for session auth requests.
- `POST /api/login`
  - Logs in with email/password and creates a session.
- `POST /api/logout`
  - Logs out and invalidates session.
- `GET /api/me`
  - Returns authenticated user data (protected by `auth:sanctum`).

## Local Development

## Prerequisites

- PHP 8.4+
- Composer
- Node.js 18+
- npm
- A database supported by Laravel (SQLite, MySQL, or PostgreSQL)

## 1) Backend setup (Laravel)

```bash
cd backend/laravel-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

Backend default URL: `http://localhost:8000`

## 2) Frontend setup (React)

```bash
cd frontend
npm install
npm start
```

Frontend default URL: `http://localhost:3000`

## 3) Frontend API base URL

The frontend uses `REACT_APP_API_URL`.

- If unset, it defaults to `http://localhost:8000`.
- To override, create `frontend/.env`:

```bash
REACT_APP_API_URL=http://localhost:8000
```

## 4) CORS and credentials

This project uses cookie-based auth across frontend/backend origins.

- Backend CORS allows credentials.
- Set backend `.env` origins explicitly:

```bash
FRONTEND_ORIGINS=http://localhost:3000,https://geo-tracker-eight-blond.vercel.app
FRONTEND_ORIGIN_PATTERNS=
```

- `FRONTEND_ORIGINS` is a comma-separated allowlist.
- `FRONTEND_ORIGIN_PATTERNS` is optional for regex patterns (for example Vercel previews).
- `FRONTEND_ORIGIN` is still supported as a backward-compatible fallback.
- Make sure browser requests send credentials (already enabled in frontend Axios client).

## Demo User

The Laravel seeder creates a default user:

- Email: `test@example.com`
- Password: `password123`

## Deployment Notes

- Root `railway.toml` builds from `backend/laravel-backend/Dockerfile`.
- Start command is `/usr/local/bin/start.sh`.
- Health check path is `/up`.

## Notes

- Geolocation data is fetched from `https://ipinfo.io` in the frontend.
- Search history is currently stored in client state (not persisted in backend).

## License

Project license remains as configured in the repository.
