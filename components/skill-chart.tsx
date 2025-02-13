"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { User } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Skill = string | { name: string; level: number }

type NormalizedSkill = {
  name: string
  level: number
}

type SkillChartProps = {
  user: User
  isEditing: boolean
  onSave: (updatedProfile: Partial<User>) => Promise<void>
}

export function SkillChart({ user, isEditing, onSave }: SkillChartProps) {
  const [skills, setSkills] = useState<NormalizedSkill[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [newSkillLevel, setNewSkillLevel] = useState(50)

  useEffect(() => {
    // Normalize skills data
    const normalizedSkills = (user.skills || []).map((skill: Skill) => {
      if (typeof skill === "string") {
        return { name: skill, level: 50 } // Default level for string skills
      }
      return skill as NormalizedSkill
    })
    setSkills(normalizedSkills)
  }, [user.skills])

  const handleAddSkill = () => {
    if (newSkill.trim() !== "" && !skills.some((skill) => skill.name === newSkill.trim())) {
      setSkills([...skills, { name: newSkill.trim(), level: newSkillLevel }])
      setNewSkill("")
      setNewSkillLevel(50)
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill.name !== skillToRemove))
  }

  const handleSave = () => {
    onSave({ skills: skills.map((skill) => ({ name: skill.name, level: skill.level })) })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Habilidades</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#2C3E50] rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">{skill.name}</span>
              {isEditing && (
                <button onClick={() => handleRemoveSkill(skill.name)} className="text-red-500 hover:text-red-700">
                  ×
                </button>
              )}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <motion.div
                className="bg-blue-600 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
      {isEditing && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex-1">
              <Label htmlFor="newSkill" className="sr-only">
                Nova habilidade
              </Label>
              <Input
                id="newSkill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Nova habilidade"
                className="bg-[#2C3E50] text-white"
              />
            </div>
            <div className="w-full sm:w-24">
              <Label htmlFor="newSkillLevel" className="sr-only">
                Nível
              </Label>
              <Input
                id="newSkillLevel"
                type="number"
                min="0"
                max="100"
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                className="bg-[#2C3E50] text-white"
              />
            </div>
            <Button onClick={handleAddSkill} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white w-full sm:w-auto">
              Adicionar
            </Button>
          </div>
          <Button onClick={handleSave} className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
            Salvar Alterações
          </Button>
        </div>
      )}
    </div>
  )
}

