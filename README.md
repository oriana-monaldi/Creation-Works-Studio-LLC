# CreationWorks Studio LLC

A service-led corporate website built with React 18, Vite 6 and TypeScript. The supplied CreationWorks logo defines a black, gold and warm off-white palette. An interactive HTML/CSS ecosystem connects web, AI, commerce and growth to concrete business solutions without WebGL. Eight service areas use a light editorial layout; concept projects have large visual presentations. English and Spanish, responsive navigation, project dialogs and an inquiry form are implemented.

## Run and verify

```sh
npm install
npm run dev
npm run build
npm run lint
npm run test:e2e
```

Browser tests expect the local server at `http://127.0.0.1:5173`. Windows uses installed Chrome; elsewhere install Playwright Chromium or set `PLAYWRIGHT_CHROME_PATH`. The tests cover the clarity and visibility of all eight services, relevant inquiry selection, validated contact briefs and download, EN/ES, mobile navigation, project details, keyboard interactions, reduced motion, automated WCAG checks and layouts from 320 to 1920 pixels. Screenshots are written to ignored `artifacts/`.

## Content and structure

- `src/data/corporate.ts`: bilingual corporate positioning, services, business outcomes and FAQ.
- `src/data/content.ts`: shared translations and extended service/platform catalog.
- `src/data/projects.ts`: three explicitly labeled concept projects; replace with authorized client cases when available. No fabricated client metrics are used.
- `src/sections`: service-led hero and introduction, all eight services, practical AI feature, selected work, company/process, technologies, FAQ and inline contact.
- `src/components`: supplied brand logo, accessible navigation, native dialogs, project illustrations and footer. The earlier unused BrandSculpture is retained in source but is not imported or shipped.
- `src/data/terms.ts`: all 22 terms supplied by CreationWorks, available from navigation, hero and a prominent footer banner at `/terms`, in their original Spanish. The Vite plugin serves and exports a standalone `terms/index.html` page that works without JavaScript. The prior `/#terms` dialog remains compatible.
- `src/styles/project-visuals.css`: reusable existing project visual assets in CSS.
- `src/index.css`: responsive corporate layouts. `src/styles/refinement.css` defines the final editorial palette, ecosystem and featured project layouts.
- `src/animations`: dynamically loaded, restrained GSAP text motion. Content is immediately visible; reduced motion is respected and manual preferences persist.

## Contact and deployment configuration

Copy `.env.example` to `.env.local` and supply verified values:

- `VITE_CONTACT_EMAIL`: enables email links and a prefilled email handoff after preparing an inquiry.
- `VITE_SOCIAL_URL`: official social profile.
- `VITE_SITE_URL`: public HTTPS origin, used for canonical/Open Graph and production robots/sitemap generation.

Contact uses WhatsApp at +54 9 11 5808-3844 (`src/utils/config.ts`). Visitors can open a direct chat or complete the validated form, which opens WhatsApp with their name, email, company, localized service and message. The visitor must review and send the message in WhatsApp; opening it is not confirmation of delivery. A repeat WhatsApp link, preview, copy and download remain available if the popup is blocked. Optional email handoff also requires sending the draft in the email application. The form does not post to an endpoint.

Run `npm run build` and deploy `dist/` on your chosen static host. No deployment has been performed. Fonts are self-hosted; project illustrations are local. Regenerate the included social-share image using `npm run create:og`.

## SEO and accessibility

All services and benefits exist in semantic HTML, without interaction requirements. Technical detail expanders, FAQ, hero solution tabs, native project dialogs, skip navigation, focus states and form labels support keyboard use. Metadata, a share image, Organization structured data, robots and optional sitemap/canonical are included. No advertising trackers are installed.
