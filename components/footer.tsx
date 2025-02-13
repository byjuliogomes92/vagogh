import Link from "next/link"
import { Github, Linkedin, Twitter, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-[#1E293B] py-8 mt-auto relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Creators Section */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold mb-3">Criado por</h3>
            <div className="space-y-2">
              <Link
                href="https://www.linkedin.com/in/byjuliogomes/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                <span className="hover:underline">Júlio Cesar Gomes</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/ingridnogueira/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                <span className="hover:underline">Íngrid Dayana</span>
              </Link>
            </div>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold mb-3">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/guia-carreira" className="text-muted-foreground hover:text-foreground transition-colors">
                  Guia de Carreira
                </Link>
              </li>
              <li>
                <Link href="/empresas" className="text-muted-foreground hover:text-foreground transition-colors">
                  Para Empresas
                </Link>
              </li>
              <li>
                <Link href="/ajuda" className="text-muted-foreground hover:text-foreground transition-colors">
                  Central de Ajuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Legal Section */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold mb-3">Redes Sociais</h3>
            <div className="flex space-x-4">
              <Link
                href="https://github.com/vagogh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com/vagogh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>

            <div className="pt-4 space-y-2">
              <Link
                href="/privacidade"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Política de Privacidade
              </Link>
              <Link
                href="/termos"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-border flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VaGogh. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground flex items-center mt-2 sm:mt-0">
            Feito com <Heart className="h-4 w-4 mx-1 text-red-500" /> no Brasil
          </p>
        </div>
      </div>
    </footer>
  )
}

