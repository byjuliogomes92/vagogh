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
      title: "Foco no remoto",
      description: "As melhores oportunidades para trabalhar online, sem limitações geográficas.",
    },
    {
      icon: Users,
      title: "Vagas híbridas também",
      description: "Para quem deseja um equilíbrio entre escritório e home office.",
    },
    {
      icon: Zap,
      title: "Filtros avançados",
      description: "Encontre as vagas que mais se alinham com o seu perfil, experiência e preferências.",
    },
    {
      icon: Coffee,
      title: "Avisos periódicos de vagas por e-mail",
      description: "Receba atualizações sobre novas oportunidades diretamente na sua caixa de entrada.",
    },
    {
      icon: Briefcase,
      title: "IA para compatibilidade de vagas",
      description: "Nossa tecnologia ajuda a identificar as vagas que têm mais chances de se encaixar no seu perfil profissional.",
    },
    {
      icon: Search,
      title: "Atualizações constantes",
      description: "Oportunidades novas todos os dias, filtradas para quem busca flexibilidade e qualidade de vida.",
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
      <div className="relative z-10">
        <NavBar />
        <main className="container mx-auto px-4 py-16 pt-24">
          {/* Hero Section */}
          <motion.section
            className="text-center mb-24 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Título Principal */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-playfair italic text-[#F7D047]">
              Seu talento, sem fronteiras.
            </h1>

            {/* Descrição Breve */}
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              No Vagogh, acreditamos que talento não tem fronteiras. Conectamos você às melhores vagas remotas e híbridas, adaptadas ao seu estilo de vida.
            </p>

            {/* Botão de CTA */}
            <div className="mb-12">
              <Link href="/signup">
                <Button size="lg" className="bg-[#7333DD] hover:bg-[#5d20c0] text-white text-lg">
                  Comece Sua Jornada <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>

            {/* Missão e Valores Section */}
            <motion.section
              className="container mx-auto px-4 py-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Missão com Fundo Transparente */}
              <motion.div
                className="p-8 rounded-lg mb-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-2xl font-semibold text-[#F7D047] mb-4">Nossa Missão</h3>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Inspirados na genialidade e liberdade criativa de Van Gogh, queremos revolucionar a forma como as pessoas encontram trabalho. Nossa missão é conectar profissionais a empregos flexíveis, permitindo que você trabalhe de onde quiser – seja de casa, de um café ou viajando pelo mundo.
                </p>
              </motion.div>

              {/* Valores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: "/earth-globe.png", // Caminho correto para a imagem de liberdade
                    title: "Liberdade",
                    description: "Acreditamos que o trabalho deve se adaptar à vida das pessoas, não o contrário.",
                  },
                  {
                    icon: "/rocket.png", // Caminho correto para a imagem de acessibilidade
                    title: "Acessibilidade",
                    description: "Conectamos talentos às melhores oportunidades de forma simples e sem barreiras.",
                  },
                  {
                    icon: "/electric-light-bulb.png", // Caminho correto para a imagem de inovação
                    title: "Inovação",
                    description: "Oferecemos as vagas mais atualizadas e relevantes para você.",
                  },
                  {
                    icon: "/lock.png", // Caminho correto para a imagem de confiança
                    title: "Confiança",
                    description: "Garantimos que todas as oportunidades sejam seguras e alinhadas às suas expectativas.",
                  },
                  {
                    icon: "/chart.png", // Caminho correto para a imagem de crescimento
                    title: "Crescimento",
                    description: "Ajudamos você a construir uma carreira flexível e sustentável, sem limites geográficos.",
                  },
                  {
                    icon: "/handshake.png", // Caminho correto para a imagem de colaboração
                    title: "Colaboração",
                    description: "Promovemos um ambiente de trabalho colaborativo, onde todos podem contribuir e crescer juntos.",
                  },
                ].map((value, index) => (
                  <motion.div
                    key={index}
                    className="bg-[#1E293B] p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-24 h-24 mb-4 relative">
                      <Image
                        src={value.icon} // Caminho da imagem
                        alt={value.title} // Texto alternativo para acessibilidade
                        fill // Preenche o container (width e height são definidos pelo container)
                        className="object-contain" // Mantém a proporção da imagem
                      />
                    </div>
                    <h4 className="text-xl font-semibold text-[#F7D047] mb-2">{value.title}</h4>
                    <p className="text-gray-300">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* CTA Final */}
            <div className="mt-8">
              <Link href="/signup">
                <Button size="lg" className="bg-[#7333DD] hover:bg-[#5d20c0] text-white text-lg">
                  Comece Sua Jornada <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
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

