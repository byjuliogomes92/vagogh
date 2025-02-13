import type { User } from "@/contexts/auth-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

type ProfileAboutProps = {
  user: User
  isEditing: boolean
  onSave: (updatedProfile: Partial<User>) => Promise<void>
}

export function ProfileAbout({ user, isEditing, onSave }: ProfileAboutProps) {
  const [bio, setBio] = useState(user.bio || "")

  const handleSave = () => {
    onSave({ bio })
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-semibold text-white">Sobre</h3>
      {isEditing ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white">
              Biografia
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Conte-nos sobre você..."
              className="bg-[#2C3E50] text-white border-gray-600 min-h-[150px]"
              rows={8}
            />
            <p className="text-sm text-gray-400 mt-2">
              Dica: Use quebras de linha para parágrafos e **texto** para negrito.
            </p>
          </div>
          <Button onClick={handleSave} className="bg-[#7C3AED] hover:bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
            Salvar
          </Button>
        </>
      ) : (
        <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
          {user.bio
            ? user.bio.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph.split("**").map((part, i) =>
                    i % 2 === 0 ? (
                      part
                    ) : (
                      <strong key={i} className="font-bold">
                        {part}
                      </strong>
                    ),
                  )}
                </p>
              ))
            : "Nenhuma informação fornecida."}
        </div>
      )}
    </motion.div>
  )
}

