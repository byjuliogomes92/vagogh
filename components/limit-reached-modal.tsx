import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

interface LimitReachedModalProps {
  isOpen: boolean
  limitType: "search" | "view"
}

export function LimitReachedModal({ isOpen, limitType }: LimitReachedModalProps) {
  const router = useRouter()

  const handleLogin = () => {
    router.push("/login")
  }

  const handleSignup = () => {
    router.push("/signup")
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white border-2 border-[#3B82F6] rounded-xl shadow-xl">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center mb-4"
          >
            <AlertTriangle className="w-16 h-16 text-yellow-400" />
          </motion.div>
          <DialogTitle className="text-2xl font-bold text-center text-[#F7D047]">
            Limite Diário Atingido - Faça Login para Continuar
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-gray-300 mt-2">
          Você atingiu o limite diário de {limitType === "search" ? "3 buscas" : "3 visualizações"} de vagas. Para
          continuar, faça login ou crie uma conta gratuita.
          <br />
          Este limite será reiniciado amanhã.
        </DialogDescription>
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-center text-[#F7D047]">Benefícios ao criar uma conta:</h3>
          <ul className="space-y-2">
            {[
              "Buscas ilimitadas",
              "Visualizações ilimitadas",
              "Salvar vagas favoritas",
              "Receber recomendações personalizadas",
            ].map((benefit, index) => (
              <motion.li
                key={index}
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
                <span className="text-gray-200">{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <Button
            onClick={handleLogin}
            className="bg-gradient-to-r from-[#7333DD] to-[#5d20c0] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Fazer Login
          </Button>
          <Button
            onClick={handleSignup}
            className="bg-gradient-to-r from-[#7333DD] to-[#5d20c0] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Criar Conta Grátis
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

