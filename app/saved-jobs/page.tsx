"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/firebase"
import { collection, query, onSnapshot, where } from "firebase/firestore"
import { NavBar } from "@/components/nav-bar"
import { JobCard } from "@/components/job-card"
import { DonationBanner } from "@/components/donation-banner"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { JobFolders } from "@/components/job-folders"

export default function SavedJobsPage(): React.ReactNode {
  const { user } = useAuth()
  const [savedJobs, setSavedJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      let q = query(collection(db, `users/${user.id}/savedJobs`))

      if (selectedFolder) {
        q = query(q, where("folderId", "==", selectedFolder))
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const jobs = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          jobs.push({
            ...data,
            id: doc.id,
            posted: data.posted?.toDate?.() || data.posted,
          })
        })
        setSavedJobs(jobs)
        setIsLoading(false)
      })

      return () => unsubscribe()
    }
  }, [user, selectedFolder])

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Acesso Restrito</h1>
          <p className="text-xl text-gray-300 mb-8">Você precisa estar logado para ver suas vagas salvas.</p>
          <Link href="/login">
            <Button className="bg-[#0055FF] hover:bg-[#0044CC] text-white">Fazer Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <DonationBanner />
      <NavBar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Vagas Salvas</h1>
            <Link href="/">
              <Button variant="outline" className="text-white border-white bg-[#0F172A] hover:bg-white hover:text-[#0F172A]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Vagas
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <JobFolders onSelectFolder={setSelectedFolder} selectedFolder={selectedFolder} />
            </div>
            <div className="md:col-span-3">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-300">Carregando suas vagas salvas...</p>
                </div>
              ) : savedJobs.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {savedJobs.map((job, index) => (
                    <JobCard key={job.id} {...job} index={index} isSaved={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-300 mb-4">
                    {selectedFolder ? "Não há vagas salvas nesta pasta." : "Você ainda não salvou nenhuma vaga."}
                  </p>
                  <Link href="/">
                    <Button className="bg-[#0055FF] hover:bg-[#0044CC] text-white">Explorar Vagas</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

