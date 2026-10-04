import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('terms have a visible homepage link and a standalone page without JavaScript', async ({
  page,
  browser,
}, testInfo) => {
  await page.goto('/')
  await expect(page.locator('.hero-legal-link')).toBeVisible()
  await expect(page.locator('.hero-legal-link')).toHaveAttribute('href', '/terms/en/')
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: testInfo.project.use.viewport,
  })
  const legal = await context.newPage()
  await legal.goto(new URL('/terms', page.url()).href)
  await expect(legal.getByRole('heading', { level: 1 })).toHaveText('Términos y Condiciones')
  await expect(legal.locator('main section')).toHaveCount(22)
  await expect(legal.locator('main')).toContainText('50% de anticipo')
  await legal.screenshot({ path: `artifacts/terms-page-${testInfo.project.name}.png` })
  await context.close()
})

test('supplied logo and all 22 original terms are accessible and deep-linkable', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const logo = page.locator('header .brand-logo')
  await expect(logo).toBeVisible()
  expect(await logo.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBe(629)
  await page.getByRole('contentinfo').getByRole('link', { name: 'Terms & Conditions', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Terms & Conditions' })
  await expect(dialog.locator('.terms-content section')).toHaveCount(22)
  await expect(dialog).toContainText('50% upfront payment')
  await expect(dialog).toContainText('22. Contact')
  await expect(page).toHaveURL(/#terms$/)
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(audit.violations.map((item) => item.id)).toEqual([])
  await page.screenshot({ path: `artifacts/terms-${testInfo.project.name}.png` })
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Terms & Conditions', exact: true })).toBeFocused()
  await page.goto('/#terms')
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'ES', exact: true }).first().click()
  await page.getByRole('contentinfo').getByRole('link', { name: 'Términos y Condiciones', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'Términos y Condiciones' })).toBeVisible()
})

test('interactive sculpture renders in WebGL and preserves services without WebGL', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.brand-sculpture')).toBeVisible()
  await expect(page.locator('.brand-sculpture canvas')).toHaveCount(1)
  await expect(page.locator('.brand-sculpture')).toHaveClass(/is-ready/)
  await page.getByRole('tab', { name: '02 Automate' }).click()
  await expect(page.getByRole('tabpanel')).toContainText('Less busywork. Better business.')
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof original>) {
      if (String(args[0]).startsWith('webgl')) return null
      return original.apply(this, args)
    } as typeof original
  })
  await page.reload()
  await expect(page.locator('.sculpture-fallback')).toBeVisible()
  await expect(page.locator('.hero-intro')).toContainText('technology and digital services company')
  await expect(page.locator('.brand-sculpture canvas')).toHaveCount(0)
  await page.getByRole('tab', { name: '03 Grow' }).click()
  await expect(page.getByRole('tabpanel')).toContainText('Connect clicks to customers.')
})
