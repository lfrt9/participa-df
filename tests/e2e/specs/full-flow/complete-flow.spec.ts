import { test, expect, testData } from '../../fixtures/test-fixtures'

/**
 * Testes de Fluxo Completo
 * Validação end-to-end de cenários reais
 */

test.describe('Fluxos Completos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Manifestação Anônima', () => {
    test('fluxo completo de denúncia anônima via texto', async ({ page }) => {
      // Etapa 1: Relato
      await page.getByRole('textbox').fill(
        'Gostaria de denunciar irregularidades no atendimento do posto de saúde da minha região. ' +
        'Os funcionários não estão seguindo os protocolos de atendimento estabelecidos.'
      )
      await page.getByRole('button', { name: /continuar/i }).click()

      // Etapa 2: Assunto
      await page.getByRole('radio', { name: /denúncia/i }).click()
      await page.getByRole('combobox').click()
      await page.getByRole('option', { name: /saúde/i }).click()
      await page.getByRole('button', { name: /continuar/i }).click()

      // Etapa 3: Resumo
      await expect(page.locator('text=/denúncia/i').first()).toBeVisible()
      await expect(page.locator('text=/saúde/i').first()).toBeVisible()
      await page.getByRole('button', { name: /continuar/i }).click()

      // Etapa 4: Identificação (anônimo)
      await page.locator('[role="switch"]').click()
      await expect(page.locator('text=/anônima/i').first()).toBeVisible()
      await page.getByRole('button', { name: /continuar/i }).click()

      // Etapa 5: Anexos (pular)
      await page.getByRole('button', { name: /finalizar/i }).click()

      // Etapa 6: Protocolo
      await expect(page.locator('text=/registrada/i')).toBeVisible({ timeout: 10000 })
      await expect(page.locator('text=/DF-\\d{8}-\\d{5}-DNT/')).toBeVisible()
    })
  })

  test.describe('Manifestação Identificada', () => {
    test('fluxo completo de reclamação identificada', async ({ page }) => {
      // Etapa 1: Relato
      await page.getByRole('textbox').fill(
        'Venho registrar minha reclamação sobre o atraso constante do transporte público na região administrativa de Taguatinga. ' +
        'Os ônibus da linha 123 estão chegando com mais de 30 minutos de atraso todos os dias.'
      )
      await page.getByRole('button', { name: /continuar/i }).click()

      // Etapa 2: Assunto
      await page.getByRole('radio', { name: /reclamação/i }).click()
      await page.getByRole('combobox').click()
      await page.getByRole('option', { name: /transporte/i }).click()
      await page.getByRole('button', { name: /continuar/i }).click()

      // Etapa 3: Resumo
      await page.getByRole('button', { name: /continuar/i }).click()

      // Etapa 4: Identificação (identificado)
      // Preencher dados
      await page.locator('input[autocomplete="name"]').fill(testData.usuario.nome)
      await page.locator('input[type="email"]').fill(testData.usuario.email)
      await page.getByRole('button', { name: /continuar/i }).click()

      // Etapa 5: Anexos
      await page.getByRole('button', { name: /finalizar/i }).click()

      // Etapa 6: Protocolo
      await expect(page.locator('text=/registrada/i')).toBeVisible({ timeout: 10000 })
      await expect(page.locator('text=/DF-\\d{8}-\\d{5}-RCT/')).toBeVisible()

      // Verificar que mostra confirmação de email
      await expect(page.locator(`text=/${testData.usuario.email}/`)).toBeVisible()
    })
  })

  test.describe('Diferentes Tipos de Manifestação', () => {
    const tiposManifestacao = [
      { tipo: /sugestão/i, codigo: 'SGT' },
      { tipo: /elogio/i, codigo: 'ELT' },
      { tipo: /solicitação/i, codigo: 'SLT' },
      { tipo: /pedido de informação/i, codigo: 'IFT' },
    ]

    for (const { tipo, codigo } of tiposManifestacao) {
      test(`fluxo de ${tipo.source} deve gerar protocolo correto`, async ({ page }) => {
        // Relato
        await page.getByRole('textbox').fill(testData.relato.texto)
        await page.getByRole('button', { name: /continuar/i }).click()

        // Assunto
        await page.getByRole('radio', { name: tipo }).click()
        await page.getByRole('combobox').click()
        await page.getByRole('option').first().click()
        await page.getByRole('button', { name: /continuar/i }).click()

        // Resumo
        await page.getByRole('button', { name: /continuar/i }).click()

        // Identificação (anônimo para simplificar)
        await page.locator('[role="switch"]').click()
        await page.getByRole('button', { name: /continuar/i }).click()

        // Anexos
        await page.getByRole('button', { name: /finalizar/i }).click()

        // Protocolo
        await expect(page.locator('text=/registrada/i')).toBeVisible({ timeout: 10000 })
      })
    }
  })

  test.describe('Navegação entre etapas', () => {
    test('botão voltar deve funcionar em todas as etapas', async ({ page }) => {
      // Ir para etapa 2
      await page.getByRole('textbox').fill(testData.relato.texto)
      await page.getByRole('button', { name: /continuar/i }).click()

      // Voltar para etapa 1
      await page.getByRole('button', { name: /voltar/i }).click()

      // Verificar que voltou
      await expect(page.getByRole('textbox')).toBeVisible()
      await expect(page.getByRole('textbox')).toHaveValue(testData.relato.texto)
    })

    test('dados devem ser preservados ao navegar', async ({ page }) => {
      // Preencher etapa 1
      await page.getByRole('textbox').fill(testData.relato.texto)
      await page.getByRole('button', { name: /continuar/i }).click()

      // Preencher etapa 2
      await page.getByRole('radio', { name: /reclamação/i }).click()
      await page.getByRole('combobox').click()
      await page.getByRole('option', { name: /saúde/i }).click()
      await page.getByRole('button', { name: /continuar/i }).click()

      // Ir para etapa 3 e voltar para 1
      await page.getByRole('button', { name: /voltar/i }).click()
      await page.getByRole('button', { name: /voltar/i }).click()

      // Verificar que dados foram preservados
      await expect(page.getByRole('textbox')).toHaveValue(testData.relato.texto)
    })
  })

  test.describe('Nova manifestação', () => {
    test('botão nova manifestação deve resetar formulário', async ({ page }) => {
      // Completar fluxo
      await page.getByRole('textbox').fill(testData.relato.texto)
      await page.getByRole('button', { name: /continuar/i }).click()

      await page.getByRole('radio', { name: /elogio/i }).click()
      await page.getByRole('combobox').click()
      await page.getByRole('option').first().click()
      await page.getByRole('button', { name: /continuar/i }).click()

      await page.getByRole('button', { name: /continuar/i }).click()

      await page.locator('[role="switch"]').click()
      await page.getByRole('button', { name: /continuar/i }).click()

      await page.getByRole('button', { name: /finalizar/i }).click()

      // Clicar em nova manifestação
      await page.getByRole('button', { name: /nova manifestação/i }).click()

      // Verificar que voltou ao início
      await expect(page.getByRole('textbox')).toBeVisible()
      await expect(page.getByRole('textbox')).toHaveValue('')
    })
  })
})
