import type { User } from "@/contexts/auth-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { ContactButton } from "@/components/contact-button"
import { ContactMethodSelect } from "@/components/contact-method-select"

type ProfileHeaderProps = {
  user: User
  isEditing: boolean
  onSave: (updatedProfile: Partial<User>) => Promise<void>
}

export function ProfileHeader({ user, isEditing, onSave }: ProfileHeaderProps) {
  const [name, setName] = useState(user.name)
  const [desiredPosition, setDesiredPosition] = useState(user.desiredPosition || "")
  const [location, setLocation] = useState(user.location || "")

  const handleSave = () => {
    onSave({ name, desiredPosition, location })
  }

  return (
    <motion.div
      className="bg-[url('https://cdn.pixabay.com/photo/2023/06/09/14/58/art-8051934_1280.png')] bg-cover bg-center rounded-lg p-3 sm:p-6 shadow-lg relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-black/50 rounded-lg"></div>
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
        <Avatar className="w-20 h-20 sm:w-32 sm:h-32 border-4 border-white">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3 sm:space-y-4 text-center sm:text-left">
          {isEditing ? (
            <>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-2xl font-bold bg-white/10 border-white/20 text-white"
              />
              <Input
                value={desiredPosition}
                onChange={(e) => setDesiredPosition(e.target.value)}
                className="text-xl text-white/80 bg-white/10 border-white/20"
                placeholder="Cargo desejado"
              />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="text-white/60 bg-white/10 border-white/20"
                placeholder="Localização"
              />
              <Button onClick={handleSave} className="mt-2">
                Salvar
              </Button>
              <div className="mt-4">
                <ContactMethodSelect
                  contactMethod={user.contactMethod}
                  contactValue={user.contactValue}
                  onSave={(method, value) => onSave({ contactMethod: method, contactValue: value })}
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl sm:text-3xl font-bold text-white">{user.name}</h2>
              <p className="text-lg sm:text-xl text-white/80">{user.desiredPosition}</p>
              <p className="text-sm sm:text-base text-white/60">{user.location}</p>
              {user.contactMethod && user.contactValue && (
                <div className="mt-4 flex justify-center md:justify-start">
                  <ContactButton method={user.contactMethod} value={user.contactValue} />
                </div>
              )}
              <div className="flex justify-center md:justify-start space-x-4 mt-4">
                <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20">
                  Compartilhar Perfil
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

