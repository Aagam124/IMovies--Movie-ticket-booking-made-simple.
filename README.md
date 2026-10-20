# iMovies — Movie Ticket Booking Made Simple

A full-stack movie ticket booking application built with the **MERN stack (MongoDB, Express.js, React, and Node.js)**. iMovies provides a complete movie discovery and booking experience, including seat selection, simulated payments, booking management, reviews, favorites, and an administrative dashboard.

Designed to run locally using free and open-source tools, the application requires no paid APIs, external payment gateways, or mandatory cloud services.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Configuration](#environment-configuration)
- [Database Seeding](#database-seeding)
- [Admin Account Setup](#admin-account-setup)
- [API Reference](#api-reference)
- [Security and Data Integrity](#security-and-data-integrity)
- [Testing](#testing)
- [Demo Payment Disclaimer](#demo-payment-disclaimer)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Overview

iMovies simplifies the movie ticket booking process through an intuitive interface and a structured backend architecture. Users can explore movies, discover available shows, select seats, simulate a payment, and manage their bookings. Administrators can manage movies, theatres, shows, users, and bookings through dedicated controls.

The project emphasizes secure authentication, role-based authorization, server-side validation, and reliable seat inventory management.

**Project highlights**

- Complete movie discovery and booking workflow.
- Separate user and administrator experiences.
- Real-time seat availability based on persisted booking locks.
- Server-side pricing and duplicate-seat prevention.
- Local-first development with MongoDB Community Edition.
- Automated tests for core application workflows.

## Key Features

### User Experience

- User registration, login, and logout.
- Show/hide password functionality.
- Movie catalogue with search, genre and language filters, and pagination.
- Detailed movie pages with ratings and trailer links.
- Favorites and movie reviews with create, edit, and delete operations.
- Show selection by date and theatre.
- Interactive seat map with availability indicators.
- Booking confirmation with a unique booking identifier.
- Booking history and cancellation eligibility checks.
- Simulated payment success and failure scenarios.

### Administration

- Dashboard with booking and revenue statistics.
- Movie creation, editing, and deletion.
- Theatre and show management.
- Booking overview and administrative cancellation.
- Role-based access to administrative functionality.
- Dedicated admin account creation through a server-side command.

### Reliability and Security

- JWT authentication stored in an HTTP-only cookie.
- Password hashing with bcrypt.
- Protected API routes and role-based authorization.
- Centralized error handling and authentication rate limiting.
- Server-side price calculation.
- Atomic unique database constraints for seat locking.
- Booking cancellation with a configurable cutoff period.
- Integration tests for concurrent booking attempts and important failure scenarios.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, HTTP-only cookies, bcrypt |
| API communication | HTTP, JSON, cookie-based authentication |
| Testing | Node.js test runner, Supertest, Vitest |
| Development tools | npm, Git, VS Code |

The application is designed to work with a locally running MongoDB instance. MongoDB Atlas can optionally be used as an alternative database host.

## System Architecture

```text
┌─────────────────────────────┐
│       React Frontend        │
│       Vite :5173            │
└──────────────┬──────────────┘
               │
               │ HTTP + Cookies
               ▼
┌─────────────────────────────┐
│      Express REST API       │
│         Port 8000            │
│                             │
│ Authentication & Validation│
│ Movies, Shows & Theatres    │
│ Bookings & Seat Locks       │
│ Reviews, Favorites & Admin  │
└──────────────┬──────────────┘
               │
               │ Mongoose
               ▼
┌─────────────────────────────┐
│          MongoDB            │
│                             │
│ Users, Movies, Shows        │
│ Theatres, Bookings          │
│ Seat Locks & Reviews        │
└─────────────────────────────┘
```

### Architectural Highlights

- **Single user identity model:** Users and administrators share the same authentication flow. Administrative profiles reference users with the `admin` role.
- **Seat inventory:** Each show stores a snapshot of its theatre's seat layout and pricing.
- **Duplicate-booking protection:** A unique compound index on `(show, seatId)` prevents two bookings from locking the same seat.
- **Server-authoritative pricing:** The backend calculates booking totals using the selected show's configured prices.
- **Cancellation handling:** Eligible cancellations release seat locks and update the simulated payment status.

## Project Structure

```text
IMovies/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── styles.css
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   ├── tests/
│   ├── utils/
│   ├── app.js
│   ├── index.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

The exact files may vary as the project evolves.

## Prerequisites

Install the following software before running the application:

- [Node.js](https://nodejs.org/) — version 18 or later; Node.js 20 or 22 is recommended.
- npm — included with Node.js.
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community) — for local database operation.
- [Git](https://git-scm.com/) — optional for running the application, required for version control.

Verify your Node.js and npm installations:

```bash
node --version
npm --version
```

Verify that MongoDB is accessible:

```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

A successful ping indicates that MongoDB is responding.

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Aagam124/IMovies---Movie-ticket-booking-made-simple..git
cd IMovies---Movie-ticket-booking-made-simple..
```

If you already have the project on your computer, open its existing folder instead.

### 2. Configure the Backend

Open a terminal in the project root:

```bash
cd server
npm install
```

Create the backend environment file.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS/Linux:**

```bash
cp .env.example .env
```

Edit `server/.env` and configure the required variables as described in the next section.

### 3. Configure the Frontend

Open a second terminal from the project root:

```bash
cd client
npm install
```

Optionally create the frontend environment file.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS/Linux:**

```bash
cp .env.example .env
```

The default frontend API URL is `http://localhost:8000/api`.

### 4. Start the Backend

In the backend terminal:

```bash
cd server
npm run dev
```

The API runs at:

`http://localhost:8000`

### 5. Start the Frontend

In a separate terminal:

```bash
cd client
npm run dev
```

The frontend runs at:

`http://localhost:5173`

Open the frontend URL in your browser to use iMovies.

### 6. Verify the Backend

Visit the health endpoint:

`http://localhost:8000/api/health`

The endpoint reports the actual database connection state. A healthy response returns HTTP `200`; a degraded database connection returns HTTP `503`.

## Environment Configuration

### Backend — `server/.env`

| Variable | Purpose | Example |
|---|---|---|
| `PORT` | Backend server port | `8000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/Imovies` |
| `JWT_SECRET` | Secret used to sign JWTs | Generate a random secret |
| `CLIENT_URL` | Allowed frontend origin | `http://localhost:5173` |
| `NODE_ENV` | Runtime environment | `development` |
| `CANCELLATION_CUTOFF_HOURS` | Cancellation cutoff before a show | `2` |

Generate a random JWT secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Copy the generated value into `JWT_SECRET` in `server/.env`.

### Frontend — `client/.env`

```env
VITE_API_URL=http://localhost:8000/api
```

The frontend environment file is optional when the application already uses this default.

**Important:** Never commit actual `.env` files, passwords, JWT secrets, database credentials, or API tokens to a public repository. Commit only the corresponding `.env.example` templates with placeholder values.

## Database Seeding

The project includes a seed script for generating demo data.

Run the following command from the backend directory:

```bash
cd server
npm run seed
```

The script creates eight fictional demo movies, two theatres, and shows for the next seven days. It is designed to be idempotent so that repeated runs do not duplicate existing demo records.

Ensure MongoDB is running and the backend environment is configured before seeding.

## Admin Account Setup

Public registration cannot create an administrator account. Create the first admin explicitly from the backend terminal:

```bash
cd server
npm run create-admin -- --username admin --email admin@example.com
```

Follow the CLI prompt if it requests a password.

Alternatively, the script supports a password argument:

```bash
npm run create-admin -- --username admin --email admin@example.com --password "StrongPass123"
```

Use a strong, unique local password. Be aware that command-line passwords may be retained in terminal history or visible to local process-inspection tools. The interactive prompt is preferable when available.

If the email already exists, the script promotes that account according to its documented behavior; an existing password remains unchanged.

Log in through the regular login page. Users with the admin role are redirected to the administrative dashboard.

## API Reference

All API responses use JSON. The common response format is:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Optional fields may include `errors` and `pagination`, depending on the endpoint.

| Module | Endpoint | Description |
|---|---|---|
| Health | `GET /api/health` | API and database health |
| Authentication | `POST /api/auth/register` | Register a user |
| Authentication | `POST /api/auth/login` | Authenticate a user |
| Authentication | `POST /api/auth/logout` | Log out |
| Authentication | `GET /api/auth/me` | Retrieve the current user |
| Movies | `GET /api/movies` | Search and paginate movies |
| Movies | `GET /api/movies/genres` | Retrieve available genres |
| Movies | `GET /api/movies/:id` | Retrieve movie details |
| Theatres | `GET /api/theatres` | List theatres |
| Theatres | `GET /api/theatres/:id` | Retrieve theatre details |
| Shows | `GET /api/shows` | List shows |
| Shows | `GET /api/shows/:id` | Retrieve show and seat information |
| Shows | `GET /api/shows/movie/:movieId` | List shows for a movie |
| Bookings | `POST /api/bookings` | Create a booking |
| Bookings | `GET /api/bookings/my` | Retrieve personal booking history |
| Bookings | `GET /api/bookings/:id` | Retrieve booking details |
| Bookings | `PATCH /api/bookings/:id/cancel` | Cancel an eligible booking |
| Favorites | `GET /api/favorites` | Retrieve favorites |
| Favorites | `GET /api/favorites/ids` | Retrieve favorite movie IDs |
| Favorites | `POST /api/favorites` | Add a favorite |
| Favorites | `DELETE /api/favorites/:movieId` | Remove a favorite |
| Reviews | `GET /api/reviews/movie/:movieId` | List movie reviews |
| Reviews | `GET /api/reviews/my` | Retrieve personal reviews |
| Admin | `GET /api/admin/stats` | Retrieve dashboard statistics |
| Admin | `GET /api/admin/users` | Retrieve user information |
| Admin | `GET /api/admin/bookings` | Retrieve administrative booking data |
| Admin | `PATCH /api/admin/bookings/:id/cancel` | Cancel a booking administratively |

Additional movie, theatre, show, and review endpoints support the create, update, and delete operations documented by the application.

### Booking Request Example

`POST /api/bookings`

```json
{
  "showId": "YOUR_SHOW_ID",
  "seats": ["A1", "A2"],
  "demoPaymentOutcome": "success"
}
```

The show ID must reference a real show in the configured database.

To simulate payment failure, use `"demoPaymentOutcome": "failure"`. The application returns HTTP `402`, records the failed payment state, and releases the seats according to the booking workflow.

Protected endpoints require the appropriate authenticated session and role.

## Security and Data Integrity

iMovies implements several safeguards for its local demonstration environment:

- **Authentication:** JWTs are stored in HTTP-only cookies rather than exposed to frontend JavaScript.
- **Password protection:** Passwords are hashed using bcrypt.
- **Authorization:** Administrative routes require the appropriate role.
- **Input validation:** Requests are validated by the backend before processing.
- **Seat consistency:** A unique compound database index prevents duplicate seat locks for the same show.
- **Pricing integrity:** The backend calculates prices instead of trusting amounts supplied by the client.
- **Request protection:** Authentication routes are rate-limited, and errors are handled centrally.

The seat-lock uniqueness constraint is the primary concurrency safeguard. If a seat is already locked, a conflicting booking attempt is rejected. The application is designed to support a standalone local MongoDB deployment without requiring replica-set transactions.

These controls reduce common application risks but do not constitute a formal security audit. Production deployment would require additional review of cookie settings, CSRF protections, input validation, logging, secrets management, and operational security.

## Testing

Run the backend test suite:

```bash
cd server
npm test
```

Run the frontend test suite:

```bash
cd client
npm test
```

Verify the frontend production build:

```bash
npm run build
```

Run the commands from their respective directories.

### Backend Test Coverage

The backend tests cover key application workflows, including:

- Registration and login.
- Password hashing and protected routes.
- Administrator authorization.
- Movie, theatre, and show management.
- Booking creation and duplicate-seat prevention.
- Concurrent booking attempts.
- Simulated payment failures.
- Booking cancellation and cutoff rules.
- Favorites and reviews.
- MongoDB connection failure behavior.

Integration tests require an accessible MongoDB instance. When MongoDB is unavailable, integration tests may be skipped rather than passed.

To configure a separate test database, use `MONGO_URI_TEST` with a base MongoDB URI without a database name, as supported by the test setup.

## Demo Payment Disclaimer

**iMovies does not process real payments.**

All payment outcomes are simulated locally. No card details are collected, no payment gateway is called, and no money is transferred.

Booking cancellations update the simulated payment status to `refunded`; this does not represent an actual financial refund. Dashboard revenue represents simulated booking amounts only.

## Troubleshooting

| Problem | Suggested solution |
|---|---|
| `JWT_SECRET is missing` | Configure `JWT_SECRET` in `server/.env`. |
| `ECONNREFUSED` from MongoDB | Start MongoDB and verify `MONGO_URI`. |
| Frontend cannot reach the API | Start the backend and verify `VITE_API_URL`. |
| CORS or cookie issues | Ensure `CLIENT_URL` exactly matches the frontend origin. Use `localhost` consistently for both applications. |
| Logged out immediately in production | HTTPS is required when the authentication cookie uses the `Secure` flag. |
| Port already in use | Free the port or configure a different backend port and matching frontend API URL. |
| Booking fails because a seat is taken | Refresh the seat map and select currently available seats. |
| Integration tests are skipped | Verify MongoDB connectivity and the test database configuration. |

## Future Enhancements

Potential directions for future development include:

- Automated email booking confirmations.
- Improved accessibility and responsive design.
- Movie recommendations based on user preferences.
- Additional seat-selection and booking analytics.
- Production-ready deployment with monitoring and security hardening.
- Integration with a legitimate payment provider if real payments become a requirement.

These are potential enhancements, not claims about existing functionality.

## License

No license is specified in this README. Add a `LICENSE` file if you intend to distribute the project under an open-source license. Until then, do not assume that others have permission to reuse or redistribute the code.

---

**Developed by Aagam Jain**

[View the iMovies repository on GitHub](https://github.com/Aagam124/IMovies---Movie-ticket-booking-made-simple..git)
