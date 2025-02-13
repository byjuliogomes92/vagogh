"use client"
import type React from "react"
import { useState } from "react"
import { JobForm } from "@/components/job-form"
import { db } from "@/lib/firebase"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function AddJobPage(): React.ReactNode {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized: Only admins can add jobs")
      }

      const jobsCollection = collection(db, "jobs")
      await addDoc(jobsCollection, {
        ...data,
        posted: Timestamp.fromDate(new Date()),
      })
      toast({
        title: "Success",
        description: "Job added successfully",
      })
      router.push("/admin")
    } catch (error) {
      console.error("Error adding job:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user || user.role !== "admin") {
    return <div className="text-white text-center">Unauthorized: Only admins can access this page.</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-white">Add New Job</h1>
      <JobForm
        onSubmit={handleSubmit}
        buttonText={isSubmitting ? "Adding..." : "Add Job"}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

