'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type SaveFilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  isSaving: boolean;
}

export function SaveFilterModal({ isOpen, onClose, onSave, isSaving }: SaveFilterModalProps) {
  const [filterName, setFilterName] = useState('')

  const handleSave = () => {
    if (filterName.trim()) {
      onSave(filterName.trim())
      setFilterName('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#1C1C1C] text-white">
        <DialogHeader>
          <DialogTitle>Salvar Filtro</DialogTitle>
          <DialogDescription>
            Dê um nome ao seu filtro para salvar e receber notificações de novas vagas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="filterName"
            placeholder="Nome do filtro"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="bg-[#2C2C2C] border-gray-700 text-white"
          />
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

