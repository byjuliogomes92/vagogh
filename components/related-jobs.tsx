"use client"

import React, { useState, useEffect } from "react"
import { JobCard } from "@/components/job-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

type Job = {
  id: string
  company: string
  logo: string
  title: string
  salary: number
  type: string
  level: string
  posted: string
  description: string
  requirements: string[]
  benefits: string[]
  tags: string[]
  applicationUrl?: string
}

type RelatedJobsProps = {
  currentJob: Job
}

export function RelatedJobs({ currentJob }: RelatedJobsProps) {
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedJobs = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/jobs")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (!data.success) {
          throw new Error(data.error || "Failed to fetch jobs")
        }

        // Filter and sort related jobs
        const filtered = data.jobs
          .filter((job: Job) => job.id !== currentJob.id) // Exclude current job
          .map((job: Job) => ({
            ...job,
            relevanceScore: calculateRelevanceScore(job, currentJob),
          }))
          .sort((a: Job, b: Job) => b.relevanceScore - a.relevanceScore)
          .slice(0, 3) // Get top 3 most relevant jobs

        setRelatedJobs(filtered)
      } catch (error) {
        console.error("Error fetching related jobs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedJobs()
  }, [currentJob])

  const calculateRelevanceScore = (job: Job, currentJob: Job): number => {
    let score = 0

    // Title similarity
    if (job.title.toLowerCase().includes(currentJob.title.toLowerCase())) {
      score += 5
    }

    // Level match
    if (job.level === currentJob.level) {
      score += 3
    }

    // Type match
    if (job.type === currentJob.type) {
      score += 2
    }

    // Tags match
    const commonTags = job.tags.filter((tag) => currentJob.tags.includes(tag))
    score += commonTags.length

    // Requirements similarity
    const commonRequirements = job.requirements.filter((req) =>
      currentJob.requirements.some(
        (currentReq) =>
          currentReq.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(currentReq.toLowerCase()),
      ),
    )
    score += commonRequirements.length

    return score
  }

  if (isLoading) {
    return <div className="text-white text-center mt-8">Carregando vagas relacionadas...</div>
  }

  if (relatedJobs.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">Vagas Relacionadas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedJobs.map((job, index) => (
          <JobCard key={job.id} {...job} index={index} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button className="bg-[#7333DD] hover:bg-[#5d20c0] text-white">
          Ver mais vagas
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

