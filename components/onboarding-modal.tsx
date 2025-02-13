import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Search, Briefcase, UserCircle, Bell } from "lucide-react"

const steps = [
  {
    title: "Bem-vindo ao JobZera!",
    description:
      "Estamos felizes em tê-lo conosco. Vamos dar uma olhada rápida em como você pode aproveitar ao máximo nossa plataforma.",
    icon: <Briefcase className="w-12 h-12 text-[#7C3AED]" />,
  },
  {
    title: "Busque Vagas",
    description: "Use nossa poderosa ferramenta de busca para encontrar as melhores oportunidades de trabalho remoto.",
    icon: <Search className="w-12 h-12 text-[#7C3AED]" />,
  },
  {
    title: "Complete seu Perfil",
    description:
      "Um perfil completo aumenta suas chances de ser notado pelos empregadores. Adicione suas habilidades, experiências e portfolio.",
    icon: <UserCircle className="w-12 h-12 text-[#7C3AED]" />,
  },
  {
    title: "Configure Alertas",
    description: "Receba notificações sobre novas vagas que correspondam ao seu perfil e interesses.",
    icon: <Bell className="w-12 h-12 text-[#7C3AED]" />,
  },
]

export function OnboardingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#1E293B] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">{steps[currentStep].title}</DialogTitle>
        </DialogHeader>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            {steps[currentStep].icon}
            <DialogDescription className="mt-4 text-gray-300">{steps[currentStep].description}</DialogDescription>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-white border-white hover:bg-white hover:text-[#1E293B]"
          >
            Pular
          </Button>
          <Button onClick={handleNext} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
            {currentStep === steps.length - 1 ? "Começar" : "Próximo"}
          </Button>
        </div>
        <div className="flex justify-center mt-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${index === currentStep ? "bg-[#7C3AED]" : "bg-gray-600"}`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

