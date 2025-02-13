"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

type JobFormProps = {
  initialData?: {
    company: string
    logo: string
    title: string
    // location: string
    salary: number
    type: string
    level: string
    description: string
    requirements: string[]
    benefits: string[]
    tags: string[]
    applicationUrl: string
    isSponsored: boolean
  }
  onSubmit: (data: any) => Promise<void>
  buttonText: string
  isSubmitting: boolean
}

export function JobForm({ initialData, onSubmit, buttonText, isSubmitting }: JobFormProps) {
  const [formData, setFormData] = useState(
    initialData || {
      company: "",
      logo: "",
      title: "",
      // location: '',
      salary: 0,
      type: "",
      level: "",
      description: "",
      requirements: [""],
      benefits: [""],
      tags: [""],
      applicationUrl: "",
      isSponsored: false,
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (index: number, value: string, field: "requirements" | "benefits" | "tags") => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => (i === index ? value : item)),
    }))
  }

  const handleAddArrayItem = (field: "requirements" | "benefits" | "tags") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const handleRemoveArrayItem = (index: number, field: "requirements" | "benefits" | "tags") => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== index),
    }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSponsoredChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isSponsored: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="company">Empresa</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="bg-[#0d1526] text-white"
          />
        </div>
        <div>
          <Label htmlFor="logo">URL do Logo</Label>
          <Input
            id="logo"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            required
            className="bg-[#0d1526] text-white"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="title">Título da Vaga</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="bg-[#0d1526] text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="salary">Salário</Label>
          <Input
            id="salary"
            name="salary"
            type="number"
            value={formData.salary}
            onChange={handleChange}
            required
            className="bg-[#0d1526] text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="type">Tipo de Contrato</Label>
          <Select name="type" value={formData.type} onValueChange={handleSelectChange("type")}>
            <SelectTrigger className="bg-[#0d1526] text-white">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tempo Integral">Tempo Integral</SelectItem>
              <SelectItem value="Meio Período">Meio Período</SelectItem>
              <SelectItem value="Freelancer">Freelancer</SelectItem>
              <SelectItem value="Estágio">Estágio</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="level">Nível de Experiência</Label>
          <Select name="level" value={formData.level} onValueChange={handleSelectChange("level")}>
            <SelectTrigger className="bg-[#0d1526] text-white">
              <SelectValue placeholder="Selecione o nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Júnior">Júnior</SelectItem>
              <SelectItem value="Pleno">Pleno</SelectItem>
              <SelectItem value="Sênior">Sênior</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição da Vaga</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="bg-[#0d1526] text-white min-h-[100px]"
        />
      </div>

      <div>
        <Label>Requisitos</Label>
        {formData.requirements.map((req, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <Input
              value={req}
              onChange={(e) => handleArrayChange(index, e.target.value, "requirements")}
              className="bg-[#0d1526] text-white"
            />
            <Button type="button" variant="destructive" onClick={() => handleRemoveArrayItem(index, "requirements")}>
              Remover
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => handleAddArrayItem("requirements")} className="mt-2">
          Adicionar Requisito
        </Button>
      </div>

      <div>
        <Label>Benefícios</Label>
        {formData.benefits.map((benefit, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <Input
              value={benefit}
              onChange={(e) => handleArrayChange(index, e.target.value, "benefits")}
              className="bg-[#0d1526] text-white"
            />
            <Button type="button" variant="destructive" onClick={() => handleRemoveArrayItem(index, "benefits")}>
              Remover
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => handleAddArrayItem("benefits")} className="mt-2">
          Adicionar Benefício
        </Button>
      </div>

      <div>
        <Label>Tags</Label>
        {formData.tags.map((tag, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <Input
              value={tag}
              onChange={(e) => handleArrayChange(index, e.target.value, "tags")}
              className="bg-[#0d1526] text-white"
            />
            <Button type="button" variant="destructive" onClick={() => handleRemoveArrayItem(index, "tags")}>
              Remover
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => handleAddArrayItem("tags")} className="mt-2">
          Adicionar Tag
        </Button>
      </div>

      <div>
        <Label htmlFor="applicationUrl">URL de Candidatura</Label>
        <Input
          id="applicationUrl"
          name="applicationUrl"
          value={formData.applicationUrl}
          onChange={handleChange}
          className="bg-[#0d1526] text-white"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="isSponsored">Vaga Patrocinada</Label>
          <Switch id="isSponsored" checked={formData.isSponsored} onCheckedChange={handleSponsoredChange} />
        </div>
        <p className="text-sm text-gray-500">Vagas patrocinadas aparecem com destaque e têm maior visibilidade.</p>
      </div>

      <Button type="submit" className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white" disabled={isSubmitting}>
        {buttonText}
      </Button>
    </form>
  )
}

