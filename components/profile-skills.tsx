import type { User } from "@/contexts/auth-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

type ProfileSkillsProps = {
  user: User
  isEditing: boolean
  onSave: (updatedProfile: Partial<User>) => Promise<void>
}

export function ProfileSkills({ user, isEditing, onSave }: ProfileSkillsProps) {
  const [skills, setSkills] = useState(user.skills || [])
  const [newSkill, setNewSkill] = useState("")

  const handleAddSkill = () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleSave = () => {
    onSave({ skills })
  }

  return (
    <motion.div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Habilidades</h3>
      {isEditing ? (
        <>
          <motion.div className="space-y-4">
            <motion.div className="flex space-x-2">
              <motion.div className="flex-1">
                <Label htmlFor="newSkill" className="sr-only">
                  Nova habilidade
                </Label>
                <Input
                  id="newSkill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Nova habilidade"
                  className="bg-[#2C3E50] text-white"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddSkill()
                    }
                  }}
                />
              </motion.div>
              <Button onClick={handleAddSkill} className="bg-[#0055FF] hover:bg-[#0044CC] text-white">
                Adicionar
              </Button>
            </motion.div>
            <motion.div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <motion.div key={index}>
                  <Badge key={index} variant="secondary" className="bg-[#34495E] text-white">
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)} className="ml-2 text-gray-400 hover:text-white">
                      ×
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          <Button onClick={handleSave} className="w-full bg-[#0055FF] hover:bg-[#0044CC] text-white">
            Salvar Alterações
          </Button>
        </>
      ) : (
        <motion.div className="flex flex-wrap gap-2">
          {user.skills && user.skills.length > 0 ? (
            user.skills.map((skill, index) => (
              <motion.div key={index}>
                <Badge key={index} variant="secondary" className="bg-[#34495E] text-white">
                  {skill}
                </Badge>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-300">Nenhuma habilidade adicionada.</p>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

