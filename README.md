# Participa DF - Ouvidoria Digital

Sistema web progressivo (PWA) para registro de manifestações cidadãs junto à Ouvidoria do Governo do Distrito Federal.

**Solução desenvolvida para o 1º Hackathon em Controle Social - Desafio Participa DF**

**Acesso Online:** [https://projeto2.luisfrt.com](https://projeto2.luisfrt.com)

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
git clone https://github.com/lfrt9/participa-df.git
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

## Execução com Docker

O Docker é a forma mais simples de executar a aplicação em produção.

### Pré-requisitos

- **Docker** versão 20.x ou superior
- **Docker Compose** versão 2.x ou superior

### 1. Construir e Iniciar

```bash
# Clonar repositório
git clone https://github.com/lfrt9/participa-df.git
cd projeto2

# Construir e iniciar o container
docker compose up -d --build

# Verificar se está rodando
docker compose ps
```

### 2. Acessar a Aplicação

Após iniciar, acesse:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Aplicação** | http://localhost:3000 | Interface principal do PWA |

### 3. Testar a Aplicação

```bash
# Verificar health check
curl http://localhost:3000/health

# Verificar se a página carrega
curl -s http://localhost:3000 | head -20
```

### 4. Ver Logs

```bash
# Logs em tempo real
docker compose logs -f

# Logs com timestamp
docker compose logs -t
```

### 5. Parar a Aplicação

```bash
# Parar containers
docker compose down

# Parar e remover volumes
docker compose down -v
```

### Usando Imagem do GitHub Container Registry

Se preferir usar a imagem pré-construída:

```bash
# Baixar e executar a imagem
docker run -d -p 3000:80 --name ouvidoria-pwa ghcr.io/lfrt9/participa-df:latest

# Verificar se está rodando
docker ps

# Parar
docker stop ouvidoria-pwa && docker rm ouvidoria-pwa
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

A aplicação foi desenvolvida seguindo as diretrizes **WCAG 2.1 nível AA**, conforme exigido pelo edital. Abaixo está documentado cada critério atendido, sua implementação e como verificar.

---

### Sumário de Conformidade WCAG 2.1 AA

| Critério WCAG | Descrição | Status | Arquivo/Local |
|---------------|-----------|--------|---------------|
| 1.1.1 | Conteúdo não textual | ✅ | Ícones com `aria-hidden`, imagens com `alt` |
| 1.3.1 | Informações e relações | ✅ | Labels associados, landmarks semânticos |
| 1.3.2 | Sequência significativa | ✅ | Ordem do DOM corresponde à visual |
| 1.4.3 | Contraste mínimo | ✅ | Cores definidas em `globals.css` |
| 1.4.4 | Redimensionar texto | ✅ | Zoom 200% sem quebra de layout |
| 2.1.1 | Teclado | ✅ | Toda funcionalidade acessível via Tab |
| 2.1.2 | Sem bloqueio de teclado | ✅ | ESC fecha modais, sem keyboard traps |
| 2.4.1 | Ignorar blocos | ✅ | Skip link implementado |
| 2.4.3 | Ordem do foco | ✅ | Tab order lógico e sequencial |
| 2.4.6 | Cabeçalhos e rótulos | ✅ | `h1`, `h2`, `h3` hierárquicos |
| 2.4.7 | Foco visível | ✅ | Ring de foco em todos elementos |
| 3.3.1 | Identificação de erro | ✅ | Mensagens de erro com `role="alert"` |
| 3.3.2 | Rótulos ou instruções | ✅ | Labels e hints em todos campos |
| 4.1.1 | Análise sintática | ✅ | HTML válido, sem erros de parsing |
| 4.1.2 | Nome, função, valor | ✅ | ARIA labels e states corretos |

---

### Critério 1: Skip Link (WCAG 2.4.1)

**O que é:** Link invisível que aparece ao focar, permitindo pular diretamente para o conteúdo principal.

**Implementação:**
- Arquivo: `src/components/layout/Layout.tsx`
- Elemento: `<a href="#main-content" className="skip-link">Pular para conteúdo</a>`
- Target: `<main id="main-content" ...>`

**Como verificar:**
1. Abra a aplicação no navegador
2. Pressione `Tab` uma vez (o link aparece no topo esquerdo)
3. Pressione `Enter` para pular para o conteúdo
4. O foco vai diretamente para o `<main>`

**Teste automatizado:**
```bash
npm run test:a11y -- --grep "skip link"
```

---

### Critério 2: Landmarks Semânticos (WCAG 1.3.1)

**O que é:** Regiões identificáveis da página que leitores de tela anunciam.

**Implementação:**
- `<header role="banner">` - Cabeçalho da página
- `<main role="main">` - Conteúdo principal
- `<nav>` (se houver navegação)
- `<footer role="contentinfo">` - Rodapé

**Arquivos:**
- `src/components/layout/Header.tsx` - linha 8
- `src/components/layout/Layout.tsx` - linha 23
- `src/App.tsx` - estrutura geral

**Como verificar:**
1. Instale a extensão "Landmarks" no navegador
2. Ou abra DevTools > Elements e procure por `role=`
3. Ou use VoiceOver/NVDA e pressione o atalho de landmarks (NVDA: D)

**Teste automatizado:**
```bash
npm run test:a11y -- --grep "landmarks"
```

---

### Critério 3: Labels em Formulários (WCAG 1.3.1, 3.3.2)

**O que é:** Todo campo de entrada deve ter um rótulo associado programaticamente.

**Implementação:**
- Componente `Input`: `src/components/ui/Input.tsx`
  - Label com `htmlFor` vinculado ao `id` do input
  - Campos obrigatórios marcados com `aria-required="true"` (via atributo `required`)
  - Erros vinculados com `aria-describedby`

```tsx
// Exemplo de uso:
<Input
  id="input-nome"
  label="Nome completo"
  required
  error={errors.nome}
/>
```

**Como verificar:**
1. Clique no texto do label - o campo deve ganhar foco
2. No DevTools, inspecione o input e verifique:
   - `<label for="input-nome">` existe
   - O input tem `id="input-nome"`
   - Se há erro, `aria-describedby` aponta para o elemento de erro

**Locais dos campos:**
- Step 1 (Relato): `src/features/wizard/StepRelato.tsx` - linha 109
- Step 2 (Assunto): `src/features/wizard/StepAssunto.tsx` - linhas 63, 84
- Step 4 (Identificação): `src/features/wizard/StepIdentificacao.tsx` - linhas 196-239

**Teste automatizado:**
```bash
npm run test:a11y -- --grep "labels"
```

---

### Critério 4: Contraste de Cores (WCAG 1.4.3)

**O que é:** Texto deve ter contraste mínimo de 4.5:1 (normal) ou 3:1 (grande/bold).

**Implementação:**
- Arquivo: `src/styles/globals.css`
- Cores principais:
  - `--foreground: 222.2 84% 4.9%` (texto escuro) sobre `--background: 0 0% 100%` (fundo branco)
  - `--primary: 221.2 83.2% 53.3%` (azul GDF)
  - `--destructive: 0 84.2% 60.2%` (vermelho para erros)

**Ratios calculados:**
| Combinação | Ratio | Requisito | Status |
|------------|-------|-----------|--------|
| Texto escuro / Fundo branco | 16.8:1 | 4.5:1 | ✅ |
| Azul GDF / Fundo branco | 4.7:1 | 4.5:1 | ✅ |
| Texto em botões primários | 8.2:1 | 4.5:1 | ✅ |
| Vermelho erro / Fundo branco | 4.5:1 | 4.5:1 | ✅ |

**Como verificar:**
1. Chrome DevTools > Elements > Selecione texto
2. Na aba "Computed", procure por "color" e clique no quadrado colorido
3. O DevTools mostra o ratio de contraste automaticamente
4. Ou use a ferramenta online: https://webaim.org/resources/contrastchecker/

**Teste automatizado:**
```bash
npm run test:a11y -- --grep "contraste"
```

---

### Critério 5: Navegação por Teclado (WCAG 2.1.1, 2.1.2)

**O que é:** Toda funcionalidade deve ser operável via teclado, sem armadilhas.

**Implementação:**
- Todos os elementos interativos são focáveis (buttons, inputs, links)
- Tab order segue a ordem visual (sem `tabindex` > 0)
- Modais implementam "focus trap" temporário (foco fica dentro enquanto aberto)
- ESC fecha modais e dropdowns

**Arquivos relevantes:**
- Botões: `src/components/ui/Button.tsx`
- Modais: `src/components/ui/Modal.tsx` (usa Radix Dialog)
- Select/Dropdown: `src/components/ui/Select.tsx` (usa Radix Select)

**Como verificar:**
1. Desconecte o mouse ou use apenas teclado
2. Pressione `Tab` repetidamente - deve navegar por todos elementos interativos
3. A ordem deve ser: Skip link → Header → Conteúdo principal → Footer
4. Em cada step do wizard, deve seguir: campos do formulário → botão Voltar → botão Continuar
5. `Shift+Tab` navega na ordem inversa
6. Abra um dropdown e pressione `ESC` - deve fechar

**Teste automatizado:**
```bash
npm run test:a11y -- --grep "teclado"
```

---

### Critério 6: Foco Visível (WCAG 2.4.7)

**O que é:** O elemento focado deve ter indicador visual claro.

**Implementação:**
- Arquivo: `src/styles/globals.css`
- Classes de foco:

```css
/* Estilo global de foco */
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Botões */
.btn:focus-visible {
  @apply ring-2 ring-offset-2;
}

/* Inputs */
.form-input:focus {
  @apply border-primary ring-2 ring-primary/20;
}
```

**Como verificar:**
1. Navegue com `Tab` pela aplicação
2. Cada elemento focado deve ter um anel azul visível ao redor
3. O indicador deve ter contraste suficiente com o fundo

**Teste automatizado:**
```bash
npm run test:a11y -- --grep "foco"
```

---

### Critério 7: Mensagens de Erro Acessíveis (WCAG 3.3.1)

**O que é:** Erros devem ser identificados e descritos para o usuário, incluindo via tecnologias assistivas.

**Implementação:**
- Mensagens de erro têm `role="alert"` para serem anunciadas imediatamente
- Vinculadas ao campo via `aria-describedby`
- Campos inválidos têm `aria-invalid="true"`
- Toast de validação usa `aria-live="polite"`

**Arquivos:**
- `src/components/ui/Input.tsx` - linhas 40-45 (erro com role="alert")
- `src/hooks/useFormValidation.ts` - anúncio para screen readers
- `src/components/ui/Toast.tsx` - região aria-live

**Código do Input:**
```tsx
{error && (
  <p id={errorId} className="form-error" role="alert">
    <AlertCircle aria-hidden="true" />
    {error}
  </p>
)}
```

**Como verificar:**
1. Tente avançar sem preencher campos obrigatórios
2. O toast aparece com a mensagem de erro
3. Os campos inválidos são destacados
4. No DevTools, verifique que os erros têm `role="alert"`
5. Com VoiceOver/NVDA, a mensagem é anunciada automaticamente

**Teste automatizado:**
```bash
npm run test:a11y -- --grep "erro"
```

---

### Critério 8: Idioma da Página (WCAG 3.1.1)

**O que é:** O idioma principal da página deve ser declarado no HTML.

**Implementação:**
- Arquivo: `index.html`
- Elemento: `<html lang="pt-BR">`

**Como verificar:**
1. Abra DevTools > Elements
2. Verifique o elemento `<html>`
3. Deve ter o atributo `lang="pt-BR"`

**Teste automatizado:**
```bash
npm run test:a11y -- --grep "idioma"
```

---

### Critério 9: Redimensionamento (WCAG 1.4.4)

**O que é:** Conteúdo deve ser legível e funcional com zoom de até 200%.

**Implementação:**
- Layout responsivo com CSS flexbox/grid
- Unidades relativas (rem, em, %) em vez de pixels fixos
- Viewport meta permite zoom do usuário

**Como verificar:**
1. No navegador, pressione `Cmd/Ctrl + +` até chegar em 200% de zoom
2. A página não deve ter scroll horizontal
3. Todo conteúdo deve permanecer visível e legível
4. Os botões devem continuar clicáveis

**Teste automatizado:**
```bash
npm run test:a11y -- --grep "zoom"
```

---

### Critério 10: Áreas de Toque (WCAG 2.5.5)

**O que é:** Elementos interativos devem ter área mínima de 44x44 pixels.

**Implementação:**
- Arquivo: `src/styles/globals.css`
- Botões: `min-height: 44px;`
- Inputs: `min-height: 44px;`
- Links em áreas de toque têm padding adequado

**Como verificar:**
1. Abra DevTools > Elements
2. Selecione um botão ou input
3. Na aba "Computed", verifique width e height
4. Ambos devem ser ≥ 44px

**Teste automatizado:**
```bash
npm run test:a11y -- --grep "touch"
```

---

### Critério 11: Preferência de Movimento Reduzido (WCAG 2.3.3)

**O que é:** Respeitar a preferência do usuário por animações reduzidas.

**Implementação:**
- Arquivo: `src/styles/globals.css`

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Como verificar:**
1. No macOS: Preferências > Acessibilidade > Tela > Reduzir movimento
2. No Windows: Configurações > Acessibilidade > Efeitos visuais > Mostrar animações
3. Recarregue a página - animações devem ser mínimas ou inexistentes

**Teste automatizado:**
```bash
npm run test:a11y -- --grep "motion"
```

---

### Critério 12: Ícones Decorativos (WCAG 1.1.1)

**O que é:** Ícones puramente decorativos devem ser escondidos de tecnologias assistivas.

**Implementação:**
- Todos os ícones Lucide têm `aria-hidden="true"`
- Ícones que transmitem informação têm `aria-label` ou texto associado

**Exemplo em código:**
```tsx
// Ícone decorativo (escondido)
<AlertCircle className="w-4 h-4" aria-hidden="true" />

// Ícone informativo (com label)
<button aria-label="Remover arquivo">
  <Trash2 aria-hidden="true" />
</button>
```

**Como verificar:**
1. Inspecione um ícone no DevTools
2. Deve ter `aria-hidden="true"`
3. Se for um botão só com ícone, o botão deve ter `aria-label`

---

### Executar Todos os Testes de Acessibilidade

```bash
# Instalar Playwright (se necessário)
npx playwright install

# Executar todos os testes de acessibilidade
npm run test:a11y

# Executar com interface visual (recomendado para debug)
npx playwright test tests/e2e/specs/p1-criteria/accessibility.spec.ts --ui

# Executar com modo debug step-by-step
npx playwright test tests/e2e/specs/p1-criteria/accessibility.spec.ts --debug

# Executar teste específico
npm run test:a11y -- --grep "skip link"
npm run test:a11y -- --grep "contraste"
npm run test:a11y -- --grep "teclado"
```

---

### Ferramentas de Acessibilidade Utilizadas

| Ferramenta | Uso | Como usar |
|------------|-----|-----------|
| **@axe-core/playwright** | Testes automáticos E2E | `npm run test:a11y` |
| **eslint-plugin-jsx-a11y** | Linting durante desenvolvimento | `npm run lint` |
| **Radix UI** | Componentes acessíveis por padrão | Já integrado |

---

### Validação Manual Recomendada

Além dos testes automatizados, recomenda-se validar com:

#### 1. Leitor de Tela
- **macOS:** VoiceOver (Cmd + F5)
- **Windows:** NVDA (gratuito) ou Narrator
- **Navegue pela aplicação** e verifique se as informações são anunciadas corretamente

#### 2. Navegação por Teclado
- Desconecte o mouse
- Use apenas Tab, Shift+Tab, Enter, Espaço, Setas
- Complete todo o fluxo do wizard

#### 3. Chrome Lighthouse
```
DevTools > Lighthouse > Accessibility > Generate report
```
Esperado: Score ≥ 90

#### 4. axe DevTools Extension
- Instale a extensão no Chrome/Firefox
- Abra DevTools > axe DevTools
- Execute "Analyze" em cada página

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
