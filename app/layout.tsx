import type React from "react"
import { Inter, Playfair_Display } from "next/font/google"
import { ClientWrapper } from "./client-wrapper"
import { ScrollToTop } from "@/components/scroll-to-top"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["900"],
  style: ["italic"],
  variable: "--font-playfair",
})

export const metadata = {
  title: "VaGogh - Encontre sua próxima oportunidade",
  description: "Plataforma de busca de empregos remotos",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${inter.className} ${playfair.variable}`}>
      <body suppressHydrationWarning>
        <ScrollToTop />
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  )
}



import './globals.css'