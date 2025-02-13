"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface JobPostingFormProps {
  onSubmit: () => void
  jobType: "free" | "sponsored" | null
}

export function JobPostingForm({ onSubmit, jobType }: JobPostingFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    type: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Job data:", formData)
    onSubmit()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-lg border-0">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Título da Vaga
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="bg-white/20 border-0 text-white placeholder-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Descrição da Vaga
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="bg-white/20 border-0 text-white placeholder-gray-400 min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="requirements" className="text-white">
              Requisitos
            </Label>
            <Textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
              className="bg-white/20 border-0 text-white placeholder-gray-400 min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary" className="text-white">
              Faixa Salarial
            </Label>
            <Input
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Ex: R$ 3.000 - R$ 5.000"
              className="bg-white/20 border-0 text-white placeholder-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-white">
              Localização
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ex: Remoto, São Paulo - SP, etc."
              className="bg-white/20 border-0 text-white placeholder-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type" className="text-white">
              Tipo de Contrato
            </Label>
            <Select name="type" value={formData.type} onValueChange={handleSelectChange("type")}>
              <SelectTrigger className="bg-white/20 border-0 text-white">
                <SelectValue placeholder="Selecione o tipo de contrato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Tempo Integral</SelectItem>
                <SelectItem value="part-time">Meio Período</SelectItem>
                <SelectItem value="contract">Contrato</SelectItem>
                <SelectItem value="internship">Estágio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            {jobType === "free" ? "Publicar Vaga Gratuita" : "Publicar Vaga Patrocinada"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

