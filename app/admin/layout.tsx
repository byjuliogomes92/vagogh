'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { NavBar } from "@/components/nav-bar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login')
    }
  }, [user, router])

  if (!user || user.role !== 'admin') {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C]">
      <NavBar />
      <div className="container mx-auto p-4">
        {children}
      </div>
    </div>
  )
}

