import { Request, Response } from "express";
import { IRoom, Room } from "../models/room.model";
import { ApiResponse } from "../types/api.types";

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

    const room = await Room.create({
      name: name.trim(),
      createdBy: createdBy.trim(),
    });

    res.status(201).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};