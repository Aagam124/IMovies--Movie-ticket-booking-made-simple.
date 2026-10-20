# IMovies project audit

## Checks completed in this workspace
- Checked JavaScript module syntax for `.js` and `.mjs` files with `node --check`.
- Checked relative imports across JavaScript/JSX modules; no missing relative imports were found.
- Confirmed the project includes separate React/Vite frontend and Express/Mongoose backend package manifests.
- Updated README execution instructions to match the configured backend port (8000) and documented MongoDB Atlas setup and secure admin creation.
- Confirmed the archive uses `.env.example` templates; do not add real Atlas credentials to the project ZIP or Git.

## Checks not completed
- Full backend tests could not run in this environment because dependency installation did not finish and required packages (including `supertest` and `bcryptjs`) were unavailable in the installed `node_modules`.
- The React production build was not verified here.
- A live MongoDB Atlas connection cannot be verified without your private connection string, network access allowlist, and database user. Configure these locally in `server/.env` and check `/api/health`.

## Before submission
1. Run `npm install` in both `server` and `client` on your computer.
2. Configure `server/.env` with your Atlas URI and a long random `JWT_SECRET`.
3. Start the server and verify `http://localhost:8000/api/health` reports `database.status: connected`.
4. Run `npm test` in `server` and `npm run build` in `client`; fix any environment-specific failures.
5. Never commit or share the real `.env` file.
