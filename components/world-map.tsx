"use client"

import React from "react"
import { motion } from "framer-motion"

export const WorldMap = () => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event
    setMousePosition({ x: clientX, y: clientY })
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" onMouseMove={handleMouseMove}>
      <svg width="100%" height="100%" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="#0F172A" />
        <circle cx={mousePosition.x} cy={mousePosition.y} r="100" fill="url(#gradient)">
          <animateMotion dur="10s" repeatCount="indefinite" path="M0 0 L 100 0 Z" />
        </circle>
        {[...Array(100)].map((_, index) => (
          <motion.circle
            key={index}
            cx={Math.random() * 1000}
            cy={Math.random() * 1000}
            r={Math.random() * 2 + 1}
            fill="#7C3AED"
            initial={{ opacity: Math.random() }}
            animate={{
              opacity: [Math.random(), Math.random(), Math.random()],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

