"use client"
import { useState, useEffect } from "react"
import { JobForm } from "@/components/job-form"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

export default function EditJobPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchJob = async () => {
      const docRef = doc(db, "jobs", params.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setJob(docSnap.data())
      } else {
        console.log("No such document!")
      }
    }

    fetchJob()
  }, [params.id])

  const handleSubmit = async (data: any) => {
    const jobRef = doc(db, "jobs", params.id)
    await updateDoc(jobRef, data)
    router.push("/admin")
  }

  if (!job) {
    return <div>Carregando...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-white">Editar Vaga</h1>
      <JobForm initialData={job} onSubmit={handleSubmit} buttonText="Atualizar Vaga" />
    </div>
  )
}

