import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-[hsl(var(--gdf-blue))] text-white sticky top-0 z-50">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-[hsl(var(--gdf-blue))] focus:rounded-lg focus:font-medium"
      >
        Pular para o conteúdo principal
      </a>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <a href="/" className="flex items-center" aria-label="Participa DF - Página inicial">
            <img
              src="/participadf-logo.svg"
              alt="Participa DF - Ouvidoria do Governo"
              className="h-8 md:h-10"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Principal">
            <a
              href="https://www.df.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/90 hover:text-white transition-colors"
            >
              Portal GDF
            </a>
            <a
              href="https://www.cg.df.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/90 hover:text-white transition-colors"
            >
              Controladoria-Geral
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition-colors touch-target"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav
            id="mobile-menu"
            className="md:hidden py-4 border-t border-blue-700"
            aria-label="Menu mobile"
          >
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.df.gov.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-white/90 hover:text-white hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Portal GDF
                </a>
              </li>
              <li>
                <a
                  href="https://www.cg.df.gov.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-white/90 hover:text-white hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Controladoria-Geral
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
