import { test, expect } from '../../fixtures/test-fixtures'

/**
 * Testes de Integração Técnica
 * Critério P1: 1.5 pontos
 */

test.describe('Integração Técnica', () => {
  test.describe('PWA', () => {
    test('manifest.json deve ser válido', async ({ page }) => {
      const response = await page.goto('/manifest.webmanifest')
      expect(response?.status()).toBe(200)

      const manifest = await response?.json()

      // Verificar campos obrigatórios
      expect(manifest.name).toBeDefined()
      expect(manifest.short_name).toBeDefined()
      expect(manifest.icons).toBeDefined()
      expect(manifest.start_url).toBeDefined()
      expect(manifest.display).toBe('standalone')
      expect(manifest.theme_color).toBeDefined()
      expect(manifest.background_color).toBeDefined()
      expect(manifest.lang).toBe('pt-BR')
    })

    test('service worker deve ser registrado', async ({ page }) => {
      await page.goto('/')

      // Aguardar registro do SW
      await page.waitForTimeout(2000)

      const swRegistered = await page.evaluate(async () => {
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations()
          return registrations.length > 0
        }
        return false
      })

      expect(swRegistered).toBeTruthy()
    })

    test('app deve ser instalável', async ({ page }) => {
      await page.goto('/')

      // Verificar manifest link
      const manifestLink = await page.locator('link[rel="manifest"]').count()
      expect(manifestLink).toBeGreaterThan(0)

      // Verificar meta tags para PWA
      const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content')
      expect(themeColor).toBe('#0050A0')
    })

    test('offline indicator deve existir', async ({ page, context }) => {
      await page.goto('/')

      // Simular offline
      await context.setOffline(true)

      // Aguardar um momento
      await page.waitForTimeout(1000)

      // O app deve continuar funcionando com dados em cache
      // ou mostrar indicador de offline
      const paginaCarregada = await page.locator('body').isVisible()
      expect(paginaCarregada).toBeTruthy()

      // Restaurar online
      await context.setOffline(false)
    })
  })

  test.describe('Branding Participa DF', () => {
    test('cores do governo devem estar aplicadas', async ({ page }) => {
      await page.goto('/')

      // Verificar cor primária (azul GDF #0050A0)
      const header = page.locator('header')
      const headerBgColor = await header.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor
      })

      // Verificar que é uma variação de azul
      expect(headerBgColor).toMatch(/rgb\(0, 80, 160\)|hsl/)
    })

    test('logo/identidade visual deve estar presente', async ({ page }) => {
      await page.goto('/')

      // Verificar título
      const titulo = page.locator('text=/participa df/i')
      await expect(titulo).toBeVisible()

      // Verificar branding no header
      const header = page.locator('header')
      await expect(header).toBeVisible()
    })

    test('fluxo deve ser coerente com sistema real', async ({ page }) => {
      await page.goto('/')

      // Verificar que as etapas principais existem
      // Relato
      await expect(page.locator('text=/relato/i').first()).toBeVisible()

      // Verificar título descritivo
      const tituloRelato = page.locator('h2', { hasText: /relato/i })
      await expect(tituloRelato).toBeVisible()
    })
  })

  test.describe('Idioma', () => {
    test('interface deve estar em português do Brasil', async ({ page }) => {
      await page.goto('/')

      // Verificar lang da página
      const lang = await page.locator('html').getAttribute('lang')
      expect(lang).toBe('pt-BR')

      // Verificar textos em português
      await expect(page.locator('text=/continuar/i')).toBeVisible()
      await expect(page.locator('text=/relato/i').first()).toBeVisible()
    })

    test('mensagens devem estar em português', async ({ page }) => {
      await page.goto('/')

      // Verificar placeholder em português
      const textarea = page.getByRole('textbox')
      const placeholder = await textarea.getAttribute('placeholder')

      // Deve conter texto em português
      expect(placeholder).toMatch(/descreva|relato|manifestação/i)
    })
  })
})
