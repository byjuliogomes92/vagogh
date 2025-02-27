"use client"

import { useState, useEffect } from "react"
import { JobCard } from "./job-card"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/firebase"
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type Job = {
  id: string
  company: string
  logo: string
  title: string
  location: string
  salary?: number
  type: string
  level: string
  posted: Date
  description: string
  requirements: string[]
  benefits: string[]
  tags: string[]
  applicationUrl?: string
}

type User = {
  id: string
  skills: string[]
  experience: { level: string }[]
  education: { field: string }[]
  desiredPosition: string
}

export function RecommendedJobs() {
  const { user } = useAuth()
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const userData = user as User

        const jobsQuery = query(collection(db, "jobs"), orderBy("posted", "desc"), limit(20))
        const jobsSnapshot = await getDocs(jobsQuery)

        if (jobsSnapshot.empty) {
          console.log("No jobs found")
          setRecommendedJobs([])
          setIsLoading(false)
          return
        }

        let jobs = jobsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          posted: doc.data().posted.toDate(),
        })) as Job[]

        jobs = jobs.filter((job) => {
          const levelMatch = job.level.toLowerCase().includes(userData.experience?.[0]?.level?.toLowerCase() || "")
          const titleMatch = job.title.toLowerCase().includes(userData.desiredPosition?.toLowerCase() || "")
          const skillMatch = userData.skills?.some((skill) =>
            job.requirements.some((req) => req.toLowerCase().includes(skill.toLowerCase())),
          )

          return levelMatch || titleMatch || skillMatch
        })

        jobs.sort((a, b) => {
          const scoreA = calculateRelevanceScore(a, userData)
          const scoreB = calculateRelevanceScore(b, userData)
          return scoreB - scoreA
        })

        setRecommendedJobs(jobs.slice(0, 3))
      } catch (error) {
        console.error("Error fetching recommended jobs:", error)
        toast({
          title: "Error",
          description: "Failed to fetch recommended jobs. Please try again later.",
          variant: "destructive",
        })
        setRecommendedJobs([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendedJobs()
  }, [user])

  const calculateRelevanceScore = (job: Job, userData: User) => {
    let score = 0

    const skillsMatch = job.requirements.filter((req) =>
      userData.skills?.some((skill) => skill.toLowerCase().includes(req.toLowerCase())),
    ).length
    score += skillsMatch * 2

    if (job.level.toLowerCase() === userData.experience?.[0]?.level?.toLowerCase()) {
      score += 3
    }

    if (job.title.toLowerCase().includes(userData.desiredPosition?.toLowerCase() || "")) {
      score += 5
    }

    if (
      userData.education?.some((edu) =>
        job.requirements.some((req) => req.toLowerCase().includes(edu.field.toLowerCase())),
      )
    ) {
      score += 2
    }

    return score
  }

  return (
    <Card className="w-full bg-[#1E293B] border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white flex items-center justify-between">
          Vagas Recomendadas
          <Link href="/recommended-jobs">
            <Button variant="link" className="text-[#F7D047] hover:text-[#FED853]">
              Ver todas
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-[200px] w-full bg-gray-700" />
            ))}
          </div>
        ) : recommendedJobs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {recommendedJobs.map((job, index) => (
              <JobCard key={job.id} {...job} index={index} isSaved={false} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-300 mb-4">Você ainda não tem vagas recomendadas.</p>
            <p className="text-lg text-gray-400 mb-8">
              Continue atualizando seu perfil para receber recomendações personalizadas.
            </p>
            <Link href="/">
              <Button className="bg-[#7333DD] hover:bg-[#5d20c0] text-white">Explorar Vagas</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

