"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/lib/firebase"
import { collection, query, onSnapshot, deleteDoc, doc } from "firebase/firestore"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JsonJobInput } from "@/components/json-job-input"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { useJobPostingStatus } from "@/contexts/job-posting-context"
import { Button } from "@/components/ui/button"

type Job = {
  id: string
  company: string
  title: string
  location: string
  salary: number
  type: string
  level: string
  posted: Date
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
    }
  }, [user, router])

  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    const q = query(collection(db, "jobs"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const jobsData: Job[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        jobsData.push({
          id: doc.id,
          ...data,
          posted: data.posted.toDate(),
        } as Job)
      })
      setJobs(jobsData)
    })

    return () => unsubscribe()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta vaga?")) {
      try {
        await deleteDoc(doc(db, "jobs", id))
        toast({
          title: "Sucesso",
          description: "Vaga excluída com sucesso",
        })
      } catch (error) {
        console.error("Error deleting job: ", error)
        toast({
          title: "Erro",
          description: "Falha ao excluir a vaga",
          variant: "destructive",
        })
      }
    }
  }

  const handleJsonSubmit = async (jobs: any[]) => {
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobs),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Failed to add jobs")
      }
      toast({
        title: "Sucesso",
        description: result.message,
      })
    } catch (error) {
      console.error("Error adding jobs: ", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao adicionar as vagas",
        variant: "destructive",
      })
    }
  }

  const { isJobPostingEnabled, toggleJobPostingStatus } = useJobPostingStatus()

  if (!user || user.role !== "admin") {
    return <div className="text-white text-center">Unauthorized: Only admins can access this page.</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-white">Painel Administrativo</h1>
      <Tabs defaultValue="jobs" className="mb-6">
        <TabsList>
          <TabsTrigger value="jobs">Vagas</TabsTrigger>
        </TabsList>
        <TabsContent value="jobs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Salário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Data de Publicação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.salary}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>{job.level}</TableCell>
                  <TableCell>{job.posted.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Link href={`/admin/edit-job/${job.id}`}>
                      <Button variant="outline" className="bg-[#7333DD] mr-2">
                        Editar
                      </Button>
                    </Link>
                    <Button variant="destructive" onClick={() => handleDelete(job.id)}>
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Adicionar Vagas por JSON</h2>
            <JsonJobInput onSubmit={handleJsonSubmit} />
          </div>
        </TabsContent>
      </Tabs>
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Configurações</h2>
        <div className="flex items-center space-x-2">
          <Switch checked={isJobPostingEnabled} onCheckedChange={toggleJobPostingStatus} className="bg-[#7333DD]" />
          <span className="text-white">
            {isJobPostingEnabled ? "Desativar" : "Ativar"} página de publicação de vagas
          </span>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

