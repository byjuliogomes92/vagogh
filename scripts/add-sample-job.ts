import { db } from '../lib/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

async function addSampleJob() {
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
    console.log("Vaga adicionada com sucesso com ID: ", docRef.id)
  } catch (error) {
    console.error("Erro ao adicionar vaga:", error)
  }
}

addSampleJob()

