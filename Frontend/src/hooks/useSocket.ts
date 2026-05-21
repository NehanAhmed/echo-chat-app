import { useEffect } from "react";
import socket from "@/lib/socket";
import { useChatStore } from "@/store/chatStore";

export const useSocket = () => {
  const {
    setConnected,
    setError,
    addMessage,
    setMessageHistory,
    addUser,
    removeUser,
  } = useChatStore();

  useEffect(() => {
    // --- Connection events ---
    socket.on("connect", () => {
      setConnected(true);
      setError(null);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("connect_error", () => {
      setError("Connection failed. Retrying...");
    });

    // --- Chat events ---
    socket.on("messageHistory", (messages) => {
      setMessageHistory(messages);
    });

    socket.on("message", (data) => {
      addMessage(data);
    });

    socket.on("userJoined", (data) => {
      addUser(data.displayName);
    });

    socket.on("userLeft", (data) => {
      removeUser(data.displayName);
    });

    socket.on("error", (message) => {
      setError(message);
    });

    // Cleanup — critical, prevents duplicate listeners on re-render
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("messageHistory");
      socket.off("message");
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("error");
    };
  }, []); // empty deps — register once, cleanup on unmount
};