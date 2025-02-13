import { Button } from "@/components/ui/button"
import { Mail, Phone, Linkedin } from "lucide-react"

interface ContactButtonProps {
  method: "email" | "whatsapp" | "linkedin"
  value: string
}

export function ContactButton({ method, value }: ContactButtonProps) {
  const getHref = () => {
    switch (method) {
      case "email":
        return `mailto:${value}`
      case "whatsapp":
        const cleanNumber = value.replace(/\D/g, "")
        return `https://wa.me/${cleanNumber}`
      case "linkedin":
        return `https://www.linkedin.com/in/${value}`
      default:
        return "#"
    }
  }

  const getIcon = () => {
    switch (method) {
      case "email":
        return <Mail className="w-5 h-5" />
      case "whatsapp":
        return <Phone className="w-5 h-5" />
      case "linkedin":
        return <Linkedin className="w-5 h-5" />
    }
  }

  return (
    <Button
      asChild
      variant="default"
      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full px-6 py-2 text-sm font-medium shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
    >
      <a href={getHref()} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
        {getIcon()}
        <span>Contato</span>
      </a>
    </Button>
  )
}

