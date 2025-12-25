# Participa DF - Ouvidoria PWA

> Sistema de registro de manifestações cidadãs para a Ouvidoria do Governo do Distrito Federal

[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA-green)](https://www.w3.org/WAI/WCAG21/quickref/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue)](https://web.dev/progressive-web-apps/)
[![React](https://img.shields.io/badge/React-18.2-61dafb)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

## Sobre o Projeto

Este PWA foi desenvolvido para o **1º Hackathon em Controle Social - Desafio Participa DF**, permitindo que cidadãos registrem manifestações junto à Ouvidoria do Distrito Federal de forma acessível e intuitiva.

### Funcionalidades Principais

- **Multicanalidade**: Registro via texto, áudio, imagem e vídeo
- **Acessibilidade WCAG 2.1 AA**: Interface totalmente acessível
- **PWA Instalável**: Funciona offline após instalação
- **Anonimato Opcional**: Manifestações identificadas ou anônimas
- **Detecção de PII**: Alerta sobre dados pessoais em manifestações anônimas
- **Protocolo Padronizado**: Formato DF-YYYYMMDD-XXXXX-TT

### Tipos de Manifestação

- 🚨 **Denúncia**: Comunicar irregularidades ou condutas ilegais
- 📢 **Reclamação**: Relatar insatisfação com serviço público
- 💡 **Sugestão**: Propor melhorias nos serviços
- 👍 **Elogio**: Reconhecer um bom atendimento
- 📋 **Solicitação**: Solicitar um serviço ou providência
- ❓ **Pedido de Informação**: Solicitar informações sobre serviços

## Tecnologias

| Categoria | Tecnologia |
|-----------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 + vite-plugin-pwa |
| UI | Radix UI + Tailwind CSS |
| Estado | Zustand |
| Formulários | React Hook Form + Zod |
| Testes | Playwright + axe-core |

## Instalação

Consulte o guia completo em [INSTALLATION.md](./INSTALLATION.md).

### Início Rápido

```bash
# Clonar repositório
git clone <url-do-repositorio>
cd projeto2

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:5173

## Estrutura do Projeto

```
projeto2/
├── src/
│   ├── App.tsx                    # Componente principal
│   ├── main.tsx                   # Entry point
│   ├── styles/globals.css         # Design system
│   ├── types/manifestation.ts     # Tipos TypeScript
│   ├── hooks/useWizardStore.ts    # Estado global (Zustand)
│   ├── services/
│   │   ├── protocol.service.ts    # Geração de protocolo
│   │   └── storage.service.ts     # Armazenamento local
│   ├── components/
│   │   ├── ui/                    # Componentes de interface
│   │   ├── layout/                # Layout (Header, Footer)
│   │   └── media/                 # Gravação/upload de mídia
│   └── features/wizard/           # Etapas do formulário
├── tests/e2e/                     # Testes Playwright
├── public/                        # Assets públicos
└── playwright.config.ts           # Configuração de testes
```

## Fluxo do Usuário

O registro de manifestação segue um wizard de 6 etapas:

1. **Relato**: Descrever a manifestação (texto, áudio ou arquivos)
2. **Assunto**: Selecionar tipo e categoria
3. **Resumo**: Revisar informações
4. **Identificação**: Escolher identificação ou anonimato
5. **Anexos**: Adicionar arquivos complementares (opcional)
6. **Protocolo**: Confirmação com número do protocolo

## Formato do Protocolo

O protocolo segue o padrão:

```
DF-YYYYMMDD-XXXXX-TT

Onde:
- DF: Jurisdição (Distrito Federal)
- YYYYMMDD: Data de registro
- XXXXX: Número sequencial (00001-99999)
- TT: Código do tipo + canal (ex: DNT = Denúncia Texto)
```

Exemplo: `DF-20260127-00042-RCT` (Reclamação via Texto)

## Acessibilidade

O projeto segue as diretrizes WCAG 2.1 nível AA:

- ✅ Contraste de cores 4.5:1 (texto normal) e 3:1 (texto grande)
- ✅ Navegação completa por teclado
- ✅ Compatível com leitores de tela (ARIA)
- ✅ Touch targets mínimo 44x44px
- ✅ Zoom até 200% sem perda de funcionalidade
- ✅ Respeita `prefers-reduced-motion`
- ✅ Semântica HTML5 correta

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build

# Testes
npm run test:e2e     # Todos os testes E2E
npm run test:a11y    # Testes de acessibilidade
npm run test:p1      # Testes critérios P1
npm run test:p2      # Testes critérios P2
npm run test:responsive  # Testes de responsividade

# Lint
npm run lint         # Verificar código
```

## Testes

Os testes E2E cobrem todos os critérios do edital:

### Critérios P1 (Entrega)

| Critério | Pontuação | Arquivo de Teste |
|----------|-----------|------------------|
| Acessibilidade | 2.5 pts | `accessibility.spec.ts` |
| Multicanalidade | 3.0 pts | `multichannel.spec.ts` |
| UX/UI | 3.0 pts | `ux-ui.spec.ts` |
| Integração | 1.5 pts | `integration.spec.ts` |

### Critérios P2 (Código)

| Critério | Pontuação | Arquivo de Teste |
|----------|-----------|------------------|
| Lógica | 3.0 pts | `logic-flow.spec.ts` |

### Executar Testes

```bash
# Instalar browsers do Playwright
npx playwright install

# Executar todos os testes
npm run test:e2e

# Visualizar relatório
npm run test:e2e:report
```

## PWA (Progressive Web App)

O aplicativo pode ser instalado em dispositivos:

1. Acesse o site em um navegador compatível
2. Clique em "Instalar" na barra de endereço ou menu
3. O app ficará disponível na tela inicial

### Funcionalidades Offline

- Interface carrega mesmo sem conexão
- Manifestações são salvas localmente
- Sincronização automática quando online

## Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nome`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nome`)
5. Abra um Pull Request

## Licença

Este projeto foi desenvolvido para o 1º Hackathon em Controle Social - Desafio Participa DF.

## Contato

- **Ouvidoria GDF**: 162 (ligação gratuita)
- **Email**: ouvidoria@cg.df.gov.br
- **Site**: [participa.df.gov.br](https://www.participa.df.gov.br)

---

Desenvolvido para o **1º Hackathon em Controle Social - Desafio Participa DF** 🏛️
