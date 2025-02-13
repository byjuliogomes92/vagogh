import type { User } from "@/types/user"
import type { Job } from "@/types/job"

export function calculateJobRelevance(user: User, job: Job): number {
  let score = 0

  try {
    console.log("Calculating relevance for job:", job.id)
    console.log("User data:", JSON.stringify(user, null, 2))
    console.log("Job data:", JSON.stringify(job, null, 2))

    // Correspondência de nível de experiência
    if (user.experience && user.experience.length > 0) {
      const userLevel = user.experience[0].level?.toLowerCase()
      if (userLevel && job.level && job.level.toLowerCase().includes(userLevel)) {
        score += 30
        console.log("Experience level match, score +30")
      }
    }

    // Correspondência de habilidades
    const userSkills =
      user.skills?.map((skill) => (typeof skill === "string" ? skill.toLowerCase() : skill.name.toLowerCase())) || []
    const jobSkills = job.requirements.map((req) => req.toLowerCase())
    const matchingSkills = userSkills.filter((skill) => jobSkills.some((jobSkill) => jobSkill.includes(skill)))
    score += matchingSkills.length * 10
    console.log(`Matching skills: ${matchingSkills.length}, score +${matchingSkills.length * 10}`)

    // Correspondência de cargo desejado
    if (user.desiredPosition && job.title && job.title.toLowerCase().includes(user.desiredPosition.toLowerCase())) {
      score += 20
      console.log("Desired position match, score +20")
    }

    // Correspondência de localização
    if (user.location && job.location && job.location.toLowerCase().includes(user.location.toLowerCase())) {
      score += 15
      console.log("Location match, score +15")
    }

    // Bônus para vagas recentes
    if (job.posted instanceof Date) {
      const daysSincePosted = (new Date().getTime() - job.posted.getTime()) / (1000 * 3600 * 24)
      if (daysSincePosted <= 7) {
        score += 10
        console.log("Recent job bonus, score +10")
      }
    } else {
      console.log("Warning: job.posted is not a Date object")
    }

    console.log(`Final relevance score for job ${job.id}: ${score}`)
    return score
  } catch (error) {
    console.error("Erro ao calcular relevância da vaga:", error)
    console.error("Job that caused the error:", JSON.stringify(job, null, 2))
    console.error("User data when error occurred:", JSON.stringify(user, null, 2))
    return 0
  }
}

export function getRecommendedJobs(user: User, jobs: Job[], limit = 9): Job[] {
  console.log("Iniciando processo de recomendação de vagas")
  console.log("Número de vagas para processar:", jobs.length)
  console.log("Perfil do usuário:", JSON.stringify(user, null, 2))

  try {
    const scoredJobs = jobs.map((job) => {
      try {
        const relevanceScore = calculateJobRelevance(user, job)
        return { ...job, relevanceScore }
      } catch (error) {
        console.error(`Error scoring job ${job.id}:`, error)
        return { ...job, relevanceScore: 0 }
      }
    })

    console.log("Vagas pontuadas:", scoredJobs.length)

    // Ordenar as vagas por pontuação de relevância (decrescente)
    scoredJobs.sort((a, b) => b.relevanceScore - a.relevanceScore)

    // Retornar as top N vagas recomendadas
    const recommendedJobs = scoredJobs.slice(0, limit)
    console.log("Número de vagas recomendadas:", recommendedJobs.length)
    console.log(
      "Top 3 vagas recomendadas:",
      recommendedJobs.slice(0, 3).map((job) => ({ id: job.id, score: job.relevanceScore })),
    )

    return recommendedJobs
  } catch (error) {
    console.error("Erro no processo de recomendação:", error)
    return []
  }
}

