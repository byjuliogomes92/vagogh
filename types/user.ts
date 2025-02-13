export type User = {
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
  skills?: (string | { name: string; level: number })[]
  portfolioLinks?: {
    title: string
    url: string
  }[]
  hasCompletedOnboarding?: boolean
  contactMethod?: "email" | "whatsapp" | "linkedin"
  contactValue?: string
}

