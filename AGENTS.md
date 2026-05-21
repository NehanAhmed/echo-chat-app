# AGENTS.md — echo-chat-app

Real-time ephemeral chat app. MERN + Socket.IO.

Before any frontend/UI work, read DESIGN.md first — it defines the design system, shadcn rules, animations, and icon usage.

## Structure

```
echo-chat-app/
├── Backend/          # Express 5 + Socket.IO + Mongoose
│   └── src/
│       ├── index.ts             # entry: connectDB, initSocket, listen
│       ├── app.ts               # Express app + route mounting
│       ├── socket/index.ts      # Socket.IO typed event handlers
│       ├── controllers/
│       ├── models/              # Room & Message schemas (TTL index on expiresAt)
│       ├── routes/              # room.route.ts (POST /api/rooms)
│       ├── db/                  # MongoDB connection
│       └── types/
├── Frontend/         # React 19 + Vite 7 + Tailwind 4 + shadcn/ui
│   └── src/
│       ├── main.tsx             # entry (BrowserRouter, ThemeProvider)
│       ├── App.tsx
│       ├── components/
│       ├── hooks/               # useSocket, useJoinRoom, useSendMessage
│       ├── lib/                 # socket.ts (typed IO client), axios.ts, utils.ts
│       ├── pages/
│       ├── store/               # Zustand chatStore
│       └── types/               # Socket.IO event types, room types
```

## Commands

| Package | Command | Description |
|---------|---------|-------------|
| Backend | `pnpm dev` | `tsx --watch src/index.ts` |
| Backend | `pnpm build` | `tsc` (outputs `dist/`) |
| Backend | `pnpm start` | `node dist/index.js` |
| Backend | `pnpm type-check` | `tsc --noEmit` |
| Frontend | `pnpm dev` | Vite dev server (HMR on :5173) |
| Frontend | `pnpm build` | `tsc -b && vite build` |
| Frontend | `pnpm typecheck` | `tsc --noEmit` |
| Frontend | `pnpm lint` | ESLint |
| Frontend | `pnpm format` | Prettier (`**/*.{ts,tsx}`) |
| Frontend | `pnpm preview` | Vite production preview |

## Key quirks

- **Package manager is `pnpm`** (not npm). Lockfile: `pnpm-lock.yaml`.
- **Run both packages separately** — no root dev script. Two terminals: `Backend/` + `Frontend/`.
- **Frontend TypeScript strict** with `verbatimModuleSyntax` — use `import type` for type-only imports.
- **Frontend path alias** `@/` maps to `Frontend/src/` (in both tsconfig and vite.config).
- **Frontend builds with `tsc -b`** (project references), not just `tsc`.
- **Socket.IO typed** — `ServerToClientEvents` / `ClientToServerEvents` interfaces shared between packages (but manually duplicated, not a shared lib).
- **Backend uses CommonJS** (`"module": "commonjs"`), Frontend uses ESM (`"type": "module"`).
- **No auth** — rooms joined by display name + roomId (MongoDB ObjectId).
- **TTL-based auto-expiry** — rooms + messages self-delete after 24h via MongoDB TTL index on `expiresAt`.
- **`socket.autoConnect = false`** — frontend only connects when user explicitly joins a room.

## Environment

| Variable | File | Default |
|----------|------|---------|
| `MONGO_URI` | Backend `.env` | `mongodb://127.0.0.1:27017/echo-chat` |
| `PORT` | Backend `.env` | `5000` |
| `CLIENT_URL` | Backend `.env` | `http://localhost:5173` |
| `VITE_SERVER_URL` | Frontend `.env` | `http://localhost:5000` |

## Testing

No test runner configured in either package. No CI.

## Conventions

- Prettier: no semicolons, double quotes, trailing commas (es5), tailwind plugin.
- ESLint: typescript-eslint recommended + react-hooks + react-refresh (Vite).
- `dist/` is gitignored in both packages (Frontend via `.gitignore`, Backend via `tsconfig.json` `exclude`).
