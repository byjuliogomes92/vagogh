import { useState, useEffect } from 'react';
import type { User } from "@/contexts/auth-context";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Job = {
  title: string;
  requirements: string[];
  level: string;
};

type CompatibilityProps = {
  user: User;
  job: Job;
};



type Compatibility = {
  score: number;
  details: string;
  matchedSkills: string[];
  missingSkills: string[];
};

const AnimatedProgressBar = ({ value }: { value: number }) => {
  const getColor = () => {
    if (value <= 50) return "bg-red-300";
    if (value <= 80) return "bg-[#F7D047]";
    return "bg-green-300";
  };

  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${getColor()}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
};

export function CompatibilitySection({ user, job }: CompatibilityProps) {
  const [compatibility, setCompatibility] = useState<Compatibility | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.skills && user.skills.length > 0) {
      setLoading(true);

      fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, job }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Resposta da API:', data);
          setCompatibility({
            score: data.score,
            details: data.details,
            matchedSkills: data.matchedSkills || [],
            missingSkills: data.missingSkills || [],
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching compatibility:', error);
          setLoading(false);
        });
    }
  }, [user, job]);

  const isProfileComplete = (): boolean => {
    return !!user.skills && user.skills.length > 0;
  };

  const calculateProfileCompleteness = (): number => {
    return user.skills && user.skills.length > 0 ? 100 : 0;
  };

  return (
    <Card className="bg-[#1E293B] border-gray-700 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-white">Compatibilidade do Perfil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProfileComplete() ? (
          <>
            {loading ? (
              <p className="text-white">Calculando compatibilidade...</p>
            ) : (
              <>
                {compatibility && (
                  <>
                    <motion.div
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div
                        className={`text-3xl sm:text-4xl font-bold ${
                          compatibility.score <= 50
                            ? "text-red-300"
                            : compatibility.score <= 80
                            ? "text-[#F7D047]"
                            : "text-green-300"
                        }`}
                      >
                        {Math.round(compatibility.score)}%
                      </div>
                      <AnimatedProgressBar value={compatibility.score} />
                    </motion.div>

                    <motion.p
                      className="text-xs sm:text-sm text-gray-400 mt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      {compatibility.details}
                    </motion.p>

                    <div className="mt-4">
                      <h3 className="text-white font-semibold">Habilidades Correspondentes:</h3>
                      <ul className="text-gray-400">
                        {compatibility.matchedSkills.map((skill, index) => (
                          <li key={index}>✅ {skill}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-white font-semibold">Habilidades Faltantes:</h3>
                      <ul className="text-gray-400">
                        {compatibility.missingSkills.map((skill, index) => (
                          <li key={index}>❌ {skill}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </>
            )}
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
  );
}