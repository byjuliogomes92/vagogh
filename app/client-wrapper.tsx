"use client"

import React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { BannerProvider } from "@/contexts/banner-context"
import { AuthProvider } from "@/contexts/auth-context"
import { JobPostingProvider } from "@/contexts/job-posting-context"
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { useAuth } from "@/contexts/auth-context"

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  return (
    <>
      <div className="flex flex-col min-h-screen relative bg-[#0f172a] text-foreground pb-16 md:pb-0">
        <main className="flex-grow z-10 relative">{children}</main>
        <Footer />
      </div>
      {user && <BottomNavBar />}
      <Toaster />
    </>
  )
}

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <React.StrictMode>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <AuthProvider>
          <JobPostingProvider>
            <BannerProvider>
              <AuthenticatedLayout>{children}</AuthenticatedLayout>
            </BannerProvider>
          </JobPostingProvider>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
}

