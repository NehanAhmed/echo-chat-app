import { Request, Response } from "express";
import { IRoom, Room } from "../models/room.model";
import { ApiResponse } from "../types/api.types";
import { generateRoomId } from "../utils/generateRoomId";

interface CreateRoomRequest {
  name: string;
  createdBy: string;
}

export const createRoom = async (
  req: Request<{}, {}, CreateRoomRequest>,
  res: Response<ApiResponse<IRoom>>  // ← typed response
) => {
  try {
    const { name, createdBy } = req.body;

    if (!name?.trim() || !createdBy?.trim()) {
      res.status(400).json({ success: false, message: "Name and createdBy are required" });
      return;
    }

    const MAX_RETRIES = 5
    let room
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const roomId = generateRoomId()
      try {
        room = await Room.create({
          _id: roomId,
          name: name.trim(),
          createdBy: createdBy.trim(),
        })
        break
      } catch (err: unknown) {
        const mongoErr = err as { code?: number; name?: string }
        if (mongoErr.code === 11000 || mongoErr.name === "MongoServerError") {
          if (attempt === MAX_RETRIES - 1) {
            res.status(500).json({ success: false, message: "Failed to create room after retries" })
            return
          }
          continue
        }
        throw err
      }
    }

    res.status(201).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};