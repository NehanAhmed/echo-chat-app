import { io, Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "@/types/socket.types";

// Typed socket instance
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000",
  {
    autoConnect: false,    // only connect when user joins a room
    reconnection: true,    // auto reconnect on drop
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  }
);

export default socket;