"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs"
import { CheckCircle2, XCircle } from "lucide-react"
import { PublisherForm } from "@/components/publisher-form"
import { JobPostingForm } from "@/components/job-posting-form"

export default function PublicarVagaContent() {
  const [step, setStep] = useState<"landing" | "publisher" | "job">("landing")
  const [jobType, setJobType] = useState<"free" | "sponsored" | null>(null)

  const handleStartPosting = (type: "free" | "sponsored") => {
    setJobType(type)
    setStep("publisher")
  }

  const handlePublisherSubmit = () => {
    setStep("job")
  }

  const handleJobSubmit = () => {
    // Handle job submission logic here
    console.log("Job submitted")
  }

  return (
    <>
      {step === "landing" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-white text-center mb-8">Publique sua vaga no JobZera</h1>
          <p className="text-xl text-gray-200 text-center mb-12">
            Alcance os melhores talentos para sua empresa com nossa plataforma de recrutamento líder de mercado
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white/20 backdrop-blur-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Como funciona</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Escolha entre publicação gratuita ou patrocinada</li>
                  <li>Preencha as informações do publicador</li>
                  <li>Detalhe as informações da vaga</li>
                  <li>Revise e publique sua vaga</li>
                  <li>Receba candidaturas de profissionais qualificados</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="bg-white/20 backdrop-blur-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Por que escolher o JobZera?</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200">
                <ul className="list-disc list-inside space-y-2">
                  <li>Alcance uma ampla base de profissionais qualificados</li>
                  <li>Ferramentas avançadas de filtragem de candidatos</li>
                  <li>Integração com ATS (Applicant Tracking Systems)</li>
                  <li>Suporte dedicado ao cliente</li>
                  <li>Análises e relatórios detalhados</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="free" className="w-full max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="free">Publicação Gratuita</TabsTrigger>
              <TabsTrigger value="sponsored">Publicação Patrocinada</TabsTrigger>
            </TabsList>
            <TabsContent value="free">
              <Card>
                <CardHeader>
                  <CardTitle>Publicação Gratuita</CardTitle>
                  <CardDescription>Ideal para empresas em crescimento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle2 className="text-green-500 mr-2" />
                    <span>Listagem básica por 30 dias</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="text-green-500 mr-2" />
                    <span>Até 3 vagas por mês</span>
                  </div>
                  <div className="flex items-center">
                    <XCircle className="text-red-500 mr-2" />
                    <span>Sem destaque nos resultados de busca</span>
                  </div>
                  <div className="flex items-center">
                    <XCircle className="text-red-500 mr-2" />
                    <span>Sem relatórios de desempenho</span>
                  </div>
                  <Button
                    onClick={() => handleStartPosting("free")}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Começar Gratuitamente
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="sponsored">
              <Card>
                <CardHeader>
                  <CardTitle>Publicação Patrocinada</CardTitle>
                  <CardDescription>Para empresas que buscam os melhores talentos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle2 className="text-green-500 mr-2" />
                    <span>Listagem premium por 60 dias</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="text-green-500 mr-2" />
                    <span>Vagas ilimitadas</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="text-green-500 mr-2" />
                    <span>Destaque nos resultados de busca</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="text-green-500 mr-2" />
                    <span>Relatórios detalhados de desempenho</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="text-green-500 mr-2" />
                    <span>Suporte prioritário</span>
                  </div>
                  <p className="font-bold text-lg">A partir de R$ 299,00 por vaga</p>
                  <Button
                    onClick={() => handleStartPosting("sponsored")}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Publicar Vaga Patrocinada
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}

      {step === "publisher" && (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl font-bold text-white text-center mb-8">Informações do Publicador</h2>
          <PublisherForm onSubmit={handlePublisherSubmit} />
        </motion.div>
      )}

      {step === "job" && (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl font-bold text-white text-center mb-8">Detalhes da Vaga</h2>
          <JobPostingForm onSubmit={handleJobSubmit} jobType={jobType} />
        </motion.div>
      )}
    </>
  )
}

