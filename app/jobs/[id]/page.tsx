"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { NavBar } from "@/components/nav-bar"
import { JobDetails } from "@/components/job-details"
import { DonationBanner } from "@/components/donation-banner"
import { AdSense } from "@/components/ad-sense"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { RelatedJobs } from "@/components/related-jobs"
import { LimitReachedModal } from "@/components/limit-reached-modal"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, increment } from "firebase/firestore"

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
  isSponsored?: boolean
  viewCount: number
  saveCount: number
  shareCount: number
  applyCount: number
}

export default function JobPage() {
  const params = useParams()
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLimitReachedModalOpen, setIsLimitReachedModalOpen] = useState(false)
  const { user, viewCount, incrementViewCount } = useAuth()

  useEffect(() => {
    const fetchJobDetails = async () => {
      setIsLoading(true)
      setError(null)
      try {
        if (!user && viewCount >= 3) {
          setIsLimitReachedModalOpen(true)
          setIsLoading(false)
          return
        }

        if (!params.id) {
          throw new Error("Job ID is missing")
        }

        const jobRef = doc(db, "jobs", params.id as string)
        const jobSnap = await getDoc(jobRef)

        if (!jobSnap.exists()) {
          setError("Vaga não encontrada")
          setIsLoading(false)
          return
        }

        const jobData = jobSnap.data()

        // Increment view count in Firestore
        try {
          await updateDoc(jobRef, {
            viewCount: increment(1),
          })
        } catch (updateError) {
          console.error("Error updating view count:", updateError)
          // Continue with the function even if updating view count fails
        }

        setJob({
          id: jobSnap.id,
          ...jobData,
          viewCount: (jobData.viewCount || 0) + 1,
          saveCount: jobData.saveCount || 0,
          shareCount: jobData.shareCount || 0,
          applyCount: jobData.applyCount || 0,
          isSponsored: jobData.isSponsored || false,
        } as Job)

        if (!user) {
          incrementViewCount()
        }
      } catch (err) {
        console.error("Error fetching job details:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        toast({
          title: "Error",
          description: "Failed to load job details. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchJobDetails()
    }
  }, [params.id, user, viewCount])

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <DonationBanner />
      <NavBar className="relative z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-8 pt-14 sm:pt-24">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 order-2 lg:order-1">
            {isLoading ? (
              <p className="text-white text-center">Carregando detalhes da vaga...</p>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : job ? (
              <>
                <JobDetails
                  {...job}
                  isSponsored={job.isSponsored}
                  viewCount={job.viewCount}
                  saveCount={job.saveCount}
                  shareCount={job.shareCount}
                  applyCount={job.applyCount}
                />
                <RelatedJobs currentJob={job} />
              </>
            ) : (
              <p className="text-white text-center">Nenhuma informação da vaga encontrada.</p>
            )}
          </div>
          <aside className="w-full lg:w-80 space-y-6 order-1 lg:order-2">
            <AdSense
              client="ca-pub-xxxxxxxxxxxxxxxx"
              slot="xxxxxxxxxx"
              style={{ display: "block", minHeight: "250px", width: "100%" }}
            />
          </aside>
        </div>
      </div>
      <LimitReachedModal
        isOpen={isLimitReachedModalOpen}
        onClose={() => setIsLimitReachedModalOpen(false)}
        limitType="view"
      />
    </div>
  )
}

