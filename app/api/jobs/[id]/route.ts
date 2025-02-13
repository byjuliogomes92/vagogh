import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, increment } from "firebase/firestore"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const jobId = params.id
    const jobRef = doc(db, "jobs", jobId)
    const jobSnap = await getDoc(jobRef)

    if (!jobSnap.exists()) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const jobData = jobSnap.data()

    // Increment view count
    await updateDoc(jobRef, {
      viewCount: increment(1),
    })

    const job = {
      id: jobSnap.id,
      company: jobData.company || "",
      logo: jobData.logo || "",
      title: jobData.title || "",
      location: jobData.location || "",
      salary: jobData.salary || 0,
      type: jobData.type || "",
      level: jobData.level || "",
      posted: jobData.posted?.toDate().toISOString() || new Date().toISOString(),
      description: jobData.description || "",
      requirements: Array.isArray(jobData.requirements) ? jobData.requirements : [],
      benefits: Array.isArray(jobData.benefits) ? jobData.benefits : [],
      tags: Array.isArray(jobData.tags) ? jobData.tags : [],
      applicationUrl: jobData.applicationUrl,
      viewCount: (jobData.viewCount || 0) + 1, // Increment local count
      saveCount: jobData.saveCount || 0,
      shareCount: jobData.shareCount || 0,
      applyCount: jobData.applyCount || 0,
    }

    return NextResponse.json({ job, success: true })
  } catch (error) {
    console.error("Error fetching job details:", error)
    return NextResponse.json({ error: "Failed to fetch job details", success: false }, { status: 500 })
  }
}

