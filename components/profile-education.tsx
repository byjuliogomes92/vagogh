import type { User } from "@/contexts/auth-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Plus, Trash2 } from "lucide-react"

type ProfileEducationProps = {
  user: User
  isEditing: boolean
  onSave: (updatedProfile: Partial<User>) => Promise<void>
}

export function ProfileEducation({ user, isEditing, onSave }: ProfileEducationProps) {
  const [education, setEducation] = useState(user.education || [])

  const handleAddEducation = () => {
    setEducation([...education, { institution: "", degree: "", field: "", graduationDate: "" }])
  }

  const handleUpdateEducation = (index: number, field: string, value: string) => {
    const updatedEducation = [...education]
    updatedEducation[index] = { ...updatedEducation[index], [field]: value }
    setEducation(updatedEducation)
  }

  const handleRemoveEducation = (index: number) => {
    const updatedEducation = education.filter((_, i) => i !== index)
    setEducation(updatedEducation)
  }

  const handleSave = () => {
    onSave({ education })
  }

  return (
    <motion.div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Educação</h3>
      {isEditing ? (
        <>
          {education.map((edu, index) => (
            <motion.div key={index} className="space-y-4 p-4 bg-[#2C3E50] rounded-lg">
              <div className="space-y-2">
                <Label htmlFor={`institution-${index}`}>Instituição</Label>
                <Input
                  id={`institution-${index}`}
                  value={edu.institution}
                  onChange={(e) => handleUpdateEducation(index, "institution", e.target.value)}
                  className="bg-[#34495E] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`degree-${index}`}>Grau</Label>
                <Input
                  id={`degree-${index}`}
                  value={edu.degree}
                  onChange={(e) => handleUpdateEducation(index, "degree", e.target.value)}
                  className="bg-[#34495E] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`field-${index}`}>Área de Estudo</Label>
                <Input
                  id={`field-${index}`}
                  value={edu.field}
                  onChange={(e) => handleUpdateEducation(index, "field", e.target.value)}
                  className="bg-[#34495E] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`graduationDate-${index}`}>Data de Graduação</Label>
                <Input
                  id={`graduationDate-${index}`}
                  type="date"
                  value={edu.graduationDate}
                  onChange={(e) => handleUpdateEducation(index, "graduationDate", e.target.value)}
                  className="bg-[#34495E] text-white"
                />
              </div>
              <Button type="button" variant="destructive" onClick={() => handleRemoveEducation(index)}>
                <Trash2 className="h-4 w-4 mr-2" /> Remover Educação
              </Button>
            </motion.div>
          ))}
          <Button
            type="button"
            onClick={handleAddEducation}
            className="w-full bg-[#2C3E50] hover:bg-[#34495E] text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Adicionar Educação
          </Button>
          <Button onClick={handleSave} className="w-full bg-[#0055FF] hover:bg-[#0044CC] text-white">
            Salvar Alterações
          </Button>
        </>
      ) : (
        <motion.div className="space-y-4">
          {user.education && user.education.length > 0 ? (
            user.education.map((edu, index) => (
              <motion.div key={index} className="bg-[#2C3E50] p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-white">
                  {edu.degree} em {edu.field}
                </h4>
                <p className="text-gray-300">{edu.institution}</p>
                <p className="text-gray-300">Concluído em {edu.graduationDate}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-300">Nenhuma informação educacional adicionada.</p>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

