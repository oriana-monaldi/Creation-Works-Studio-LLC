import { expect, test } from '@playwright/test'

test('sections fill the viewport and longer content uses document scrolling', async ({ page }, testInfo) => {
  test.setTimeout(120000)
  test.skip(testInfo.project.name !== 'desktop', 'Viewport coverage runs in the desktop project')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const language of ['en', 'es']) {
    for (const [width, height] of [[1366, 768], [1440, 900], [1280, 720], [1920, 1080], [1024, 768], [390, 844], [768, 500]]) {
      await page.setViewportSize({ width, height })
      await page.goto(`/?lang=${language}`)
      await expect(page.locator('#hero-title')).toBeVisible()
      const sizes = await page.locator('.hero').evaluate((hero) => {
        const bounds = hero.getBoundingClientRect()
        return {
          height: bounds.height,
          overflow: document.documentElement.scrollWidth > innerWidth,
          sections: Array.from(document.querySelectorAll('#main > section')).map(section => ({
            id:section.id || section.classList[0],
            height:section.getBoundingClientRect().height,
            overflow:getComputedStyle(section).overflowY,
            scroll:section.scrollHeight,
            client:section.clientHeight,
            centerOffset:(() => {
              const children=Array.from(section.children).map(child=>child.getBoundingClientRect())
              const bounds=section.getBoundingClientRect()
              return ((Math.min(...children.map(child=>child.top))+Math.max(...children.map(child=>child.bottom)))/2)-(bounds.top+bounds.height/2)
            })(),
          })),
        }
      })
      expect(sizes.overflow, `${language} ${width}x${height}`).toBe(false)
      expect(sizes.height).toBeGreaterThanOrEqual(height - 1)
      for (const section of sizes.sections) {
        expect(section.height, `${section.id} ${language} ${width}x${height}`).toBeGreaterThanOrEqual(height - 1)
        if (section.id !== 'top') expect(section.overflow).toBe('visible')
        if (width >= 1024 && height >= 720 && ['intro','work'].includes(section.id)) {
          expect(section.height, `${section.id} ${language} ${width}x${height}`).toBeCloseTo(height, 0)
        }
        if (section.id !== 'top') {
          expect(Math.abs(section.centerOffset), `${section.id} is centered`).toBeLessThanOrEqual(2)
        }
      }
      if (width < 768) {
        expect(sizes.sections.find(section => section.id === 'work')!.height).toBeGreaterThan(height)
      }
    }
  }
})

test('company, eight visible services, meaningful hero interaction and project details', async ({
  page,
}, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Technology that')
  await expect(page.locator('.hero-intro')).toContainText('technology and digital services company')
  await expect(page.locator('.hero-intro')).toContainText('websites, software and apps')
  await expect(page.locator('.brand-sculpture')).toBeVisible()
  expect(await page.locator('canvas').count()).toBeLessThanOrEqual(1)
  await page.getByRole('tab', { name: '02 Automate' }).click()
  await expect(page.getByRole('tabpanel')).toContainText('Less busywork. Better business.')
  await page.getByRole('tab', { name: '02 Automate' }).press('ArrowRight')
  await expect(page.getByRole('tab', { name: '03 Grow' })).toBeFocused()
  await expect(page.getByRole('tabpanel')).toContainText('Connect clicks to customers.')
  await page.screenshot({ path: `artifacts/corporate-${testInfo.project.name}-hero.png` })
  await page.locator('.hero-buttons').getByRole('link', { name: 'Explore our work' }).click()
  await expect(page.locator('#work')).toBeInViewport()
  await page.locator('#capabilities').scrollIntoViewIfNeeded()
  await expect(page.locator('.service-detail')).toHaveCount(8)
  for (const id of [
    'web',
    'software',
    'ai',
    'commerce',
    'growth',
    'creative',
    'data',
    'consulting',
  ]) {
    const article = page.locator(`#service-${id}`)
    await expect(article.getByRole('heading')).toBeVisible()
    await expect(article.locator('.deliverables li')).toHaveCount(4)
    await expect(article.getByRole('button', { name: 'Discuss this service' })).toBeVisible()
  }
  await expect(page.locator('#service-web')).toContainText('Landing pages')
  await expect(page.locator('#service-software')).toContainText('CRM, ERP')
  await expect(page.locator('#service-ai')).toContainText('voice agents & chatbots')
  await expect(page.locator('#service-commerce')).toContainText('Shopify, Tiendanube & WooCommerce')
  await expect(page.locator('#service-growth')).toContainText('Meta, Google, TikTok & LinkedIn Ads')
  await expect(page.locator('#service-data')).toContainText('Custom APIs')
  await page.locator('#service-ai summary').click()
  await expect(page.locator('#service-ai .service-tags')).toContainText('n8n / Make / Zapier')
  await page.locator('#work').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: 'Explore concept: E-COMMERCE' }).first().click()
  await expect(page.getByRole('dialog')).toContainText(
    'This concept has not been deployed for a client.',
  )
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.getByRole('button', { name: 'Explore concept: E-COMMERCE' }).first()).toBeFocused()
  await page.locator('#studio').scrollIntoViewIfNeeded()
  await expect(page.locator('.reasons-grid article')).toHaveCount(3)
  await expect(page.locator('.technology')).toContainText('React')
  await page
    .locator('.faq summary')
    .filter({ hasText: 'Can I hire you for just one service?' })
    .click()
  await expect(page.locator('.faq details[open]')).toContainText('Yes.')
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await expect(page.locator('#contact form')).toBeVisible()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced')
  for (const section of ['work', 'studio', 'contact']) {
    await page.locator(`#${section}`).scrollIntoViewIfNeeded()
    await page.screenshot({ path: `artifacts/corporate-${testInfo.project.name}-${section}.png` })
  }
  await page.evaluate(() => {
    ;(document.activeElement as HTMLElement)?.blur()
    window.scrollTo(0, 0)
  })
  await expect(page.locator('h1')).toHaveCount(1)
  await page.screenshot({
    path: `artifacts/corporate-${testInfo.project.name}-full.png`,
    fullPage: true,
  })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect(errors).toEqual([])
})

test('service inquiry, inline contact validation and real brief download', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.locator('#service-ai').getByRole('button', { name: 'Discuss this service' }).click()
  const contact = page.locator('#contact')
  await expect(contact).toBeInViewport()
  await expect(contact.getByLabel('What do you need?')).toHaveValue('AI & Automation')
  await contact.getByRole('button', { name: 'Continue to WhatsApp' }).click()
  await expect(contact.getByText('Your project brief is ready.')).not.toBeVisible()
  await contact.getByLabel('Your name').fill('Test Business')
  await contact.getByLabel('Email address').fill('review@example.com')
  await contact.getByLabel('Company').fill('Review Company')
  await contact
    .getByLabel('Tell us about your idea')
    .fill('We need a WhatsApp and CRM automation for customer inquiries.')
  await page.context().route('https://wa.me/**', (route) => route.fulfill({ body: '<html><body>WhatsApp handoff</body></html>', contentType: 'text/html' }))
  const popupPromise = page.waitForEvent('popup')
  await contact.getByRole('button', { name: 'Continue to WhatsApp' }).click()
  const popup = await popupPromise
  await popup.waitForLoadState()
  const handoff = new URL(popup.url())
  expect(handoff.pathname).toBe('/5491158083844')
  expect(handoff.searchParams.get('text')).toContain('Name: Test Business')
  expect(handoff.searchParams.get('text')).toContain('Email: review@example.com')
  expect(handoff.searchParams.get('text')).toContain('Company: Review Company')
  expect(handoff.searchParams.get('text')).toContain('AI & automation')
  expect(handoff.searchParams.get('text')).toContain('WhatsApp and CRM automation')
  await popup.close()
  await expect(contact).toContainText('Review the message and tap Send')
  await expect(contact.getByRole('link', { name: 'Open WhatsApp with my inquiry' })).toHaveAttribute('href', handoff.href)
  await contact.getByText('Review your brief', { exact: true }).click()
  await expect(contact.locator('pre')).toContainText('AI & automation')
  const download = page.waitForEvent('download')
  await contact.getByRole('button', { name: 'Download brief' }).click()
  expect((await download).suggestedFilename()).toBe('creationworks-project-brief.txt')
  await page.getByRole('button', { name: 'Privacy', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText('Your information')
  await page.keyboard.press('Escape')
})

test('Spanish content, mobile navigation and reduced motion remain functional', async ({
  page,
}, testInfo) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'ES', exact: true }).first().click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(page.locator('h1')).toContainText('Tecnología que')
  await expect(page.locator('.hero-intro')).toContainText('empresa de tecnología')
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Abrir navegación' }).click()
    await page
      .getByRole('dialog')
      .getByRole('link', { name: /Servicios/ })
      .click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
    await expect(page.locator('#capabilities')).toBeInViewport()
  }
  await expect(page.locator('#service-web')).toContainText('Desarrollo web')
  await expect(page.locator('#service-ai')).toContainText('IA y automatización')
  await page
    .locator('#service-commerce')
    .getByRole('button', { name: 'Consultar por este servicio' })
    .click()
  await expect(page.locator('#contact select')).toHaveValue('E-Commerce')
  await page.getByRole('button', { name: 'Reducir movimiento' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced')
  await page.reload()
  await expect(page.locator('h1')).toContainText('Tecnología que')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
