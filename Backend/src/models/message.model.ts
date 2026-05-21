// message.model.ts
import mongoose from "mongoose";

interface IMessage {
  roomId: mongoose.Types.ObjectId;
  displayName: string;
  content: string;
  expiresAt: Date;
  createdAt: Date;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    content: {
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


messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
messageSchema.index({ roomId: 1, createdAt: -1 });

export const Message = mongoose.model<IMessage>("Message", messageSchema);