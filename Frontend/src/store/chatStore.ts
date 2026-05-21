import type { MessagePayload } from "@/types/socket.types";
import { create } from "zustand";

interface chatState {
     // State
  messages: MessagePayload[];
  onlineUsers: string[];
  roomId: string | null;
  displayName: string | null;
  isConnected: boolean;
  isJoining: boolean;
  error: string | null;

  // Actions
  setRoom: (roomId: string, displayName: string) => void;
  setConnected: (status: boolean) => void;
  setJoining: (status: boolean) => void;
  setError: (error: string | null) => void;
  setMessageHistory: (messages: MessagePayload[]) => void;
  addMessage: (message: MessagePayload) => void;
  addUser: (displayName: string) => void;
  removeUser: (displayName: string) => void;
  reset: () => void;
}

const initialState = {
  messages: [],
  onlineUsers: [],
  roomId: null,
  displayName: null,
  isConnected: false,
  isJoining: false,
  error: null,
};

export const useChatStore = create<chatState>((set) => ({
  ...initialState,

  setRoom: (roomId, displayName) => set({ roomId, displayName }),
  setConnected: (status) => set({ isConnected: status }),
  setJoining: (status) => set({ isJoining: status }),
  setError: (error) => set({ error }),

  // Replaces all messages — used when history loads on join
  setMessageHistory: (messages) => set({ messages }),

  // Appends single new message
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  addUser: (displayName) =>
    set((state) => ({
      onlineUsers: [...state.onlineUsers, displayName],
    })),

  removeUser: (displayName) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.filter((u) => u !== displayName),
    })),

  reset: () => set(initialState),
}));