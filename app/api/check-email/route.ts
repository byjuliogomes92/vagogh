import { NextResponse } from "next/server"
import { auth } from "@/lib/firebase"
import { fetchSignInMethodsForEmail } from "firebase/auth"

export async function POST(request: Request) {
  const { email } = await request.json()

  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email)
    const exists = signInMethods.length > 0

    return NextResponse.json({ exists })
  } catch (error) {
    console.error("Error checking email:", error)
    return NextResponse.json({ error: "Failed to check email" }, { status: 500 })
  }
}

