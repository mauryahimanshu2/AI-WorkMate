# AI WorkMate

AI WorkMate is a full-stack AI content creation workspace. It combines a React single-page application with an Express API, MongoDB persistence, JWT authentication, Gemini-powered content generation, content revision history, and an administrator dashboard.

This repository contains both applications:

- `frontend/` — React, TypeScript, Redux Toolkit, Axios, and Vite
- `backend/` — Node.js, Express, TypeScript, MongoDB/Mongoose, JWT, and Google Gemini

## Features

### User workspace

- Account registration and sign-in
- Persistent authenticated sessions with automatic access-token refresh
- Single-page navigation with browser Back and Forward support
- Dashboard statistics and recent content
- AI content generation with configurable tone, language, audience, and length
- Content templates for email, social media, blogs, product descriptions, marketing copy, business proposals, job descriptions, meeting summaries, and custom content
- Searchable and filterable generation history
- Content editing, deletion, export, and revision history

### Administration

- Automatically seeded administrator account
- User search and filtering
- User detail and generation-history views
- Account activation and deactivation
- Administrator-only API authorization

### Backend and AI

- Access and refresh JWT token pair
- Refresh-token rotation and invalidation on logout
- Password hashing with bcrypt
- Request validation with Zod
- Per-user AI generation rate limiting
- Gemini request timeout and retry handling
- AI usage and token tracking
- Configurable input, output, retry, rate-limit, and cost settings

## Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Redux Toolkit, React Redux, Axios, Vite |
| Backend | Node.js, Express 5, TypeScript, Mongoose, Zod |
| Database | MongoDB |
| Authentication | JSON Web Tokens and bcrypt |
| AI provider | Google Gemini through `@google/genai` |

## Prerequisites

Install the following before starting the project:

- Node.js 20.19 or later
- npm
- MongoDB, either locally or through MongoDB Atlas
- A Google Gemini API key

## Project structure

```text
AI-WorkMate/
├── frontend/
│   ├── src/
│   │   ├── admin/          # Administrator dashboard
│   │   ├── auth/           # Registration, sign-in, and session services
│   │   ├── content/        # Content studio, history, editor, and API services
│   │   ├── dashboard/      # User dashboard and workspace shell
│   │   ├── landing/        # Public landing page
│   │   ├── routing/        # Client-side SPA navigation
│   │   ├── services/       # Shared Axios API client
│   │   └── store/          # Redux store
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── ai/             # AI provider interface and Gemini integration
│   │   ├── config/         # Database and CORS configuration
│   │   └── modules/
│   │       ├── admin/      # User administration API
│   │       ├── aiContent/  # Generation, history, prompts, and usage tracking
│   │       └── auth/       # Users, tokens, middleware, and admin seeding
│   ├── .env.example
│   └── package.json
└── README.md
```

## Installation

Clone the repository and install the dependencies for both applications:

```bash
git clone <repository-url>
cd AI-WorkMate

cd backend
npm install

cd ../frontend
npm install
```

## Environment configuration

Never commit real secrets. The repository ignores `.env` files and includes safe `.env.example` templates.

### Backend environment

Create `backend/.env` by copying `backend/.env.example`:

```bash
cd backend
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure these values:

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `NODE_ENV` | No | Runtime environment label | `development` |
| `PORT` | No | Backend HTTP port; defaults to 5000 | `5000` |
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb://127.0.0.1:27017/ai-workmate` |
| `CORS_ORIGIN` | Yes | Exact frontend origin allowed by CORS | `http://localhost:5173` |
| `JWT_SECRET` | Yes | Long random access-token secret | A unique random string |
| `JWT_REFRESH_SECRET` | Yes | Separate long random refresh-token secret | A different random string |
| `JWT_ACCESS_EXPIRES_IN` | Yes | Access-token lifetime | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Yes | Refresh-token lifetime | `7d` |
| `ADMIN_NAME` | Yes | Seeded administrator name | `System Admin` |
| `ADMIN_EMAIL` | Yes | Seeded administrator email | `admin@example.com` |
| `ADMIN_PASSWORD` | Yes | Administrator password, minimum 8 characters | Use a strong password |
| `AI_PROVIDER` | No | AI provider identifier; defaults to and currently supports `gemini` | `gemini` |
| `GEMINI_API_KEY` | Yes | Google Gemini API key | Your API key |
| `AI_MODEL` | Yes | Gemini model used for generation | `gemini-3.5-flash-lite` |
| `AI_TIMEOUT_MS` | No | AI request timeout in milliseconds | `60000` |
| `AI_RETRY_ATTEMPTS` | No | AI request attempts, capped at 5 | `3` |
| `AI_MAX_INPUT_LENGTH` | No | Maximum combined request input length | `5000` |
| `AI_MAX_OUTPUT_TOKENS` | No | Maximum generated output tokens | `4000` |
| `AI_RATE_LIMIT` | No | AI generation requests allowed per user every 24 hours | `10` |
| `AI_INPUT_COST_PER_1M_TOKENS` | No | Optional input-token cost used for usage calculations | `0` |
| `AI_OUTPUT_COST_PER_1M_TOKENS` | No | Optional output-token cost used for usage calculations | `0` |

The backend seeds or updates the administrator during startup. Changing the configured administrator password invalidates that administrator's existing sessions.

### Frontend environment

Create `frontend/.env` from `frontend/.env.example`:

```bash
cd frontend
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

The frontend uses one environment variable:

| Variable | Description | Development value |
| --- | --- | --- |
| `VITE_API_URL` | API base path or complete deployed API URL | `/api` |

During development, Vite proxies `/api` requests to `http://localhost:5000`. For separate production hosts, set `VITE_API_URL` to the public backend API URL and set `CORS_ORIGIN` to the exact public frontend origin.

## Running locally

Start MongoDB first, then open two terminals from the repository root.

Terminal 1 — backend:

```bash
cd backend
npm run dev
```

Terminal 2 — frontend:

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The API runs at [http://localhost:5000](http://localhost:5000), and its health endpoint is [http://localhost:5000/api/health](http://localhost:5000/api/health).

Interactive Swagger documentation is available at [http://localhost:5000/api/docs/](http://localhost:5000/api/docs/). The canonical OpenAPI 3.1 document is stored in `backend/docs/openapi.json` and served at `/api/docs/openapi.json`.

## Available scripts

### Frontend

Run these commands from `frontend/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 5173 |
| `npm run typecheck` | Run TypeScript validation |
| `npm run build` | Type-check and create the production bundle in `frontend/dist` |
| `npm run preview` | Preview the production frontend locally |

### Backend

Run these commands from `backend/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API in watch mode |
| `npm run typecheck` | Run TypeScript validation without creating output |
| `npm run build` | Compile TypeScript into `backend/dist` |
| `npm start` | Run the compiled backend from `backend/dist/app.js` |

## Frontend routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/signup` | Public | Account registration |
| `/signin` | Public | Account sign-in |
| `/dashboard` | Authenticated | User overview and recent content |
| `/studio` | Authenticated | AI content generation studio |
| `/content` | Authenticated | Searchable content history |
| `/content/:id` | Authenticated | Content editor and revision history |
| `/admin` | Administrator | User administration dashboard |

The frontend is a single-page application. In production, configure the web server to return `frontend/dist/index.html` for unknown non-API routes so that direct visits to routes such as `/dashboard` continue to work.

## API overview

All protected requests require this header:

```http
Authorization: Bearer <access-token>
```

API responses use a consistent shape:

```json
{
  "success": true,
  "message": "Request completed",
  "data": {}
}
```

### Health

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | Confirm that the API is running |

### Authentication

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/signup` | Public | Create a user account |
| `POST` | `/api/auth/login` | Public | Authenticate and receive access and refresh tokens |
| `POST` | `/api/auth/refresh-token` | Public | Rotate a valid refresh token and issue a new token pair |
| `POST` | `/api/auth/logout` | Authenticated | Invalidate the current session |

Registration requires `name`, `email`, and `password`. Names must contain 2–100 characters, and passwords must contain at least 8 characters.

### AI content

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/ai-content/content-types` | Public | List supported content types |
| `GET` | `/api/ai-content/options` | Public | List tones, languages, platforms, and form options |
| `POST` | `/api/ai-content/generate` | Authenticated | Generate and save AI content |
| `GET` | `/api/ai-content/history` | Authenticated | Return the current user's paginated history |
| `GET` | `/api/ai-content/:generationId` | Authenticated | Return one generation owned by the current user |
| `GET` | `/api/ai-content/:generationId/revisions` | Authenticated | Return revision history |
| `PATCH` | `/api/ai-content/:generationId` | Authenticated | Update a title or generated content |
| `DELETE` | `/api/ai-content/:generationId` | Authenticated | Delete generated content |

The history endpoint accepts `page`, `limit`, `contentType`, `status`, and `search` query parameters. `limit` may be between 1 and 100.

Example generation request:

```json
{
  "contentType": "professional_email",
  "topic": "Project status update",
  "description": "Write a concise weekly update covering progress, risks, and next steps.",
  "targetAudience": "Project stakeholders",
  "tone": "professional",
  "language": "English",
  "wordCount": 300,
  "keywords": ["progress", "risks", "next steps"],
  "recipient": "Stakeholder team",
  "callToAction": "Reply with questions before Friday"
}
```

### Administration

All administration endpoints require an authenticated user with the `admin` role.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/admin/users` | List and filter users |
| `GET` | `/api/admin/users/:userId` | Return user details |
| `PATCH` | `/api/admin/users/:userId/status` | Activate or deactivate a user |
| `GET` | `/api/admin/users/:userId/history` | Return a user's generation history |

## Production build

Build both applications:

```bash
cd backend
npm run build

cd ../frontend
npm run build
```

Start the compiled backend:

```bash
cd backend
npm start
```

Serve the contents of `frontend/dist` with a static web server or hosting platform. Configure these production requirements:

1. Send all `/api` traffic to the Express backend, or use the full backend URL in `VITE_API_URL`.
2. Fall back to `index.html` for frontend routes.
3. Use HTTPS for both applications.
4. Set `CORS_ORIGIN` to the exact frontend origin.
5. Use production MongoDB credentials and strong, unique JWT secrets.

## Security notes

- Do not commit `.env` files, database credentials, JWT secrets, administrator credentials, or Gemini API keys.
- Use different values for `JWT_SECRET` and `JWT_REFRESH_SECRET`.
- Generate long random JWT secrets for production.
- Restrict MongoDB network access and use a database user with only the necessary permissions.
- Rotate any credential immediately if it is accidentally exposed.
- The frontend stores the active session in browser local storage. Treat any untrusted frontend script as a security risk and maintain a restrictive deployment policy.

## Troubleshooting

### Backend does not start

- Confirm that `backend/.env` exists.
- Confirm that `MONGODB_URI`, `CORS_ORIGIN`, all administrator variables, JWT secrets, `GEMINI_API_KEY`, and `AI_MODEL` are populated.
- Make sure MongoDB is running and reachable.
- Make sure port 5000 is not already in use.

### Frontend cannot reach the API

- Confirm that the backend is running on port 5000.
- Keep `VITE_API_URL=/api` during normal local development.
- Confirm that `CORS_ORIGIN=http://localhost:5173` in `backend/.env`.
- Restart Vite after changing `frontend/.env` because Vite reads environment variables at startup.

### Sign-in redirects back to the sign-in page

- Check that the access and refresh JWT secrets are configured.
- Confirm that the user is active.
- If administrator credentials were changed, sign in again because existing administrator tokens are invalidated.
- Clear old browser storage if tokens were created with previous JWT secrets.

### AI generation fails

- Verify `GEMINI_API_KEY` and `AI_MODEL`.
- Confirm that the Gemini account has access to the configured model.
- Check the backend console for timeout, quota, rate-limit, or provider errors.
- Increase `AI_TIMEOUT_MS` only if the provider regularly needs more time.

## Validation

Before committing changes, run:

```bash
cd backend
npm run typecheck
npm run build

cd ../frontend
npm run typecheck
npm run build
```

The repository currently does not define an automated test script, so TypeScript validation and production builds are the baseline project checks.

