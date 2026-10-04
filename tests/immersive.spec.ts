import { test, expect } from '@playwright/test'

test('immersive scene responds to pointer and scroll without rendering errors', async ({ page }, info) => {
  const failures: string[] = []
  page.on('pageerror', error => failures.push(error.message))
  page.on('console', message => { if (message.type() === 'error' && /shader|webgl/i.test(message.text())) failures.push(message.text()) })
  await page.goto('/')
  await expect(page.locator('.brand-sculpture')).toHaveClass(/is-ready/)
  await expect(page.locator('.brand-sculpture img')).toHaveCount(0)
  await expect(page.locator('.brand-sculpture')).toHaveAttribute('data-stage', 'neural')
  await expect(page.locator('.hero-buttons button')).toBeVisible()
  await expect(page.locator('.opening-wordmark > span').first()).toHaveCSS('opacity', '1')
  await page.mouse.move(250, 320)
  await page.screenshot({ path: `artifacts/immersive-${info.project.name}-entry.png` })
  await page.mouse.move(700, 400)
  await page.evaluate(() => window.scrollTo({ top: innerHeight * 0.85, behavior: 'instant' }))
  await expect(page.locator('.hero-world')).toBeInViewport()
  await page.screenshot({ path: `artifacts/immersive-${info.project.name}-tunnel.png` })
  await page.evaluate(() => {
    const section = document.getElementById('capabilities')!
    window.scrollTo({ top: section.getBoundingClientRect().top + scrollY - innerHeight * .4, behavior: 'instant' })
  })
  await expect(page.locator('.brand-sculpture')).toHaveAttribute('data-stage', 'transition')
  await expect.poll(() => page.locator('.brand-sculpture').evaluate(el => Number(el.style.getPropertyValue('--network-opacity')))).toBeLessThan(.5)
  await page.screenshot({ path: `artifacts/immersive-${info.project.name}-transition.png` })
  await page.evaluate(() => {
    const section = document.getElementById('capabilities')!
    window.scrollTo({ top: section.getBoundingClientRect().top + scrollY + innerHeight * .2, behavior: 'instant' })
  })
  await expect(page.locator('.brand-sculpture')).toHaveAttribute('data-stage', 'ribbon')
  await expect.poll(() => page.locator('.brand-sculpture').evaluate(el => el.style.getPropertyValue('--network-opacity'))).toBe('0')
  await page.screenshot({ path: `artifacts/immersive-${info.project.name}-ribbon.png` })
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await expect(page.locator('.brand-sculpture')).toHaveAttribute('data-stage', 'neural')
  await expect.poll(() => page.locator('.brand-sculpture').evaluate(el => el.style.getPropertyValue('--network-opacity'))).toBe('1')
  await page.evaluate(() => {
    const section = document.getElementById('studio')!
    window.scrollTo({ top: section.getBoundingClientRect().top + scrollY + innerHeight * .4, behavior: 'instant' })
  })
  await expect(page.locator('.brand-sculpture')).toHaveAttribute('data-stage', 'woven')
  await page.screenshot({ path: `artifacts/immersive-${info.project.name}-woven.png` })
  await page.locator('footer').scrollIntoViewIfNeeded()
  await expect(page.locator('.global-world canvas')).toBeInViewport()
  await page.screenshot({ path: `artifacts/immersive-${info.project.name}-footer.png` })
  if (info.project.name === 'desktop') {
    const card = page.locator('.service-detail').first()
    await card.scrollIntoViewIfNeeded()
    await card.hover({ position: { x: 80, y: 70 } })
    await expect.poll(() => card.evaluate(el => el.style.getPropertyValue('--card-glow'))).toBe('1')
    await page.mouse.move(0, 0)
    await expect.poll(() => card.evaluate(el => el.style.getPropertyValue('--card-glow'))).toBe('0')
  }
  expect(failures).toEqual([])
})



test('opening enters once even when the animation library loads late', async ({ page }) => {
  await page.route(/gsap.*\.js/, async route => {
    await new Promise(resolve => setTimeout(resolve, 1800))
    await route.continue()
  })
  await page.goto('/')
  await expect(page.locator('.site')).toHaveAttribute('data-entry', 'ready')
  const opacities = await page.locator('.opening-wordmark > span').first().evaluate(element => new Promise<number[]>(resolve => {
    const samples: number[] = []
    const start = performance.now()
    const sample = () => {
      samples.push(Number(getComputedStyle(element).opacity))
      if (performance.now() - start < 2800) requestAnimationFrame(sample)
      else resolve(samples)
    }
    sample()
  }))
  expect(opacities.at(-1)).toBe(1)
  expect(opacities.every((value, i) => i === 0 || value >= opacities[i - 1] - .02)).toBe(true)
})



