import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SignupPromptModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SignupPromptModal({ isOpen, onClose }: SignupPromptModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#1E293B] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">Acesse dados exclusivos!</DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <p>
            Para ver as estatísticas detalhadas desta vaga e ter acesso a recursos exclusivos, crie sua conta gratuita
            agora!
          </p>
          <div className="flex flex-col space-y-2">
            <Button asChild className="bg-[#7333DD] hover:bg-[#5d20c0] text-white">
              <Link href="/signup">Criar Conta Grátis</Link>
            </Button>
            <Button variant="outline" onClick={onClose}>
              Agora não
            </Button>
          </div>
          <p className="text-sm text-gray-400">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-[#7333DD] hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

