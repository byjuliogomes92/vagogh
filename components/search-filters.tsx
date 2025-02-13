"use client"

import { useState } from "react"
import { Search, Filter, Save, ChevronDown, ChevronUp, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useCallback, useEffect } from "react"
import { SaveFilterModal } from "./save-filter-modal"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/firebase"
import { collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import ReactCountryFlag from "react-country-flag"
import { CountrySelector } from "./country-selector"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export type FilterCriteria = {
  search: string
  experience: string
  contractType: string
  salaryRange: [number, number]
  selectedTags: string[]
  datePosted: string
  country: string
  countryCode: string
  company: string | null
  selectedBenefits: string[]
}

type PopularCompany = {
  name: string
  logo: string
  jobCount: number
}

type SearchFiltersProps = {
  filters: FilterCriteria
  onFilterChange: (key: keyof FilterCriteria, value: any) => void
  onSaveFilter: (name: string, filter: FilterCriteria) => void
}

const jobTags = [
  { name: "Designer", color: "pink-500 hover:bg-pink-600" },
  { name: "Front-end", color: "blue-500 hover:bg-blue-600" },
  { name: "Back-end", color: "green-500 hover:bg-green-600" },
  { name: "Full-stack", color: "purple-500 hover:bg-purple-600" },
  { name: "Cientista de Dados", color: "yellow-500 hover:bg-yellow-600" },
  { name: "DevOps", color: "cyan-500 hover:bg-cyan-600" },
  { name: "UX/UI", color: "red-500 hover:bg-red-600" },
  { name: "Mobile", color: "lime-500 hover:bg-lime-600" },
  { name: "Product Manager", color: "indigo-500 hover:bg-indigo-600" },
]

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

const countries = [
  { value: "all", label: "Todos os países", code: "XX" },
  { value: "remote", label: "Totalmente remoto", code: "XX" },
  { value: "brazil", label: "Brasil", code: "BR" },
  { value: "usa", label: "Estados Unidos", code: "US" },
  { value: "canada", label: "Canadá", code: "CA" },
  { value: "uk", label: "Reino Unido", code: "GB" },
  { value: "germany", label: "Alemanha", code: "DE" },
  { value: "france", label: "França", code: "FR" },
  { value: "spain", label: "Espanha", code: "ES" },
  { value: "portugal", label: "Portugal", code: "PT" },
  { value: "italy", label: "Itália", code: "IT" },
  { value: "netherlands", label: "Países Baixos", code: "NL" },
  { value: "australia", label: "Austrália", code: "AU" },
  { value: "japan", label: "Japão", code: "JP" },
  { value: "china", label: "China", code: "CN" },
  { value: "india", label: "Índia", code: "IN" },
  { value: "russia", label: "Rússia", code: "RU" },
  { value: "mexico", label: "México", code: "MX" },
  { value: "argentina", label: "Argentina", code: "AR" },
  { value: "south_africa", label: "África do Sul", code: "ZA" },
  { value: "sweden", label: "Suécia", code: "SE" },
  { value: "norway", label: "Noruega", code: "NO" },
  { value: "denmark", label: "Dinamarca", code: "DK" },
  { value: "finland", label: "Finlândia", code: "FI" },
  { value: "switzerland", label: "Suíça", code: "CH" },
]

const benefits = [
  { value: "vale-transporte", label: "Vale-transporte", emoji: "🚌" },
  { value: "vale-refeicao", label: "Vale Refeição", emoji: "🍽️" },
  { value: "vale-alimentacao", label: "Vale Alimentação", emoji: "🛒" },
  { value: "assistencia-medica", label: "Assistência médica", emoji: "🏥" },
  { value: "assistencia-odontologica", label: "Assistência odontológica", emoji: "🦷" },
  { value: "totalpass", label: "TotalPass", emoji: "🏋️" },
  { value: "wellhub", label: "Wellhub", emoji: "🧘" },
  { value: "day-off", label: "Day-off", emoji: "🏖️" },
  { value: "auxilio-creche", label: "Auxílio Creche", emoji: "👶" },
  { value: "seguro-de-vida", label: "Seguro de vida", emoji: "🛡️" },
  { value: "auxilio-home-office", label: "Auxílio home office", emoji: "🏠" },
  { value: "parcerias", label: "Parcerias", emoji: "🤝" },
]

const initialFilters: FilterCriteria = {
  search: "",
  experience: "all",
  contractType: "all",
  salaryRange: [1000, 30000],
  selectedTags: [],
  datePosted: "all",
  country: "all",
  countryCode: "XX",
  company: null,
  selectedBenefits: [],
}

const QuestionMarkTooltip = ({ content }: { content: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#25344C] text-white text-xs font-bold ml-2 cursor-help">
          ?
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export function SearchFilters({ filters, onFilterChange, onSaveFilter }: SearchFiltersProps) {
  const { user } = useAuth()
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [popularCompanies, setPopularCompanies] = useState<PopularCompany[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [filteredCompanies, setFilteredCompanies] = useState<PopularCompany[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterName, setFilterName] = useState("")

  const fetchPopularCompanies = useCallback(async () => {
    setIsLoading(true)
    const companiesRef = collection(db, "jobs")
    const q = query(companiesRef, orderBy("company"), limit(10))
    const querySnapshot = await getDocs(q)
    const companies: { [key: string]: PopularCompany } = {}
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      if (!companies[data.company]) {
        companies[data.company] = {
          name: data.company,
          logo: data.logo || "/placeholder.svg",
          jobCount: 1,
        }
      } else {
        companies[data.company].jobCount++
      }
    })
    setPopularCompanies(Object.values(companies))
    setFilteredCompanies(Object.values(companies))
    setIsLoading(false)
    console.log("Fetched companies:", companies) // Log for debugging
  }, [])

  useEffect(() => {
    fetchPopularCompanies()
  }, [fetchPopularCompanies])

  const handleInputChange = useCallback(
    (key: keyof FilterCriteria, value: any) => {
      if (key === "country") {
        const selectedCountry = countries.find((c) => c.value === value)
        onFilterChange("country", value)
        onFilterChange("countryCode", selectedCountry?.code || "XX")
      } else if (key === "selectedBenefits") {
        // Certifique-se de que estamos passando os valores corretos dos benefícios
        onFilterChange(key, value)
      } else {
        onFilterChange(key, value)
      }
    },
    [onFilterChange],
  )

  const handleTagClick = useCallback(
    (tag: string) => {
      onFilterChange(
        "selectedTags",
        filters.selectedTags.includes(tag)
          ? filters.selectedTags.filter((t) => t !== tag)
          : [...filters.selectedTags, tag],
      )
    },
    [filters.selectedTags, onFilterChange],
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleSaveFilter = async (name: string) => {
    if (user) {
      setIsSaving(true)
      try {
        const filterRef = await addDoc(collection(db, `users/${user.id}/savedFilters`), {
          name,
          filter: filters,
          createdAt: new Date(),
        })
        console.log("Filter saved with ID: ", filterRef.id)
        onSaveFilter(name, filters)
        setIsSaveModalOpen(false)
      } catch (error) {
        console.error("Error saving filter: ", error)
        // Add error notification for the user here
      } finally {
        setIsSaving(false)
      }
    }
  }

  const filteredJobs = jobTitles.filter((job) => job.toLowerCase().includes(searchValue.toLowerCase()))

  useEffect(() => {
    if (searchValue) {
      setOpen(true)
    }
  }, [searchValue])

  const SelectedCountry = ({ value }: { value: string }) => {
    const country = countries.find((c) => c.value === value)
    if (!country) return null
    return (
      <div className="flex items-center space-x-2">
        {country.code !== "XX" && (
          <ReactCountryFlag
            countryCode={country.code}
            svg
            style={{
              width: "1em",
              height: "1em",
            }}
            title={country.label}
          />
        )}
        <span>{country.label}</span>
      </div>
    )
  }

  const handleCountrySelect = useCallback(
    (country: { value: string; code: string }) => {
      handleInputChange("country", country.value)
      handleInputChange("countryCode", country.code)
    },
    [handleInputChange],
  )

  const handleCompanySelect = useCallback(
    (company: string) => {
      setSelectedCompany(company)
      handleInputChange("company", company)
      console.log("Selected company:", company) // Add this log
    },
    [handleInputChange],
  )

  const filterCompanies = useCallback(
    (value: string) => {
      const filtered = popularCompanies.filter((company) => company.name.toLowerCase().includes(value.toLowerCase()))
      setFilteredCompanies(filtered)
      console.log("Filtered companies:", filtered) // Log for debugging
    },
    [popularCompanies],
  )

  useEffect(() => {
    if (open) {
      setFilteredCompanies(popularCompanies)
    }
  }, [open, popularCompanies])

  return (
    <Card className="w-full bg-[#1E293B] border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex justify-between items-center">
          Filtros de Busca
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="text-white border-white hover:bg-white hover:text-[#283851] bg-[#283851]"
          >
            <Filter className="w-4 h-4 mr-2" />
            {isFilterOpen ? "Fechar Filtros" : "Abrir Filtros"}
            {isFilterOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search" className="text-white flex items-center">
              Buscar vagas
              <QuestionMarkTooltip content="Digite palavras-chave relacionadas ao cargo, habilidades ou empresa que você está procurando." />
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Input
                    id="search"
                    type="search"
                    placeholder="Designer UX, Engenheiro de dados, Gerente de produtos..."
                    className="w-full bg-[#0d1526] border-gray-700 text-white pl-10 pr-4 py-2"
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value)
                      handleInputChange("search", e.target.value)
                    }}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar vagas..." value={searchValue} onValueChange={setSearchValue} />
                    <CommandList>
                      <CommandEmpty>Nenhuma vaga encontrada.</CommandEmpty>
                      <CommandGroup>
                        {filteredJobs.map((job) => (
                          <CommandItem
                            key={job}
                            onSelect={() => {
                              setSearchValue(job)
                              handleInputChange("search", job)
                              setOpen(false)
                            }}
                          >
                            {job}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white flex items-center">
              Tags
              <QuestionMarkTooltip content="Selecione tags relevantes para refinar sua busca por vagas específicas." />
            </Label>
            <div className="flex flex-wrap gap-2">
              {jobTags.map((tag) => (
                <Button
                  key={tag.name}
                  variant="outline"
                  size="sm"
                  className={`text-white transition-all duration-200 ease-in-out transform hover:-translate-y-1 ${
                    filters.selectedTags.includes(tag.name)
                      ? `border-2 border-${tag.color.replace("bg-", "")} font-semibold scale-105`
                      : "border border-white/30 bg-[#1E2D44]"
                  } hover:${tag.color} hover:text-white`}
                  onClick={() => handleTagClick(tag.name)}
                >
                  {tag.name}
                  {filters.selectedTags.includes(tag.name) && <span className="ml-1 text-xs">✓</span>}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-white flex items-center">
                    Experiência
                    <QuestionMarkTooltip content="Selecione o nível de experiência desejado para a vaga." />
                  </Label>
                  <Select value={filters.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                    <SelectTrigger id="experience" className="w-full bg-[#0d1526] border-gray-700 text-white">
                      <SelectValue placeholder="Experiência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="junior">Júnior</SelectItem>
                      <SelectItem value="mid">Pleno</SelectItem>
                      <SelectItem value="senior">Sênior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contractType" className="text-white flex items-center">
                    Tipo de Contrato
                    <QuestionMarkTooltip content="Escolha o tipo de contrato de trabalho que você está buscando." />
                  </Label>
                  <Select
                    value={filters.contractType}
                    onValueChange={(value) => handleInputChange("contractType", value)}
                  >
                    <SelectTrigger id="contractType" className="w-full bg-[#0d1526] border-gray-700 text-white">
                      <SelectValue placeholder="Tipo de Contrato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="full">Tempo Integral</SelectItem>
                      <SelectItem value="part">Meio Período</SelectItem>
                      <SelectItem value="contract">Contrato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="datePosted" className="text-white flex items-center">
                    Data de Publicação
                    <QuestionMarkTooltip content="Filtre as vagas com base em quando foram publicadas." />
                  </Label>
                  <Select value={filters.datePosted} onValueChange={(value) => handleInputChange("datePosted", value)}>
                    <SelectTrigger id="datePosted" className="w-full bg-[#0d1526] border-gray-700 text-white">
                      <SelectValue placeholder="Data de Publicação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as datas</SelectItem>
                      <SelectItem value="7d">Últimos 7 dias</SelectItem>
                      <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-white flex items-center">
                    País
                    <QuestionMarkTooltip content="Selecione o país onde você deseja trabalhar ou escolha 'Remoto' para vagas totalmente remotas." />
                  </Label>
                  <CountrySelector
                    countries={countries}
                    selectedCountry={filters.country}
                    onSelect={handleCountrySelect}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-white flex items-center">
                    Empresa
                    <QuestionMarkTooltip content="Busque por empresas específicas. As sugestões mostram as empresas com mais vagas." />
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between bg-[#0d1526] border-gray-700 text-white"
                      >
                        {selectedCompany || "Todas empresas"}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Buscar empresa..."
                          className="h-9"
                          onValueChange={(value) => filterCompanies(value)}
                        />
                        <CommandList>
                          <CommandEmpty>Nenhuma empresa encontrada.</CommandEmpty>
                          <CommandGroup heading="Empresas">
                            <CommandItem onSelect={() => handleCompanySelect("")}>
                              <Check
                                className={cn("mr-2 h-4 w-4", selectedCompany === "" ? "opacity-100" : "opacity-0")}
                              />
                              Todas empresas
                            </CommandItem>
                            <CommandSeparator />
                            {isLoading ? (
                              <CommandItem>Carregando empresas...</CommandItem>
                            ) : (
                              (filteredCompanies.length > 0 ? filteredCompanies : popularCompanies).map((company) => (
                                <CommandItem
                                  key={company.name}
                                  onSelect={() => handleCompanySelect(company.name)}
                                  className="flex items-center space-x-2"
                                >
                                  <Image
                                    src={company.logo || "/placeholder.svg"}
                                    alt={company.name}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                  />
                                  <span>{company.name}</span>
                                  <span className="ml-auto text-xs text-gray-400">{company.jobCount} vagas</span>
                                  {selectedCompany === company.name && <Check className="ml-2 h-4 w-4" />}
                                </CommandItem>
                              ))
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="benefits" className="text-white flex items-center">
                    Benefícios
                    <QuestionMarkTooltip content="Selecione os benefícios que você está buscando na vaga." />
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between bg-[#0d1526] border-gray-700 text-white"
                      >
                        {filters.selectedBenefits && filters.selectedBenefits.length > 0
                          ? `${filters.selectedBenefits.length} benefício(s) selecionado(s)`
                          : "Selecionar benefícios"}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar benefícios..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>Nenhum benefício encontrado.</CommandEmpty>
                          <CommandGroup>
                            {benefits.map((benefit) => (
                              <CommandItem
                                key={benefit.value}
                                onSelect={() => {
                                  const updatedBenefits = filters.selectedBenefits?.includes(benefit.value)
                                    ? filters.selectedBenefits.filter((b) => b !== benefit.value)
                                    : [...(filters.selectedBenefits || []), benefit.value]
                                  handleInputChange("selectedBenefits", updatedBenefits)
                                }}
                              >
                                <div className="flex items-center">
                                  <span className="mr-2">{benefit.emoji}</span>
                                  {benefit.label}
                                </div>
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    filters.selectedBenefits?.includes(benefit.value) ? "opacity-100" : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryRange" className="text-white flex items-center">
                  Faixa Salarial
                  <QuestionMarkTooltip content="Defina a faixa salarial desejada para as vagas." />
                </Label>
                <div className="pt-2">
                  <Slider
                    value={filters.salaryRange}
                    onValueChange={(value) => handleInputChange("salaryRange", value)}
                    min={1000}
                    max={30000}
                    step={500}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-white/70">
                  <span>{formatCurrency(filters.salaryRange[0])}</span>
                  <span>{formatCurrency(filters.salaryRange[1])}</span>
                </div>
              </div>
              {user && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => setIsSaveModalOpen(true)}
                    className="bg-[#0055FF] hover:bg-[#0044CC] text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Filtro
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
        <DialogContent className="bg-[#1E293B] text-white">
          <DialogHeader>
            <DialogTitle>Salvar Filtro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nome do filtro"
              className="bg-[#2C3E50] text-white border-gray-700"
              onChange={(e) => setFilterName(e.target.value)}
            />
            <Button
              onClick={() => handleSaveFilter(filterName)}
              className="w-full bg-[#0055FF] hover:bg-[#0044CC] text-white"
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <SaveFilterModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveFilter}
        isSaving={isSaving}
      />
    </Card>
  )
}

