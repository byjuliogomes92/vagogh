"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bookmark, Sparkles, FolderPlus, Check, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/firebase"
import { doc, setDoc, deleteDoc, getDoc, collection, query, getDocs } from "firebase/firestore"
import { useToast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AnalyticsModal } from "./analytics-modal"
import { LimitReachedModal } from "@/components/limit-reached-modal"

// ...

type Job = {
  id: string
  company: string
  logo: string
  title: string
  location: string
  salary?: number
  type: string
  level: string
  posted: Date | string
  description: string
  requirements: string[]
  benefits: string[]
  tags: string[]
  applicationUrl?: string
  isSponsored?: boolean
  isApplied?: boolean
  viewCount: number
  saveCount: number
  shareCount: number
  applyCount: number
}

interface JobCardProps {
  id: string
  company: string
  logo: string
  title: string
  location: string
  salary?: number
  type: string
  level: string
  posted: Date | string
  applicationUrl?: string
  index: number
  isSaved?: boolean
  isSponsored?: boolean
  isApplied?: boolean
  viewCount: number
  description: string
}

const pastelColors = [
  "bg-[#FFE5E5]", // Pastel Red
  "bg-[#FFE8F0]", // Pastel Pink
  "bg-[#E5E5FF]", // Pastel Blue
  "bg-[#FFFFE5]", // Pastel Yellow
  "bg-[#FFE5FF]", // Pastel Purple
  "bg-[#E5FFFF]", // Pastel Cyan
  "bg-[#FFF0E5]", // Pastel Orange
  "bg-[#E5F0FF]", // Pastel Light Blue
]

const getCardColor = (index: number) => {
  return pastelColors[index % pastelColors.length]
}

const formatDate = (date: Date | string) => {
  let postedDate: Date

  if (typeof date === "string") {
    postedDate = new Date(date)
  } else if (date instanceof Date) {
    postedDate = date
  } else {
    console.error("Invalid date format:", date)
    return "Data inválida"
  }

  if (isNaN(postedDate.getTime())) {
    console.error("Invalid date:", date)
    return "Data inválida"
  }

  const now = new Date()
  const diffTime = Math.abs(now.getTime() - postedDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    return "Ontem"
  } else if (diffDays <= 7) {
    return `${diffDays} dias atrás`
  } else {
    return postedDate.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })
  }
}

export function JobCard({
  id,
  company,
  logo,
  title,
  location,
  salary,
  type,
  level,
  posted,
  applicationUrl,
  index,
  isSaved: initialIsSaved = false,
  isSponsored,
  isApplied = false,
  viewCount,
  description,
}: JobCardProps) {
  const { user, viewCount: globalViewCount, incrementViewCount } = useAuth()
  const { toast } = useToast()
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [isJobApplied, setIsJobApplied] = useState(isApplied)
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false)
  const [currentViewCount, setCurrentViewCount] = useState(viewCount) // Added state for updated view count
  const [folders, setFolders] = useState([])
  const [isLimitReachedModalOpen, setIsLimitReachedModalOpen] = useState(false) // Added state for modal visibility

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
    setIsJobApplied(isApplied)
  }, [isApplied])

  useEffect(() => {
    const fetchFolders = async () => {
      if (user) {
        const foldersQuery = query(collection(db, `users/${user.id}/jobFolders`))
        const foldersSnapshot = await getDocs(foldersQuery)
        const foldersList = foldersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setFolders(foldersList)
      }
    }
    fetchFolders()
  }, [user])

  useEffect(() => {
    const fetchUpdatedViewCount = async () => {
      const jobRef = doc(db, "jobs", id) // Corrected path to fetch viewCount
      const jobSnap = await getDoc(jobRef)
      if (jobSnap.exists()) {
        const jobData = jobSnap.data() as any // Type assertion to access viewCount
        setCurrentViewCount(jobData.viewCount || 0)
      }
    }

    fetchUpdatedViewCount()
  }, [id]) // Added useEffect to fetch updated view count

  useEffect(() => {
    setIsSaved(initialIsSaved)
  }, [initialIsSaved])

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

    try {
      const newSavedState = !isSaved
      setIsSaved(newSavedState) // Atualiza o estado local imediatamente

      if (newSavedState) {
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
          folderId,
        })
        console.log("Vaga salva com sucesso")
        toast({
          title: "Vaga salva",
          description: "A vaga foi adicionada aos seus favoritos.",
        })
      } else {
        await deleteDoc(jobRef)
        console.log("Vaga removida dos favoritos")
        toast({
          title: "Vaga removida",
          description: "A vaga foi removida dos seus favoritos.",
        })
      }
    } catch (error) {
      console.error("Error saving/removing job:", error)
      setIsSaved(!newSavedState) // Reverte o estado local em caso de erro
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar ou remover a vaga. Tente novamente.",
        variant: "destructive",
      })
    }
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
        toast({
          title: "Vaga desmarcada",
          description: "A vaga foi removida da sua lista de aplicações.",
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
          appliedAt: new Date(),
          location,
          userId: user.id,
        })
        setIsJobApplied(true)
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-xl p-5 ${getCardColor(index)} relative ${isJobApplied ? "border-2 border-green-500" : ""}`}
    >
      {isSponsored && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1 shadow-lg z-10">
          <Sparkles className="w-3 h-3" />
          <span>Destaque</span>
        </div>
      )}
      {isJobApplied && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Aplicado
        </div>
      )}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden p-2">
              <Image
                src={logo || "/placeholder.svg"}
                alt={`${company} logo`}
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight">{title}</h3>
              <p className="text-gray-600 text-sm">{company}</p>
              <p className="text-gray-500 text-sm">{location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:bg-black/5"
                  onClick={(e) => {
                    e.preventDefault()
                    handleSaveJob()
                  }}
                >
                  {isSaved ? <Bookmark className="h-5 w-5 fill-current" /> : <Bookmark className="h-5 w-5" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => handleSaveJob()}>
                  {isSaved ? "Remover dos favoritos" : "Salvar vaga"}
                </DropdownMenuItem>
                {folders.map((folder) => (
                  <DropdownMenuItem key={folder.id} onSelect={() => handleSaveJob(folder.id)}>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    {isSaved ? `Mover para ${folder.name}` : `Salvar em ${folder.name}`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleApplyJob}
                    className={`text-gray-600 hover:bg-green-100 transition-colors duration-200 ${
                      isJobApplied ? "text-green-500 hover:text-green-600 hover:bg-green-50" : "hover:text-green-500"
                    }`}
                  >
                    <Check className={`h-5 w-5 ${isJobApplied ? "fill-current" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isJobApplied ? "Marcar como não aplicada" : "Marcar como aplicada"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-white/50 text-gray-900 font-normal rounded-full px-3">
            {type}
          </Badge>
          <Badge variant="outline" className="bg-white/50 text-gray-900 font-normal rounded-full px-3">
            {level}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="font-semibold text-gray-900">
            {salary
              ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(salary)
              : "A combinar"}
          </div>
          <div
            className="flex items-center space-x-2 text-sm text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={() => setIsAnalyticsModalOpen(true)}
          >
            <Eye className="w-4 h-4" />
            <span>{currentViewCount} visualizações</span> {/* Updated to use currentViewCount */}
          </div>
        </div>

        <div className="pt-2">
          <Link
            href={`/jobs/${id}`}
            className="w-full"
            onClick={(e) => {
              if (!user && globalViewCount >= 5) {
                e.preventDefault()
                setIsLimitReachedModalOpen(true)
              } else if (!user) {
                incrementViewCount()
              }
            }}
          >
            <Button className="w-full bg-[#7333DD] hover:bg-[#5d20c0] text-white">Detalhes</Button>
          </Link>
        </div>

        <div className="text-xs text-gray-500">Publicado {formatDate(posted)}</div>
      </div>
      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        jobTitle={title}
        viewCount={viewCount}
        saveCount={isSaved ? 1 : 0}
        shareCount={0}
        applyCount={isJobApplied ? 1 : 0}
      />
      <LimitReachedModal
        isOpen={isLimitReachedModalOpen}
        onClose={() => setIsLimitReachedModalOpen(false)}
        limitType="view"
      />
    </motion.div>
  )
}

