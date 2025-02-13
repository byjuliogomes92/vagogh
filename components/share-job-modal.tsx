import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Linkedin, Twitter, Mail, Share2 } from "lucide-react"

interface ShareJobModalProps {
  isOpen: boolean
  onClose: () => void
  jobTitle: string
  jobUrl: string
}

export function ShareJobModal({ isOpen, onClose, jobTitle, jobUrl }: ShareJobModalProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(jobUrl).then(
      () => {
        setIsCopied(true)
        toast({
          title: "Link copiado",
          description: "O link da vaga foi copiado para a área de transferência.",
        })
        setTimeout(() => setIsCopied(false), 2000)
      },
      () => {
        toast({
          title: "Erro",
          description: "Não foi possível copiar o link. Por favor, tente novamente.",
          variant: "destructive",
        })
      },
    )
  }

  const handleShare = (platform: "linkedin" | "twitter" | "whatsapp" | "email") => {
    const shareText = `Confira esta vaga de ${jobTitle}!`
    const shareLinks = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(jobUrl)}&text=${encodeURIComponent(shareText)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${jobUrl}`)}`,
      email: `mailto:?subject=${encodeURIComponent(`Vaga interessante: ${jobTitle}`)}&body=${encodeURIComponent(`Olá,\n\nEncontrei esta vaga que pode te interessar:\n\n${jobTitle}\n\nConfira mais detalhes em: ${jobUrl}`)}`,
    }

    window.open(shareLinks[platform], "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Vaga</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input value={jobUrl} readOnly className="flex-1" />
          <Button onClick={handleCopyLink} variant="secondary">
            {isCopied ? "Copiado!" : "Copiar"}
          </Button>
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          <Button onClick={() => handleShare("linkedin")} variant="outline">
            <Linkedin className="h-4 w-4 mr-2" />
            LinkedIn
          </Button>
          <Button onClick={() => handleShare("twitter")} variant="outline">
            <Twitter className="h-4 w-4 mr-2" />
            Twitter
          </Button>
          <Button onClick={() => handleShare("whatsapp")} variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
          <Button onClick={() => handleShare("email")} variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

