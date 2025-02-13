"use client";

import { useState, useEffect } from "react";
import { NavBar } from "@/components/nav-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronUp, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return; // Evita erro no SSR

    const handleScroll = () => {
      const scrollPosition = document.documentElement?.scrollTop || 0;
      setShowScrollTop(scrollPosition > 300);

      const sectionElements = sections
        .map((section) => document.getElementById(section.id))
        .filter((el): el is HTMLElement => el !== null); // Remove valores nulos

      const currentSection = sectionElements.find(
        (element) => element.getBoundingClientRect().top >= 0
      );

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (typeof document !== "undefined") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const scrollToTop = () => {
    if (typeof document !== "undefined") {
      document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex flex-row">
        <aside className="w-64 p-4 bg-gray-900 text-white">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="h-6 w-6 mr-2" />
            Menu
          </Button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant="ghost"
                    className={`w-full justify-start ${
                      activeSection === section.id
                        ? "bg-[#3E5166] text-white"
                        : "text-gray-300"
                    }`}
                    onClick={() => scrollToSection(section.id)}
                  >
                    {section.title}
                  </Button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
        <main className="flex-1 p-6">
          <ScrollArea className="max-w-4xl mx-auto">
            {sections.map((section) => (
              <Card key={section.id} id={section.id} className="mb-6">
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Conteúdo da seção {section.title}...</p>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </main>
      </div>

      {showScrollTop && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
