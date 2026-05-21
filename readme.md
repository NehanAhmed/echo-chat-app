<div align="center">
  <!-- Banner image placeholder — add your preferred banner here -->
  <!-- <img src="url-to-banner.png" alt="Echo Chat Banner" width="100%" /> -->
  <br />
</div>

<p align="center">
  <strong>A real-time messaging application built with the MERN stack and Socket.IO for ephemeral room-based communication.</strong>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/MERN-Stack-green?style=flat-square" alt="MERN Stack" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Socket.IO-v4.8-blue?style=flat-square&logo=socket.io" alt="Socket.IO" /></a>
  <a href="#"><img src="https://img.shields.io/badge/MongoDB-TTL%20Auto--Expiry-brightgreen?style=flat-square&logo=mongodb" alt="MongoDB TTL" /></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript" alt="TypeScript" /></a>
  <a href="#"><img src="https://img.shields.io/badge/React-v19-61DAFB?style=flat-square&logo=react" alt="React 19" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Vite-v7-646CFF?style=flat-square&logo=vite" alt="Vite 7" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS 4" /></a>
  <a href="#"><img src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square" alt="License" /></a>
</p>

---

## What Is Echo Chat?

Echo Chat is a **real-time messaging platform** that lets users create temporary chat rooms that self-destruct after 24 hours. Designed for quick, ephemeral conversations, it removes the clutter of permanent chat history.

- **Ephemeral rooms with auto-expiry** — Every room and its messages are automatically deleted after 24 hours via MongoDB TTL indexes, ensuring privacy and reducing storage bloat.
- **Instant, real-time communication** — Powered by WebSockets through Socket.IO, messages, join, and leave notifications are delivered instantly across all connected clients.
- **Room-based multi-participant chat** — Users can create rooms, share the room ID, and have multiple participants join the same conversation in real time.
- **No authentication required** — Simply enter a display name to join a room. The focus is on frictionless, immediate conversations without sign-ups or accounts.

## Features

- **Create & join rooms** — RESTful endpoints to create new rooms (`POST /api/rooms`) and join them via WebSocket using a valid MongoDB ObjectId.
- **Live messaging** — Messages are persisted to MongoDB and broadcast to all room participants in real time.
- **Room expiry** — Rooms and their messages are automatically cleaned up after 24 hours via MongoDB TTL indexes.
- **Message history** — On joining a room, the last 100 messages are served as history (configurable via `MESSAGE_HISTORY_LIMIT`).
- **Server-side input validation** — Display names are trimmed and length-limited (1–30 characters); message content is validated and capped at 5000 characters.
- **Graceful connection lifecycle** — Joined rooms and display names are tracked via socket data; `userJoined` and `userLeft` events are broadcast on connect/leave/disconnect with proper guards against incomplete payloads.
- **TypeScript end-to-end** — Full type safety across server and client with typed Socket.IO events and shared API response types.

## Built With

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js |
| **Backend Framework** | Express 5 |
| **Database** | MongoDB with Mongoose ODM (TTL indexes for auto-expiry) |
| **Real-time** | Socket.IO 4.x (WebSocket communication) |
| **Frontend Framework** | React 19 |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4 with shadcn/ui components |
| **Language** | TypeScript (strict mode throughout) |

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB instance (local or Atlas)
- pnpm

### Backend Setup

```bash
cd Backend
pnpm install

# Create a .env file with your MongoDB connection string
echo "MONGO_URI=mongodb://127.0.0.1:27017/echo-chat" > .env
echo "PORT=5000" >> .env

# Start the development server
pnpm dev
```

The server starts on `http://localhost:5000` with Socket.IO listening on the same port.

### Frontend Setup

```bash
cd Frontend
pnpm install
pnpm dev
```

The Vite dev server starts on `http://localhost:5173` (default).

### Running Together

```bash
# From the project root (if you have a root package.json with scripts)
# Otherwise, run both in separate terminals:
cd Backend && pnpm dev
cd Frontend && pnpm dev
```

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/rooms` | Create a new chat room (body: `{ name, createdBy }`) |

### WebSocket Events

| Event (Client → Server) | Payload | Description |
|-------------------------|---------|-------------|
| `joinRoom` | `{ roomId, displayName }` | Join a room and receive message history |
| `sendMessage` | `{ roomId, content, displayName }` | Send a message to the room |
| `leaveRoom` | `roomId` | Leave a room |

| Event (Server → Client) | Payload | Description |
|-------------------------|---------|-------------|
| `message` | `MessagePayload` | A new message in the joined room |
| `messageHistory` | `MessagePayload[]` | Recent messages on join |
| `userJoined` | `{ displayName, roomId }` | A participant joined the room |
| `userLeft` | `{ displayName, roomId }` | A participant left the room |
| `error` | `string` | Error message |

## Project Structure

```text
echo-chat-app/
├── Backend/
│   ├── src/
│   │   ├── app.ts              # Express app & route mounting
│   │   ├── index.ts            # Entry point (DB connect, HTTP server, Socket.IO init)
│   │   ├── controllers/        # Route handlers
│   │   ├── db/                 # MongoDB connection
│   │   ├── models/             # Mongoose schemas (Room, Message)
│   │   ├── routes/             # Express route definitions
│   │   ├── socket/             # Socket.IO typed event handlers
│   │   └── types/              # Shared TypeScript types
│   ├── package.json
│   └── tsconfig.json
├── Frontend/
│   ├── src/                    # React application source
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── readme.md
```

## License

Distributed under the MIT License. See the license file in the repository for more information.
