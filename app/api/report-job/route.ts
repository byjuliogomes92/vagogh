import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"

export async function POST(request: Request) {
  try {
    const { jobId, jobTitle, jobUrl, reason, comments, userEmail, reportedAt } = await request.json()

    // Validate required fields
    if (!jobId || !jobTitle || !jobUrl || !reason || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Add the report to Firestore
    const reportRef = await addDoc(collection(db, "jobReports"), {
      jobId,
      jobTitle,
      jobUrl,
      reason,
      comments,
      userEmail,
      reportedAt,
      status: "pending", // You can use this to track the status of the report
    })

    return NextResponse.json({ success: true, reportId: reportRef.id })
  } catch (error) {
    console.error("Error submitting job report:", error)
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 })
  }
}

