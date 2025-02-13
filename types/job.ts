export type Job = {
  id: string
  company: string
  logo: string
  title: string
  location: string
  salary: number
  type: string
  level: string
  posted: Date
  description: string
  requirements: string[]
  benefits: string[]
  tags: string[]
  applicationUrl?: string
  isSponsored: boolean
  viewCount: number
}

