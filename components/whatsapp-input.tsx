import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface WhatsAppInputProps {
  initialValue?: string
  onChange: (value: string) => void
}

export function WhatsAppInput({ initialValue = "", onChange }: WhatsAppInputProps) {
  const [ddi, setDDI] = useState("55")
  const [ddd, setDDD] = useState("")
  const [number, setNumber] = useState("")

  useEffect(() => {
    if (initialValue) {
      const match = initialValue.match(/(\d{2})(\d{2})(\d+)/)
      if (match) {
        setDDI(match[1])
        setDDD(match[2])
        setNumber(match[3])
      }
    }
  }, [initialValue])

  useEffect(() => {
    const fullNumber = `${ddi}${ddd}${number}`
    onChange(fullNumber)
  }, [ddi, ddd, number, onChange])

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <div>
          <Label htmlFor="ddi">DDI</Label>
          <Input id="ddi" value={ddi} onChange={(e) => setDDI(e.target.value)} className="w-16" maxLength={3} />
        </div>
        <div>
          <Label htmlFor="ddd">DDD</Label>
          <Input id="ddd" value={ddd} onChange={(e) => setDDD(e.target.value)} className="w-16" maxLength={2} />
        </div>
        <div className="flex-1">
          <Label htmlFor="number">Número</Label>
          <Input id="number" value={number} onChange={(e) => setNumber(e.target.value)} maxLength={9} />
        </div>
      </div>
    </div>
  )
}

