import { chromium } from '@playwright/test'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })
const target = process.argv[2] || 'http://127.0.0.1:5173'
const errors = []
page.on('pageerror', error => errors.push(error.message))
await page.goto(target, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(6500)
await page.screenshot({ path: 'artifacts/review-desktop.png' })
if (!target.includes('lusion')) {
  await page.locator('#capabilities').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1500)
  await page.screenshot({ path: 'artifacts/review-services.png' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(target)
  await page.waitForTimeout(3000)
  await page.screenshot({ path: 'artifacts/review-mobile.png', fullPage: true })
}
console.log(JSON.stringify({ errors, title: await page.title() }))
await browser.close()
