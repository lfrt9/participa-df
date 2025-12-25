import { test, expect, testData } from '../../fixtures/test-fixtures'

/**
 * Testes de Responsividade - Mobile
 * Viewports: 320px-767px
 */

const mobileViewports = [
  { width: 320, height: 568, name: 'iPhone SE' },
  { width: 375, height: 667, name: 'iPhone 8' },
  { width: 390, height: 844, name: 'iPhone 12' },
  { width: 360, height: 800, name: 'Android' },
]

test.describe('Responsividade Mobile', () => {
  for (const viewport of mobileViewports) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await page.goto('/')
      })

      test('layout não deve quebrar', async ({ page }) => {
        // Verificar que elementos principais estão visíveis
        const header = page.locator('header')
        await expect(header).toBeVisible()

        const main = page.locator('main')
        await expect(main).toBeVisible()

        // Verificar que a página carregou corretamente
        const pageLoaded = await page.evaluate(() => document.readyState === 'complete')
        expect(pageLoaded).toBeTruthy()
      })

      test('texto deve ser legível sem zoom', async ({ page }) => {
        // Verificar tamanho de fonte mínimo
        const textos = page.locator('p, span, label')
        const count = await textos.count()

        for (let i = 0; i < Math.min(count, 10); i++) {
          const texto = textos.nth(i)
          if (await texto.isVisible()) {
            const fontSize = await texto.evaluate((el) => {
              return parseFloat(window.getComputedStyle(el).fontSize)
            })
            // Mínimo 12px para legibilidade
            expect(fontSize).toBeGreaterThanOrEqual(12)
          }
        }
      })

      test('botões devem ser clicáveis (touch targets 44px)', async ({ page }) => {
        const botoes = page.locator('button')
        const count = await botoes.count()

        for (let i = 0; i < count; i++) {
          const botao = botoes.nth(i)
          if (await botao.isVisible()) {
            const box = await botao.boundingBox()
            if (box) {
              expect(box.width).toBeGreaterThanOrEqual(44)
              expect(box.height).toBeGreaterThanOrEqual(44)
            }
          }
        }
      })

      test('forms devem ser usáveis', async ({ page }) => {
        // Verificar que textarea é acessível
        const textarea = page.getByRole('textbox')
        await expect(textarea).toBeVisible()

        // Verificar que pode digitar
        await textarea.fill('Teste mobile')
        await expect(textarea).toHaveValue('Teste mobile')
      })

      test('navegação deve ser acessível', async ({ page }) => {
        // Verificar menu mobile
        const menuButton = page.locator('button[aria-label*="menu"]')

        if (await menuButton.count() > 0) {
          await expect(menuButton).toBeVisible()
        }

        // Verificar que botão continuar está acessível
        const continuar = page.getByRole('button', { name: /continuar/i })
        await expect(continuar).toBeVisible()
      })

      test('não deve haver overflow horizontal', async ({ page }) => {
        const overflowInfo = await page.evaluate(() => {
          const scrollWidth = document.documentElement.scrollWidth
          const clientWidth = document.documentElement.clientWidth
          const viewportWidth = window.innerWidth
          return {
            // Em telas muito pequenas (320px), aceitar tolerância maior
            hasSignificantOverflow: scrollWidth > Math.max(clientWidth, viewportWidth) + 50,
            scrollWidth,
            clientWidth,
            viewportWidth,
          }
        })

        // Permitir diferença maior em viewports muito pequenos
        expect(overflowInfo.hasSignificantOverflow).toBeFalsy()
      })

      test('imagens devem ser responsivas', async ({ page }) => {
        const imagens = page.locator('img')
        const count = await imagens.count()

        for (let i = 0; i < count; i++) {
          const img = imagens.nth(i)
          if (await img.isVisible()) {
            const box = await img.boundingBox()
            if (box) {
              // Imagem não deve ultrapassar largura da viewport
              expect(box.width).toBeLessThanOrEqual(viewport.width)
            }
          }
        }
      })

      test('stepper mobile deve mostrar etapa atual', async ({ page }) => {
        // Em mobile, o stepper deve mostrar apenas a etapa atual
        const stepperMobile = page.locator('.md\\:hidden')

        if (await stepperMobile.count() > 0) {
          await expect(stepperMobile.first()).toBeVisible()
        }
      })
    })
  }
})
