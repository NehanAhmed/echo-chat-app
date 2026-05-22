import { motion } from 'motion/react'

const Logo = ({ className }: { className?: string }) => {
  return (
    <motion.img
      src="/logo.png"
      alt="Echo Chat"
      width={512}
      height={512}
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}

export default Logo
