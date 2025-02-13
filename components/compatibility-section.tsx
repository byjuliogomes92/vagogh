import type { User } from "@/contexts/auth-context"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Job = {
  title: string
  requirements: string[]
  level: string
}

type CompatibilityProps = {
  user: User
  job: Job
}

const AnimatedProgressBar = ({ value }: { value: number }) => {
  const getColor = () => {
    if (value <= 50) return "bg-red-300"
    if (value <= 80) return "bg-[#F7D047]"
    return "bg-green-300"
  }

  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${getColor()}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  )
}

export function CompatibilitySection({ user, job }: CompatibilityProps) {
  const isProfileComplete = (): boolean => {
    return !!user.skills && user.skills.length > 0
  }

  const calculateProfileCompleteness = (): number => {
    return user.skills && user.skills.length > 0 ? 100 : 0
  }

  const calculateCompatibility = (): {
    score: number
    details: { category: string; match: number; details: string; improvement: string | null }[]
  } => {
    if (!isProfileComplete()) {
      return { score: 0, details: [] }
    }

    let totalScore = 0
    const details = []

    // Skills match
    const skillsMatch = job.requirements.filter((req) =>
      user.skills?.some((skill) => {
        const reqLower = req.toLowerCase()
        const skillLower = skill.toLowerCase()
        return skillLower.includes(reqLower) || reqLower.includes(skillLower) || areSkillsRelated(skillLower, reqLower)
      }),
    ).length
    const skillsScore = (skillsMatch / job.requirements.length) * 100
    totalScore += skillsScore
    details.push({
      category: "Habilidades",
      match: skillsScore,
      details: `${skillsMatch} de ${job.requirements.length} habilidades correspondentes ou relacionadas`,
      improvement:
        skillsScore < 100
          ? `Considere desenvolver as seguintes habilidades: ${job.requirements
              .filter(
                (req) =>
                  !user.skills?.some((skill) => {
                    const reqLower = req.toLowerCase()
                    const skillLower = skill.toLowerCase()
                    return (
                      skillLower.includes(reqLower) ||
                      reqLower.includes(skillLower) ||
                      areSkillsRelated(skillLower, reqLower)
                    )
                  }),
              )
              .join(", ")}`
          : null,
    })

    // Experience match (inactive)
    const calculateExperienceMatch = (
      userExperience: { position: string; level?: string }[] | undefined,
      jobTitle: string,
      jobLevel: string,
    ): number => {
      if (!userExperience || userExperience.length === 0) {
        return 0
      }

      const levels = { Júnior: 1, Pleno: 2, Sênior: 3 }
      const jobLevelValue = levels[jobLevel as keyof typeof levels] || 2 // Default to Pleno if not specified

      let highestMatch = 0

      for (const exp of userExperience) {
        const positionMatch = arePositionsRelated(exp.position, jobTitle)
        if (positionMatch) {
          const userLevelValue = levels[exp.level as keyof typeof levels] || 1 // Default to Júnior if not specified
          const levelDifference = Math.max(0, jobLevelValue - userLevelValue)
          const levelMatch = Math.max(0, 100 - levelDifference * 33.33) // Deduct 33.33% for each level difference

          const overallMatch = (positionMatch + levelMatch) / 2
          highestMatch = Math.max(highestMatch, overallMatch)
        }
      }

      return highestMatch
    }

    // Education match (inactive)
    const calculateEducationMatch = (userEducation: { degree: string }[] | undefined, jobLevel: string): number => {
      const educationLevels = { Júnior: 1, Pleno: 2, Sênior: 3 }
      const userHighestEducation = Math.max(
        ...(userEducation?.map((edu) => educationLevels[edu.degree as keyof typeof educationLevels] || 0) || [0]),
      )
      const jobLevelRequired = educationLevels[jobLevel as keyof typeof educationLevels] || 0
      const educationMatch =
        userHighestEducation >= jobLevelRequired ? 100 : (userHighestEducation / jobLevelRequired) * 100
      return educationMatch
    }

    // Only using skills score for now
    const overallScore = totalScore

    return { score: overallScore, details }
  }

  const areSkillsRelated = (skill1: string, skill2: string): boolean => {
    const relatedSkills: { [key: string]: string[] } = {
      javascript: ["react", "vue", "angular", "node"],
      react: ["javascript", "redux", "nextjs"],
      vue: ["javascript", "vuex", "nuxt"],
      angular: ["javascript", "typescript", "rxjs"],
      node: ["javascript", "express", "mongodb"],
      python: ["django", "flask", "pandas"],
      java: ["spring", "hibernate", "junit"],
      csharp: ["dotnet", "aspnet", "entityframework"],
      php: ["laravel", "symfony", "wordpress"],
      "ui/ux": ["figma", "sketch", "adobe xd", "user research", "wireframing", "prototyping"],
      design: ["photoshop", "illustrator", "indesign", "typography", "color theory"],
      // Add more related skills as needed
    }

    for (const [key, relatedArray] of Object.entries(relatedSkills)) {
      if (
        (skill1.includes(key) && relatedArray.some((related) => skill2.includes(related))) ||
        (skill2.includes(key) && relatedArray.some((related) => skill1.includes(related)))
      ) {
        return true
      }
    }

    return false
  }

  const arePositionsRelated = (position1: string, position2: string): number => {
    const pos1 = position1.toLowerCase()
    const pos2 = position2.toLowerCase()

    if (pos1 === pos2) {
      return 100 // Exact match
    }

    const relatedPositions: { [key: string]: string[] } = {
      "ui/ux designer": ["ux designer", "ui designer", "product designer", "interaction designer"],
      "frontend developer": ["web developer", "javascript developer", "react developer", "vue developer"],
      "backend developer": ["software engineer", "java developer", "python developer", "node.js developer"],
      "full stack developer": ["web developer", "software engineer", "javascript developer"],
      "product manager": ["product owner", "project manager", "scrum master"],
      // Add more related positions as needed
    }

    for (const [key, related] of Object.entries(relatedPositions)) {
      if (
        (pos1.includes(key) && related.some((r) => pos2.includes(r))) ||
        (pos2.includes(key) && related.some((r) => pos1.includes(r)))
      ) {
        return 80 // Related position
      }
    }

    return 0 // Not related
  }

  const { score, details } = calculateCompatibility()

  return (
    <Card className="bg-[#1E293B] border-gray-700 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-white">Compatibilidade do Perfil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProfileComplete() ? (
          <>
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className={`text-3xl sm:text-4xl font-bold ${
                  score <= 50 ? "text-red-300" : score <= 80 ? "text-[#F7D047]" : "text-green-300"
                }`}
              >
                {Math.round(score)}%
              </div>
              <AnimatedProgressBar value={score} />
            </motion.div>
            <div className="space-y-4">
              {details.map((detail, index) => (
                <motion.div
                  key={index}
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <span className="text-gray-300">{detail.category}</span>
                    <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                      <span className="text-sm font-medium text-gray-300">{Math.round(detail.match)}%</span>
                      <AnimatedProgressBar value={detail.match} />
                    </div>
                  </div>
                  {detail.improvement && <p className="text-sm text-gray-400 mt-1">{detail.improvement}</p>}
                </motion.div>
              ))}
            </div>
            <motion.p
              className="text-xs sm:text-sm text-gray-400 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Esta pontuação é baseada na correspondência entre suas habilidades e os requisitos da vaga. Continue
              aprimorando seu perfil para aumentar suas chances!
            </motion.p>
          </>
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-white mb-4">Seu perfil está {calculateProfileCompleteness()}% completo.</p>
            <p className="text-gray-400 mb-4">
              A compatibilidade não pode ser calculada porque seu perfil está incompleto. É importante manter seu perfil
              sempre atualizado para obter melhores resultados de compatibilidade e aumentar suas chances de conseguir a
              vaga desejada.
            </p>
            <p className="text-gray-400 mb-4">
              Para completar seu perfil, adicione informações sobre:
              {!user.skills || user.skills.length === 0 ? <span className="block">- Suas habilidades</span> : null}
            </p>
            <Button asChild className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
              <Link href="/profile">Atualizar Perfil</Link>
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

