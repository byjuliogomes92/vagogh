"use client"

import { useEffect, useState } from "react"
import type { FilterCriteria } from "./search-filters"
import { Button } from "@/components/ui/button"
import { Trash2, Filter, Save, ChevronRight, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/firebase"
import { collection, query, onSnapshot, deleteDoc, doc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

type SavedFilter = {
  id: string
  name: string
  filter: FilterCriteria
}

type SavedFiltersProps = {
  onApply: (filter: FilterCriteria) => void
}

export function SavedFilters({ onApply }: SavedFiltersProps) {
  const [filters, setFilters] = useState<SavedFilter[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const q = query(collection(db, `users/${user.id}/savedFilters`))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const savedFilters: SavedFilter[] = []
        querySnapshot.forEach((doc) => {
          savedFilters.push({ id: doc.id, ...doc.data() } as SavedFilter)
        })
        setFilters(savedFilters)
      })

      return () => unsubscribe()
    }
  }, [user])

  const handleDelete = async (id: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, `users/${user.id}/savedFilters`, id))
        toast({
          title: "Filtro excluído",
          description: "O filtro foi removido com sucesso.",
        })
      } catch (error) {
        console.error("Error deleting filter: ", error)
        toast({
          title: "Erro",
          description: "Não foi possível excluir o filtro. Tente novamente.",
          variant: "destructive",
        })
      }
    }
  }

  const renderFilterDetails = (filter: FilterCriteria) => (
    <div className="space-y-2 text-sm text-gray-400">
      {filter.search && <p>Busca: {filter.search}</p>}
      {filter.experience !== "all" && <p>Experiência: {filter.experience}</p>}
      {filter.contractType !== "all" && <p>Tipo de Contrato: {filter.contractType}</p>}
      <p>
        Faixa Salarial: R${filter.salaryRange[0]} - R${filter.salaryRange[1]}
      </p>
      {filter.selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filter.selectedTags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-[#334155] text-white">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <Card className="bg-[#1E293B] border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center mb-2">
          <Save className="mr-2 h-5 w-5" />
          Filtros Salvos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {filters.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-white/70 text-center py-4"
            >
              Nenhum filtro salvo ainda.
            </motion.p>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {filters.map((filter, index) => (
                <AccordionItem key={filter.id} value={filter.id} className="border-b border-gray-700">
                  <AccordionTrigger className="text-white hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium truncate mr-2">{filter.name}</span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-2 pb-4">
                      {renderFilterDetails(filter.filter)}
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button
                          size="sm"
                          onClick={() => onApply(filter.filter)}
                          className="bg-[#0055FF] hover:bg-[#0044CC] text-white"
                        >
                          <Filter className="w-4 h-4 mr-2" />
                          Aplicar
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(filter.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

