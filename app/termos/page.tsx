"use client"

import { useState, useEffect } from "react"
import { NavBar } from "@/components/nav-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronUp, Menu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

const sections = [
  { id: "aceitacao", title: "1. Aceitação dos Termos" },
  { id: "sobre", title: "2. Sobre a VaGogh.com" },
  { id: "uso", title: "3. Uso da Plataforma" },
  { id: "conteudo", title: "4. Conteúdo do Usuário" },
  { id: "taxas", title: "5. Taxas e Pagamentos" },
  { id: "responsabilidade", title: "6. Limitação de Responsabilidade" },
  { id: "propriedade", title: "7. Propriedade Intelectual" },
  { id: "privacidade", title: "8. Política de Privacidade" },
  { id: "rescisao", title: "9. Rescisão" },
  { id: "alteracoes", title: "10. Alterações nos Termos" },
  { id: "legislacao", title: "11. Legislação Aplicável" },
  { id: "contato", title: "12. Contato" },
]

const isBrowser = typeof window !== "undefined"; // Definição global de isBrowser

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // Garante que não roda no servidor

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);

      const sectionElements = sections.map((section) =>
        document.getElementById(section.id)
      );

      const currentSection = sectionElements.findIndex(
        (element) => element && element.getBoundingClientRect().top >= 0
      );

      if (currentSection !== -1) {
        setActiveSection(sections[currentSection].id);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isBrowser]);

  const scrollToTop = () => {
    if (isBrowser) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (isBrowser) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <Card className="w-full bg-[#1E293B] text-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Termos e Condições de Uso da VaGogh.com</CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8 w-full">
              <div className="lg:w-1/4">
                <div className="sticky top-24">
                  <Button variant="outline" className="md:hidden w-full mb-4" onClick={() => setMenuOpen(!menuOpen)}>
                    <Menu className="mr-2 h-4 w-4" /> Índice
                  </Button>
                  <AnimatePresence>
                    {(menuOpen || window.innerWidth >= 768) && (
                      <motion.nav
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1 bg-[#2C3E50] p-4 rounded-lg"
                      >
                        {sections.map((section) => (
                          <Button
                            key={section.id}
                            variant="ghost"
                            className={`w-full justify-start ${
                              activeSection === section.id ? "bg-[#3E5166] text-white" : "text-gray-300"
                            }`}
                            onClick={() => scrollToSection(section.id)}
                          >
                            {section.title}
                          </Button>
                        ))}
                      </motion.nav>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <ScrollArea className="w-full h-[70vh] md:h-[80vh] pr-4">
                <div className="space-y-8 text-lg leading-relaxed">
                  <p>
                    Bem-vindo(a) à VaGogh.com! Ao acessar e utilizar nossa plataforma, você concorda em cumprir os
                    seguintes Termos e Condições. Leia-os atentamente antes de usar o site.
                  </p>

                  <section id="aceitacao" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">1. Aceitação dos Termos</h2>
                    <p>
                      Ao criar uma conta ou acessar a VaGogh.com, você confirma que leu, entendeu e concorda com os
                      presentes Termos e Condições. Caso não concorde, pedimos que não utilize nossa plataforma.
                    </p>
                  </section>

                  <section id="sobre" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">2. Sobre a VaGogh.com</h2>
                    <p>
                      A VaGogh.com é uma plataforma dedicada à busca de vagas de trabalho remoto, conectando empresas a
                      candidatos ao redor do mundo. Não nos envolvemos diretamente na contratação, que ocorre
                      exclusivamente entre o candidato e a empresa.
                    </p>
                  </section>

                  <section id="uso" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">3. Uso da Plataforma</h2>
                    <h3 className="text-2xl font-medium mt-6 mb-4 text-gray-300">3.1. Elegibilidade</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>O uso da VaGogh.com está disponível apenas para indivíduos maiores de 18 anos.</li>
                      <li>O usuário deve fornecer informações reais e precisas ao criar um perfil.</li>
                    </ul>
                    <h3 className="text-2xl font-medium mt-6 mb-4 text-gray-300">3.2. Responsabilidades do Usuário</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Não é permitido o uso da plataforma para atividades ilegais ou não autorizadas.</li>
                      <li>Você é responsável por manter a confidencialidade de suas credenciais de acesso.</li>
                      <li>
                        Não nos responsabilizamos por informações incorretas fornecidas no perfil ou na descrição de
                        vagas.
                      </li>
                    </ul>
                  </section>

                  <section id="conteudo" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">4. Conteúdo do Usuário</h2>
                    <p>
                      Ao enviar informações, como currículos ou descrições de vagas, você concede à VaGogh.com o direito
                      não exclusivo de utilizar esse conteúdo para operar a plataforma.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                      <li>
                        É proibido o envio de conteúdos ofensivos, discriminatórios ou que violem leis e direitos
                        autorais.
                      </li>
                      <li>Reservamo-nos o direito de remover ou editar conteúdos que violem os Termos.</li>
                    </ul>
                  </section>

                  <section id="taxas" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">5. Taxas e Pagamentos</h2>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>O cadastro e a busca por vagas básicas são gratuitos para candidatos.</li>
                      <li>
                        Algumas funcionalidades avançadas podem estar disponíveis mediante assinatura ou pagamento de
                        taxas, previamente informadas.
                      </li>
                      <li>
                        Empresas podem estar sujeitas a taxas para publicar vagas ou acessar perfis de candidatos.
                      </li>
                    </ul>
                  </section>

                  <section id="responsabilidade" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">6. Limitação de Responsabilidade</h2>
                    <p>A VaGogh.com atua apenas como intermediária. Não garantimos:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                      <li>Contratações bem-sucedidas.</li>
                      <li>Precisão das informações fornecidas por empresas ou candidatos.</li>
                      <li>Disponibilidade constante da plataforma, que pode passar por manutenção ou interrupções.</li>
                    </ul>
                  </section>

                  <section id="propriedade" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">7. Propriedade Intelectual</h2>
                    <p>
                      Todo o conteúdo da VaGogh.com, incluindo o design, textos, gráficos, logos e código, é protegido
                      por leis de direitos autorais. É proibido reproduzir ou distribuir qualquer material sem
                      autorização prévia.
                    </p>
                  </section>

                  <section id="privacidade" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">8. Política de Privacidade</h2>
                    <p>
                      Para mais informações sobre como tratamos os dados coletados, consulte nossa{" "}
                      <Link href="/privacidade" className="text-[#F7D047] hover:underline">
                        Política de Privacidade
                      </Link>
                      .
                    </p>
                  </section>

                  <section id="rescisao" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">9. Rescisão</h2>
                    <p>
                      A VaGogh.com se reserva o direito de suspender ou encerrar seu acesso à plataforma a qualquer
                      momento, caso haja violação destes Termos.
                    </p>
                  </section>

                  <section id="alteracoes" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">10. Alterações nos Termos</h2>
                    <p>
                      Reservamo-nos o direito de alterar estes Termos a qualquer momento. Notificaremos os usuários
                      sobre mudanças significativas, mas recomendamos revisitar esta página periodicamente.
                    </p>
                  </section>

                  <section id="legislacao" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">11. Legislação Aplicável</h2>
                    <p>
                      Estes Termos são regidos pelas leis do Brasil, e qualquer disputa será resolvida nos tribunais
                      competentes do Estado de São Paulo.
                    </p>
                  </section>

                  <section id="contato" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">12. Contato</h2>
                    <p>
                      Caso tenha dúvidas sobre estes Termos, entre em contato conosco através do e-mail
                      suporte@vagogh.com.
                    </p>
                  </section>
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </main>
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8"
          >
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
              onClick={scrollToTop}
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

