"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const jobTypes = [
  { id: "full-time", label: "Tempo Integral" },
  { id: "part-time", label: "Meio Período" },
  { id: "contract", label: "Contrato" },
  { id: "internship", label: "Estágio" },
]

const experienceLevels = [
  { id: "entry", label: "Júnior" },
  { id: "intermediate", label: "Pleno" },
  { id: "senior", label: "Sênior" },
  { id: "lead", label: "Líder" },
]

export function JobFilters() {
  const [salary, setSalary] = React.useState([3000, 15000])

  return (
    <Card className="w-full lg:w-72">
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Tipo de Emprego</h3>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox id={type.id} />
                <label htmlFor={type.id} className="text-sm">
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Faixa Salarial (R$)</h3>
          <Slider value={salary} onValueChange={setSalary} max={30000} step={1000} className="w-full" />
          <div className="flex justify-between text-sm">
            <span>R${salary[0]}</span>
            <span>R${salary[1]}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Nível de Experiência</h3>
          <div className="flex flex-wrap gap-2">
            {experienceLevels.map((level) => (
              <Badge
                key={level.id}
                variant="outline"
                className="cursor-pointer hover:bg-[#7333DD] hover:text-white dark:hover:bg-[#70B5F9] dark:hover:text-gray-900 border-[#7333DD] text-[#7333DD] dark:border-[#70B5F9] dark:text-[#70B5F9]"
              >
                {level.label}
              </Badge>
            ))}
          </div>
        </div>

        <Button className="w-full bg-[#7333DD] hover:bg-[#5d20c0] text-white dark:bg-[#70B5F9] dark:hover:bg-[#4A90E2] dark:text-gray-900">
          Aplicar Filtros
        </Button>
      </CardContent>
    </Card>
  )
}

