"use client"

import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, User, Mail, Lock, Briefcase } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"

type FormData = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  gender: string
  desiredPosition: string
  acceptCommunications: boolean
}

const steps = [
  { title: "Informações Pessoais", icon: User },
  { title: "Conta", icon: Mail },
  { title: "Perfil Profissional", icon: Briefcase },
]

export function SignupForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const { signup, isLoading } = useAuth()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    desiredPosition: "",
    acceptCommunications: true,
  })

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      })
      return
    }

    try {
      // Check if the email already exists
      const response = await fetch("/api/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      })
      const result = await response.json()

      if (result.exists) {
        toast({
          title: "E-mail já cadastrado",
          description: (
            <div>
              Este e-mail já está associado a uma conta.
              <Button
                variant="link"
                className="p-0 text-[#F7D047] hover:text-[#FED853]"
                onClick={() => router.push("/login")}
              >
                Faça login aqui
              </Button>
              ou use outro e-mail.
            </div>
          ),
          variant: "warning",
        })
        return
      }

      // If email doesn't exist, proceed with signup
      await signup(data.firstName, data.lastName, data.email, data.password, data.gender, formData.acceptCommunications)
      toast({
        title: "Sucesso",
        description: "Conta criada com sucesso!",
      })
      router.push("/login")
    } catch (err) {
      if (err instanceof Error) {
        const firebaseError = err as { code?: string }
        if (firebaseError.code === "auth/email-already-in-use") {
          toast({
            title: "E-mail já cadastrado",
            description: (
              <div>
                Este e-mail já está associado a uma conta.
                <Button
                  variant="link"
                  className="p-0 text-[#F7D047] hover:text-[#FED853]"
                  onClick={() => router.push("/login")}
                >
                  Faça login aqui
                </Button>
                ou use outro e-mail.
              </div>
            ),
            variant: "warning",
          })
        } else {
          toast({
            title: "Erro",
            description: "Erro ao criar conta. Tente novamente.",
            variant: "destructive",
          })
        }
      }
    }
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input
                id="firstName"
                {...register("firstName", { required: "Nome é obrigatório" })}
                className="bg-[#2C3E50] border-[#334155] text-white"
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                id="lastName"
                {...register("lastName", { required: "Sobrenome é obrigatório" })}
                className="bg-[#2C3E50] border-[#334155] text-white"
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gênero</Label>
              <Select onValueChange={(value) => register("gender").onChange({ target: { value } })}>
                <SelectTrigger className="bg-[#2C3E50] border-[#334155] text-white">
                  <SelectValue placeholder="Selecione seu gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                  <SelectItem value="non-binary">Não-binário</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefiro não dizer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Ao continuar você aceita nossos{" "}
              <Link href="/termos" className="text-[#F7D047] hover:underline">
                termos e condições
              </Link>{" "}
              e nossa{" "}
              <Link href="/privacidade" className="text-[#F7D047] hover:underline">
                política de privacidade
              </Link>
              .
            </p>
          </>
        )
      case 1:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: "E-mail é obrigatório" })}
                className="bg-[#2C3E50] border-[#334155] text-white"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                {...register("password", { required: "Senha é obrigatória" })}
                className="bg-[#2C3E50] border-[#334155] text-white"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: "Confirmação de senha é obrigatória",
                  validate: (value) => value === watch("password") || "As senhas não coincidem",
                })}
                className="bg-[#2C3E50] border-[#334155] text-white"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>
          </>
        )
      case 2:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="desiredPosition">Cargo Desejado</Label>
              <Input
                id="desiredPosition"
                {...register("desiredPosition")}
                className="bg-[#2C3E50] border-[#334155] text-white"
                placeholder="Ex: Desenvolvedor Full Stack, Designer UX/UI"
              />
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptCommunications"
                  checked={formData.acceptCommunications}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, acceptCommunications: checked as boolean }))
                  }
                />
                <label htmlFor="acceptCommunications" className="text-sm text-gray-300">
                  Eu concordo em receber comunicações e ofertas personalizadas de acordo com meus interesses
                </label>
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={`flex flex-col items-center ${index <= currentStep ? "text-[#F7D047]" : "text-gray-500"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index <= currentStep ? "bg-[#F7D047]" : "bg-gray-700"
              }`}
            >
              <step.icon className={`w-6 h-6 ${index <= currentStep ? "text-[#0F172A]" : "text-gray-400"}`} />
            </div>
            <span className="mt-2 text-sm">{step.title}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      <div className="space-y-2"></div>
      <div className="flex justify-between mt-8">
        {currentStep > 0 && (
          <Button type="button" onClick={prevStep} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        )}
        {currentStep < steps.length - 1 ? (
          <Button type="button" onClick={nextStep} className="ml-auto">
            Próximo <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" className="ml-auto" disabled={isLoading}>
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>
        )}
      </div>
    </form>
  )
}

