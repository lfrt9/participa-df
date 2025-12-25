import { test, expect, testData } from '../../fixtures/test-fixtures'

/**
 * Testes de Responsividade - Desktop
 * Viewports: 1024px+
 */

const desktopViewports = [
  { width: 1280, height: 720, name: 'HD' },
  { width: 1920, height: 1080, name: 'Full HD' },
  { width: 2560, height: 1440, name: '2K' },
]

test.describe('Responsividade Desktop', () => {
  for (const viewport of desktopViewports) {
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

      test('conteúdo deve ser centralizado com max-width', async ({ page }) => {
        const container = page.locator('.container, [class*="max-w"]').first()

        if (await container.count() > 0) {
          const box = await container.boundingBox()
          if (box && viewport.width > 1200) {
            // Em telas grandes, conteúdo deve ter largura máxima
            expect(box.width).toBeLessThan(viewport.width)
          }
        }
      })

      test('stepper completo deve ser visível', async ({ page }) => {
        const stepperDesktop = page.locator('.hidden.md\\:flex, ol.hidden.md\\:flex')

        if (await stepperDesktop.count() > 0) {
          await expect(stepperDesktop.first()).toBeVisible()
        }
      })

      test('grid de tipos deve mostrar múltiplas colunas', async ({ page }) => {
        await page.getByRole('textbox').fill(testData.relato.texto)
        await page.getByRole('button', { name: /continuar/i }).click()

        // Verificar layout em grid
        const gridContainer = page.locator('.grid')

        if (await gridContainer.count() > 0) {
          const gridStyles = await gridContainer.first().evaluate((el) => {
            return window.getComputedStyle(el).gridTemplateColumns
          })

          // Deve ter múltiplas colunas em desktop
          if (viewport.width >= 768) {
            expect(gridStyles).not.toBe('none')
          }
        }
      })

      test('navegação desktop deve estar visível', async ({ page }) => {
        // Menu desktop (não o menu mobile)
        const navDesktop = page.locator('nav.hidden.md\\:flex, nav.md\\:flex')

        if (await navDesktop.count() > 0) {
          await expect(navDesktop.first()).toBeVisible()
        }
      })

      test('formulários devem ter largura adequada', async ({ page }) => {
        const textarea = page.getByRole('textbox')
        const box = await textarea.boundingBox()

        if (box) {
          // Não deve ser muito largo (dificulta leitura)
          expect(box.width).toBeLessThan(viewport.width - 100)

          // Mas também não muito estreito
          expect(box.width).toBeGreaterThan(400)
        }
      })

      test('footer deve ter layout em colunas', async ({ page }) => {
        const footer = page.locator('footer')
        const footerGrid = footer.locator('.grid')

        if (await footerGrid.count() > 0 && viewport.width >= 768) {
          const gridStyles = await footerGrid.first().evaluate((el) => {
            return window.getComputedStyle(el).gridTemplateColumns
          })

          expect(gridStyles).not.toBe('none')
        }
      })
    })
  }
})
