"use client"
import { useState, useEffect } from "react"
import { NavBar } from "@/components/nav-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronUp, Menu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const sections = [
  { id: "introducao", title: "1. Introdução" },
  { id: "informacoes-coletadas", title: "2. Informações que Coletamos" },
  { id: "uso-informacoes", title: "3. Como Usamos Suas Informações" },
  { id: "compartilhamento", title: "4. Compartilhamento de Informações" },
  { id: "seus-direitos", title: "5. Seus Direitos" },
  { id: "seguranca", title: "6. Segurança dos Dados" },
  { id: "retencao", title: "7. Retenção de Dados" },
  { id: "cookies", title: "8. Uso de Cookies" },
  { id: "alteracoes", title: "9. Alterações a Esta Política" },
  { id: "contato", title: "10. Contato" },
]

export default function PrivacyPolicyPage() {
  const isBrowser = typeof window !== "undefined"; // Reintroducing isBrowser
  const [activeSection, setActiveSection] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isBrowser) return; // Ensure code runs only in the browser

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
            <CardTitle className="text-3xl font-bold text-center">Política de Privacidade da VaGogh.com</CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8 w-full">
              <div className="lg:w-1/4">
                <div className="sticky top-24">
                  <Button variant="outline" className="md:hidden w-full mb-4" onClick={() => setMenuOpen(!menuOpen)}>
                    <Menu className="mr-2 h-4 w-4" /> Índice
                  </Button>
                  <AnimatePresence>
                    {(menuOpen || (isBrowser && window.innerWidth >= 768)) && (
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
                    Bem-vindo(a) à VaGogh.com! A sua privacidade é muito importante para nós. Este documento explica
                    como coletamos, usamos, armazenamos e protegemos suas informações pessoais ao utilizar nossa
                    plataforma.
                  </p>

                  <section id="introducao" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">1. Introdução</h2>
                    <p>
                      A VaGogh.com é comprometida com a transparência no uso de dados pessoais. Esta Política de
                      Privacidade descreve como tratamos suas informações de acordo com as leis de proteção de dados
                      aplicáveis.
                    </p>
                  </section>

                  <section id="informacoes-coletadas" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">2. Informações que Coletamos</h2>
                    <h3 className="text-2xl font-medium mt-6 mb-4 text-gray-300">
                      2.1. Informações Fornecidas por Você
                    </h3>
                    <p>Ao criar uma conta ou utilizar nossos serviços, podemos coletar:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                      <li>Nome completo, e-mail e informações de contato.</li>
                      <li>Currículo, histórico profissional e preferências de vagas.</li>
                      <li>Informações de pagamento, caso você contrate serviços pagos.</li>
                    </ul>
                    <h3 className="text-2xl font-medium mt-6 mb-4 text-gray-300">
                      2.2. Informações Coletadas Automaticamente
                    </h3>
                    <p>Ao acessar nossa plataforma, coletamos automaticamente:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                      <li>Dados de navegação, como endereço IP, tipo de dispositivo, navegador e páginas visitadas.</li>
                      <li>Cookies e tecnologias similares para melhorar a experiência do usuário.</li>
                    </ul>
                  </section>

                  <section id="uso-informacoes" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">3. Como Usamos Suas Informações</h2>
                    <p>Utilizamos suas informações para:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                      <li>Conectar candidatos e empresas de forma eficiente.</li>
                      <li>Melhorar a experiência do usuário com recomendações personalizadas.</li>
                      <li>Entrar em contato sobre atualizações, novas funcionalidades ou comunicações importantes.</li>
                      <li>Cumprir obrigações legais e regulatórias.</li>
                    </ul>
                  </section>

                  <section id="compartilhamento" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">4. Compartilhamento de Informações</h2>
                    <p>Compartilhamos informações pessoais apenas:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                      <li>Com empresas que publicam vagas, mediante seu consentimento explícito.</li>
                      <li>Com fornecedores e parceiros confiáveis que nos ajudam a operar a plataforma.</li>
                      <li>Quando exigido por lei ou para proteger nossos direitos legais.</li>
                    </ul>
                  </section>

                  <section id="seus-direitos" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">5. Seus Direitos</h2>
                    <p>Você tem o direito de:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                      <li>Acessar, corrigir ou excluir suas informações pessoais.</li>
                      <li>Revogar seu consentimento para o uso de dados, a qualquer momento.</li>
                      <li>Solicitar a portabilidade de dados ou limitar seu processamento.</li>
                    </ul>
                    <p className="mt-4">
                      Para exercer seus direitos, entre em contato pelo e-mail privacidade@vagogh.com.
                    </p>
                  </section>

                  <section id="seguranca" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">6. Segurança dos Dados</h2>
                    <p>
                      Adotamos medidas técnicas e organizacionais adequadas para proteger suas informações contra acesso
                      não autorizado, perda ou uso indevido. Porém, nenhum sistema é 100% seguro, e não podemos garantir
                      a segurança absoluta.
                    </p>
                  </section>

                  <section id="retencao" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">7. Retenção de Dados</h2>
                    <p>
                      Armazenamos suas informações pelo tempo necessário para cumprir os objetivos descritos nesta
                      Política, salvo se a lei exigir outro período.
                    </p>
                  </section>

                  <section id="cookies" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">8. Uso de Cookies</h2>
                    <p>Utilizamos cookies para:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                      <li>Lembrar suas preferências.</li>
                      <li>Analisar o desempenho da plataforma.</li>
                      <li>Personalizar anúncios (com consentimento).</li>
                    </ul>
                    <p className="mt-4">Você pode ajustar as configurações de cookies em seu navegador.</p>
                  </section>

                  <section id="alteracoes" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">9. Alterações a Esta Política</h2>
                    <p>
                      Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças
                      significativas por e-mail ou em nossa plataforma.
                    </p>
                  </section>

                  <section id="contato" className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-[#F7D047]">10. Contato</h2>
                    <p>
                      Se tiver dúvidas ou preocupações sobre esta Política de Privacidade, entre em contato conosco:
                    </p>
                    <p className="mt-4">E-mail: privacidade@vagogh.com</p>
                    <p className="mt-4">Última atualização: 28/01/2025</p>
                  </section>

                  <p className="text-center text-xl font-semibold mt-8">
                    VaGogh.com – Transformando o mercado remoto com confiança e segurança.
                  </p>
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

