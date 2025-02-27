import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Configuração do cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use a chave da API do OpenAI
});


// Função de cálculo algorítmico
function calculateCompatibilityAlgorithmically(user: any, job: any): {
    score: number;
    details: string;
    matchedSkills: string[];
    missingSkills: string[];
  } {
    // Verifique se o perfil do usuário está completo
    if (!user.skills || user.skills.length === 0) {
      return {
        score: 0,
        details: 'Perfil do usuário incompleto. Adicione habilidades para calcular a compatibilidade.',
        matchedSkills: [],
        missingSkills: job.requirements,
      };
    }
  
    // Normalize as habilidades e requisitos (converta para minúsculas e remova espaços extras)
    const userSkills = user.skills.map((skill: string) => skill.toLowerCase().trim());
    const jobRequirements = job.requirements.map((req: string) => req.toLowerCase().trim());
  
    // Identifique as habilidades correspondentes e as faltantes
    const matchedSkills = jobRequirements.filter((req: string) =>
      userSkills.some((skill: string) => skill.includes(req) || req.includes(skill))
    );
  
    const missingSkills = jobRequirements.filter((req: string) =>
      !userSkills.some((skill: string) => skill.includes(req) || req.includes(skill))
    );
  
    // Calcule a pontuação de compatibilidade
    const totalRequirements = jobRequirements.length;
    const score = totalRequirements > 0 ? (matchedSkills.length / totalRequirements) * 100 : 0;
  
    // Gere detalhes da compatibilidade
    let details = '';
    if (score >= 80) {
      details = 'Ótima compatibilidade! O usuário possui a maioria das habilidades necessárias para a vaga.';
    } else if (score >= 50) {
      details = 'Compatibilidade moderada. O usuário possui algumas habilidades necessárias, mas pode precisar de aprimoramento.';
    } else {
      details = 'Baixa compatibilidade. O usuário precisa desenvolver mais habilidades para se qualificar para a vaga.';
    }
  
    // Adicione sugestões de melhoria
    if (missingSkills.length > 0) {
      details += ` Sugestões de habilidades para desenvolver: ${missingSkills.join(', ')}.`;
    }
  
    return {
      score,
      details,
      matchedSkills,
      missingSkills,
    };
  }

  

  export async function POST(req: Request) {
    try {
      const { user, job } = await req.json();
      console.log('Dados recebidos na API:', { user, job });
  
      if (!user || !job) {
        console.error('Dados do usuário ou da vaga ausentes');
        return NextResponse.json({ error: 'Dados do usuário ou da vaga ausentes' }, { status: 400 });
      }
  
      // Tente usar a API da OpenAI
      try {
        const prompt = `Calcule a compatibilidade do perfil do usuário com a vaga de emprego. O usuário possui as seguintes habilidades: ${user.skills.join(', ')}. A vaga requer as seguintes habilidades: ${job.requirements.join(', ')}. Nível da vaga: ${job.level}.
  
  Analise as habilidades do usuário e compare com os requisitos da vaga. Dê uma pontuação de compatibilidade (0 a 100) e explique detalhadamente por que o usuário é ou não compatível com a vaga. Inclua sugestões de como o usuário pode melhorar sua compatibilidade, se necessário.`;
        console.log('Prompt gerado:', prompt);
  
        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          model: 'gpt-3.5-turbo', // Modelo mais econômico
        });
  
        const generatedText = completion.choices[0].message.content;
        console.log('Texto gerado pela IA:', generatedText);
  
        if (!generatedText) {
          throw new Error('A IA não gerou nenhum texto.');
        }
  
        // Retorne o texto gerado como resposta
        return NextResponse.json(
          { score: 75, details: generatedText, matchedSkills: [], missingSkills: [] },
          { status: 200 }
        );
      } catch (aiError) {
        console.error('Erro ao chamar a API da OpenAI:', aiError);
  
        // Use o cálculo algorítmico como fallback
        const { score, details, matchedSkills, missingSkills } = calculateCompatibilityAlgorithmically(user, job);
        return NextResponse.json(
          { score, details, matchedSkills, missingSkills },
          { status: 200 }
        );
      }
    } catch (error) {
      console.error('Erro na rota da API:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }