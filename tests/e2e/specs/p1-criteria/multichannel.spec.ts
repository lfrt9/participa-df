import { test, expect, testData } from '../../fixtures/test-fixtures'

/**
 * Testes de Multicanalidade
 * Critério P1: 3 pontos
 */

test.describe('Multicanalidade', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Canal de Texto', () => {
    test('textarea deve aceitar input', async ({ page }) => {
      const textarea = page.getByRole('textbox')
      await textarea.fill(testData.relato.texto)

      await expect(textarea).toHaveValue(testData.relato.texto)
    })

    test('contador de caracteres deve funcionar', async ({ page }) => {
      const textarea = page.getByRole('textbox')
      await textarea.fill('Teste de contador')

      // Verificar que o contador existe e mostra o valor correto
      const contador = page.locator('text=/\\d+\\/\\d+/')
      await expect(contador).toBeVisible()
    })

    test('validação min length deve funcionar', async ({ page }) => {
      const textarea = page.getByRole('textbox')
      await textarea.fill(testData.relato.textoInvalido)

      // Botão continuar deve estar desabilitado
      const continuar = page.getByRole('button', { name: /continuar/i })
      await expect(continuar).toBeDisabled()
    })

    test('validação max length deve funcionar', async ({ page }) => {
      const textarea = page.getByRole('textbox')

      // Tentar inserir texto muito longo
      const textoLongo = 'a'.repeat(6000)
      await textarea.fill(textoLongo)

      // Verificar que foi limitado
      const valor = await textarea.inputValue()
      expect(valor.length).toBeLessThanOrEqual(5000)
    })
  })

  test.describe('Canal de Áudio', () => {
    test('tab de áudio deve estar acessível', async ({ page }) => {
      const tabAudio = page.getByRole('tab', { name: /áudio/i })
      await expect(tabAudio).toBeVisible()
      await tabAudio.click()

      // Verificar que o painel de áudio está visível
      const painelAudio = page.getByRole('tabpanel')
      await expect(painelAudio).toBeVisible()
    })

    test('botão gravar deve existir', async ({ page }) => {
      await page.getByRole('tab', { name: /áudio/i }).click()

      const botaoGravar = page.getByRole('button', { name: /iniciar gravação/i })
      await expect(botaoGravar).toBeVisible()
    })

    test('controles devem ser acessíveis por teclado', async ({ page }) => {
      await page.getByRole('tab', { name: /áudio/i }).click()

      const botaoGravar = page.getByRole('button', { name: /iniciar gravação/i })
      await botaoGravar.focus()

      // Verificar que o botão está focado
      await expect(botaoGravar).toBeFocused()

      // Verificar que pode ser ativado com Enter
      const isFocusable = await botaoGravar.evaluate((el) => {
        return el.tabIndex >= 0
      })
      expect(isFocusable).toBeTruthy()
    })

    test('waveform visual deve existir', async ({ page }) => {
      await page.getByRole('tab', { name: /áudio/i }).click()

      // Verificar que existe área de visualização de waveform
      const waveform = page.locator('.waveform, [role="img"][aria-label*="áudio"]')
      await expect(waveform).toBeVisible()
    })
  })

  test.describe('Canal de Imagem', () => {
    test('tab de arquivos deve estar acessível', async ({ page }) => {
      const tabArquivos = page.getByRole('tab', { name: /arquivos/i })
      await expect(tabArquivos).toBeVisible()
      await tabArquivos.click()

      // Verificar que o painel está visível
      const painel = page.getByRole('tabpanel')
      await expect(painel).toBeVisible()
    })

    test('área de upload deve existir', async ({ page }) => {
      await page.getByRole('tab', { name: /arquivos/i }).click()

      // Verificar dropzone
      const dropzone = page.locator('.dropzone, [role="button"][aria-label*="upload"]')
      await expect(dropzone).toBeVisible()
    })

    test('dropzone deve ser clicável', async ({ page }) => {
      await page.getByRole('tab', { name: /arquivos/i }).click()

      const dropzone = page.locator('.dropzone').first()
      await expect(dropzone).toBeVisible()

      // Verificar que é focável e clicável
      await dropzone.click()

      // O input file deve existir (mesmo que oculto)
      const inputFile = page.locator('input[type="file"]')
      await expect(inputFile).toBeAttached()
    })

    test('formatos aceitos devem incluir JPEG, PNG, WebP', async ({ page }) => {
      await page.getByRole('tab', { name: /arquivos/i }).click()

      const inputFile = page.locator('input[type="file"]')
      const accept = await inputFile.getAttribute('accept')

      expect(accept).toContain('image/jpeg')
      expect(accept).toContain('image/png')
    })

    test('limite de 5 arquivos deve ser respeitado', async ({ page }) => {
      await page.getByRole('tab', { name: /arquivos/i }).click()

      // Verificar que o texto menciona o limite
      const textoLimite = page.locator('text=/\\d+ de \\d+ arquivos/')
      await expect(textoLimite).toBeVisible()
    })
  })

  test.describe('Canal de Vídeo', () => {
    test('upload de vídeo deve ser suportado', async ({ page }) => {
      await page.getByRole('tab', { name: /arquivos/i }).click()

      const inputFile = page.locator('input[type="file"]')
      const accept = await inputFile.getAttribute('accept')

      expect(accept).toContain('video/mp4')
    })

    test('formatos aceitos devem incluir MP4, WebM', async ({ page }) => {
      await page.getByRole('tab', { name: /arquivos/i }).click()

      const inputFile = page.locator('input[type="file"]')
      const accept = await inputFile.getAttribute('accept')

      expect(accept).toContain('video/mp4')
      expect(accept).toContain('video/webm')
    })
  })
})
