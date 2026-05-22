// room.model.ts
import mongoose from "mongoose";

export interface IRoom {
  _id: string;
  name: string;
  createdBy: string;
  expiresAt: Date;
}

const roomSchema = new mongoose.Schema<IRoom>(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

roomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Room = mongoose.model<IRoom>("Room", roomSchema);