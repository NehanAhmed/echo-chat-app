import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useChatStore } from "@/store/chatStore"

export default function RoomSessionCard() {
  const { roomId, displayName, reset } = useChatStore()

  if (!roomId || !displayName) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mt-8"
    >
      <Card size="sm" className="mx-auto max-w-sm">
        <CardContent className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback>{displayName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs font-medium text-foreground">
              {displayName}
            </span>
            <span className="text-[0.625rem] text-muted-foreground">
              Room {roomId}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Link
              to={`/room/${roomId}?name=${encodeURIComponent(displayName)}`}
            >
              <Button size="sm">Rejoin</Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              className="text-muted-foreground"
            >
              Dismiss
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
