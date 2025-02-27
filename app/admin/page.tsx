"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/lib/firebase"
import { collection, query, onSnapshot, deleteDoc, doc, addDoc } from "firebase/firestore"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JsonJobInput } from "@/components/json-job-input"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { useJobPostingStatus } from "@/contexts/job-posting-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Job = {
  id: string;
  company: string;
  title: string;
  location: string;
  salary: number | null;
  type: string | null;
  level: string;
  posted: Date;
  description?: string; // Propriedade opcional
  requirements?: string[]; // Propriedade opcional
  tags?: string[]; // Propriedade opcional
};

const AdminDashboard: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()

  // Redireciona para a página de login se o usuário não for admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
    }
  }, [user, router])

  const [jobs, setJobs] = useState<Job[]>([])

  // Estado para o formulário de adição de vagas
  const [newJob, setNewJob] = useState({
    company: "",
    title: "",
    location: "",
    salary: null as number | null,
    type: "",
    level: "",
    description: "",
    requirements: [] as string[],
    tags: [] as string[],
  })

  // Busca as vagas do Firebase em tempo real
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

  // Função para deletar uma vaga
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

  // Função para adicionar vagas via JSON
  const handleJsonSubmit = async (jobs: any[]) => {
    try {
      const jobsCollection = collection(db, "jobs")

      // Adiciona cada vaga do JSON ao Firebase
      for (const job of jobs) {
        await addDoc(jobsCollection, {
          ...job,
          posted: new Date(job.posted), // Converte a data para o formato do Firebase
        })
      }

      toast({
        title: "Sucesso",
        description: "Vagas adicionadas com sucesso",
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

  // Função para adicionar uma nova vaga via formulário
  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const jobsCollection = collection(db, "jobs")
      await addDoc(jobsCollection, {
        ...newJob,
        posted: new Date(), // Adiciona a data atual
      })

      toast({
        title: "Sucesso",
        description: "Vaga adicionada com sucesso",
      })

      // Limpa o formulário após a adição
      setNewJob({
        company: "",
        title: "",
        location: "",
        salary: null,
        type: "",
        level: "",
        description: "",
        requirements: [],
        tags: [],
      })
    } catch (error) {
      console.error("Error adding job: ", error)
      toast({
        title: "Erro",
        description: "Falha ao adicionar a vaga",
        variant: "destructive",
      })
    }
  }

  const { isJobPostingEnabled, toggleJobPostingStatus } = useJobPostingStatus()

  // Se o usuário não for admin, exibe uma mensagem de não autorizado
  if (!user || user.role !== "admin") {
    return <div className="text-white text-center">Unauthorized: Only admins can access this page.</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-white">Painel Administrativo</h1>
      <Tabs defaultValue="jobs" className="mb-6">
        <TabsList>
          <TabsTrigger value="jobs">Vagas</TabsTrigger>
          <TabsTrigger value="add-job">Adicionar Vaga</TabsTrigger>
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
        <TabsContent value="add-job">
          <form onSubmit={handleAddJob} className="space-y-4">
            <div>
              <label className="block text-white">Empresa</label>
              <Input
                type="text"
                value={newJob.company}
                className="bg-[#1E293B]"
                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-white">Título</label>
              <Input
                type="text"
                value={newJob.title}
                className="bg-[#1E293B]"
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-white">Localização</label>
              <Input
                type="text"
                value={newJob.location}
                className="bg-[#1E293B]"
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-white">Salário</label>
              <Input
                type="number"
                value={newJob.salary || ""}
                className="bg-[#1E293B]"
                onChange={(e) => setNewJob({ ...newJob, salary: parseFloat(e.target.value) || null })}
              />
            </div>
            <div>
              <label className="block text-white">Tipo</label>
              <Input
                type="text"
                value={newJob.type}
                className="bg-[#1E293B]"
                onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-white">Nível</label>
              <Input
                type="text"
                value={newJob.level}
                className="bg-[#1E293B]"
                onChange={(e) => setNewJob({ ...newJob, level: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-white">Descrição</label>
              <Textarea
                value={newJob.description}
                className="bg-[#1E293B]"
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-white">Requisitos (separados por vírgula)</label>
              <Input
                type="text"
                value={newJob.requirements.join(",")}
                className="bg-[#1E293B]"
                onChange={(e) =>
                  setNewJob({ ...newJob, requirements: e.target.value.split(",") })
                }
              />
            </div>
            <div>
              <label className="block text-white">Tags (separadas por vírgula)</label>
              <Input
                type="text"
                value={newJob.tags.join(",")}
                className="bg-[#1E293B]"
                onChange={(e) => setNewJob({ ...newJob, tags: e.target.value.split(",") })}
              />
            </div>
            <Button type="submit" className="bg-[#7333DD]">
              Adicionar Vaga
            </Button>
          </form>
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