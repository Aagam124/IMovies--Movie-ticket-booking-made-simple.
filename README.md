# iMovies — Movie Ticket Booking Made Simple

A complete MERN-stack movie ticket booking app built with **free and open-source tools only**.
It runs entirely on your computer: no paid APIs, no API keys, no cloud account, no real payments.

## Features

- Landing, register, login (show/hide password), logout; JWT in an **HTTP-only cookie**
- Movie catalogue with search, genre/language filters and pagination
- Movie details with rating, trailer link, favorites and reviews (create / edit / delete)
- Show selection by date and theatre, **live seat map**, server-side pricing
- Booking confirmation with a unique booking ID, booking history, cancellation (2-hour cut-off)
- **Demo payment** (simulated success or failure — no card data, no money)
- Admin: dashboard statistics, add/edit/delete movies, theatres and shows, booking management
- Role-based navigation, protected routes, centralized error handling, rate-limited auth

## Architecture

```
React (Vite, port 5173)  ──HTTP + cookie──▶  Express API (port 8000)  ──Mongoose──▶  MongoDB
```

- **Auth:** one `User` collection (role `user` | `admin`). The `Admin` model is a profile (permissions, display name) linked to an admin user, so there is a single login flow and password hash.
- **Seat inventory:** each show copies its theatre's layout and prices at creation. Seats are ids like `A1`.
- **No double booking:** a `SeatLock` collection has a **unique index on (show, seatId)**. Booking inserts one lock per seat; if any seat is taken the database rejects the insert, the attempt is rolled back and the API returns `409`. Unique indexes are atomic on every MongoDB deployment, so **no replica set or transactions are required** (a standalone local `mongod` works). `show.bookedSeats` mirrors the locks for fast seat-map reads.
- **Pricing:** totals are computed on the server from the show's section prices; any amount sent by the client is ignored.
- **Cancellation:** owners may cancel confirmed bookings until `CANCELLATION_CUTOFF_HOURS` (default 2) before the show; admins may always cancel. Seats are released and the demo payment is marked `refunded`.

## Folder structure

```
IMovies/
├── client/   React app (src/components, context, hooks, pages, services, utils, styles.css)
└── server/   config/ controllers/ middleware/ models/ routes/ services/ scripts/ tests/ utils/ app.js index.js
```

## Prerequisites

- Node.js 18+ (20 or 22 recommended) and npm
- MongoDB Community Edition running locally (or an Atlas free-tier cluster, optional)
- Git (optional)

### Install MongoDB Community Edition locally

- **Windows:** download the MSI from <https://www.mongodb.com/try/download/community>, choose "Complete", keep "Install MongoDB as a Service". It then listens on `127.0.0.1:27017`.
- **macOS:** `brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community`
- **Ubuntu/Debian:** follow the official guide at <https://www.mongodb.com/docs/manual/administration/install-on-linux/>, then `sudo systemctl start mongod`.
- Check it is running: `mongosh --eval "db.runCommand({ ping: 1 })"`.

### Optional: MongoDB Atlas (free tier)

Create a free cluster, add a database user, allow your IP, and put the connection string in `MONGO_URI`. Atlas free-tier limits and terms can change, so check Atlas's current pricing page. The app does not need Atlas; local MongoDB is the default.

## Environment variables

Copy the examples (never commit the real `.env` files):

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env      # optional; the default already matches
```

| Variable (server) | Meaning |
|---|---|
| `PORT` | API port (8000) |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/Imovies` |
| `JWT_SECRET` | **Required.** Long random string. Generate: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `CLIENT_URL` | Allowed browser origin(s), comma-separated (`http://localhost:5173`) |
| `NODE_ENV` | `development` or `production` (production makes the cookie `Secure`, so it needs HTTPS) |
| `CANCELLATION_CUTOFF_HOURS` | Optional, default 2 |

Client: `VITE_API_URL=http://localhost:8000/api`.

## Run it

Terminal 1 — backend:

```bash
cd server
npm install
npm run dev        # http://localhost:8000
```

Terminal 2 — frontend:

```bash
cd client
npm install
npm run dev        # http://localhost:5173
```

Health check: `GET http://localhost:8000/api/health` returns the real MongoDB state (`200` when connected, `503` with `"status":"degraded"` when not).

## Seed demo data

```bash
cd server
npm run seed
```

Creates 8 clearly labelled **fictional demo movies** (original titles, locally stored SVG posters), 2 theatres and shows for the next 7 days. It is idempotent: run it as often as you like, nothing is duplicated (new days get new shows).

## Create the first admin

Registration can never create an admin (a `role` in the request body is ignored). Create one explicitly on your machine:

```bash
cd server
npm run create-admin -- --username admin --email admin@example.com --password "StrongPass123"
```

Leave out `--password` to be prompted (note: the prompt is visible; CLI arguments can end up in shell history, so use a throw-away password locally). If the email already exists, that account is promoted to admin and its password is unchanged. Then log in at `/login`: admins land on `/admin`.

## API overview

All responses are JSON: `{ success, message?, data?, errors?, pagination? }`.

| Area | Endpoints |
|---|---|
| Health | `GET /api/health` |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` |
| Movies | `GET /api/movies` (`search`, `genre`, `language`, `page`, `limit`), `GET /api/movies/genres`, `GET /api/movies/:id`; admin: `POST`, `PUT /:id`, `DELETE /:id` |
| Theatres | `GET /api/theatres`, `GET /:id`; admin: `POST`, `PUT /:id`, `DELETE /:id` |
| Shows | `GET /api/shows`, `GET /api/shows/:id` (includes seat map), `GET /api/shows/movie/:movieId`; admin: `POST`, `PUT /:id`, `DELETE /:id` |
| Bookings (login) | `POST /api/bookings`, `GET /api/bookings/my`, `GET /api/bookings/:id`, `PATCH /api/bookings/:id/cancel`; admin: `GET /api/bookings/admin/all` |
| Favorites (login) | `GET /api/favorites`, `GET /api/favorites/ids`, `POST /api/favorites`, `DELETE /api/favorites/:movieId` |
| Reviews | `GET /api/reviews/movie/:movieId`, `GET /api/reviews/my`, `POST`, `PUT /:id` (owner), `DELETE /:id` (owner or admin) |
| Admin | `GET /api/admin/stats`, `GET /api/admin/users`, `GET /api/admin/bookings`, `PATCH /api/admin/bookings/:id/cancel` |

`POST /api/bookings` body: `{ "showId": "...", "seats": ["A1","A2"], "demoPaymentOutcome": "success" | "failure" }`. A simulated failure returns `402`, marks the booking `payment_failed`/`failed` and releases the seats.

## Tests

```bash
cd server && npm test            # unit + integration (Node's built-in test runner + Supertest)
cd client && npm test            # Vitest (validators/formatters)
cd client && npm run build       # production build check
```

Integration tests need a running MongoDB and create a throw-away database per test process (`imovies_test_<pid>`, dropped afterwards). Point them elsewhere with `MONGO_URI_TEST=mongodb://host:port` (base URI **without** a database name). If MongoDB is unreachable they report as *skipped*, never as passed. They cover registration/login, bcrypt hashing, protected and admin-only routes, movie/theatre/show CRUD, booking, duplicate-seat prevention (including 6 simultaneous requests for one seat), demo payment failure, cancellation and cut-off, favorites, reviews, and the MongoDB-down behaviour (`503`).

## Demo payment limitations

Payments are **simulated**. You choose "succeeds" or "fails" on the booking screen; no card details are collected, no payment provider is called and no money moves. "Refunds" on cancellation only change the stored `paymentStatus`. The "demo revenue" on the dashboard is the sum of simulated amounts.

## Troubleshooting

- **`JWT_SECRET is missing…` on start:** set a real value in `server/.env`.
- **`MongoDB connection failed … ECONNREFUSED`:** MongoDB isn't running or `MONGO_URI` is wrong. The API keeps retrying every 5 s and answers `503` meanwhile; `/api/health` shows the state.
- **Browser shows "Cannot reach the server":** start the backend, and make sure `VITE_API_URL` matches its port.
- **CORS / cookie not sent:** `CLIENT_URL` must exactly match the frontend origin (scheme, host and port). Use `localhost` for both, not a mix of `localhost` and `127.0.0.1`.
- **Logged in but immediately logged out in production:** the cookie is `Secure` when `NODE_ENV=production`, so serve over HTTPS.
- **Port already in use:** change `PORT` (and `VITE_API_URL`) or stop the other process.
- **Show times:** a show's date and time are interpreted in the server's time zone.
- **Posters:** posters use local SVG files; admin-added remote posters fall back to a local placeholder if they fail to load. Only use images you are allowed to use.


## MongoDB Atlas checklist
1. In Atlas, create a database user (this is separate from your Atlas website login).
2. Add your current IP address under **Network Access**; avoid `0.0.0.0/0` except for temporary testing.
3. Copy the Node.js connection string from **Connect → Drivers**.
4. Put it in `server/.env` as `MONGO_URI=...`, with `/imovies` as the database name. URL-encode special characters in the database password.
5. Keep `server/.env` private. Never paste the real connection string into public repositories or screenshots.
6. Start the backend and open `http://localhost:8000/api/health`. The endpoint must report the actual database state.

## Start both apps
Terminal 1: `cd server` → `npm install` → create `server/.env` from `.env.example` → `npm run dev`.
Terminal 2: `cd client` → `npm install` → create `client/.env` from `.env.example` if needed → `npm run dev`.
