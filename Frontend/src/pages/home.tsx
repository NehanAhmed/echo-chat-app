import { motion } from "motion/react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import Logo from "@/components/logo"

export default function Home() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="h-px w-12 origin-center rounded-full bg-primary"
        />

      <Logo />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.25,
          }}
          className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground"
        >
          Real-time conversations that disappear without a trace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.35,
          }}
          className="mt-10 flex items-center gap-3"
        >
          <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.15 }}>
            <Link to="/create">
              <Button size="lg" className="text-sm" asChild>
                <span>Create room</span>
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.15 }}>
            <Link to="/join">
              <Button variant="outline" size="lg" className="text-sm" asChild>
                <span>Join room</span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
