// hooks/useCreateRoom.ts
import { api } from "@/lib/axios";
import type { RoomCreatePayload } from "@/types/room.types";
import { useMutation } from "@tanstack/react-query";

const createRoom = async (payload: RoomCreatePayload) => {
  const response = await api.post("/rooms", payload);
  return response.data;
};

export const useCreateRoom = () => {
  return useMutation({
    mutationKey: ["create-room"],
    mutationFn: createRoom,
  });
};