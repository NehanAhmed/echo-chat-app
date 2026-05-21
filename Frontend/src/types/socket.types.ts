export interface MessagePayload {
  id: string;
  displayName: string;
  content: string;
  roomId: string;
  createdAt: string;
}

export interface UserPayload {
  displayName: string;
  roomId: string;
}

// What server sends to client
export interface ServerToClientEvents {
  message: (data: MessagePayload) => void;
  messageHistory: (messages: MessagePayload[]) => void;
  userJoined: (data: UserPayload) => void;
  userLeft: (data: UserPayload) => void;
  error: (message: string) => void;
}

// What client sends to server
export interface ClientToServerEvents {
  joinRoom: (data: { roomId: string; displayName: string }) => void;
  sendMessage: (data: { roomId: string; content: string; displayName: string }) => void;
  leaveRoom: (roomId: string) => void;
}