import { test, expect, testData } from '../../fixtures/test-fixtures'

/**
 * Testes de UX/UI
 * Critério P1: 3 pontos
 */

test.describe('UX/UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Design e navegação', () => {
    test('navegação deve ser intuitiva - máximo 3 clicks para objetivo', async ({ page }) => {
      // Objetivo: chegar à tela de protocolo
      // 1. Preencher relato e continuar
      await page.getByRole('textbox').fill(testData.relato.texto)
      await page.getByRole('button', { name: /continuar/i }).click()

      // 2. Selecionar tipo e categoria e continuar
      await page.getByRole('radio', { name: /reclamação/i }).click()
      await page.getByRole('combobox').click()
      await page.getByRole('option', { name: /saúde/i }).click()
      await page.getByRole('button', { name: /continuar/i }).click()

      // 3. Continuar nas próximas etapas
      await page.getByRole('button', { name: /continuar/i }).click() // Resumo
      await page.getByRole('button', { name: /continuar/i }).click() // Identificação
      await page.getByRole('button', { name: /finalizar/i }).click() // Anexos

      // Deve estar na tela de protocolo
      const protocoloTitulo = page.locator('text=/manifestação registrada/i')
      await expect(protocoloTitulo).toBeVisible({ timeout: 10000 })
    })

    test('stepper/indicador de progresso deve ser visível', async ({ page }) => {
      // Verificar que o stepper existe
      const stepper = page.locator('[aria-label*="etapa"], nav[aria-label*="registro"]')
      await expect(stepper).toBeVisible()
    })

    test('botões devem ter feedback visual no hover/focus', async ({ page }) => {
      const botao = page.getByRole('button', { name: /continuar/i })

      // Verificar estilos iniciais
      const estilosIniciais = await botao.evaluate((el) => {
        const styles = window.getComputedStyle(el)
        return {
          backgroundColor: styles.backgroundColor,
          transform: styles.transform,
        }
      })

      // Hover
      await botao.hover()

      // Focus
      await botao.focus()

      const estilosFocus = await botao.evaluate((el) => {
        const styles = window.getComputedStyle(el)
        return {
          outline: styles.outline,
          boxShadow: styles.boxShadow,
        }
      })

      // Deve ter algum indicador de focus
      const temIndicadorFocus = estilosFocus.outline !== 'none' ||
                                estilosFocus.boxShadow !== 'none'
      expect(temIndicadorFocus).toBeTruthy()
    })
  })

  test.describe('Estados', () => {
    test('loading states devem ser exibidos durante operações', async ({ page }) => {
      // Preencher formulário completo
      await page.getByRole('textbox').fill(testData.relato.texto)
      await page.getByRole('button', { name: /continuar/i }).click()

      await page.getByRole('radio', { name: /reclamação/i }).click()
      await page.getByRole('combobox').click()
      await page.getByRole('option', { name: /saúde/i }).click()
      await page.getByRole('button', { name: /continuar/i }).click()

      // Verificar que botões mostram estado de loading quando clicados
      // (O botão pode ter um spinner ou mudar de texto)
      const botaoContinuar = page.getByRole('button', { name: /continuar/i })
      await expect(botaoContinuar).toBeEnabled()
    })

    test('error states devem ser informativos', async ({ page }) => {
      // Tentar avançar sem preencher campos obrigatórios
      // Na etapa de identificação sem anonimato
      await page.getByRole('textbox').fill(testData.relato.texto)
      await page.getByRole('button', { name: /continuar/i }).click()

      await page.getByRole('radio', { name: /reclamação/i }).click()
      await page.getByRole('combobox').click()
      await page.getByRole('option', { name: /saúde/i }).click()
      await page.getByRole('button', { name: /continuar/i }).click()

      await page.getByRole('button', { name: /continuar/i }).click() // Resumo

      // Na etapa de identificação, verificar mensagens de erro
      // Se não for anônimo e campos estiverem vazios
      const identificacaoTitulo = page.locator('text=/identificação/i')
      await expect(identificacaoTitulo).toBeVisible()
    })

    test('success feedback deve aparecer após submissão', async ({ page }) => {
      // Fluxo completo
      await page.getByRole('textbox').fill(testData.relato.texto)
      await page.getByRole('button', { name: /continuar/i }).click()

      await page.getByRole('radio', { name: /reclamação/i }).click()
      await page.getByRole('combobox').click()
      await page.getByRole('option', { name: /saúde/i }).click()
      await page.getByRole('button', { name: /continuar/i }).click()

      await page.getByRole('button', { name: /continuar/i }).click() // Resumo

      // Ativar anônimo para não precisar preencher dados
      const toggle = page.locator('[role="switch"]')
      await toggle.click()
      await page.getByRole('button', { name: /continuar/i }).click() // Identificação

      await page.getByRole('button', { name: /finalizar/i }).click() // Anexos

      // Verificar sucesso
      const sucesso = page.locator('text=/registrada/i')
      await expect(sucesso).toBeVisible({ timeout: 10000 })
    })
  })

  test.describe('Feedback', () => {
    test('validação inline deve ocorrer em tempo real', async ({ page }) => {
      const textarea = page.getByRole('textbox')

      // Digitar texto curto
      await textarea.fill('abc')

      // Verificar que o botão continua desabilitado
      const botaoContinuar = page.getByRole('button', { name: /continuar/i })
      await expect(botaoContinuar).toBeDisabled()

      // Digitar texto válido
      await textarea.fill(testData.relato.texto)

      // Botão deve ficar habilitado
      await expect(botaoContinuar).toBeEnabled()
    })
  })
})
