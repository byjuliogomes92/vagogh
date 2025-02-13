"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useJobPostingStatus } from "@/contexts/job-posting-context"
import { NavBar } from "@/components/nav-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PublicarVagaContent from "./publicar-vaga-content"

export default function PublicarVagaPage(): React.ReactNode {
  const { isJobPostingEnabled } = useJobPostingStatus()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <NavBar />
      <main className="container mx-auto px-4 py-12 pt-24">
        {isJobPostingEnabled ? (
          <PublicarVagaContent />
        ) : (
          <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg border-0">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-white text-center">Publicar Vaga - Em Breve</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl text-gray-200 text-center">
                Estamos trabalhando duro para trazer a funcionalidade de publicação de vagas para você. Fique ligado
                para novidades!
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

