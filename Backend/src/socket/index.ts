import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import mongoose from "mongoose";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData,
  MessagePayload,
} from "./types";
import { Message } from "../models/message.model";
import { Room } from "../models/room.model";

const MESSAGE_HISTORY_LIMIT = 100;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_DISPLAY_NAME_LENGTH = 30;

export const initSocket = (httpServer: HttpServer) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(
    httpServer,
    {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    }
  );

  io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    // --- JOIN ROOM ---
    socket.on("joinRoom", async ({ roomId, displayName }) => {
      try {
        // Validate displayName
        const trimmedName = displayName?.trim();
        if (!trimmedName || trimmedName.length > MAX_DISPLAY_NAME_LENGTH) {
          socket.emit("error", `Display name must be between 1 and ${MAX_DISPLAY_NAME_LENGTH} characters`);
          return;
        }

        // Validate roomId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
          socket.emit("error", "Invalid room ID");
          return;
        }

        // Check room exists and hasn't expired
        const room = await Room.findById(roomId);
        if (!room) {
          socket.emit("error", "Room not found or has expired");
          return;
        }

        socket.join(roomId);
        socket.data.displayName = trimmedName;
        socket.data.roomId = roomId;

        // Fetch existing messages and send ONLY to this socket
        const messages = await Message.find({ roomId })
          .sort({ createdAt: 1 })
          .limit(MESSAGE_HISTORY_LIMIT)
          .lean();

        const history: MessagePayload[] = messages.map((msg) => ({
          id: msg._id.toString(),
          displayName: msg.displayName,
          content: msg.content,
          roomId: msg.roomId.toString(),
          createdAt: msg.createdAt.toISOString(),
        }));

        socket.emit("messageHistory", history);

        // Notify everyone else in room
        socket.to(roomId).emit("userJoined", { displayName, roomId });

        console.log(`${displayName} joined room ${roomId}`);
      } catch (err) {
        console.error("joinRoom error:", err);
        socket.emit("error", "Failed to join room");
      }
    });

    // --- SEND MESSAGE ---
    socket.on("sendMessage", async ({ roomId, content, displayName }) => {
      try {
        // Validate content
        const trimmedContent = content?.trim();
        if (!trimmedContent) {
          socket.emit("error", "Message content cannot be empty");
          return;
        }
        if (trimmedContent.length > MAX_MESSAGE_LENGTH) {
          socket.emit("error", `Message content exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`);
          return;
        }

        if (!mongoose.Types.ObjectId.isValid(roomId)) {
          socket.emit("error", "Invalid room ID");
          return;
        }

        // Get room to copy its expiresAt to the message
        const room = await Room.findById(roomId).lean();
        if (!room) {
          socket.emit("error", "Room not found or has expired");
          return;
        }

        // Save to DB first
        const savedMessage = await Message.create({
          roomId,
          displayName,
          content: trimmedContent,
          expiresAt: room.expiresAt,
        });

        const messagePayload: MessagePayload = {
          id: savedMessage._id.toString(),
          displayName: savedMessage.displayName,
          content: savedMessage.content,
          roomId: savedMessage.roomId.toString(),
          createdAt: savedMessage.createdAt.toISOString(),
        };

        // Broadcast to everyone in room including sender
        io.to(roomId).emit("message", messagePayload);
      } catch (err) {
        console.error("sendMessage error:", err);
        socket.emit("error", "Failed to send message");
      }
    });

    // --- LEAVE ROOM ---
    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      const displayName = socket.data.displayName;
      if (displayName) {
        socket.to(roomId).emit("userLeft", { displayName, roomId });
      }
    });

    // --- DISCONNECT ---
    socket.on("disconnect", () => {
      const { displayName, roomId } = socket.data;

      if (roomId && displayName) {
        socket.to(roomId).emit("userLeft", { displayName, roomId });
      }

      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};