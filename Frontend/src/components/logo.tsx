import { motion } from 'motion/react'

const Logo = () => {
  return (
      <h1 className="mt-8 font-heading tracking-tight text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1,
            }}
            className="text-5xl/tight font-semibold text-primary"
          >
            echo
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.15,
            }}
            className="text-2xl/tight font-light text-muted-foreground"
          >
            chat
          </motion.span>
        </h1>
  )
}

export default Logo