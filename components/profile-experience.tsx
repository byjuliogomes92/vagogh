import type { User } from "@/contexts/auth-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Plus, Trash2 } from "lucide-react"

type ProfileExperienceProps = {
  user: User
  isEditing: boolean
  onSave: (updatedProfile: Partial<User>) => Promise<void>
}

export function ProfileExperience({ user, isEditing, onSave }: ProfileExperienceProps) {
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
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-semibold text-white">Experiência Profissional</h3>
      {isEditing ? (
        <>
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className="space-y-4 p-4 bg-[#2C3E50] rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="space-y-2">
                <Label htmlFor={`company-${index}`} className="text-white">
                  Empresa
                </Label>
                <Input
                  id={`company-${index}`}
                  value={exp.company}
                  onChange={(e) => handleUpdateExperience(index, "company", e.target.value)}
                  className="bg-[#34495E] text-white border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`position-${index}`} className="text-white">
                  Cargo
                </Label>
                <Input
                  id={`position-${index}`}
                  value={exp.position}
                  onChange={(e) => handleUpdateExperience(index, "position", e.target.value)}
                  className="bg-[#34495E] text-white border-gray-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${index}`} className="text-white">
                    Data de início
                  </Label>
                  <Input
                    id={`startDate-${index}`}
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => handleUpdateExperience(index, "startDate", e.target.value)}
                    className="bg-[#34495E] text-white border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`endDate-${index}`} className="text-white">
                    Data de término
                  </Label>
                  <Input
                    id={`endDate-${index}`}
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => handleUpdateExperience(index, "endDate", e.target.value)}
                    className="bg-[#34495E] text-white border-gray-600"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`description-${index}`} className="text-white">
                  Descrição das atividades
                </Label>
                <Textarea
                  id={`description-${index}`}
                  value={exp.description}
                  onChange={(e) => handleUpdateExperience(index, "description", e.target.value)}
                  className="bg-[#34495E] text-white border-gray-600"
                  rows={4}
                />
              </div>
              <Button type="button" variant="destructive" onClick={() => handleRemoveExperience(index)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Remover Experiência
              </Button>
            </motion.div>
          ))}
          <Button
            type="button"
            onClick={handleAddExperience}
            className="w-full bg-[#2C3E50] hover:bg-[#34495E] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Experiência
          </Button>
          <Button onClick={handleSave} className="w-full bg-[#7333DD] hover:bg-[#0044CC] text-white">
            Salvar Alterações
          </Button>
        </>
      ) : (
        <div className="space-y-6">
          {user.experience && user.experience.length > 0 ? (
            user.experience.map((exp, index) => (
              <motion.div
                key={index}
                className="bg-[#2C3E50] p-4 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <h4 className="text-lg font-semibold text-white">
                  {exp.position} at {exp.company}
                </h4>
                <p className="text-gray-400">
                  {exp.startDate} - {exp.endDate || "Presente"}
                </p>
                <p className="text-gray-300 mt-2">{exp.description}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-300">Nenhuma experiência profissional adicionada.</p>
          )}
        </div>
      )}
    </motion.div>
  )
}

