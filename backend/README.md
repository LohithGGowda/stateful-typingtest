# AWS Typing Challenge — Backend

Express API + SQLite backend for the AWS Typing Challenge.
Uses Node.js built-in `node:sqlite` — **zero native dependencies**.

## Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/attendees` | Register a participant |
| `GET` | `/api/attendees` | List all attendees |
| `POST` | `/api/scores` | Submit a typing score |
| `GET` | `/api/leaderboard` | Get leaderboard (all roles) |
| `GET` | `/api/leaderboard?role=student` | Get student leaderboard |
| `GET` | `/api/leaderboard?role=faculty` | Get faculty leaderboard |
| `DELETE` | `/api/leaderboard` | Reset all scores (requires password) |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment |
| `DATA_DIR` | `./data` | SQLite database directory |
| `RESET_PASSWORD` | `RCB` | Admin password to reset leaderboard |

## Running locally (development)

```bash
# From project root — starts both frontend and backend
# Terminal 1: backend
node --no-warnings=ExperimentalWarning backend/server.js

# Terminal 2: frontend (Vite proxies /api to localhost:3001)
npm run dev
```

## Docker (production)

```bash
# Build and run
docker compose up --build

# App available at http://localhost:3001
```

## Data persistence

The SQLite database is stored at `DATA_DIR/typing.db`.
In Docker, it is mounted as a named volume (`typing_data`) so data
survives container restarts and rebuilds.
