"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Bell,
  LogOut,
  Bookmark,
  Settings,
  User,
  Star,
  ArrowRight,
  Menu,
  X,
  LayoutDashboard,
  LogIn,
  ChevronDown,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useBanner } from "@/contexts/banner-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { usePathname } from "next/navigation"

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isBannerVisible } = useBanner()
  const { user, logout, setLastVisitedUrl } = useAuth()
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState("")
  const pathname = usePathname()
  const isAdmin = user?.role === "admin"

  useEffect(() => {
    if (user) {
      setAvatarUrl(user.avatarUrl || `https://api.dicebear.com/6.x/micah/svg?seed=${user.email}`)
    }
  }, [user])

  useEffect(() => {
    if (pathname !== "/login" && pathname !== "/signup") {
      setLastVisitedUrl(pathname)
    }
  }, [pathname, setLastVisitedUrl])

  const handleLogout = () => {
    logout()
    router.push("/")
    setIsMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 w-full bg-[#0f172a] border-b border-border transition-all duration-300 ${
        isBannerVisible ? "top-8" : "top-0"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
            <Image
              src="https://raw.githubusercontent.com/byjuliogomes92/vagogh/94fcea45233b67d01f2315ff2e822375cbb09785/public/logo.svg"
              alt="VaGogh"
              width={120}
              height={120}
              className="h-19 w-19"
            />
          </Link>
        </div>

        <div className="hidden md:flex md:items-center md:space-x-6">
          <Link
            href="/"
            className={`transition-all duration-300 px-4 py-2 rounded-lg hover:bg-[#1E293B] ${
              pathname === "/" ? "text-foreground font-playfair text-lg" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Buscar vagas
          </Link>
          <Link
            href="/sobre-nos"
            className={`transition-all duration-300 px-4 py-2 rounded-lg hover:bg-[#1E293B] ${
              pathname === "/sobre-nos"
                ? "text-foreground font-playfair text-lg"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sobre Nós
          </Link>
          <span className="text-[#454D60] flex items-center cursor-not-allowed px-4 py-2">
            Anunciar Vaga
            <span className="ml-2 px-1 py-0.5 text-[10px] bg-[#454c5b] text-white rounded-full">Em breve!</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <>
              <div className="hidden md:flex space-x-4">
                <Link href="/saved-jobs" onClick={closeMobileMenu}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-[#1E293B] hover:scale-105 transition-all duration-300 mr-2"
                  >
                    <Bookmark className="h-5 w-5 mr-1" />
                    <span className="hidden sm:inline">Vagas Salvas</span>
                  </Button>
                </Link>
                <Link href="/recommended-jobs" onClick={closeMobileMenu}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-[#1E293B] hover:scale-105 transition-all duration-300 mr-2"
                  >
                    <Star className="h-5 w-5 mr-1" />
                    <span className="hidden sm:inline">Recomendadas</span>
                  </Button>
                </Link>
                <Link href="/settings" onClick={closeMobileMenu}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground hover:bg-[#1E293B] hover:scale-105 transition-all duration-300"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-[#1E293B] hover:scale-105 transition-all duration-300"
              >
                <Bell className="h-5 w-5" />
              </Button>
            </>
          )}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none group">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-foreground hidden sm:inline">{user.firstName}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-[#1E293B] border-gray-700 p-2 transition-all duration-200 ease-in-out"
                sideOffset={5}
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="text-white hover:bg-[#7333DD] hover:scale-105 flex items-center py-3 px-4 text-base w-full rounded-lg transition-all duration-300"
                    onClick={closeMobileMenu}
                  >
                    <User className="mr-3 h-5 w-5" />
                    <span className="flex-grow">Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin"
                      className="text-white hover:bg-[#7333DD] hover:scale-105 flex items-center py-3 px-4 text-base w-full rounded-lg transition-all duration-300"
                      onClick={closeMobileMenu}
                    >
                      <LayoutDashboard className="mr-3 h-5 w-5" />
                      <span className="flex-grow">Painel Admin</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-white hover:bg-[#7333DD] hover:scale-105 flex items-center py-3 px-4 text-base w-full rounded-lg transition-all duration-300"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span className="flex-grow">Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" onClick={closeMobileMenu}>
                <Button
                  variant="ghost"
                  className={`text-muted-foreground hover:text-foreground hover:bg-[#1E293B] hover:scale-105 transition-all duration-300 px-4 py-2 rounded-lg ${
                    pathname === "/login" ? "font-playfair italic font-black" : ""
                  }`}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
              </Link>
              <Link href="/signup" onClick={closeMobileMenu}>
                <Button
                  variant="default"
                  className={`flex items-center space-x-2 hover:scale-105 transition-all duration-300 ${
                    pathname === "/signup" ? "font-playfair italic font-black" : ""
                  }`}
                >
                  <span>Comece aqui</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
          <button
            className="md:hidden text-foreground hover:text-[#7333DD]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0f172a] border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/" ? "text-white bg-[#1E293B]" : "text-gray-300 hover:bg-[#1E293B] hover:text-white"
              }`}
              onClick={closeMobileMenu}
            >
              Buscar vagas
            </Link>
            <Link
              href="/sobre-nos"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/sobre-nos"
                  ? "text-white bg-[#1E293B]"
                  : "text-gray-300 hover:bg-[#1E293B] hover:text-white"
              }`}
              onClick={closeMobileMenu}
            >
              Sobre Nós
            </Link>
            <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 cursor-not-allowed">
              Anunciar Vaga
              <Badge variant="outline" className="ml-2 bg-[#454c5b] text-white">
                Em breve
              </Badge>
            </span>
            {user && (
              <>
                <Link
                  href="/saved-jobs"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-[#1E293B] hover:text-white"
                  onClick={closeMobileMenu}
                >
                  Vagas Salvas
                </Link>
                <Link
                  href="/recommended-jobs"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-[#1E293B] hover:text-white"
                  onClick={closeMobileMenu}
                >
                  Recomendadas
                </Link>
                <Link
                  href="/settings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-[#1E293B] hover:text-white"
                  onClick={closeMobileMenu}
                >
                  Configurações
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-[#1E293B] hover:text-white"
                    onClick={closeMobileMenu}
                  >
                    Painel Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-[#1E293B] hover:text-white"
                >
                  Sair
                </button>
              </>
            )}
            {!user && (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-[#1E293B] hover:text-white"
                  onClick={closeMobileMenu}
                >
                  <LogIn className="inline-block w-4 h-4 mr-2" />
                  Entrar
                </Link>
                <Link
                  href="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-[#7333DD] hover:bg-[#5d20c0]"
                  onClick={closeMobileMenu}
                >
                  Comece aqui
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </motion.header>
  )
}

