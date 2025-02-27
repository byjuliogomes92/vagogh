"use client"
import type React from "react"
import { NavBar } from "@/components/nav-bar"
import { WorldMap } from "@/components/world-map"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Users, Zap, Coffee, Briefcase, Search, ArrowRight } from "lucide-react"
import { useJobPostingStatus } from "@/contexts/job-posting-context"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"

const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
    <Card className="bg-[#1E293B] border-none h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className="w-6 h-6 text-[#7333DD]" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
)

const TeamMember = ({
  name,
  role,
  image,
  linkedin,
}: {
  name: string
  role: string
  image: string
  linkedin: string
}) => (
  <motion.div
    className="flex flex-col items-center space-y-2"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Image
      src={image || "/placeholder.svg"}
      alt={name}
      width={120}
      height={120}
      className="rounded-full border-4 border-[#7333DD]"
    />
    <h3 className="text-xl font-semibold text-white">{name}</h3>
    <p className="text-gray-400">{role}</p>
    <Link href={linkedin} target="_blank" rel="noopener noreferrer">
      <Button variant="outline" size="sm" className="mt-2 bg-[#1E293B]">
        LinkedIn
      </Button>
    </Link>
  </motion.div>
)

const FAQItem = ({ question, answer }: { question: string; answer: string }) => (
  <AccordionItem value={question}>
    <AccordionTrigger>{question}</AccordionTrigger>
    <AccordionContent>{answer}</AccordionContent>
  </AccordionItem>
)

const Statistic = ({ value, label }: { value: string; label: string }) => (
  <motion.div className="text-center" whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
    <h3 className="text-4xl font-bold text-[#F7D047]">{value}</h3>
    <p className="text-gray-400">{label}</p>
  </motion.div>
)

export default function SobreNos(): React.ReactNode {
  const { isJobPostingEnabled } = useJobPostingStatus()

  const features = [
    {
      icon: Globe,
      title: "Alcance Global",
      description: "Conecte-se com oportunidades de trabalho remoto de empresas do mundo todo.",
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description: "Faça parte de uma comunidade vibrante de profissionais remotos e empresas inovadoras.",
    },
    {
      icon: Zap,
      title: "Tecnologia Avançada",
      description: "Nossa plataforma utiliza IA para matching perfeito entre candidatos e vagas.",
    },
    {
      icon: Coffee,
      title: "Cultura Remota",
      description: "Promovemos e valorizamos a cultura do trabalho remoto e flexível.",
    },
    {
      icon: Briefcase,
      title: "Vagas de Qualidade",
      description: "Curadoria das melhores oportunidades de trabalho remoto do mercado.",
    },
    {
      icon: Search,
      title: "Busca Inteligente",
      description: "Ferramentas avançadas para encontrar a vaga ideal para o seu perfil.",
    },
  ]

  const faqItems = [
    {
      question: "O que é o VaGogh?",
      answer:
        "O VaGogh é uma plataforma de busca de empregos focada em conectar profissionais talentosos a oportunidades de trabalho remoto em todo o mundo.",
    },
    {
      question: "Como funciona o processo de candidatura?",
      answer:
        "Após criar sua conta, você pode pesquisar vagas, filtrar por suas preferências e se candidatar diretamente através da plataforma. Algumas empresas podem redirecionar você para seus próprios sistemas de candidatura.",
    },
    {
      question: "O VaGogh é gratuito para candidatos?",
      answer:
        "Sim, o uso da plataforma é totalmente gratuito para candidatos. Não cobramos nenhuma taxa para buscar vagas ou se candidatar.",
    },
    {
      question: "Como as empresas podem publicar vagas?",
      answer:
        "As empresas podem se cadastrar na plataforma e publicar vagas através de nossa interface intuitiva. Oferecemos opções de publicação gratuita e patrocinada para maior visibilidade.",
    },
  ]

  const testimonials = [
    {
      quote: "O VaGogh transformou minha busca por emprego. Encontrei meu trabalho dos sonhos em apenas duas semanas!",
      author: "Maria S., Designer UX",
    },
    {
      quote: "A plataforma mais intuitiva que já usei. As recomendações de vagas são sempre relevantes.",
      author: "João P., Desenvolvedor Full Stack",
    },
    {
      quote: "Graças ao VaGogh, consegui uma oportunidade internacional sem sair de casa.",
      author: "Ana L., Gerente de Produto",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0F172A] relative">
      <WorldMap />
      <div className="relative z-10">
        <NavBar />
        <main className="container mx-auto px-4 py-16 pt-24">
          {/* Hero Section */}
          <motion.section
            className="text-center mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-playfair italic text-[#F7D047]">
              Descubra o Futuro do Trabalho Remoto
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              O VaGogh conecta profissionais talentosos a oportunidades globais de trabalho remoto. Sua próxima grande
              oportunidade está a um clique de distância.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-[#7333DD] hover:bg-[#5d20c0] text-white text-lg">
                Comece Sua Jornada <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </motion.section>

          {/* Statistics Section */}
          <motion.section
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Statistic value="10k+" label="Vagas Disponíveis" />
              <Statistic value="5k+" label="Empresas Parceiras" />
              <Statistic value="100k+" label="Profissionais Conectados" />
            </div>
          </motion.section>

          {/* Features Section */}
          <motion.section
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-3xl font-semibold text-white mb-8 text-center">Por que escolher o VaGogh?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
              ))}
            </div>
          </motion.section>

          {/* Testimonials Section */}
          <motion.section
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-3xl font-semibold text-white mb-8 text-center">O que dizem nossos usuários</h2>
            <InfiniteMovingCards items={testimonials} direction="right" speed="slow">
              {(testimonial) => (
                <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-none">
                  <CardContent className="p-6">
                    <p className="text-gray-300 italic mb-4">"{testimonial.quote}"</p>
                    <p className="text-white font-semibold">{testimonial.author}</p>
                  </CardContent>
                </Card>
              )}
            </InfiniteMovingCards>
          </motion.section>

          {/* Team Section */}
          <motion.section
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h2 className="text-3xl font-semibold text-white mb-8 text-center">Conheça Nossa Equipe</h2>
            <div className="flex flex-wrap justify-center gap-12">
              <TeamMember
                name="Júlio Cesar Gomes"
                role="Co-fundador & Desenvolvedor"
                image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1690508626742.jpg-YrOvNoAXlsqIPwug255OPvaQOmeMzn.jpeg"
                linkedin="https://www.linkedin.com/in/byjuliogomes/"
              />
              <TeamMember
                name="Íngrid Dayana"
                role="Co-fundadora & Gerente de Marketing"
                image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1734031699993.jpg-hy05nITCGatfdfBzIMSOBf461L2Qmq.jpeg"
                linkedin="https://www.linkedin.com/in/ingridnogueira/"
              />
            </div>
          </motion.section>

          {/* FAQ Section */}
          <motion.section
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <h2 className="text-3xl font-semibold text-white mb-8 text-center">Perguntas Frequentes</h2>
            <Card className="bg-[#1E293B] border-none">
              <CardContent className="pt-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <FAQItem key={index} question={item.question} answer={item.answer} />
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <h2 className="text-3xl font-semibold text-white mb-4">Pronto para Começar?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Junte-se a milhares de profissionais e empresas que já estão transformando o futuro do trabalho com o
              VaGogh.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/signup">
                <Button size="lg" className="bg-[#7333DD] hover:bg-[#5d20c0] text-white w-full sm:w-auto">
                  Cadastre-se Gratuitamente
                </Button>
              </Link>
              {isJobPostingEnabled ? (
                <Link href="/publicar-vaga">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white bg-[#1E293B] hover:bg-white hover:text-[#1C1C1C] w-full sm:w-auto"
                  >
                    Publicar uma Vaga
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white/70 border-white/70 cursor-not-allowed w-full sm:w-auto bg-[#1E293B]"
                  disabled
                >
                  Publicar uma Vaga
                  <span className="ml-2 px-1 py-0.5 text-[10px] bg-yellow-500 text-black rounded-full">Em breve</span>
                </Button>
              )}
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  )
}

