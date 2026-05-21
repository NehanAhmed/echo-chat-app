import { useCallback } from "react"
import socket from "@/lib/socket"
import { useChatStore } from "@/store/chatStore"

export const useJoinRoom = () => {
  const { setRoom, setJoining, reset } = useChatStore()

  const joinRoom = useCallback(
    (roomId: string, displayName: string) => {
      setJoining(true)

      socket.connect()
      socket.emit("joinRoom", { roomId, displayName })

      setRoom(roomId, displayName)
      setJoining(false)
    },
    [setRoom, setJoining],
  )

  const leaveRoom = useCallback(
    (roomId: string) => {
      socket.emit("leaveRoom", roomId)
      socket.disconnect()
      reset()
    },
    [reset],
  )

  return { joinRoom, leaveRoom }
}