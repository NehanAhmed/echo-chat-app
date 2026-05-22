import { useState } from "react"
import { motion } from "motion/react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateRoom } from "@/hooks/useRoom"

export default function CreateRoom() {
  const navigate = useNavigate()
  const { mutateAsync, isPending, error } = useCreateRoom()
  const [name, setName] = useState("")
  const [createdBy, setCreatedBy] = useState("")
  const [validationError, setValidationError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")

    const trimmedName = name.trim()
    const trimmedCreatedBy = createdBy.trim()

    if (!trimmedName || !trimmedCreatedBy) {
      setValidationError("Both fields are required")
      return
    }
    if (trimmedName.length < 2 || trimmedCreatedBy.length < 2) {
      setValidationError("Each field must be at least 2 characters")
      return
    }

    try {
      const res = await mutateAsync({ name: trimmedName, createdBy: trimmedCreatedBy })
      const roomId = res.data._id as string
      navigate(`/room/${roomId}?name=${encodeURIComponent(trimmedCreatedBy)}`)
    } catch {
      // error is surfaced via the mutation's `error` state
    }
  }

  const displayError = validationError || error?.message

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 sm:px-6">
      <div className="flex w-full flex-col items-center text-center">
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
          className="mt-6 font-heading text-xl/tight font-semibold tracking-tight sm:text-2xl/tight"
        >
          Create room
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
          Name your room and choose a display name to get started.
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
            <Label htmlFor="room-name">Room name</Label>
            <Input
              id="room-name"
              placeholder="e.g. Project Alpha"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
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
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              disabled={isPending}
            />
          </motion.div>

          {displayError && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-xs text-destructive"
            >
              {displayError}
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
              <Button size="lg" className="w-full text-sm sm:w-auto" disabled={isPending}>
                {isPending ? "Creating..." : "Create room"}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </div>
    </main>
  )
}
