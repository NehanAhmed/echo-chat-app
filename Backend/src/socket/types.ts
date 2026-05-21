// What server sends TO client
export interface ServerToClientEvents {
  message: (data: MessagePayload) => void;
  userJoined: (data: UserPayload) => void;
  userLeft: (data: UserPayload) => void;
  roomExpiry: (expiresAt: string) => void;
  messageHistory: (messages: MessagePayload[]) => void;
  error: (message: string) => void;
}

// What client sends TO server
export interface ClientToServerEvents {
  joinRoom: (data: JoinRoomPayload) => void;
  sendMessage: (data: SendMessagePayload) => void;
  leaveRoom: (roomId: string) => void;
}

// Data attached to each socket connection
export interface SocketData {
  displayName: string;
  roomId: string;
}

// Payloads
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

export interface JoinRoomPayload {
  roomId: string;
  displayName: string;
}

export interface SendMessagePayload {
  roomId: string;
  content: string;
  displayName: string;
}
