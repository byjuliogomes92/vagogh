"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useAuth } from "@/contexts/auth-context"

type JobPostingContextType = {
  isJobPostingEnabled: boolean
  toggleJobPostingStatus: () => Promise<void>
}

const JobPostingContext = createContext<JobPostingContextType | undefined>(undefined)

export function JobPostingProvider({ children }: { children: React.ReactNode }) {
  const [isJobPostingEnabled, setIsJobPostingEnabled] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const fetchJobPostingStatus = async () => {
      try {
        const docRef = doc(db, "settings", "jobPosting")
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setIsJobPostingEnabled(docSnap.data().enabled)
        } else {
          // If the document doesn't exist, create it with a default value
          await setDoc(docRef, { enabled: false })
          setIsJobPostingEnabled(false)
        }
      } catch (error) {
        console.error("Error fetching job posting status:", error)
        setIsJobPostingEnabled(false)
      }
    }

    fetchJobPostingStatus()
  }, [])

  const toggleJobPostingStatus = async () => {
    if (user?.role !== "admin") {
      console.error("Unauthorized: Only admins can toggle job posting status")
      return
    }

    try {
      const newStatus = !isJobPostingEnabled
      const docRef = doc(db, "settings", "jobPosting")
      await setDoc(docRef, { enabled: newStatus }, { merge: true })
      setIsJobPostingEnabled(newStatus)
    } catch (error) {
      console.error("Error toggling job posting status:", error)
    }
  }

  return (
    <JobPostingContext.Provider value={{ isJobPostingEnabled, toggleJobPostingStatus }}>
      {children}
    </JobPostingContext.Provider>
  )
}

export const useJobPostingStatus = () => {
  const context = useContext(JobPostingContext)
  if (context === undefined) {
    throw new Error("useJobPostingStatus must be used within a JobPostingProvider")
  }
  return context
}

