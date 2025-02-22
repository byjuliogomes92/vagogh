import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Copy, Linkedin, Share2 } from 'lucide-react'

interface ShareProfileModalProps {
  isOpen: boolean
  onClose: () => void
  profileUrl: string
}

export function ShareProfileModal({ isOpen, onClose, profileUrl }: ShareProfileModalProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setIsCopied(true)
      toast({
        title: "Link copiado",
        description: "O link do perfil foi copiado para a área de transferência.",
        className: "bg-green-500 text-white",
      })
      setTimeout(() => setIsCopied(false), 2000)
    }, () => {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link. Por favor, tente novamente.",
        variant: "destructive",
      })
    })
  }

  const handleShareLinkedIn = () => {
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`
    window.open(linkedInShareUrl, '_blank')
  }

  const handleShareWhatsApp = () => {
    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`Confira meu perfil profissional no VahGogh: ${profileUrl}`)}`
    window.open(whatsappShareUrl, '_blank')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#0F172A]">
        <DialogHeader>
          <DialogTitle>Compartilhar Perfil</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input
            value={profileUrl}
            readOnly
            className="flex-1 bg-[#0a101e]"
          />
          <Button onClick={handleCopyLink} variant="secondary">
            {isCopied ? "Copiado!" : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          <Button onClick={handleShareLinkedIn} variant="outline" className='bg-[#0055FF]'>
            <Linkedin className="h-4 w-4 mr-2" />
            LinkedIn
          </Button>
          <Button onClick={handleShareWhatsApp} variant="outline" className='bg-[#0055FF]'>
            <Share2 className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

