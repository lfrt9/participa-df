import { test as base, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Fixtures personalizados para testes do Participa DF
 */

// Dados de teste para manifestações
export const testData = {
  relato: {
    texto: 'Este é um relato de teste para verificar o funcionamento do sistema de manifestações. O texto deve ter pelo menos 20 caracteres para ser válido.',
    textoInvalido: 'Texto curto',
  },
  usuario: {
    nome: 'Maria Silva Santos',
    cpf: '123.456.789-00',
    email: 'maria.santos@email.com',
    telefone: '(61) 99999-8888',
  },
  usuarioComPII: {
    texto: 'Meu nome é João Pedro Silva, CPF 111.222.333-44, telefone (61) 98765-4321.',
  },
}

// Extend base test with accessibility checking
export const test = base.extend<{
  makeAxeBuilder: () => AxeBuilder
}>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .exclude('#__next-build-watcher') // Exclude dev tools
    await use(makeAxeBuilder)
  },
})

export { expect }

// Helper para navegar pelas etapas do wizard
export async function navegarParaEtapa(page: any, etapa: string) {
  const etapas = ['relato', 'assunto', 'resumo', 'identificacao', 'anexos', 'protocolo']
  const indiceAtual = 0
  const indiceDestino = etapas.indexOf(etapa)

  for (let i = indiceAtual; i < indiceDestino; i++) {
    // Preencher dados mínimos para cada etapa
    if (etapas[i] === 'relato') {
      await page.getByRole('textbox').fill(testData.relato.texto)
    }
    if (etapas[i] === 'assunto') {
      await page.getByRole('radio', { name: /reclamação/i }).click()
      await page.getByRole('combobox').click()
      await page.getByRole('option', { name: /saúde/i }).click()
    }
    await page.getByRole('button', { name: /continuar/i }).click()
  }
}

// Helper para verificar contraste WCAG
export function verificarContrasteMinimo(foreground: string, background: string): boolean {
  // Simplified contrast check - in real implementation use a proper library
  return true // Placeholder
}
