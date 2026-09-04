# FarmFlow

FarmFlow is a small, production-quality full-stack web application for
tracking farm crops, livestock, and daily tasks. It exists primarily as a
**hands-on learning project** for full-stack development, deployment, and
— above all — technical and on-page SEO for a React single-page
application. See [`SEO.md`](./SEO.md) for the dedicated SEO deep-dive.

This is deliberately **not** a large commercial farm platform. It's small
enough to read end to end in an afternoon while still being wired up the
way a real production app would be: real auth, a real database, real
error handling, and real SEO mechanics.

---

## 1. Architecture overview

```
Browser
  │
  ├── Public pages (/, /about, /features, /crop-management, ...)
  │     Server-rendered-looking, but actually a client-rendered React
  │     SPA. See SEO.md for what that means for crawlability.
  │
  └── Private app (/login, /dashboard, /crops, /livestock, /tasks, ...)
        Client-rendered, auth-gated, noindex.

Frontend (React + Vite)  ──REST/JSON, JWT in Authorization header──▶  Backend (Flask)
                                                                          │
                                                                          ▼
                                                                     MongoDB
                                                              (users, crops,
                                                               livestock, tasks)
```

The frontend and backend are two independent projects (`frontend/` and
`backend/`) that only communicate over HTTP. Either can be deployed to a
different host, and neither imports code from the other.

---

## 2. Technology stack

**Frontend:** React 18, Vite 5, React Router 6, plain CSS (no CSS
framework), no state-management library beyond React context.

**Backend:** Python 3, Flask 3, Flask-CORS, PyJWT, bcrypt, pymongo
(direct MongoDB driver — no ODM, to keep the data layer easy to read).

**Database:** MongoDB (local `mongod`, Docker, or MongoDB Atlas).

---

## 3. Project structure

```
FarmFlow/
├── frontend/
│   ├── public/                # static assets; robots.txt & sitemap.xml
│   │                            are GENERATED here, not hand-written
│   ├── scripts/
│   │   └── generate-seo-files.mjs   # builds robots.txt + sitemap.xml
│   ├── src/
│   │   ├── components/        # SEO, Breadcrumbs, Header, Footer, ProtectedRoute
│   │   ├── context/           # AuthContext (JWT session state)
│   │   ├── hooks/             # useSEO
│   │   ├── layouts/           # PublicLayout, AppLayout
│   │   ├── pages/             # one file per route
│   │   ├── services/          # api.js (fetch wrapper)
│   │   ├── utils/             # seoConfig.js, headTags.js
│   │   ├── App.jsx            # route table
│   │   └── main.jsx           # entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── routes/                 # auth.py, crops.py, livestock.py, tasks.py
│   ├── services/
│   │   └── db.py               # MongoDB connection + indexes
│   ├── models/
│   │   └── serializers.py      # Mongo doc <-> JSON helpers
│   ├── utils/
│   │   └── auth.py             # password hashing, JWT, @require_auth
│   ├── app.py                  # Flask app, blueprint registration
│   ├── config.py               # env-driven configuration
│   ├── requirements.txt
│   └── .env.example
│
├── README.md
├── SEO.md
└── .gitignore
```

---

## 4. Prerequisites

- **Node.js** 18 or newer (for the Vite frontend)
- **Python** 3.10 or newer (for the Flask backend)
- **MongoDB** — any one of:
  - a local `mongod` instance (default: `mongodb://localhost:27017`)
  - MongoDB running in Docker
  - a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

---

## 5. Installation

### 5.1 Clone and install dependencies

```bash
git clone <your-repo-url> FarmFlow
cd FarmFlow

# Backend
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Frontend (in a second terminal)
cd ../frontend
npm install
```

### 5.2 Configure environment variables

Both `backend/` and `frontend/` ship a `.env.example`. Copy each to `.env`
and fill in real values — **never commit the real `.env` files**.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

`backend/.env`:

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string. Local: `mongodb://localhost:27017/farmflow`. Atlas: `mongodb+srv://...` |
| `JWT_SECRET` | Random secret used to sign session tokens. Generate one with `python -c "import secrets; print(secrets.token_hex(32))"` |
| `JWT_EXPIRES_HOURS` | How long a login session lasts |
| `CORS_ORIGINS` | Comma-separated list of allowed frontend origins |
| `FLASK_ENV` | `development` or `production` |
| `PORT` | Port the Flask server listens on |

`frontend/.env`:

| Variable | Purpose |
|---|---|
| `VITE_SITE_URL` | The canonical public URL of the site. Drives canonical tags, Open Graph URLs, robots.txt, and sitemap.xml. Use `http://localhost:5173` in dev. |
| `VITE_API_URL` | Base URL of the backend API |

### 5.3 MongoDB setup

**Local MongoDB:**

```bash
# macOS (Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian — see https://www.mongodb.com/docs/manual/administration/install-on-linux/

# Docker (any OS)
docker run -d -p 27017:27017 --name farmflow-mongo mongo:7
```

No manual database or collection creation is required — MongoDB creates
the `farmflow` database and its collections (`users`, `crops`,
`livestock`, `tasks`) automatically the first time a document is written.
The backend also creates indexes (`services/db.py: init_indexes()`) on
startup.

**MongoDB Atlas (cloud, free tier):**

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Add your IP (or `0.0.0.0/0` for local development only) under Network Access.
3. Create a database user under Database Access.
4. Copy the connection string into `backend/.env` as `MONGO_URI`, replacing
   `<password>` and adding `/farmflow` before the query string, e.g.:
   `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/farmflow?retryWrites=true&w=majority`

---

## 6. Running locally

Two terminals:

```bash
# Terminal 1 — backend
cd backend
source .venv/bin/activate
python app.py
# → running on http://localhost:5000

# Terminal 2 — frontend
cd frontend
npm run dev
# → running on http://localhost:5173
```

`npm run dev` automatically regenerates `public/robots.txt` and
`public/sitemap.xml` from `VITE_SITE_URL` before starting Vite (see
`scripts/generate-seo-files.mjs`).

Open `http://localhost:5173`. Create an account from `/login` (use the
"Create account" toggle), then explore `/dashboard`, `/crops`,
`/livestock`, and `/tasks`.

---

## 7. Production build

```bash
cd frontend
npm run build      # outputs to frontend/dist/, regenerates SEO files first
npm run preview    # serve the production build locally to sanity-check it
```

For the backend, run behind a production WSGI server rather than the
Flask dev server, e.g.:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

Set `FLASK_ENV=production` in `backend/.env` for production deployments.

---

## 8. API documentation

All endpoints return JSON. Protected endpoints require
`Authorization: Bearer <token>`.

### Auth

| Method | Path | Auth | Body |
|---|---|---|---|
| POST | `/api/auth/register` | – | `{ name, email, password }` |
| POST | `/api/auth/login` | – | `{ email, password }` |
| POST | `/api/auth/logout` | – | – |
| GET | `/api/auth/me` | ✓ | – |

### Crops / Livestock / Tasks

Each resource follows the same REST shape (shown for crops; livestock and
tasks are identical in shape with their own fields):

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/crops` | ✓ | List the current user's crops |
| POST | `/api/crops` | ✓ | Create a crop |
| GET | `/api/crops/<id>` | ✓ | Fetch one crop |
| PUT | `/api/crops/<id>` | ✓ | Update a crop |
| DELETE | `/api/crops/<id>` | ✓ | Delete a crop |

Tasks additionally expose `PATCH /api/tasks/<id>/complete` as a
convenience for the "mark complete" UI action.

All list/detail/update/delete operations are scoped to the authenticated
user — one account can never read or modify another account's records.

**Field reference:**

- **Crop:** `name`, `type`, `area` (number), `planting_date`,
  `expected_harvest_date`, `status` (`planned` | `planted` | `growing` | `harvested`)
- **Livestock:** `identifier`, `species`, `breed`, `age` (number),
  `status` (`healthy` | `sick` | `pregnant` | `sold` | `deceased`)
- **Task:** `title`, `description`, `due_date`, `status`
  (`pending` | `in_progress` | `complete`)

Validation errors return `400` with a body like:
`{ "error": "Validation failed", "fields": { "name": "This field is required" } }`

---

## 9. Authentication

- Passwords are hashed with **bcrypt** before storage — plaintext
  passwords are never written to the database.
- A successful login/register returns a **JWT** signed with `JWT_SECRET`.
  The frontend stores it in `localStorage` and sends it as
  `Authorization: Bearer <token>` on every private API call.
- The `@require_auth` decorator (`backend/utils/auth.py`) protects every
  crop/livestock/task route and `/api/auth/me`.
- **Security note:** storing a JWT in `localStorage` is convenient for a
  small learning project but is readable by any JavaScript running on the
  page (an XSS risk). A production system handling sensitive data would
  typically use an httpOnly, secure cookie instead. This trade-off is
  intentional here for simplicity — see it as a discussion point, not a
  best practice to copy blindly.

---

## 10. SEO architecture (summary)

FarmFlow's public pages are indexable; its private application pages are
not. This is implemented with several complementary mechanisms — robots.txt,
per-page `<meta name="robots">`, canonical URLs, and a generated sitemap.
**Read [`SEO.md`](./SEO.md) for the full explanation of each mechanism,
why it exists, and how to test it** — that file is the actual learning
reference for this project.

---

## 11. Deployment

The frontend and backend deploy independently.

**Frontend (static hosting — Netlify, Vercel, Cloudflare Pages, etc.):**

1. Build command: `npm run build`. Output directory: `dist`.
2. Set `VITE_SITE_URL` and `VITE_API_URL` as environment variables on the
   host, pointing at your real production domain and deployed API.
3. **SPA fallback is required.** Because React Router handles routes like
   `/crop-management` client-side, the host must serve `index.html` for
   any path that doesn't match a real static file, or a direct visit to
   `https://yoursite.com/crop-management` will 404 at the server level.
   - **Netlify:** add a `frontend/public/_redirects` file containing
     `/*  /index.html  200`
   - **Vercel:** add a `frontend/vercel.json` with a rewrite:
     `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
   - Most static hosts have an equivalent "SPA fallback" or "rewrite all
     routes to index.html" setting.

**Backend (Render, Railway, Fly.io, a VPS, etc.):**

1. Set `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGINS` (your deployed frontend
   URL), and `FLASK_ENV=production` as environment variables.
2. Run with a production WSGI server (`gunicorn app:app`), not
   `python app.py`.
3. Make sure `CORS_ORIGINS` matches your deployed frontend's exact origin
   (including protocol) or browser requests will be blocked.

---

## 12. Troubleshooting

| Symptom | Likely cause |
|---|---|
| Backend crashes on startup with a MongoDB connection error | MongoDB isn't running, or `MONGO_URI` is wrong. See §5.3. |
| Frontend requests fail with a CORS error in the browser console | `CORS_ORIGINS` in `backend/.env` doesn't include the frontend's origin. |
| 401 on every private API call | Token expired (`JWT_EXPIRES_HOURS`) or missing — log in again. |
| Direct visit to `/about` works locally but 404s in production | SPA fallback isn't configured on the host — see §11. |
| `robots.txt`/`sitemap.xml` show `localhost` in production | `VITE_SITE_URL` wasn't set as a build-time environment variable on the host. |

---

## 13. License

This is a personal learning project. No license is specified — treat it
as source-available reference code rather than a package intended for
reuse as-is.
