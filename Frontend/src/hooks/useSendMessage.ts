import { useState } from "react";
import socket from "@/lib/socket";
import { useChatStore } from "@/store/chatStore";

export const useSendMessage = () => {
  const { roomId, displayName } = useChatStore();
  const [input, setInput] = useState("");

  const sendMessage = () => {
    const trimmed = input.trim();

    // Guards
    if (!trimmed || !roomId || !displayName) return;
    if (!socket.connected) return;

    socket.emit("sendMessage", {
      roomId,
      content: trimmed,
      displayName,
    });

    setInput(""); // clear input after send
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return { input, setInput, sendMessage, handleKeyDown };
};