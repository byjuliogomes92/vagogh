"use client"
import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { NavBar } from "@/components/nav-bar"
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Globe, Zap, Users, Briefcase } from "lucide-react"
import { motion } from "framer-motion"
import { SignupForm } from "@/components/signup-form"

export default function SignupPage(): React.ReactNode {
  const [error, setError] = useState("")
  const { signup, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
  }

  const benefits = [
    {
      icon: Globe,
      title: "Oportunidades Globais",
      description: "Acesse vagas de trabalho remoto de empresas do mundo todo.",
    },
    {
      icon: Zap,
      title: "Matching Inteligente",
      description: "Nossa IA conecta você com as vagas mais adequadas ao seu perfil.",
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description: "Conecte-se com outros profissionais e amplie sua rede.",
    },
    {
      icon: Briefcase,
      title: "Desenvolvimento de Carreira",
      description: "Recursos e ferramentas para impulsionar sua carreira profissional.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
      <NavBar />
      <main className="container py-8 pt-20 flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-6xl flex bg-[#1E293B]/80 backdrop-blur-lg rounded-xl overflow-hidden shadow-2xl border border-[#334155]">
          <motion.div
            className="w-1/2 p-8 hidden lg:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Benefícios do VaGogh</h2>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-[#7333DD] p-2 rounded-lg">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{benefit.title}</h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="w-full lg:w-1/2 p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardHeader className="space-y-1">
              <CardTitle className="text-4xl font-bold text-center bg-gradient-to-r from-[#F7D047] to-[#FED853] text-transparent bg-clip-text font-playfair">
                Junte-se ao VaGogh
              </CardTitle>
              <CardDescription className="text-gray-400 text-center font-lato">
                Crie sua conta e comece sua jornada profissional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignupForm />
              <div className="mt-6 pt-6 text-sm text-gray-400 text-center w-full border-t border-gray-700 font-lato">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-[#F7D047] hover:text-[#FED853] font-semibold transition-colors">
                  Faça login
                </Link>
              </div>
            </CardContent>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

