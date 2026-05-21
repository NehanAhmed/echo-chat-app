import { useState } from "react"
import { motion } from "motion/react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function JoinRoom() {
  const navigate = useNavigate()
  const [roomId, setRoomId] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState("")
  const [isJoining, setIsJoining] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const trimmedId = roomId.trim()
    const trimmedName = displayName.trim()

    if (!trimmedId || !trimmedName) {
      setError("Both fields are required")
      return
    }
    if (trimmedName.length < 2) {
      setError("Display name must be at least 2 characters")
      return
    }

    setIsJoining(true)
    navigate(`/room/${encodeURIComponent(trimmedId)}?name=${encodeURIComponent(trimmedName)}`)
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            to="/"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; Back to home
          </Link>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.05,
          }}
          className="mt-6 h-px w-12 origin-center rounded-full bg-primary"
        />

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.1,
          }}
          className="mt-6 font-heading text-2xl/tight font-semibold tracking-tight"
        >
          Join room
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.15,
          }}
          className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground"
        >
          Enter the room ID shared with you and pick a display name.
        </motion.p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 w-full max-w-sm text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.2,
            }}
            className="space-y-1.5"
          >
            <Label htmlFor="room-id">Room ID</Label>
            <Input
              id="room-id"
              placeholder="e.g. abc123"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              disabled={isJoining}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.25,
            }}
            className="mt-5 space-y-1.5"
          >
            <Label htmlFor="display-name">Your name</Label>
            <Input
              id="display-name"
              placeholder="e.g. Alex"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={isJoining}
            />
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-xs text-destructive"
            >
              {error}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.3,
            }}
            className="mt-8"
          >
            <motion.div
              whileHover={{ y: -1 }}
              transition={{ duration: 0.15 }}
            >
              <Button size="lg" className="text-sm" disabled={isJoining}>
                {isJoining ? "Joining..." : "Join room"}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </div>
    </main>
  )
}
