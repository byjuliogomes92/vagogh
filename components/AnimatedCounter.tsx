import type React from "react"
import { useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"

interface AnimatedCounterProps {
  end: number
  duration: number
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ end, duration }) => {
  const controls = useAnimation()
  const [count, setCount] = useState(0)

  useEffect(() => {
    controls.start({
      count: end,
      transition: { duration },
    })
  }, [controls, end, duration])

  return (
    <motion.span
      animate={controls}
      onUpdate={(latest) => {
        setCount(Math.round(latest.count as number))
      }}
    >
      {count}+
    </motion.span>
  )
}

