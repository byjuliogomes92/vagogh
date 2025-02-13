"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { NavBar } from "@/components/nav-bar"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileAbout } from "@/components/profile-about"
import { ProfileEducation } from "@/components/profile-education"
import { SkillChart } from "@/components/skill-chart"
import { ProfilePortfolio } from "@/components/profile-portfolio"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Share2, Edit, Download } from "lucide-react"
import { ShareProfileModal } from "@/components/share-profile-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { RecommendedJobs } from "@/components/recommended-jobs"
import { ExperienceTimeline } from "@/components/experience-timeline"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { User } from "@/types/user"

export default function ProfilePage(): React.ReactNode {
  const { user, updateUserProfile } = useAuth()
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)
    }
  }, [])

  if (!user) {
    return <div className="text-white text-center mt-8">Você precisa estar logado para ver seu perfil.</div>
  }

  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/profile/${user.id}`

  const handleSave = async (updatedProfile: Partial<User>) => {
    try {
      const profileToUpdate = Object.entries(updatedProfile).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = value
          }
          return acc
        },
        {} as Partial<User>,
      )

      await updateUserProfile(profileToUpdate)
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error)
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o perfil. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadCV = () => {
    toast({
      title: "Download iniciado",
      description: "Seu CV está sendo gerado e baixado.",
    })
  }

  const renderProfileContent = () => {
    if (isMobile) {
      return (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="about">
            <AccordionTrigger>Sobre</AccordionTrigger>
            <AccordionContent>
              <ProfileAbout user={user} isEditing={isEditing} onSave={handleSave} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="experience">
            <AccordionTrigger>Experiência</AccordionTrigger>
            <AccordionContent>
              <ExperienceTimeline user={user} isEditing={isEditing} onSave={handleSave} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="education">
            <AccordionTrigger>Educação</AccordionTrigger>
            <AccordionContent>
              <ProfileEducation user={user} isEditing={isEditing} onSave={handleSave} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="skills">
            <AccordionTrigger>Habilidades</AccordionTrigger>
            <AccordionContent>
              <SkillChart user={user} isEditing={isEditing} onSave={handleSave} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="portfolio">
            <AccordionTrigger>Portfólio</AccordionTrigger>
            <AccordionContent>
              <ProfilePortfolio user={user} isEditing={isEditing} onSave={handleSave} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )
    } else {
      return (
        <Tabs defaultValue="about" className="space-y-8">
          <TabsList className="bg-[#2C3E50] p-1 rounded-lg flex flex-wrap justify-start">
            <TabsTrigger value="about" className="data-[state=active]:bg-[#0d1526]">
              Sobre
            </TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-[#0d1526]">
              Experiência
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-[#0d1526]">
              Educação
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-[#0d1526]">
              Habilidades
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-[#0d1526]">
              Portfólio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <ProfileAbout user={user} isEditing={isEditing} onSave={handleSave} />
          </TabsContent>
          <TabsContent value="experience">
            <ExperienceTimeline user={user} isEditing={isEditing} onSave={handleSave} />
          </TabsContent>
          <TabsContent value="education">
            <ProfileEducation user={user} isEditing={isEditing} onSave={handleSave} />
          </TabsContent>
          <TabsContent value="skills">
            <SkillChart user={user} isEditing={isEditing} onSave={handleSave} />
          </TabsContent>
          <TabsContent value="portfolio">
            <ProfilePortfolio user={user} isEditing={isEditing} onSave={handleSave} />
          </TabsContent>
        </Tabs>
      )
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] overflow-hidden relative">
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/abstract-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <NavBar />
      <div className="relative">
        <main className="container mx-auto px-4 py-8 pt-24 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
              <h1 className="text-3xl font-bold text-white">Seu Perfil Profissional</h1>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  className="bg-[#1E293B] text-white hover:bg-[#2C3E50] hover:text-white"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {isEditing ? "Cancelar Edição" : "Editar Perfil"}
                </Button>
                <Button
                  onClick={() => setIsShareModalOpen(true)}
                  variant="outline"
                  className="bg-[#1E293B] text-white hover:bg-[#2C3E50] hover:text-white"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar
                </Button>
                <Button
                  onClick={handleDownloadCV}
                  variant="outline"
                  className="bg-[#1E293B] text-white hover:bg-[#2C3E50] hover:text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar CV
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="bg-transparent border-none shadow-none overflow-hidden mb-8">
                  <CardContent className="p-0">
                    <ProfileHeader user={user} isEditing={isEditing} onSave={handleSave} />
                  </CardContent>
                </Card>
                <Card className="bg-[#1E293B] border-none shadow-lg overflow-hidden">
                  <CardContent className="p-4 sm:p-6">{renderProfileContent()}</CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="bg-[#1E293B] border-none shadow-lg sticky top-24">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Vagas Recomendadas</h2>
                    <RecommendedJobs />
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
      <ShareProfileModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} profileUrl={profileUrl} />
    </div>
  )
}

