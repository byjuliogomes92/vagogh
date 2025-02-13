"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { NavBar } from "@/components/nav-bar"
import { DonationBanner } from "@/components/donation-banner"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Briefcase } from "lucide-react"
import { JobCard } from "@/components/job-card"
import { db } from "@/lib/firebase"
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore"
import { toast } from "@/components/ui/use-toast"
import { getRecommendedJobs } from "@/utils/recommendationAlgorithm"
import type { Job } from "@/types/job"

export default function RecommendedJobsPage() {
  const { user } = useAuth()
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      if (!user) {
        setError("Usuário não autenticado")
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)
      try {
        console.log("Iniciando busca de vagas recomendadas")
        const jobsRef = collection(db, "jobs")
        const q = query(jobsRef, orderBy("posted", "desc"), limit(100))
        const querySnapshot = await getDocs(q)
        console.log(`Encontradas ${querySnapshot.size} vagas no total`)

        const jobs = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            posted: data.posted?.toDate() || new Date(),
          } as Job
        })

        console.log("Aplicando algoritmo de recomendação")
        const recommendedJobs = getRecommendedJobs(user, jobs)
        console.log(`${recommendedJobs.length} vagas recomendadas após aplicar o algoritmo`)
        setRecommendedJobs(recommendedJobs)
      } catch (error) {
        console.error("Erro detalhado ao buscar vagas recomendadas:", error)
        setError("Falha ao carregar vagas recomendadas")
        toast({
          title: "Erro",
          description: "Não foi possível carregar as vagas recomendadas. Por favor, tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendedJobs()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Acesso Restrito</h1>
          <p className="text-xl text-gray-300 mb-8">Você precisa estar logado para ver suas vagas recomendadas.</p>
          <Link href="/login">
            <Button className="bg-[#0055FF] hover:bg-[#0044CC] text-white">Fazer Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <DonationBanner />
      <NavBar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Vagas Recomendadas</h1>
            <Link href="/">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#0F172A]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Vagas
              </Button>
            </Link>
          </div>

          <div className="bg-gradient-to-r from-[#1E293B] to-[#0F172A] rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <Briefcase className="text-[#0055FF] w-8 h-8 mr-4" />
              <h2 className="text-2xl font-semibold text-white">Recomendações Personalizadas</h2>
            </div>
            <p className="text-gray-300">
              Estas vagas foram selecionadas com base no seu perfil, experiência e preferências. Nosso algoritmo
              considera suas habilidades, nível de experiência, cargo desejado e localização para encontrar as melhores
              oportunidades para você.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-300">Carregando vagas recomendadas...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-xl text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} className="bg-[#0055FF] hover:bg-[#0044CC] text-white">
                Tentar novamente
              </Button>
            </div>
          ) : recommendedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <JobCard {...job} index={index} isSaved={false} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-300 mb-4">Ainda não temos recomendações personalizadas para você.</p>
              <p className="text-lg text-gray-400 mb-8">
                Continue atualizando seu perfil para receber recomendações mais precisas.
              </p>
              <Link href="/profile">
                <Button className="bg-[#0055FF] hover:bg-[#0044CC] text-white">Atualizar Perfil</Button>
              </Link>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}

