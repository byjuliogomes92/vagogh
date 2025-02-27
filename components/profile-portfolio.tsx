import type { User } from "@/contexts/auth-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExternalLink, Plus, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

type ProfilePortfolioProps = {
  user: User
  isEditing: boolean
  onSave: (updatedProfile: Partial<User>) => Promise<void>
}

export function ProfilePortfolio({ user, isEditing, onSave }: ProfilePortfolioProps) {
  const [portfolioLinks, setPortfolioLinks] = useState(user.portfolioLinks || [])
  const [newLink, setNewLink] = useState({ title: "", url: "" })

  const handleAddLink = () => {
    if (newLink.title.trim() !== "" && newLink.url.trim() !== "") {
      setPortfolioLinks([...portfolioLinks, newLink])
      setNewLink({ title: "", url: "" })
    }
  }

  const handleRemoveLink = (linkToRemove: { title: string; url: string }) => {
    setPortfolioLinks(portfolioLinks.filter((link) => link.url !== linkToRemove.url))
  }

  const handleSave = () => {
    onSave({ portfolioLinks })
  }

  return (
    <motion.div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Portfólio</h3>
      {isEditing ? (
        <>
          <motion.div className="space-y-4">
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectTitle">Título do projeto</Label>
                <Input
                  id="projectTitle"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  placeholder="Título do projeto"
                  className="bg-[#2C3E50] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectUrl">URL do projeto</Label>
                <Input
                  id="projectUrl"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="URL do projeto"
                  className="bg-[#2C3E50] text-white"
                />
              </div>
            </motion.div>
            <Button onClick={handleAddLink} className="w-full bg-[#2C3E50] hover:bg-[#34495E] text-white">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Projeto
            </Button>
          </motion.div>
          <motion.div className="space-y-2">
            {portfolioLinks.map((link, index) => (
              <motion.div key={index} className="flex items-center justify-between bg-[#2C3E50] p-2 rounded">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7333DD] hover:text-[#5d20c0]"
                >
                  {link.title}
                </a>
                <button onClick={() => handleRemoveLink(link)} className="text-gray-300 hover:text-white">
                  <Trash2 className="mr-2 h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
          <Button onClick={handleSave} className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
            Salvar Alterações
          </Button>
        </>
      ) : (
        <motion.div className="space-y-2">
          {user.portfolioLinks && user.portfolioLinks.length > 0 ? (
            user.portfolioLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-[#7333DD] hover:text-[#5d20c0]"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {link.title}
              </a>
            ))
          ) : (
            <p className="text-gray-300">Nenhum link de portfólio adicionado.</p>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

