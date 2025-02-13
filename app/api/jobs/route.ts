import { db } from "@/lib/firebase"
import { collection, query, orderBy, getDocs } from "firebase/firestore"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const jobsCollection = collection(db, "jobs")
    const jobsQuery = query(jobsCollection, orderBy("posted", "desc"))

    const querySnapshot = await getDocs(jobsQuery)

    const jobs = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        company: data.company || "",
        logo: data.logo || "",
        title: data.title || "",
        location: data.location || "",
        salary: data.salary || 0,
        type: data.type || "",
        level: data.level || "",
        posted: data.posted?.toDate().toISOString() || new Date().toISOString(),
        description: data.description || "",
        requirements: Array.isArray(data.requirements) ? data.requirements : [],
        benefits: Array.isArray(data.benefits) ? data.benefits : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        applicationUrl: data.applicationUrl,
        isSponsored: data.isSponsored || false,
        viewCount: data.viewCount || 0,
      }
    })

    return NextResponse.json({
      jobs,
      success: true,
    })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch jobs",
        details: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 },
    )
  }
}

