"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { FirebaseError } from "firebase/app"

type User = {
  id: string
  firstName: string
  lastName: string
  name: string
  email: string
  role: string
  desiredPosition?: string
  birthDate?: string
  location?: string
  linkedinUrl?: string
  emailNotifications?: boolean
  avatarUrl?: string
  bio?: string
  gender?: string
  experience?: {
    company: string
    position: string
    startDate: string
    endDate?: string
    description: string
  }[]
  education?: {
    institution: string
    degree: string
    field: string
    graduationDate: string
  }[]
  skills?: string[]
  portfolioLinks?: {
    title: string
    url: string
  }[]
  hasCompletedOnboarding?: boolean
  contactMethod?: "email" | "whatsapp" | "linkedin"
  contactValue?: string
}

type UserProfile = Omit<User, "id" | "email" | "role">

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (firstName: string, lastName: string, email: string, password: string, gender?: string) => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>
  isLoading: boolean
  setLastVisitedUrl: (url: string) => void
  searchCount: number
  setSearchCount: React.Dispatch<React.SetStateAction<number>>
  viewCount: number
  lastResetDate: string
  incrementSearchCount: () => void
  incrementViewCount: () => void
  resetCounts: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastVisitedUrl, setLastVisitedUrl] = useState<string | null>(null)
  const router = useRouter()
  const [searchCount, setSearchCount] = useState(0)
  const [viewCount, setViewCount] = useState(0)
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString())

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
        const userData = userDoc.data() as User
        setUser({
          id: firebaseUser.uid,
          firstName: userData?.firstName || "",
          lastName: userData?.lastName || "",
          name: userData?.name || "",
          email: firebaseUser.email || "",
          role: userData?.role || "user",
          desiredPosition: userData?.desiredPosition || "",
          birthDate: userData?.birthDate || "",
          location: userData?.location || "",
          linkedinUrl: userData?.linkedinUrl || "",
          emailNotifications: userData?.emailNotifications || false,
          avatarUrl: userData?.avatarUrl || `https://api.dicebear.com/6.x/micah/svg?seed=${firebaseUser.email}`,
          bio: userData?.bio || "",
          experience: userData?.experience || [],
          education: userData?.education || [],
          skills: userData?.skills || [],
          portfolioLinks: userData?.portfolioLinks || [],
          gender: userData?.gender || "",
          hasCompletedOnboarding: userData?.hasCompletedOnboarding || false,
          contactMethod: userData?.contactMethod || undefined,
          contactValue: userData?.contactValue || undefined,
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signup = async (firstName: string, lastName: string, email: string, password: string, gender?: string) => {
    setIsLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      const name = `${firstName} ${lastName}`.trim()
      await setDoc(doc(db, "users", firebaseUser.uid), {
        firstName,
        lastName,
        name,
        email,
        role: "user",
        createdAt: serverTimestamp(),
        gender: gender || "",
        hasCompletedOnboarding: false,
      })
      setUser({
        id: firebaseUser.uid,
        firstName,
        lastName,
        name,
        email,
        role: "user",
        gender: gender || "",
      })
      router.push("/")
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      const redirectUrl = lastVisitedUrl || "/"
      setLastVisitedUrl(null)
      router.push(redirectUrl)
    } catch (error) {
      console.error("Error logging in:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (!user || !auth.currentUser) {
      throw new Error("User not authenticated")
    }

    try {
      const userRef = doc(db, "users", user.id)
      const updateData = Object.entries(profile).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = value
          }
          return acc
        },
        {} as Record<string, any>,
      )

      await updateDoc(userRef, updateData)
      setUser((prevUser) => (prevUser ? { ...prevUser, ...updateData } : null))
    } catch (error) {
      console.error("Error updating user profile:", error)
      if (error instanceof FirebaseError) {
        if (error.code === "permission-denied") {
          throw new Error("Permissão negada. Certifique-se de estar logado e tente novamente.")
        } else {
          throw new Error(`Erro do Firebase (${error.code}): ${error.message}`)
        }
      } else if (error instanceof Error) {
        throw error
      } else {
        throw new Error("Ocorreu um erro ao atualizar o perfil. Por favor, tente novamente mais tarde.")
      }
    }
  }

  const checkAndResetCounts = () => {
    const today = new Date().toDateString()
    if (today !== lastResetDate) {
      setSearchCount(0)
      setViewCount(0)
      setLastResetDate(today)
    }
  }

  const incrementSearchCount = () => {
    checkAndResetCounts()
    if (!user) {
      setSearchCount((prev) => prev + 1)
    }
  }

  const incrementViewCount = () => {
    checkAndResetCounts()
    if (!user) {
      setViewCount((prev) => prev + 1)
    }
  }

  const resetCounts = () => {
    setSearchCount(0)
    setViewCount(0)
    setLastResetDate(new Date().toDateString())
  }

  useEffect(() => {
    checkAndResetCounts()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateUserProfile,
        isLoading,
        setLastVisitedUrl,
        searchCount,
        setSearchCount,
        viewCount,
        lastResetDate,
        incrementSearchCount,
        incrementViewCount,
        resetCounts,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

