"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Map, User, Settings } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function BottomNavBar() {
  const { user } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const navItems = [
    { href: "/", icon: Search, label: "Busca" },
    { href: "/minha-jornada", icon: Map, label: "Minha Jornada" },
    { href: "/profile", icon: User, label: "Meu Perfil" },
    { href: "/settings", icon: Settings, label: "Configurações" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-gray-700 px-2 py-1 flex justify-around items-center z-50 md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center space-y-1 py-1 ${
              isActive ? "text-[#F7D047]" : "text-gray-400 hover:text-white"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

