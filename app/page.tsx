"use client"
import type React from "react"
import { useCallback, useMemo, useState, useEffect } from "react"
import { NavBar } from "@/components/nav-bar"
import { SearchFilters, type FilterCriteria } from "@/components/search-filters"
import { JobCard } from "@/components/job-card"
import { DonationBanner } from "@/components/donation-banner"
import { SavedFilters } from "@/components/saved-filters"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/firebase"
import { query, collection, getDocs } from "firebase/firestore"
import { toast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import Image from "next/image"
import { Search, Briefcase, Users, Zap, Send, ArrowRight, Bookmark, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import { AnimatedCounter } from "@/components/AnimatedCounter"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { LimitReachedModal } from "@/components/limit-reached-modal"
import { ChevronUp } from "lucide-react"

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
  isSponsored: boolean
  countryCode?: string
  details: string
  viewCount: number
}

const initialFilters: FilterCriteria = {
  search: "",
  location: "all",
  experience: "all",
  contractType: "all",
  salaryRange: [1000, 30000],
  selectedTags: [],
  datePosted: "all",
  country: "all",
  countryCode: "XX",
  company: "",
  selectedBenefits: [],
}

type SortOption = "recent" | "relevant" | "salary" | "oldest" | "highSalary" | "lowSalary"

type SavedFilter = {
  id: string
  name: string
  filter: FilterCriteria
}

const Home: React.FC = () => {
  const { user, searchCount, incrementSearchCount, setSearchCount } = useAuth()
  const [filters, setFilters] = useState<FilterCriteria>(initialFilters)
  const [sortBy, setSortBy] = useState<SortOption>("recent")
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])
  const [savedJobIds, setSavedJobIds] = useState<string[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [showScrollIcon, setShowScrollIcon] = useState(true)
  const [isSavedFiltersOpen, setIsSavedFiltersOpen] = useState(false)
  const [isLimitReachedModalOpen, setIsLimitReachedModalOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [showScrollTop, setShowScrollTop] = useState(false)

  const jobsPerPage = 6

  const fetchJobs = async () => {
    console.log("Iniciando fetchJobs...");
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fazendo requisição para /api/jobs...");
      const response = await fetch("/api/jobs");
      console.log("Resposta recebida:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Dados recebidos:", data);
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch jobs");
      }
      console.log("Vagas recebidas:", data.jobs);
      setJobs(data.jobs);
      if (!user && searchCount < 5) {
        incrementSearchCount();
      }
    } catch (err) {
      console.error("Erro ao buscar vagas:", err);
      setError("Failed to load jobs. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load jobs. Please try again later.",
        variant: "destructive",
      });
    } finally {
      console.log("Finalizando fetchJobs...");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect chamado", { filters, sortBy, currentPage, user, searchCount, jobsLength: jobs.length });
    if (jobs.length === 0) { // Remova a condição !isLoading
      console.log("Chamando fetchJobs...");
      fetchJobs();
    } else {
      console.log("Condição NÃO atendida: jobs.length =", jobs.length);
    }
  }, [filters, sortBy, currentPage, user, searchCount]);

  useEffect(() => {
    const loadSavedFilters = async () => {
      if (user) {
        try {
          const q = query(collection(db, `users/${user.id}/savedFilters`))
          const querySnapshot = await getDocs(q)
          const loadedFilters: SavedFilter[] = []
          querySnapshot.forEach((doc) => {
            loadedFilters.push({ id: doc.id, ...doc.data() } as SavedFilter)
          })
          setSavedFilters(loadedFilters)
        } catch (error) {
          console.error("Error loading saved filters:", error)
          toast({
            title: "Error",
            description: "Failed to load saved filters. Please try again later.",
            variant: "destructive",
          })
        }
      }
    }

    loadSavedFilters()
  }, [user])

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (user) {
        try {
          const q = query(collection(db, `users/${user.id}/savedJobs`))
          const querySnapshot = await getDocs(q)
          const savedIds = querySnapshot.docs.map((doc) => doc.id)
          setSavedJobIds(savedIds)
        } catch (error) {
          console.error("Error fetching saved jobs:", error)
          toast({
            title: "Error",
            description: "Failed to load saved jobs. Please try again later.",
            variant: "destructive",
          })
        }
      }
    }

    fetchSavedJobs()
  }, [user])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 2) {
        setShowScrollIcon(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (searchValue) {
      setOpen(true)
    }
  }, [searchValue])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleFilterChange = useCallback((key: keyof FilterCriteria, value: any) => {
    setFilters((prev) => {
      if (prev[key] === value) return prev; // Evita atualização desnecessária
      return { ...prev, [key]: value };
    });
  }, []);

  const handleSaveFilter = useCallback(
    (name: string, filter: FilterCriteria) => {
      if (user) {
        const newFilter = { id: Date.now().toString(), name, filter }
        setSavedFilters((prev) => [...prev, newFilter])
      }
    },
    [user],
  )

  const handleDeleteSavedFilter = useCallback((id: string) => {
    setSavedFilters((prev) => prev.filter((filter) => filter.id !== id))
  }, [])

  const handleApplySavedFilter = useCallback((filter: FilterCriteria) => {
    setFilters(filter)
  }, [])

  const handleSearch = () => {
    if (!user && searchCount >= 15) {
      setIsLimitReachedModalOpen(true)
    } else {
      fetchJobs()
    }
  }

  const jobTitles = [
    "Desenvolvedor Frontend",
    "Desenvolvedor Backend",
    "Designer UX/UI",
    "Gerente de Produto",
    "Engenheiro de DevOps",
    "Cientista de Dados",
    "Analista de Marketing Digital",
    "Especialista em SEO",
    "Desenvolvedor Mobile",
    "Arquiteto de Software",
  ]

  const filteredJobsForSuggestions = useMemo(() => {
    return jobTitles.filter((job) => job.toLowerCase().includes(searchValue.toLowerCase()))
  }, [searchValue])

  const filteredJobs = useMemo(() => {
    console.log("Recalculando filteredJobs...");
    return jobs.filter((job) => {
      const matchesSearch =
        (job.title?.toLowerCase() || "").includes(filters.search.toLowerCase()) ||
        (job.company?.toLowerCase() || "").includes(filters.search.toLowerCase())

      const matchesLocation =
        (job.location?.toLowerCase() || "").includes("todo brasil") ||
        (job.location?.toLowerCase() || "").includes("remoto") ||
        (job.location?.toLowerCase() || "").includes("all")

      const matchesExperience =
        filters.experience === "all" ||
        (filters.experience === "junior" && (job.level?.toLowerCase() || "").includes("júnior")) ||
        (filters.experience === "mid" && (job.level?.toLowerCase() || "").includes("pleno")) ||
        (filters.experience === "senior" && (job.level?.toLowerCase() || "").includes("sênior"))

      const matchesContractType =
        filters.contractType === "all" ||
        (filters.contractType === "full" && (job.type?.toLowerCase() || "").includes("tempo integral")) ||
        (filters.contractType === "part" && (job.type?.toLowerCase() || "").includes("meio período")) ||
        (filters.contractType === "contract" && (job.type?.toLowerCase() || "").includes("contrato"))

      const matchesSalary =
        !job.salary || (job.salary >= filters.salaryRange[0] && job.salary <= filters.salaryRange[1])

      const matchesTags =
        filters.selectedTags.length === 0 ||
        filters.selectedTags.some(
          (tag) =>
            (job.title?.toLowerCase() || "").includes(tag.toLowerCase()) ||
            (job.company?.toLowerCase() || "").includes(tag.toLowerCase()),
        )

      const matchesDatePosted = (() => {
        if (filters.datePosted === "all") return true
        const postedDate = job.posted instanceof Date ? job.posted : new Date(job.posted)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - postedDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (filters.datePosted === "7d") return diffDays <= 7
        if (filters.datePosted === "30d") return diffDays <= 30
        return true
      })()

      const matchesCountry =
        filters.country === "all" ||
        (filters.country === "remote" && (job.location?.toLowerCase() || "").includes("remoto")) ||
        (job.location?.toLowerCase() || "").includes(filters.country.toLowerCase()) ||
        job.countryCode === filters.countryCode

      const matchesCompany = filters.company
        ? (job.company?.toLowerCase() || "") === filters.company.toLowerCase()
        : true

      const matchesBenefits =
        filters.selectedBenefits.length === 0 ||
        filters.selectedBenefits.some((benefit) => (job.details?.toLowerCase() || "").includes(benefit.toLowerCase()))

      console.log(`Job: ${job.title}, Company: ${job.company}, Matches: ${matchesCompany}`)

      return (
        matchesSearch &&
        matchesLocation &&
        matchesExperience &&
        matchesContractType &&
        matchesSalary &&
        matchesTags &&
        matchesDatePosted &&
        matchesCountry &&
        matchesCompany &&
        matchesBenefits
      )
    })
  }, [jobs, filters])

  const sortedJobs = useMemo(() => {
    console.log("Recalculando sortedJobs...");
    if (filteredJobs.length === 0) return [];
    if (jobs.length === 0) return [];
    return [...filteredJobs].sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.posted).getTime() - new Date(a.posted).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.posted).getTime() - new Date(b.posted).getTime()
      } else if (sortBy === "highSalary") {
        return (b.salary || 0) - (a.salary || 0)
      } else if (sortBy === "lowSalary") {
        return (a.salary || 0) - (b.salary || 0)
      }
      return 0
    })
  }, [filteredJobs, sortBy])

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage
    return sortedJobs.slice(startIndex, startIndex + jobsPerPage)
  }, [sortedJobs, currentPage, jobsPerPage])

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption)
  }

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }, [])

  const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
    <motion.div
      className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="bg-gradient-to-r from-[#7333DD] to-[#5d20c0] rounded-full p-3 inline-block mb-4">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  )

  const testimonials = [
    {
      quote: "O VaGogh transformou minha busca por emprego. Encontrei meu trabalho dos sonhos em apenas duas semanas!",
      author: "Maria S., Designer UX",
    },
    {
      quote: "A plataforma mais intuitiva que já usei. As recomendações de vagas são sempre relevantes.",
      author: "João P., Desenvolvedor Full Stack",
    },
    {
      quote: "Graças ao VaGogh, consegui uma oportunidade internacional sem sair de casa.",
      author: "Ana L., Gerente de Produto",
    },
    {
      quote: "As dicas da newsletter me ajudaram a me preparar melhor para as entrevistas. Recomendo!",
      author: "Carlos M., Analista de Dados",
    },
    {
      quote: "A comunidade do VaGogh é incrível. Fiz networking valioso e aprendi muito com outros profissionais.",
      author: "Fernanda R., Marketing Digital",
    },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a]">
      <div className="relative z-10 flex flex-col flex-grow">
        <DonationBanner />
        <NavBar />
        <main className="container mx-auto px-4 py-8 pt-24 pb-24 md:pb-8 flex-grow">
          {user && (
            <div
              className="absolute top-0 left-0 right-0 z-[-1]"
              style={{
                backgroundImage:
                  "url('https://elements-resized.envatousercontent.com/envato-shoebox/28c4/7d52-cf81-4199-99ba-5cbfa316f465/rm208batch15-eye-01.jpg?w=1600&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=98b433000d4b27b7d1bc8c398e0903fad68d5a4f003f0559211ea6be64fdabf8')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "100%",
                opacity: 0.1,
              }}
            />
          )}
          {user && (
            <motion.h3
              className="text-3xl font-black text-[#f8f5ff] mb-4 font-playfair text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {user.firstName}, busque sua próxima oportunidade remota
            </motion.h3>
          )}
          {!user ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-12">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-8 mb-8 px-4 sm:px-8 pt-4 sm:pt-8 w-full relative">
                  <div className="w-full md:w-1/2 space-y-6">
                    <motion.div
                      className="inline-block bg-[#0f172a] text-white text-sm font-bold px-4 py-2 rounded-full mb-4 border border-gray-700"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <AnimatedCounter end={1000} duration={2} /> vagas incríveis
                    </motion.div>
                    <motion.h1
                      className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FED853] to-[#fff5d1] font-playfair`}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      Trabalhe de qualquer lugar, até do sofá!
                    </motion.h1>
                    <motion.p
                      className="text-xl text-gray-300 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      Conectamos você às melhores oportunidades de trabalho remoto em todo o mundo.
                    </motion.p>
                  </div>
                  <motion.div
                    className="w-full md:w-1/2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        scale: [1, 1.02, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                    >
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.https://github.com/byjuliogomes92/vagogh/blob/main/public/vagogh-home.png?raw=true-storage.com/vagogh_img_02-cGkocOe3N4VO3qNMXRIJHeIBOoA1du.svg"
                        alt="Modern Work Illustration"
                        width={600}
                        height={400}
                        className="w-full h-auto object-contain max-w-md mx-auto relative z-10"
                        priority
                      />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          ) : null}
          <div className="relative z-10">
            <div className="pt-4">
              <div className="mb-8">
                <SearchFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onSaveFilter={handleSaveFilter}
                  onSearch={handleSearch}
                  open={open}
                  setOpen={setOpen}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  filteredJobs={filteredJobsForSuggestions}
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 mt-8 space-y-4 sm:space-y-0">
                <h2 className="text-xl font-semibold text-white">Vagas Encontradas</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  {user && (
                    <Button
                      onClick={() => setIsSavedFiltersOpen(!isSavedFiltersOpen)}
                      className="bg-[#1E293B] text-white hover:bg-[#2C3E50] w-full sm:w-auto"
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      Filtros Salvos
                      {isSavedFiltersOpen ? (
                        <ChevronUp className="ml-2 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  )}
                  <Select onValueChange={handleSortChange} defaultValue={sortBy}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-[#1E293B] text-white border-gray-700">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Mais recentes</SelectItem>
                      <SelectItem value="oldest">Mais antigas</SelectItem>
                      <SelectItem value="highSalary">Maior salário</SelectItem>
                      <SelectItem value="lowSalary">Menor salário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {user && (
              <AnimatePresence>
                {isSavedFiltersOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="col-span-12 mb-8 overflow-hidden"
                  >
                    <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                      <SavedFilters
                        filters={savedFilters}
                        onDelete={handleDeleteSavedFilter}
                        onApply={handleApplySavedFilter}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <div className="lg:col-span-12">
              <div className="mt-8">
                {isLoading ? (
                  <div className="text-center mt-8">
                    <p className="text-white text-xl">Carregando vagas...</p>
                  </div>
                ) : error ? (
                  <div className="text-center mt-8">
                    <p className="text-red-500 text-xl">{error}</p>
                    <Button
                      onClick={() => window.location.reload()}
                      className="mt-4 bg-[#7333DD] hover:bg-[#5d20c0] text-white"
                    >
                      Tentar novamente
                    </Button>
                  </div>
                ) : (
                  <>
                    {paginatedJobs.length > 0 ? (
                      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {paginatedJobs.map((job, index) => (
                          <JobCard
                            key={`${job.id}-${index}`}
                            {...job}
                            index={index}
                            isSaved={savedJobIds.includes(job.id)}
                            isSponsored={job.isSponsored}
                            viewCount={job.viewCount}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center mt-8 space-y-4">
                        
                      </div>
                    )}
                    {paginatedJobs.length > 0 && (
                      <div className="mt-8 flex justify-center relative z-10">
                        <Pagination
                          totalItems={sortedJobs.length}
                          itemsPerPage={jobsPerPage}
                          currentPage={currentPage}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    )}
                  </>
                )}
                {!isLoading && !error && sortedJobs.length === 0 && (
                  <div className="text-center mt-8 space-y-4">
                    <p className="text-white text-xl font-semibold">Ops! Não encontramos vagas com esses filtros.</p>
                    <p className="text-gray-400">Tente ajustar seus critérios de busca.</p>
                    <p className="text-gray-400">Pequenas mudanças podem revelar novas oportunidades!</p>
                    <Button
                      onClick={() => {
                        setFilters(initialFilters)
                        setCurrentPage(1)
                      }}
                      className="mt-4 bg-[#7333DD] hover:bg-[#5d20c0] text-white"
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {!user && (
            <>
              <section className="mt-24 mb-16">
                <motion.h2
                  className="text-4xl font-bold text-white mb-8 text-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Descubra Todas as Possibilidades
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <FeatureCard
                    icon={Search}
                    title="Busca Inteligente"
                    description="Encontre as melhores vagas com nossa tecnologia de busca avançada."
                  />
                  <FeatureCard
                    icon={Briefcase}
                    title="Vagas Exclusivas"
                    description="Acesse oportunidades de trabalho remoto em empresas de todo o mundo."
                  />
                  <FeatureCard
                    icon={Users}
                    title="Networking Global"
                    description="Conecte-se com profissionais e empresas de diversos países."
                  />
                  <FeatureCard
                    icon={Zap}
                    title="Perfil Otimizado"
                    description="Destaque suas habilidades e aumente suas chances de contratação."
                  />
                </div>
                <motion.div
                  className="mt-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Link href="/signup" className="inline-block">
                    <Button
                      size="lg"
                      className="bg-[#7333DD] hover:bg-[#5d20c0] text-white font-semibold transition-all duration-300 flex items-center space-x-2"
                    >
                      Comece Sua Jornada Agora
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </motion.div>
              </section>
              <section className="mb-24">
                <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-lg p-8 shadow-2xl">
                  <motion.h2
                    className="text-4xl font-bold text-[#f7d047] mb-4 text-center font-playfair italic"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Turbine sua Carreira com Insights Exclusivos
                  </motion.h2>
                  <motion.p
                    className="text-gray-300 text-center mb-8 text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Junte-se à nossa comunidade e receba dicas valiosas de especialistas em recrutamento, tendências do
                    mercado de trabalho e estratégias para se destacar em entrevistas.
                  </motion.p>
                  <motion.form
                    className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Input
                      type="email"
                      placeholder="Seu melhor e-mail"
                      className="flex-grow bg-[#2C3E50] text-white border-gray-700 focus:border-[#3B82F6] focus:ring-[#3B82F6] transition-all duration-300"
                    />
                    <Button
                      type="submit"
                      className="bg-[#7333DD] hover:bg-[#5d20c0] text-white font-semibold transition-all duration-300 flex items-center space-x-2"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      <span>Inscrever-se</span>
                    </Button>
                  </motion.form>
                </div>
                <div className="mt-12">
                  <h3 className="text-2xl font-semibold text-white mb-6 text-center">O que dizem nossos usuários</h3>
                  <InfiniteMovingCards items={testimonials} direction="right" speed="slow">
                    {(testimonial) => (
                      <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-none">
                        <CardContent className="p-6">
                          <p className="text-gray-300 italic mb-4">"{testimonial.quote}"</p>
                          <p className="text-white font-semibold">{testimonial.author}</p>
                        </CardContent>
                      </Card>
                    )}
                  </InfiniteMovingCards>
                </div>
              </section>
            </>
          )}
          {!user && showScrollIcon && (
            <motion.div
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            >
              <ChevronDown className="w-10 h-10 text-white" />
            </motion.div>
          )}
          {!user && (
            <LimitReachedModal
              isOpen={isLimitReachedModalOpen}
              onClose={() => setIsLimitReachedModalOpen(false)}
              limitType="search"
            />
          )}
        </main>
      </div>
      {user && <BottomNavBar />}
      {showScrollTop && (
        <Button
          className="fixed bottom-8 right-8 bg-[#7333DD] hover:bg-[#5d20c0] text-white rounded-full p-2 z-50"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}

export default Home

