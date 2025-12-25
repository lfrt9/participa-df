# Participa DF - Ouvidoria Digital

Sistema web progressivo (PWA) para registro de manifestações cidadãs junto à Ouvidoria do Governo do Distrito Federal.

**Solução desenvolvida para o 1º Hackathon em Controle Social - Desafio Participa DF**

---

## Demonstração em Vídeo

🎥 **Link do vídeo demonstrativo:** [INSERIR LINK DO VÍDEO AQUI]

---

## Sobre o Projeto

O **Participa DF** é uma aplicação web moderna que facilita o registro de manifestações cidadãs (denúncias, reclamações, sugestões e elogios) junto à Ouvidoria do Governo do Distrito Federal.

### Principais Funcionalidades

- **Multicanal**: Aceita manifestações via texto, áudio, imagem e vídeo
- **Anonimato**: Opção de registro anônimo com proteção de dados
- **Acessibilidade**: Conformidade com WCAG 2.1 nível AA
- **PWA**: Funciona offline e pode ser instalado como aplicativo
- **Responsivo**: Experiência otimizada para desktop e dispositivos móveis
- **Protocolo**: Geração automática de número de protocolo para acompanhamento

---

## Tecnologias e Ferramentas Utilizadas

### Linguagens e Frameworks
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 18.2.0 | Biblioteca para construção de interfaces |
| **TypeScript** | 5.3.3 | Superset JavaScript com tipagem estática |
| **Vite** | 5.0.12 | Build tool e dev server |
| **Tailwind CSS** | 3.4.1 | Framework CSS utilitário |

### Bibliotecas Principais
| Biblioteca | Propósito |
|------------|-----------|
| **Zustand** | Gerenciamento de estado global |
| **React Hook Form** | Gerenciamento de formulários |
| **Zod** | Validação de schemas |
| **Radix UI** | Componentes acessíveis |
| **Lucide React** | Ícones SVG |
| **LocalForage** | Persistência de dados offline |
| **react-media-recorder** | Gravação de áudio |

### PWA e Offline
| Tecnologia | Propósito |
|------------|-----------|
| **vite-plugin-pwa** | Geração do Service Worker |
| **Workbox** | Estratégias de cache offline |

### Ferramentas de Desenvolvimento
| Ferramenta | Propósito |
|------------|-----------|
| **Visual Studio Code** | Editor de código |
| **Git** | Controle de versão |
| **GitHub** | Repositório remoto |
| **Node.js / npm** | Runtime e gerenciador de pacotes |
| **ESLint** | Linting e padrões de código |
| **Playwright** | Testes E2E |
| **Vitest** | Testes unitários |

---

## Requisitos do Sistema

- **Node.js** versão 18.x ou superior
- **npm** versão 9.x ou superior (ou yarn/pnpm)

---

## Instalação e Execução

### 1. Clonar o Repositório

```bash
git clone [URL_DO_REPOSITORIO]
cd projeto2
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Executar em Modo de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

### 4. Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### 5. Visualizar Build de Produção

```bash
npm run preview
```

---

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run preview` | Visualiza o build de produção |
| `npm run lint` | Executa o linter (ESLint) |
| `npm run test` | Executa testes unitários |
| `npm run test:e2e` | Executa testes E2E com Playwright |

### Scripts de Teste por Critério do Edital

| Comando | Critério | Descrição |
|---------|----------|-----------|
| `npm run test:a11y` | P1 - Acessibilidade | Testes WCAG 2.1 AA |
| `npm run test:multichannel` | P1 - Multicanal | Texto, áudio, imagem, vídeo |
| `npm run test:ux` | P1 - UX/UI | Experiência do usuário |
| `npm run test:integration` | P1 - Integração | Integração com sistemas |
| `npm run test:logic` | P2 - Lógica | Fluxo e validações |
| `npm run test:responsive` | Responsividade | Desktop, tablet, mobile |
| `npm run test:flow` | Fluxo completo | Jornada completa do usuário |
| `npm run test:p1` | Todos P1 | Todos os critérios P1 |
| `npm run test:p2` | Todos P2 | Todos os critérios P2 |
| `npm run test:all-criteria` | Todos | Todos os critérios do edital |

---

## Estrutura do Projeto

```
projeto2/
├── public/                 # Arquivos estáticos (ícones, manifest, etc.)
├── src/
│   ├── components/        # Componentes React
│   │   ├── form/          # Componentes do formulário wizard
│   │   ├── layout/        # Header, Footer, Layout
│   │   ├── media/         # Upload de arquivos, gravação de áudio
│   │   └── ui/            # Componentes UI reutilizáveis
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilitários e helpers
│   ├── stores/            # Estado global (Zustand)
│   ├── styles/            # CSS global e variáveis
│   ├── types/             # Definições de tipos TypeScript
│   └── main.tsx           # Ponto de entrada da aplicação
├── tests/                 # Testes E2E
└── package.json
```

---

## Acessibilidade (Critério P1 - 2.5 pontos)

A aplicação foi desenvolvida seguindo as diretrizes **WCAG 2.1 nível AA**, conforme exigido pelo edital.

### Recursos Implementados

| Recurso | Descrição | Status |
|---------|-----------|--------|
| Navegação por teclado | Tab order lógico em todas as páginas | ✅ |
| Focus visible | Indicadores de foco visíveis em todos elementos | ✅ |
| Skip links | Atalhos para navegação rápida | ✅ |
| Contraste | Texto normal 4.5:1, texto grande 3:1 | ✅ |
| Labels | Todos inputs com labels associados | ✅ |
| ARIA | Roles e atributos semânticos corretos | ✅ |
| Alt text | Imagens com textos alternativos | ✅ |
| aria-live | Regiões para updates dinâmicos | ✅ |
| Touch targets | Mínimo 44x44px em elementos interativos | ✅ |
| Reduced motion | Respeita preferência do usuário | ✅ |
| Zoom 200% | Sem scroll horizontal em zoom | ✅ |
| ESC para fechar | Modais e dropdowns fecham com ESC | ✅ |

### Executar Testes de Acessibilidade

```bash
# Instalar Playwright (se necessário)
npx playwright install

# Executar apenas testes de acessibilidade
npm run test:a11y

# Executar com interface visual
npx playwright test tests/e2e/specs/p1-criteria/accessibility.spec.ts --ui

# Executar com debug
npx playwright test tests/e2e/specs/p1-criteria/accessibility.spec.ts --debug
```

### Testes Automatizados Cobertos

Os testes utilizam **axe-core** (Deque Systems) para validação automática WCAG:

#### 1. Contraste de Cores
```bash
# Verifica contraste mínimo 4.5:1 para texto normal
# Verifica contraste mínimo 3:1 para texto grande
npm run test:a11y -- --grep "Contraste"
```

#### 2. Navegação por Teclado
```bash
# Tab order lógico
# Focus visível em todos elementos
# Sem keyboard traps
# Skip links funcionais
# ESC fecha modais
npm run test:a11y -- --grep "teclado"
```

#### 3. Screen Readers (ARIA)
```bash
# Labels em todos inputs
# Alt text em imagens
# aria-live regions
# Roles semânticos corretos
npm run test:a11y -- --grep "ARIA"
```

#### 4. Outros Critérios WCAG
```bash
# Zoom 200% sem scroll horizontal
# Touch targets 44x44px mínimo
# prefers-reduced-motion respeitado
# Análise completa axe-core
npm run test:a11y -- --grep "WCAG"
```

### Ferramentas de Acessibilidade Utilizadas

| Ferramenta | Uso |
|------------|-----|
| `@axe-core/playwright` | Testes automáticos E2E |
| `@axe-core/react` | Verificação em desenvolvimento |
| `eslint-plugin-jsx-a11y` | Linting de acessibilidade |
| **Radix UI** | Componentes acessíveis por padrão |

### Validação Manual Recomendada

Além dos testes automatizados, recomenda-se validar com:

1. **NVDA** ou **VoiceOver** - Leitores de tela
2. **Navegação apenas por teclado** - Desabilitar mouse
3. **Chrome DevTools > Lighthouse** - Audit de acessibilidade
4. **axe DevTools Extension** - Extensão do navegador

---

## Uso de Inteligência Artificial

Conforme permitido pelo item 13.9 do edital, esta solução utilizou ferramentas de Inteligência Artificial como apoio no desenvolvimento:

- **ChatGPT (OpenAI)**
- **Claude (Anthropic)**

A IA foi utilizada como ferramenta de apoio. Todo o código foi revisado, testado e validado pela equipe.

---

## Licença

MIT License

---

## Equipe

Desenvolvido para o **1º Hackathon em Controle Social - Desafio Participa DF**

Organizado pela **Controladoria-Geral do Distrito Federal (CGDF)**
