import { test, expect, testData } from '../../fixtures/test-fixtures'

/**
 * Testes de Responsividade - Tablet
 * Viewports: 768px-1023px
 */

const tabletViewports = [
  { width: 768, height: 1024, name: 'iPad Portrait' },
  { width: 820, height: 1180, name: 'iPad Air' },
  { width: 1024, height: 768, name: 'iPad Landscape' },
]

test.describe('Responsividade Tablet', () => {
  for (const viewport of tabletViewports) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await page.goto('/')
      })

      test('layout não deve quebrar', async ({ page }) => {
        const header = page.locator('header')
        await expect(header).toBeVisible()

        const main = page.locator('main')
        await expect(main).toBeVisible()

        const footer = page.locator('footer')
        await expect(footer).toBeVisible()
      })

      test('stepper completo deve ser visível em tablet landscape', async ({ page }) => {
        if (viewport.width >= 768) {
          const stepperDesktop = page.locator('.hidden.md\\:flex, ol.hidden.md\\:flex')

          if (await stepperDesktop.count() > 0) {
            await expect(stepperDesktop.first()).toBeVisible()
          }
        }
      })

      test('grid de tipos de manifestação deve adaptar', async ({ page }) => {
        await page.getByRole('textbox').fill(testData.relato.texto)
        await page.getByRole('button', { name: /continuar/i }).click()

        // Verificar que os cards de tipo estão visíveis
        const tipoCards = page.locator('[role="radio"]')
        const count = await tipoCards.count()

        expect(count).toBeGreaterThan(0)

        // Verificar que estão em grid
        for (let i = 0; i < count; i++) {
          await expect(tipoCards.nth(i)).toBeVisible()
        }
      })

      test('formulários devem usar espaço adequadamente', async ({ page }) => {
        // Verificar que textarea não é muito estreito
        const textarea = page.getByRole('textbox')
        const box = await textarea.boundingBox()

        if (box) {
          // Em tablet, textarea deve ter pelo menos 300px de largura
          expect(box.width).toBeGreaterThanOrEqual(300)
        }
      })

      test('touch targets devem ser adequados', async ({ page }) => {
        // Verificar apenas botões principais que devem ter 44px
        const botoes = page.locator('button')
        const count = await botoes.count()

        for (let i = 0; i < count; i++) {
          const botao = botoes.nth(i)
          if (await botao.isVisible()) {
            const box = await botao.boundingBox()
            if (box) {
              // Verificar que botões têm altura mínima adequada
              expect(box.height).toBeGreaterThanOrEqual(40)
            }
          }
        }
      })

      test('não deve haver overflow horizontal', async ({ page }) => {
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth
        })

        expect(hasHorizontalScroll).toBeFalsy()
      })
    })
  }
})
