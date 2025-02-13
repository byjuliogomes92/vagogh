"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { NavBar } from "@/components/nav-bar"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileAbout } from "@/components/profile-about"
import { ProfileExperience } from "@/components/profile-experience"
import { ProfileEducation } from "@/components/profile-education"
import { ProfileSkills } from "@/components/profile-skills"
import { ProfilePortfolio } from "@/components/profile-portfolio"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Share2 } from "lucide-react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ContactButton } from "@/components/contact-button"

export default function PublicProfilePage() {
  const params = useParams()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (params.id) {
        const userDoc = await getDoc(doc(db, "users", params.id as string))
        if (userDoc.exists()) {
          setUser({ id: userDoc.id, ...userDoc.data() })
        } else {
          toast({
            title: "Perfil não encontrado",
            description: "O perfil que você está procurando não existe.",
            variant: "destructive",
          })
        }
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [params.id])

  const handleShare = () => {
    const profileUrl = window.location.href
    navigator.clipboard.writeText(profileUrl).then(
      () => {
        toast({
          title: "Link copiado",
          description: "O link do perfil foi copiado para a área de transferência.",
        })
      },
      () => {
        toast({
          title: "Erro",
          description: "Não foi possível copiar o link. Por favor, tente novamente.",
          variant: "destructive",
        })
      },
    )
  }

  if (isLoading) {
    return <div>Carregando perfil...</div>
  }

  if (!user) {
    return <div>Perfil não encontrado.</div>
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C]">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Perfil de {user.name}</h1>
          <Button onClick={handleShare} variant="outline" className="bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]">
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar Perfil
          </Button>
        </div>
        <div className="space-y-8">
          <ProfileHeader user={user} isEditing={false} onSave={() => {}} />
          <ProfileAbout user={user} isEditing={false} onSave={() => {}} />
          {user.contactMethod && user.contactValue && (
            <div className="mt-4">
              <ContactButton method={user.contactMethod} value={user.contactValue} />
            </div>
          )}
          <ProfileExperience user={user} isEditing={false} onSave={() => {}} />
          <ProfileEducation user={user} isEditing={false} onSave={() => {}} />
          <ProfileSkills user={user} isEditing={false} onSave={() => {}} />
          <ProfilePortfolio user={user} isEditing={false} onSave={() => {}} />
        </div>
      </main>
    </div>
  )
}

