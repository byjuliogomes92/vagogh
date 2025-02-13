"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { NavBar } from "@/components/nav-bar"

export default function AddSampleJobPage(): React.ReactNode {
  const [isLoading, setIsLoading] = useState(false)

  const handleAddSampleJob = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/add-sample-job", { method: "POST" })
      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Sucesso",
          description: `Vaga adicionada com ID: ${data.id}`,
        })
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao adicionar vaga de exemplo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C]">
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-white">Adicionar Vaga de Exemplo</h1>
        <Button
          onClick={handleAddSampleJob}
          disabled={isLoading}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
        >
          {isLoading ? "Adicionando..." : "Adicionar Vaga de Exemplo"}
        </Button>
      </div>
    </div>
  )
}

