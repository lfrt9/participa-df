# Guia de Instalação - Participa DF Ouvidoria

Este documento contém instruções detalhadas para instalar e executar o projeto.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

| Software | Versão Mínima | Verificar Instalação |
|----------|---------------|---------------------|
| Node.js | 18.0.0+ | `node --version` |
| npm | 9.0.0+ | `npm --version` |
| Git | 2.0.0+ | `git --version` |

### Instalando Node.js

#### Windows
1. Baixe o instalador em [nodejs.org](https://nodejs.org/)
2. Execute o instalador e siga as instruções
3. Reinicie o terminal

#### macOS
```bash
# Usando Homebrew
brew install node

# Ou baixe em nodejs.org
```

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Instalação

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd projeto2
```

### 2. Instalar Dependências

```bash
npm install
```

Este comando instalará todas as dependências listadas no `package.json`, incluindo:
- React 18 e React DOM
- Radix UI (componentes acessíveis)
- Tailwind CSS
- Zustand (gerenciamento de estado)
- Playwright (testes E2E)

### 3. Verificar Instalação

```bash
npm run build
```

Se o build completar sem erros, a instalação foi bem sucedida.

## Executando o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

O servidor iniciará em `http://localhost:5173`. A página recarrega automaticamente quando você modifica os arquivos.

### Build de Produção

```bash
npm run build
npm run preview
```

O build de produção será gerado em `dist/`. O comando `preview` serve os arquivos de produção localmente.

## Configuração de Testes

### Instalar Browsers do Playwright

```bash
# Instalar apenas Chromium (mais rápido)
npx playwright install chromium

# Ou instalar todos os browsers
npx playwright install
```

### Executar Testes

```bash
# Todos os testes
npm run test:e2e

# Apenas acessibilidade
npm run test:a11y

# Apenas responsividade
npm run test:responsive

# Com interface visual
npm run test:e2e:ui
```

## Estrutura de Diretórios

```
projeto2/
├── node_modules/          # Dependências (ignorado pelo git)
├── dist/                  # Build de produção (ignorado)
├── public/                # Assets públicos
│   ├── favicon.svg
│   └── icons/             # Ícones do PWA
├── src/                   # Código fonte
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles/
│   ├── types/
│   ├── hooks/
│   ├── services/
│   ├── components/
│   └── features/
├── tests/                 # Testes E2E
│   └── e2e/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── playwright.config.ts
```

## Variáveis de Ambiente

O projeto não requer variáveis de ambiente para funcionar. Porém, você pode criar um arquivo `.env` para configurações adicionais:

```env
# Porta do servidor de desenvolvimento
VITE_PORT=5173

# URL da API (se houver backend)
VITE_API_URL=http://localhost:3000
```

## Troubleshooting

### Erro: "command not found: npm"

**Causa**: Node.js não está instalado ou não está no PATH.

**Solução**:
1. Instale o Node.js seguindo as instruções acima
2. Reinicie o terminal
3. Verifique com `node --version`

### Erro: "EACCES: permission denied"

**Causa**: Problemas de permissão no npm.

**Solução** (macOS/Linux):
```bash
sudo chown -R $(whoami) ~/.npm
```

### Erro: "Module not found"

**Causa**: Dependências não instaladas ou corrompidas.

**Solução**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro no Build: "TypeScript errors"

**Causa**: Erros de tipagem no código.

**Solução**:
```bash
# Verificar erros
npx tsc --noEmit

# Corrigir erros apontados
```

### Porta 5173 em Uso

**Causa**: Outro processo usando a porta.

**Solução**:
```bash
# Encontrar processo
lsof -i :5173

# Matar processo (substitua PID)
kill -9 <PID>

# Ou usar outra porta
npm run dev -- --port 3000
```

### Playwright: "Browser not installed"

**Causa**: Browsers do Playwright não instalados.

**Solução**:
```bash
npx playwright install
```

### Testes Falhando no CI

**Causa**: Ambiente de CI diferente do local.

**Solução**:
```bash
# Instalar dependências do sistema (Ubuntu)
npx playwright install-deps
```

## Requisitos de Sistema

### Mínimos
- CPU: 2 cores
- RAM: 4GB
- Disco: 1GB livre

### Recomendados
- CPU: 4+ cores
- RAM: 8GB
- Disco: 2GB livre

## Suporte a Navegadores

O projeto suporta os seguintes navegadores:

| Navegador | Versão Mínima |
|-----------|---------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Chrome Mobile | 90+ |
| Safari iOS | 14+ |

## Atualizando Dependências

Para manter o projeto atualizado:

```bash
# Verificar atualizações disponíveis
npm outdated

# Atualizar dependências (minor/patch)
npm update

# Atualizar para versões major (cuidado!)
npx npm-check-updates -u
npm install
```

## Contato

Em caso de problemas não resolvidos:

- Abra uma issue no repositório
- Entre em contato pelo email do projeto

---

**Versão**: 1.0.0
**Última atualização**: Janeiro 2026
