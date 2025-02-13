import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { WhatsAppInput } from "./whatsapp-input"

type ContactMethod = "email" | "whatsapp" | "linkedin"

interface ContactMethodSelectProps {
  contactMethod?: ContactMethod
  contactValue?: string
  onSave: (method: ContactMethod, value: string) => void
}

export function ContactMethodSelect({ contactMethod, contactValue, onSave }: ContactMethodSelectProps) {
  const [method, setMethod] = useState<ContactMethod>(contactMethod || "email")
  const [value, setValue] = useState(contactValue || "")

  useEffect(() => {
    setMethod(contactMethod || "email")
    setValue(contactValue || "")
  }, [contactMethod, contactValue])

  const handleSave = () => {
    if (value.trim()) {
      if (method === "whatsapp") {
        const cleanedNumber = value.replace(/\D/g, "")
        if (cleanedNumber.length < 10) {
          toast({
            title: "Erro",
            description: "Por favor, insira um número de WhatsApp válido.",
            variant: "destructive",
          })
          return
        }
        onSave(method, cleanedNumber)
      } else {
        onSave(method, value.trim())
      }
      toast({
        title: "Sucesso",
        description: "Informações de contato salvas com sucesso.",
      })
    } else {
      toast({
        title: "Erro",
        description: "Por favor, preencha o campo de contato.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <Select value={method} onValueChange={(value) => setMethod(value as ContactMethod)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione o método de contato" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="whatsapp">WhatsApp</SelectItem>
          <SelectItem value="linkedin">LinkedIn</SelectItem>
        </SelectContent>
      </Select>
      {method === "whatsapp" ? (
        <WhatsAppInput initialValue={value} onChange={setValue} />
      ) : (
        <Input
          type={method === "email" ? "email" : "text"}
          placeholder={`Digite seu ${method}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}
      <Button onClick={handleSave}>Salvar Informações de Contato</Button>
    </div>
  )
}

