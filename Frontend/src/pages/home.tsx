import { motion } from "motion/react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import Logo from "@/components/logo"
import RoomSessionCard from "@/components/room-session-card"

export default function Home() {
  return (
    <main id="main-content" className="flex flex-col px-6">
      <div className="flex min-h-dvh flex-col items-center justify-center">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="h-px w-12 origin-center rounded-full bg-primary"
        />

        <Logo className="h-24 w-auto sm:h-34" />

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.25,
          }}
          className="mt-6 max-w-xs px-4 text-center text-sm leading-relaxed text-muted-foreground sm:max-w-sm"
        >
          Real-time conversations that disappear without a trace.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.35,
          }}
          className="mt-8 flex w-full max-w-xs flex-col items-stretch gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:items-center"
        >
          <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.15 }}>
            <Link to="/create" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-sm sm:w-auto" asChild>
                <span>Create room</span>
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.15 }}>
            <Link to="/join" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full text-sm sm:w-auto" asChild>
                <span>Join room</span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      <RoomSessionCard />
      </div>

    </main>
  )
}
