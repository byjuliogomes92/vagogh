"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface FlipWordsProps {
  words: Array<{ text: string; emoji: string }>
  className?: string
}

export function FlipWords({ words, className = "" }: FlipWordsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length)
    }, 2000) // Change word every 2 seconds

    return () => clearInterval(interval)
  }, [words.length])

  return (
    <div className={`relative h-24 whitespace-normal inline-block ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ rotateX: 90, opacity: 0, y: 20 }}
          animate={{ rotateX: 0, opacity: 1, y: 0 }}
          exit={{ rotateX: -90, opacity: 0, y: -20 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute w-full text-white flex items-center justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
        >
          {words[currentIndex].text}{" "}
          <Image
            src={words[currentIndex].emoji || "/placeholder.svg"}
            alt="emoji"
            width={40}
            height={40}
            className="inline-block ml-2"
            unoptimized
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

