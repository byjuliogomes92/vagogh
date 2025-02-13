"use client"

import { useState, useEffect } from "react"
import { Heart, X, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useBanner } from "@/contexts/banner-context"

export function DonationBanner() {
  const { isBannerVisible, setIsBannerVisible } = useBanner()
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (isBannerVisible) {
      const shakeInterval = setInterval(() => {
        setShake(true)
        setTimeout(() => setShake(false), 500) // Duration of shake animation
      }, 5000) // Trigger shake every 5 seconds

      const closeTimer = setTimeout(() => {
        setIsBannerVisible(false)
      }, 15000) // 15 seconds

      return () => {
        clearInterval(shakeInterval)
        clearTimeout(closeTimer)
      }
    }
  }, [isBannerVisible, setIsBannerVisible])

  if (!isBannerVisible) return null

  return (
    <AnimatePresence>
      {isBannerVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: "auto",
            opacity: 1,
            y: shake ? [-5, 5, -5, 5, 0] : 0,
          }}
          exit={{ height: 0, opacity: 0, transition: { duration: 0.5 } }}
          transition={{
            duration: 0.5,
            y: { duration: 0.5, ease: "easeInOut" },
          }}
          className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-violet-500 to-purple-500 p-0.5"
          style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
        >
          <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4 mb-2 sm:mb-0">
                <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div className="text-white text-center sm:text-left">
                  <p className="text-sm sm:text-base font-medium">Ajude o VaGogh a ficar ainda mais incrível! 🚀</p>
                  <p className="text-xs sm:text-sm opacity-90 hidden sm:block">
                    Sua contribuição mantém nossa plataforma gratuita e cheia de novidades legais.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  className="bg-white text-violet-500 hover:bg-white/90 space-x-2"
                  onClick={() => window.open("https://exemplo.com/doar", "_blank")}
                >
                  <Coffee className="h-4 w-4" />
                  <span className="hidden sm:inline">Apoiar o VaGogh</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsBannerVisible(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

