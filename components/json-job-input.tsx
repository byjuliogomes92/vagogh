'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface JsonJobInputProps {
  onSubmit: (jobs: any[]) => Promise<void>
}

export function JsonJobInput({ onSubmit }: JsonJobInputProps) {
  const [jsonInput, setJsonInput] = useState('')

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    const jobs = JSON.parse(jsonInput)
    if (!Array.isArray(jobs)) {
      throw new Error('Input must be an array of job objects')
    }
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobs),
    })
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.error || 'Failed to add jobs')
    }
    toast({
      title: "Sucesso",
      description: result.message,
    })
    setJsonInput('')
  } catch (error) {
    console.error('Error adding jobs:', error)
    toast({
      title: "Erro",
      description: error instanceof Error ? error.message : "Falha ao adicionar vagas. Verifique o formato do JSON e suas permissões.",
      variant: "destructive",
    })
  }
}

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder="Cole aqui o JSON das vagas..."
        className="min-h-[200px] bg-[#2C2C2C] text-white"
      />
      <Button type="submit" className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
        Salvar Vagas
      </Button>
    </form>
  )
}

