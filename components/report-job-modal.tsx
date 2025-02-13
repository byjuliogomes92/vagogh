import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

interface ReportJobModalProps {
  isOpen: boolean
  onClose: () => void
  jobId: string
  jobTitle: string
  jobUrl: string
}

const reportReasons = [
  { value: "fake", label: "Vaga falsa" },
  { value: "offensive", label: "Conteúdo ofensivo" },
  { value: "spam", label: "Spam" },
  { value: "misleading", label: "Informações enganosas" },
  { value: "other", label: "Outro" },
]

export function ReportJobModal({ isOpen, onClose, jobId, jobTitle, jobUrl }: ReportJobModalProps) {
  const [reason, setReason] = useState("")
  const [comments, setComments] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async () => {
    if (!reason) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um motivo para a denúncia.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/report-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          jobTitle,
          jobUrl,
          reason,
          comments,
          userEmail: user?.email,
          reportedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao enviar denúncia")
      }

      toast({
        title: "Denúncia enviada",
        description: "Obrigado por nos ajudar a manter a qualidade das vagas.",
      })
      onClose()
    } catch (error) {
      console.error("Error submitting report:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar a denúncia. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#1E293B] text-white">
        <DialogHeader>
          <DialogTitle>Denunciar Vaga</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              Motivo
            </Label>
            <Select onValueChange={setReason} value={reason}>
              <SelectTrigger className="col-span-3 bg-[#0d1526] border-gray-700">
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent>
                {reportReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="comments" className="text-right">
              Comentários
            </Label>
            <Textarea
              id="comments"
              className="col-span-3 bg-[#0d1526] border-gray-700"
              placeholder="Comentários adicionais (opcional)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} className="bg-[#0d1526] text-white border-gray-700">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#0055FF] hover:bg-[#0044CC] text-white">
            {isSubmitting ? "Enviando..." : "Enviar Denúncia"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

