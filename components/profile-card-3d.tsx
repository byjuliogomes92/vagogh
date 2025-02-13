"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import type { User } from "@/contexts/auth-context"
import Image from "next/image"

type ProfileCard3DProps = {
  user: User
}

export function ProfileCard3D({ user }: ProfileCard3DProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-300, 300], [10, -10])
  const rotateY = useTransform(x, [-300, 300], [-10, 10])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    x.set(event.clientX - rect.left - rect.width / 2)
    y.set(event.clientY - rect.top - rect.height / 2)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      style={{
        perspective: 1000,
      }}
      className="relative w-full h-64 rounded-xl overflow-hidden cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
        }}
        className="w-full h-full bg-gradient-to-br from-[#2C3E50] to-[#4CA1AF] rounded-xl shadow-xl"
      >
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
          <Image
            src={user.avatarUrl || "/placeholder.svg"}
            alt={user.name}
            width={100}
            height={100}
            className="rounded-full border-4 border-white mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
          <p className="text-lg mb-2">{user.desiredPosition}</p>
          <p className="text-sm opacity-75">{user.location}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

