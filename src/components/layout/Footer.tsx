export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h2 className="font-semibold text-foreground mb-3">Participa DF</h2>
            <p className="text-sm text-muted-foreground">
              Canal oficial de manifestações cidadãs do Governo do Distrito Federal.
              Denúncias, reclamações, sugestões e elogios.
            </p>
          </div>

          {/* Links */}
          <div>
            <h2 className="font-semibold text-foreground mb-3">Links Úteis</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.cg.df.gov.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[hsl(var(--gdf-blue))] transition-colors"
                >
                  Controladoria-Geral do DF
                </a>
              </li>
              <li>
                <a
                  href="https://www.df.gov.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[hsl(var(--gdf-blue))] transition-colors"
                >
                  Portal do Governo
                </a>
              </li>
              <li>
                <a
                  href="https://www.participa.df.gov.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[hsl(var(--gdf-blue))] transition-colors"
                >
                  Participa DF Oficial
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-semibold text-foreground mb-3">Contato</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Central 162 (ligação gratuita)</li>
              <li>ouvidoria@cg.df.gov.br</li>
              <li>Segunda a Sexta, 8h às 18h</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {currentYear} Governo do Distrito Federal. Todos os direitos reservados.
          </p>
          <p className="mt-1">
            Desenvolvido para o 1º Hackathon em Controle Social - Desafio Participa DF
          </p>
        </div>
      </div>
    </footer>
  )
}
