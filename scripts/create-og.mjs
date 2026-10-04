import { chromium } from '@playwright/test'
import { readFileSync } from 'node:fs'
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROME_PATH ||
    (process.platform === 'win32'
      ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
      : undefined),
  headless: true,
})
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
const logo = `<img src="data:image/jpeg;base64,${readFileSync('public/creationworks-logo.jpeg').toString('base64')}" alt="CreationWorks Studio" style="width:160px;height:101px;object-fit:contain;background:#000"/>`
await page.setContent(
  `<!doctype html><html><head><style>*{box-sizing:border-box}body{margin:0;background:#090a0b;color:#f4f1e9;font-family:Arial,sans-serif;padding:58px 65px}.brand{display:flex;gap:13px;align-items:center;font-size:28px;letter-spacing:-1px}.brand svg{width:40px;height:40px}.label{font-size:10px;letter-spacing:2px;margin-top:24px}h1{font-size:70px;line-height:1.05;letter-spacing:-4px;font-weight:600;margin:28px 0;max-width:730px}h1 span{color:#dcc17c}.description{font-size:17px;line-height:1.7;max-width:610px;color:#c5bcaa}.services{position:absolute;right:58px;top:154px;width:235px;background:#1c1d18;border:1px solid #625234;border-radius:6px;padding:26px}.services h2{font-size:12px;margin:0 0 19px;letter-spacing:1px}.services div{font-size:14px;border-top:1px solid #49402e;padding:15px 0}.services b{color:#dcc17c;font-size:10px;margin-right:8px}.bottom{position:absolute;bottom:45px;left:65px;right:65px;border-top:1px solid #49402e;padding-top:20px;font-size:10px;letter-spacing:1.7px}.button{display:inline-block;background:#dcc17c;padding:12px 20px;font-size:11px;margin-top:22px}</style></head><body><div class="brand">${logo}</div><div class="label">YOUR TECHNOLOGY & DIGITAL SERVICES PARTNER</div><h1>Technology that<br/>moves your<br/><span>business forward.</span></h1><div class="description">Websites, software, AI and digital growth.<br/>From strategy to implementation.</div><div class="services"><h2>WHAT WE DO ↗</h2><div><b>01</b> Web & software</div><div><b>02</b> AI & automation</div><div><b>03</b> E-commerce</div><div><b>04</b> Marketing & design</div><div><b>05</b> Data & consulting</div></div><div class="bottom">TECHNOLOGY. CREATIVITY. BUSINESS IMPACT.<span style="float:right">FLORIDA, USA · WORLDWIDE</span></div></body></html>`,
)
await page.screenshot({ path: 'public/og-image.png' })
await browser.close()
