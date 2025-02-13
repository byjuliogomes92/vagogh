import { db } from '@/lib/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const jobsCollection = collection(db, 'jobs')
    const docRef = await addDoc(jobsCollection, {
      company: "TechCorp",
      logo: "https://logo.clearbit.com/techcorp.com",
      title: "Desenvolvedor Full Stack",
      location: "São Paulo, SP",
      salary: 12000,
      type: "Tempo Integral",
      level: "Pleno",
      posted: Timestamp.fromDate(new Date())
    })

    return NextResponse.json({ 
      message: "Vaga adicionada com sucesso", 
      id: docRef.id 
    })
  } catch (error) {
    console.error("Erro ao adicionar vaga:", error)
    return NextResponse.json(
      { message: "Erro ao adicionar vaga" },
      { status: 500 }
    )
  }
}

