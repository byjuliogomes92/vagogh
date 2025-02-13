"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { User } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"

type ExperienceTimelineProps = {
  user: User
  isEditing: boolean
  onSave: (updatedProfile: Partial<User>) => Promise<void>
}

export function ExperienceTimeline({ user, isEditing, onSave }: ExperienceTimelineProps) {
  const [experiences, setExperiences] = useState(user.experience || [])

  const handleAddExperience = () => {
    setExperiences([...experiences, { company: "", position: "", startDate: "", endDate: "", description: "" }])
  }

  const handleUpdateExperience = (index: number, field: string, value: string) => {
    const updatedExperiences = [...experiences]
    updatedExperiences[index] = { ...updatedExperiences[index], [field]: value }
    setExperiences(updatedExperiences)
  }

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index)
    setExperiences(updatedExperiences)
  }

  const handleSave = () => {
    onSave({ experience: experiences })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Experiência Profissional</h3>
      <div className="relative">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-8 flex"
          >
            <div className="flex flex-col items-center mr-4">
              <div className="w-3 h-3 bg-blue-600 rounded-full" />
              <div className="w-0.5 h-full bg-gray-600" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4 bg-[#2C3E50] p-4 rounded-lg">
                  <Input
                    value={exp.company}
                    onChange={(e) => handleUpdateExperience(index, "company", e.target.value)}
                    placeholder="Empresa"
                    className="bg-[#34495E] text-white"
                  />
                  <Input
                    value={exp.position}
                    onChange={(e) => handleUpdateExperience(index, "position", e.target.value)}
                    placeholder="Cargo"
                    className="bg-[#34495E] text-white"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => handleUpdateExperience(index, "startDate", e.target.value)}
                      className="bg-[#34495E] text-white"
                    />
                    <Input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => handleUpdateExperience(index, "endDate", e.target.value)}
                      className="bg-[#34495E] text-white"
                    />
                  </div>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => handleUpdateExperience(index, "description", e.target.value)}
                    placeholder="Descrição das atividades"
                    className="bg-[#34495E] text-white"
                    rows={4}
                  />
                  <Button variant="destructive" onClick={() => handleRemoveExperience(index)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Remover Experiência
                  </Button>
                </div>
              ) : (
                <div className="bg-[#2C3E50] p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-white">{exp.position}</h4>
                  <p className="text-gray-300">{exp.company}</p>
                  <p className="text-gray-400">
                    {exp.startDate} - {exp.endDate || "Presente"}
                  </p>
                  <p className="text-gray-300 mt-2">{exp.description}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      {isEditing && (
        <div className="space-y-4">
          <Button onClick={handleAddExperience} className="w-full bg-[#2C3E50] hover:bg-[#34495E] text-white">
            <Plus className="w-4 h-4 mr-2" /> Adicionar Experiência
          </Button>
          <Button onClick={handleSave} className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
            Salvar Alterações
          </Button>
        </div>
      )}
    </div>
  )
}

