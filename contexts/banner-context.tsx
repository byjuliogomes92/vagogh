'use client'

import React, { createContext, useContext, useState } from 'react'

type BannerContextType = {
  isBannerVisible: boolean
  setIsBannerVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const BannerContext = createContext<BannerContextType | undefined>(undefined)

export function BannerProvider({ children }: { children: React.ReactNode }) {
  const [isBannerVisible, setIsBannerVisible] = useState(true)

  return (
    <BannerContext.Provider value={{ isBannerVisible, setIsBannerVisible }}>
      {children}
    </BannerContext.Provider>
  )
}

export const useBanner = () => {
  const context = useContext(BannerContext)
  if (context === undefined) {
    throw new Error('useBanner must be used within a BannerProvider')
  }
  return context
}

