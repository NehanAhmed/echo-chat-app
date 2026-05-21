// types/room.types.ts
import { z } from "zod";

export const roomCreateSchema = z.object({
  name: z.string().min(2, "Room name is required"),
  createdBy: z.string().min(2, "Your name is required"),
});

export type RoomCreatePayload = z.infer<typeof roomCreateSchema>;