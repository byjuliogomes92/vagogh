import { db } from '../lib/firebase'
import { doc, setDoc, Timestamp } from 'firebase/firestore'

async function addSampleJobWithTimestampId() {
  try {
    const now = new Date()
    const id = now.getTime().toString() // Usa o timestamp atual como ID
    const jobsCollection = collection(db, 'jobs')
    const jobDoc = doc(jobsCollection, id)
    
    await setDoc(jobDoc, {
      company: "TechCorp",
      logo: "https://logo.clearbit.com/techcorp.com",
      title: "Desenvolvedor Full Stack",
      location: "São Paulo, SP",
      salary: 12000,
      type: "Tempo Integral",
      level: "Pleno",
      posted: Timestamp.fromDate(now)
    })
    
    console.log("Vaga adicionada com sucesso com ID: ", id)
  } catch (error) {
    console.error("Erro ao adicionar vaga:", error)
  }
}

addSampleJobWithTimestampId()

