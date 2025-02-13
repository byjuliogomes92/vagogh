"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { auth, storage } from "@/lib/firebase"
import { updatePassword, deleteUser } from "firebase/auth"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage(): React.ReactNode {
  const { user, updateUserProfile, logout } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    desiredPosition: "",
    birthDate: "",
    location: "",
    linkedinUrl: "",
    emailNotifications: false,
    bio: "",
    experience: [],
    education: [],
    skills: [],
    portfolioLinks: [],
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    gender: user?.gender || "",
  })
  const [avatarUrl, setAvatarUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        desiredPosition: user.desiredPosition || "",
        birthDate: user.birthDate || "",
        location: user.location || "",
        linkedinUrl: user.linkedinUrl || "",
        emailNotifications: user.emailNotifications || false,
        bio: user.bio || "",
        experience: user.experience || [],
        education: user.education || [],
        skills: user.skills || [],
        portfolioLinks: user.portfolioLinks || [],
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        gender: user.gender || "",
      })
      setAvatarUrl(user.avatarUrl || `https://api.dicebear.com/6.x/micah/svg?seed=${user.email}`)
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, emailNotifications: checked }))
  }

  const handleArrayChange = (field: string, index: number, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item: any, i: number) => (i === index ? { ...item, ...value } : item)),
    }))
  }

  const handleAddArrayItem = (field: string, newItem: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], newItem],
    }))
  }

  const handleRemoveArrayItem = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index),
    }))
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        desiredPosition: formData.desiredPosition,
        birthDate: formData.birthDate,
        location: formData.location,
        linkedinUrl: formData.linkedinUrl,
        emailNotifications: formData.emailNotifications,
        bio: formData.bio,
        experience: formData.experience,
        education: formData.education,
        skills: formData.skills,
        portfolioLinks: formData.portfolioLinks,
        avatarUrl,
        gender: formData.gender,
      })
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar seu perfil. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth.currentUser) return

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast({
        title: "Erro",
        description: "As novas senhas não coincidem.",
        variant: "destructive",
      })
      return
    }

    try {
      await updatePassword(auth.currentUser, formData.newPassword)
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      })
      setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmNewPassword: "" }))
    } catch (error) {
      console.error("Error changing password:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar sua senha. Verifique sua senha atual e tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return

    try {
      await deleteUser(auth.currentUser)
      await logout()
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso.",
      })
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir sua conta. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    const storageRef = ref(storage, `avatars/${user.id}`)
    try {
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      setAvatarUrl(downloadURL)
      await updateUserProfile({ avatarUrl: downloadURL })
      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      })
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar sua foto de perfil. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateNewAvatar = async () => {
    if (!user) return

    const newSeed = Math.random().toString(36).substring(7)
    const newAvatarUrl = `https://api.dicebear.com/6.x/bottts/svg?seed=${newSeed}`

    try {
      await updateUserProfile({ avatarUrl: newAvatarUrl })
      setAvatarUrl(newAvatarUrl)
      toast({
        title: "Avatar atualizado",
        description: "Um novo avatar foi gerado com sucesso.",
      })
    } catch (error) {
      console.error("Error generating new avatar:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar um novo avatar. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <NavBar />
      <main className="container mx-auto px-4 py-8 pt-20">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Configurações</h1>
        </header>
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="experience">Experiência</TabsTrigger>
            <TabsTrigger value="education">Educação</TabsTrigger>
            <TabsTrigger value="skills">Habilidades</TabsTrigger>
            <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
            <TabsTrigger value="account">Conta</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20">
                      <Image
                        src={avatarUrl || "/placeholder.svg"}
                        alt="Avatar"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                        Alterar foto
                      </Button>
                      <Button type="button" variant="outline" onClick={handleGenerateNewAvatar}>
                        Gerar novo avatar
                      </Button>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Primeiro Nome</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="bg-[#1E293B] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="bg-[#1E293B] text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desiredPosition">Vaga Desejada</Label>
                    <Input
                      id="desiredPosition"
                      name="desiredPosition"
                      value={formData.desiredPosition}
                      onChange={handleInputChange}
                      className="bg-[#1E293B] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="bg-[#1E293B] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Localização</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="bg-[#1E293B] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gênero</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                    >
                      <SelectTrigger id="gender" className="bg-[#1E293B] text-white">
                        <SelectValue placeholder="Selecione seu gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Feminino</SelectItem>
                        <SelectItem value="non-binary">Não-binário</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefiro não dizer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">Link do LinkedIn</Label>
                    <Input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      className="bg-[#1E293B] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="bg-[#1E293B] text-white"
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emailNotifications"
                      checked={formData.emailNotifications}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="emailNotifications">Aceito receber notificações por e-mail da JobZera</Label>
                  </div>
                  <Button type="submit">Salvar Alterações</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Experiência Profissional</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="space-y-2 p-4 bg-[#1E293B] rounded-lg">
                      <Input
                        placeholder="Empresa"
                        value={exp.company}
                        onChange={(e) => handleArrayChange("experience", index, { company: e.target.value })}
                        className="bg-[#334155] text-white"
                      />
                      <Input
                        placeholder="Cargo"
                        value={exp.position}
                        onChange={(e) => handleArrayChange("experience", index, { position: e.target.value })}
                        className="bg-[#334155] text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          placeholder="Data de início"
                          value={exp.startDate}
                          onChange={(e) => handleArrayChange("experience", index, { startDate: e.target.value })}
                          className="bg-[#334155] text-white"
                        />
                        <Input
                          type="date"
                          placeholder="Data de término"
                          value={exp.endDate}
                          onChange={(e) => handleArrayChange("experience", index, { endDate: e.target.value })}
                          className="bg-[#334155] text-white"
                        />
                      </div>
                      <Textarea
                        placeholder="Descrição das atividades"
                        value={exp.description}
                        onChange={(e) => handleArrayChange("experience", index, { description: e.target.value })}
                        className="bg-[#334155] text-white"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemoveArrayItem("experience", index)}
                      >
                        Remover Experiência
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      handleAddArrayItem("experience", {
                        company: "",
                        position: "",
                        startDate: "",
                        endDate: "",
                        description: "",
                      })
                    }
                  >
                    Adicionar Experiência
                  </Button>
                  <Button type="submit">Salvar Alterações</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Educação</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="space-y-2 p-4 bg-[#1E293B] rounded-lg">
                      <Input
                        placeholder="Instituição"
                        value={edu.institution}
                        onChange={(e) => handleArrayChange("education", index, { institution: e.target.value })}
                        className="bg-[#334155] text-white"
                      />
                      <Input
                        placeholder="Grau"
                        value={edu.degree}
                        onChange={(e) => handleArrayChange("education", index, { degree: e.target.value })}
                        className="bg-[#334155] text-white"
                      />
                      <Input
                        placeholder="Área de Estudo"
                        value={edu.field}
                        onChange={(e) => handleArrayChange("education", index, { field: e.target.value })}
                        className="bg-[#334155] text-white"
                      />
                      <Input
                        type="date"
                        placeholder="Data de Graduação"
                        value={edu.graduationDate}
                        onChange={(e) => handleArrayChange("education", index, { graduationDate: e.target.value })}
                        className="bg-[#334155] text-white"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemoveArrayItem("education", index)}
                      >
                        Remover Educação
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      handleAddArrayItem("education", { institution: "", degree: "", field: "", graduationDate: "" })
                    }
                  >
                    Adicionar Educação
                  </Button>
                  <Button type="submit">Salvar Alterações</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Habilidades</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center bg-[#334155] rounded-full px-3 py-1">
                        <span className="text-white mr-2">{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem("skills", index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nova habilidade"
                      className="bg-[#1E293B] text-white"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          const target = e.target as HTMLInputElement
                          if (target.value.trim()) {
                            handleAddArrayItem("skills", target.value.trim())
                            target.value = ""
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Nova habilidade"]') as HTMLInputElement
                        if (input.value.trim()) {
                          handleAddArrayItem("skills", input.value.trim())
                          input.value = ""
                        }
                      }}
                    >
                      Adicionar
                    </Button>
                  </div>
                  <Button type="submit">Salvar Alterações</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle>Portfólio</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {formData.portfolioLinks.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder="Título do projeto"
                        value={link.title}
                        onChange={(e) => handleArrayChange("portfolioLinks", index, { title: e.target.value })}
                        className="bg-[#1E293B] text-white"
                      />
                      <Input
                        placeholder="URL do projeto"
                        value={link.url}
                        onChange={(e) => handleArrayChange("portfolioLinks", index, { url: e.target.value })}
                        className="bg-[#1E293B] text-white"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemoveArrayItem("portfolioLinks", index)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                  <Button type="button" onClick={() => handleAddArrayItem("portfolioLinks", { title: "", url: "" })}>
                    Adicionar Projeto
                  </Button>
                  <Button type="submit">Salvar Alterações</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="bg-[#1E293B] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="bg-[#1E293B] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      type="password"
                      value={formData.confirmNewPassword}
                      onChange={handleInputChange}
                      className="bg-[#1E293B] text-white"
                    />
                  </div>
                  <Button type="submit">Alterar Senha</Button>
                </form>
                <div className="pt-6 border-t border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Excluir Conta</h3>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Excluir Minha Conta</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá seus dados
                          de nossos servidores.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount}>Sim, excluir minha conta</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

