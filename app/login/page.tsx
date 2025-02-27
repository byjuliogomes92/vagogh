"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Mail, Lock, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await login(email, password) // Removido o terceiro argumento
      // O redirecionamento agora é tratado dentro da função de login
    } catch (err) {
      setError("Email ou senha inválidos")
      toast({
        title: "Erro no login",
        description: "Email ou senha inválidos. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
      <NavBar />
      <main className="container py-8 pt-20 flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-[#1E293B]/80 backdrop-blur-sm text-white border-[#334155] shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-4xl font-bold text-center bg-gradient-to-r from-[#F7D047] to-[#FED853] text-transparent bg-clip-text font-playfair">
                Bem-vindo de volta
              </CardTitle>
              <CardDescription className="text-gray-400 text-center">
                Entre na sua conta para acessar o VaGogh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      placeholder="seu@email.com"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-[#3C3C3C] border-gray-700 text-white pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-[#3C3C3C] border-gray-700 text-white pl-10"
                      placeholder="Sua senha"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)} // Corrigido o tipo
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
                  >
                    Lembrar credenciais
                  </label>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-[#7333DD] hover:bg-[#5d20c0] text-white font-semibold transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
              <div className="mt-6 pt-6 text-sm text-gray-400 text-center w-full border-t border-gray-700">
                Não tem uma conta?{" "}
                <Link href="/signup" className="text-[#F7D047] hover:text-[#FED853] font-semibold transition-colors">
                  Cadastre-se
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

export default LoginPage