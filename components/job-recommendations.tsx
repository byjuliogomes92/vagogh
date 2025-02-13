"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface JobRecommendation {
  title: string
  company: string
  logo: string
  connections: number
}

const recommendations: JobRecommendation[] = [
  {
    title: "Desenvolvedor Frontend Sênior",
    company: "TechCorp",
    logo: "/placeholder.svg",
    connections: 3,
  },
  {
    title: "Designer UI/UX",
    company: "DesignCo",
    logo: "/placeholder.svg",
    connections: 5,
  },
  {
    title: "Gerente de Produto",
    company: "StartupInc",
    logo: "/placeholder.svg",
    connections: 2,
  },
]

export function JobRecommendations() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recomendado para você</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((job, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
          >
            <div className="w-12 h-12 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <img src={job.logo || "/placeholder.svg"} alt={job.company} className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#0A66C2] dark:text-[#70B5F9] hover:underline">{job.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{job.connections} conexões trabalham aqui</p>
            </div>
            <Button variant="ghost" size="icon">
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}

