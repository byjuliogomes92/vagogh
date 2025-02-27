"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2,
  Clock,
  DollarSign,
  Briefcase,
  GraduationCap,
  ArrowLeft,
  Share2,
  Linkedin,
  Twitter,
  Mail,
  Bookmark,
  ExternalLink,
  Sparkles,
  Check,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { CompatibilitySection } from "./compatibility-section"
import { useAuth } from "@/contexts/auth-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"
import { ShareJobModal } from "./share-job-modal"
import { db } from "@/lib/firebase"
import { doc, setDoc, deleteDoc, getDoc, updateDoc, increment } from "firebase/firestore"
import { ReportJobModal } from "./report-job-modal"
import { AnalyticsModal } from "./analytics-modal"
import { SignupPromptModal } from "./signup-prompt-modal"

type CompanyInfo = {
  name: string
  description: string
  foundedYear?: number
  size?: string
  industry?: string
}

interface JobDetailsProps {
  id: string
  title: string
  company: string
  logo: string
  salary: number
  type: string
  level: string
  posted: string
  description: string
  requirements: string[]
  benefits: string[]
  tags: string[]
  applicationUrl?: string
  companyInfo?: CompanyInfo
  otherJobs?: Job[]
  isSponsored?: boolean
  isApplied?: boolean
  viewCount: number
  saveCount: number
  shareCount: number
  applyCount: number
}

type Job = {
  id: string
  title: string
  company: string
  location: string
  type: string
  posted: string
}

export function JobDetails({
  id,
  title,
  company,
  logo,
  salary,
  type,
  level,
  posted,
  description,
  requirements,
  benefits,
  tags,
  applicationUrl,
  isSponsored,
  isApplied = false,
  viewCount: initialViewCount,
  saveCount: initialSaveCount,
  shareCount: initialShareCount,
  applyCount: initialApplyCount,
}: JobDetailsProps) {
  const { user } = useAuth()
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
  const [otherJobs, setOtherJobs] = useState<Job[]>([])
  const [isJobApplied, setIsJobApplied] = useState(isApplied)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false)
  const [viewCount, setViewCount] = useState(initialViewCount)
  const [saveCount, setSaveCount] = useState(initialSaveCount)
  const [shareCount, setShareCount] = useState(initialShareCount)
  const [applyCount, setApplyCount] = useState(initialApplyCount)
  const [isSignupPromptModalOpen, setIsSignupPromptModalOpen] = useState(false)

  useEffect(() => {
    const checkIfJobIsSaved = async () => {
      if (user) {
        const jobRef = doc(db, `users/${user.id}/savedJobs/${id}`)
        const docSnap = await getDoc(jobRef)
        setIsSaved(docSnap.exists())
      }
    }

    checkIfJobIsSaved()
  }, [user, id])

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      // In a real application, you would fetch this data from your API
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        if (company) {
          setCompanyInfo({
            name: company,
            description: `${company} is a leading company in its sector.`,
            foundedYear: 2000,
            size: "1000-5000 employees",
            industry: "Technology", // We're setting a default industry here
          })
        }
      }, 1000)
    }

    const fetchOtherJobs = async () => {
      // In a real application, you would fetch this data from your API
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        setOtherJobs([
          {
            id: "job2",
            title: "Senior Software Engineer",
            company: company,
            location: "Remote",
            type: "Full-time",
            posted: new Date().toISOString(),
          },
          {
            id: "job3",
            title: "Product Manager",
            company: company,
            location: "São Paulo, Brazil",
            type: "Full-time",
            posted: new Date().toISOString(),
          },
        ])
      }, 1000)
    }

    fetchCompanyInfo()
    fetchOtherJobs()
  }, [company])

  useEffect(() => {
    const fetchJobDetails = async () => {
      const jobRef = doc(db, "jobs", id)
      const jobSnap = await getDoc(jobRef)
      if (jobSnap.exists()) {
        const jobData = jobSnap.data()
        setViewCount(jobData.viewCount || 0)

        // Incrementa o viewCount
        await updateDoc(jobRef, {
          viewCount: increment(1),
        })

        // Atualiza o estado local
        setViewCount((prev) => prev + 1)
      }
    }

    fetchJobDetails()
  }, [id])

  const handleSaveJob = async (folderId: string | null = null) => {
    if (!user) {
      toast({
        title: "Ação necessária",
        description: (
          <div>
            Você precisa ter uma conta para salvar vagas.{" "}
            <Link href="/signup" className="text-[#7333DD] hover:underline">
              Cadastre-se agora
            </Link>
            !
          </div>
        ),
        duration: 5000,
      })
      return
    }

    const jobRef = doc(db, `users/${user.id}/savedJobs/${id}`)

    if (isSaved && !folderId) {
      await deleteDoc(jobRef)
      setIsSaved(false)
      // Decrement save count
      const jobDocRef = doc(db, "jobs", id)
      await updateDoc(jobDocRef, {
        saveCount: increment(-1),
      })
      setSaveCount((prev) => prev - 1)
      toast({
        title: "Vaga removida",
        description: "A vaga foi removida dos seus favoritos.",
      })
    } else {
      await setDoc(jobRef, {
        id,
        company,
        logo,
        title,
        salary,
        type,
        level,
        posted,
        applicationUrl,
      })
      setIsSaved(true)
      // Increment save count
      const jobDocRef = doc(db, "jobs", id)
      await updateDoc(jobDocRef, {
        saveCount: increment(1),
      })
      setSaveCount((prev) => prev + 1)
      toast({
        title: "Vaga salva",
        description: "A vaga foi adicionada aos seus favoritos.",
      })
    }
  }

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(salary)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return "Ontem"
    } else if (diffDays <= 7) {
      return `${diffDays} dias atrás`
    } else {
      return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })
    }
  }

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/jobs/${id}` : ""
  const shareText = `Confira esta vaga de ${title} na ${company}!`

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    email: `mailto:?subject=${encodeURIComponent(`Vaga interessante: ${title}`)}&body=${encodeURIComponent(`Olá,

Encontrei esta vaga que pode te interessar:

${title} na ${company}

Confira mais detalhes em: ${shareUrl}`)}`,
  }

  const handleShare = async () => {
    setIsShareModalOpen(true)
    // Increment share count
    const jobRef = doc(db, "jobs", id)
    await updateDoc(jobRef, {
      shareCount: increment(1),
    })
  }

  const handleApplyJob = async () => {
    if (!user) {
      toast({
        title: "Ação necessária",
        description: (
          <div>
            Você precisa ter uma conta para marcar vagas como aplicadas.{" "}
            <Link href="/signup" className="text-[#7333DD] hover:underline">
              Cadastre-se agora
            </Link>
            !
          </div>
        ),
        duration: 5000,
      })
      return
    }

    try {
      const jobRef = doc(db, `users/${user.id}/appliedJobs/${id}`)
      if (isJobApplied) {
        await deleteDoc(jobRef)
        setIsJobApplied(false)
        // Decrement apply count
        const jobDocRef = doc(db, "jobs", id)
        await updateDoc(jobDocRef, {
          applyCount: increment(-1),
        })
        setApplyCount((prev) => prev - 1)
        toast({
          title: "Vaga desmarcada",
          description: "A vaga foi removida da sua lista de aplicações.",
        })
      } else {
        await setDoc(jobRef, { appliedAt: new Date() })
        setIsJobApplied(true)
        // Increment apply count
        const jobDocRef = doc(db, "jobs", id)
        await updateDoc(jobDocRef, {
          applyCount: increment(1),
        })
        setApplyCount((prev) => prev + 1)
        toast({
          title: "Vaga marcada como aplicada",
          description: "A vaga foi adicionada à sua lista de aplicações.",
        })
      }
    } catch (error) {
      console.error("Error updating applied job status:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o status da vaga. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleAnalyticsClick = () => {
    if (user) {
      setIsAnalyticsModalOpen(true)
    } else {
      setIsSignupPromptModalOpen(true)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Link href="/" className="inline-block mb-1 sm:mb-6">
        <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 px-2 py-1 sm:px-4 sm:py-2">
          <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Voltar para vagas
        </Button>
      </Link>

      <Card className="bg-[#1E293B] border-gray-700 shadow-lg">
        <div className="p-3 sm:p-6 space-y-3 sm:space-y-6">
          {isSponsored && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1 shadow-lg z-10">
              <Sparkles className="w-3 h-3" />
              <span>Destaque</span>
            </div>
          )}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center sm:gap-6 mb-4 sm:mb-8">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden p-2">
                <Image
                  src={logo || "/placeholder.svg"}
                  alt={company}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">{title}</h1>
                {isJobApplied && (
                  <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full inline-block ml-2">
                    Aplicado
                  </div>
                )}
                <p className="text-lg sm:text-xl text-gray-300">{company}</p>
              </div>
            </div>
            <div className="flex flex-row flex-wrap gap-4 sm:flex-col sm:items-end">
              <Button className="bg-[#7333DD] hover:bg-[#5d20c0] text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 flex-grow sm:w-auto flex items-center justify-center">
                <Link
                  href={`${applicationUrl}${applicationUrl.includes("?") ? "&" : "?"}utm_source=vagogh&utm_medium=referral&utm_campaign=${encodeURIComponent(title.replace(/\s+/g, "-"))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <span>Candidatar-se</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSaveJob}
                  className={`p-2 ${
                    isSaved ? "bg-[#7333DD] text-white" : "bg-white/10 text-white"
                  } hover:bg-[#5d20c0] hover:text-white rounded-full`}
                >
                  <Bookmark className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleShare}
                        className="bg-white/10 text-white hover:bg-white/20 p-2 rounded-full"
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Compartilhar vaga</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsReportModalOpen(true)}
                        className="bg-white/10 text-white hover:bg-white/20 p-2 rounded-full"
                      >
                        <AlertTriangle className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Denunciar vaga</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  variant="outline"
                  onClick={handleApplyJob}
                  className={`p-2 ${
                    isJobApplied ? "bg-green-500 text-white" : "bg-white/10 text-white"
                  } hover:bg-green-600 hover:text-white rounded-full`}
                >
                  <Check className="h-5 w-5" />
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleAnalyticsClick}
                        className="bg-white/10 text-white hover:bg-white/20 p-2 rounded-full"
                      >
                        <Building2 className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Análise da vaga</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 text-gray-200 bg-white/5 p-4 rounded-lg">
              <DollarSign className="h-6 w-6 text-[#F7D047]" />
              <div>
                <p className="text-sm text-gray-400">Salário</p>
                <span className="text-lg font-semibold">{formatSalary(salary)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-200 bg-white/5 p-4 rounded-lg">
              <Briefcase className="h-6 w-6 text-[#F7D047]" />
              <div>
                <p className="text-sm text-gray-400">Tipo de Contrato</p>
                <span className="text-lg font-semibold">{type}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-200 bg-white/5 p-4 rounded-lg">
              <GraduationCap className="h-6 w-6 text-[#F7D047]" />
              <div>
                <p className="text-sm text-gray-400">Nível</p>
                <span className="text-lg font-semibold">{level}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-gray-700">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">Descrição da Vaga</h2>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{description}</p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">Requisitos</h2>
              <ul className="space-y-2 sm:space-y-3">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                    <span className="text-[#7333DD] mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">Benefícios</h2>
              <ul className="space-y-2 sm:space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                    <span className="text-[#7333DD] mt-1">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {tags.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-[#2C3E50] text-white px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 pt-4 sm:pt-6 border-t border-gray-700">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-[#7333DD]" />
            <span>Publicado {formatDate(posted)}</span>
          </div>
        </div>
      </Card>

      {user ? (
        <CompatibilitySection user={user} job={{ title, requirements, level }} />
      ) : (
        <Card className="bg-[#1E293B] border-gray-700 p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Veja sua compatibilidade</h2>
          <p className="text-gray-300 mb-6">
            Crie uma conta para ver o quanto seu perfil é compatível com esta vaga e aumente suas chances de ser
            contratado!
          </p>
          <Button asChild className="w-full bg-[#7333DD] hover:bg-[#5d20c0] text-white">
            <Link href="/signup">Criar conta</Link>
          </Button>
        </Card>
      )}
      {user ? (
        <Card className="mt-8 bg-[#1E293B] border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Sobre {company}</CardTitle>
          </CardHeader>
          <CardContent>
            {companyInfo ? (
              <div className="space-y-4">
                <p className="text-gray-300">{companyInfo.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-white">Fundada em:</span>{" "}
                    <span className="text-gray-300">{companyInfo.foundedYear}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Tamanho:</span>{" "}
                    <span className="text-gray-300">{companyInfo.size}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Indústria:</span>{" "}
                    <span className="text-gray-300">{companyInfo.industry}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-300">Ainda não temos dados desta empresa.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-8 bg-[#1E293B] border-gray-700">
          <CardContent className="text-center py-8">
            <p className="text-white text-lg mb-4">Crie uma conta para ver informações e mais vagas desta empresa.</p>
            <Button asChild className="bg-[#7333DD] hover:bg-[#5d20c0] text-white">
              <Link href="/signup">Criar Conta</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {user && otherJobs.length > 0 && (
        <Card className="mt-8 bg-[#1E293B] border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Mais Vagas de {company}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {otherJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="block">
                  <div className="bg-[#2C3E50] p-4 rounded-lg hover:bg-[#34495E] transition-colors">
                    <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                    <p className="text-gray-300">{job.location}</p>
                    <p className="text-gray-400 text-sm">{job.type}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <ShareJobModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        jobTitle={title}
        jobUrl={typeof window !== "undefined" ? `${window.location.origin}/jobs/${id}` : ""}
      />
      <ReportJobModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        jobId={id}
        jobTitle={title}
        jobUrl={typeof window !== "undefined" ? `${window.location.origin}/jobs/${id}` : ""}
      />
      {user && (
        <AnalyticsModal
          isOpen={isAnalyticsModalOpen}
          onClose={() => setIsAnalyticsModalOpen(false)}
          jobTitle={title}
          viewCount={viewCount}
          saveCount={saveCount}
          shareCount={shareCount}
          applyCount={applyCount}
        />
      )}
      <SignupPromptModal isOpen={isSignupPromptModalOpen} onClose={() => setIsSignupPromptModalOpen(false)} />
    </div>
  )
}

