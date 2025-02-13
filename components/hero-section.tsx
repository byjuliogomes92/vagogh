"use client"

import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HeroSection() {
  return (
    <section className="min-h-[60vh] relative overflow-hidden bg-white dark:bg-gray-900">
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-grid-white/10 dark:bg-grid-gray-800/10" />
      </motion.div>

      <div className="container pt-32 pb-16">
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-[#0A66C2] dark:text-[#70B5F9] font-work-sans">
            Encontre Seu Trabalho Remoto
          </h1>
          <p className="text-xl text-muted-foreground dark:text-gray-300 font-work-sans">
            Conectando você às melhores oportunidades de trabalho remoto
          </p>

          <div className="flex flex-col md:flex-row gap-4 p-4 bg-background/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Cargo ou palavra-chave" className="pl-10 font-work-sans" />
            </div>
            <Button
              size="lg"
              className="bg-[#0A66C2] hover:bg-[#004182] text-white dark:bg-[#70B5F9] dark:hover:bg-[#4A90E2] dark:text-gray-900 font-work-sans"
            >
              Buscar Vagas
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

