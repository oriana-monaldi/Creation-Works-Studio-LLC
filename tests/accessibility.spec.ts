import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('corporate page and project dialog meet automated WCAG A/AA checks', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.locator('#capabilities').scrollIntoViewIfNeeded()
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual(
    [],
  )
  await page.getByRole('button', { name: 'Explore concept: E-COMMERCE' }).first().click()
  const dialogResult = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(
    dialogResult.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
  ).toEqual([])
})

test('layout stays inside the viewport across all supported sizes and languages', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const width of [320, 375, 600, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    for (const language of ['EN', 'ES']) {
      await page.getByRole('button', { name: language, exact: true }).first().click()
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${language} at ${width}px`,
      ).toBe(true)
      const title = page.locator('h1')
      const bounds = await title.boundingBox()
      expect(bounds?.x).toBeGreaterThanOrEqual(0)
      expect(
        await title.evaluate(
          (el) =>
            el.scrollWidth <=
            document.documentElement.clientWidth - el.getBoundingClientRect().left,
        ),
        `${language} hero at ${width}px`,
      ).toBe(true)
      if ([600, 768, 1024].includes(width) && language === 'EN') {
        await page.screenshot({ path: `artifacts/viewport-${width}.png` })
      }
    }
  }
})
