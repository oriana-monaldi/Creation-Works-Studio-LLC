import { useEffect, useRef, useState } from 'react'
import { type Language } from './data/content'
import { corporateCopy } from './data/corporate'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { SpatialCursor } from './components/SpatialCursor'
import { BrandSculpture } from './components/BrandSculpture'
import { Opening } from './sections/Opening'
import { Hero, Introduction, ServicesRibbon } from './sections/Hero'
import { Capabilities } from './sections/Capabilities'
import { Work } from './sections/Work'
import { Studio } from './sections/Studio'
import { Contact } from './sections/Contact'
import { Technology, FAQ } from './sections/Technology'
import { useExperience } from './hooks/useExperience'
import { useNarrative } from './animations/useNarrative'
import { siteUrl } from './utils/config'
function initialLanguage(): Language {
  const requested = new URLSearchParams(location.search).get('lang')
  if (requested === 'es' || requested === 'en') return requested
  try {
    return localStorage.getItem('cw-language') === 'es' ? 'es' : 'en'
  } catch {
    return 'en'
  }
}
export default function App() {
  const [sceneReady, setSceneReady] = useState(false)
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const [selection, setSelection] = useState<{ interest?: number; version: number }>({ version: 0 })
  const { reduced, systemReduced, setManualReduced } = useExperience()
  const page = useRef<HTMLDivElement>(null)
  const copy = corporateCopy[language]
  useNarrative(page, reduced, language)
  useEffect(() => {
    const timer = window.setTimeout(() => setSceneReady(true), 1600)
    return () => window.clearTimeout(timer)
  }, [])
  const openContact = (selection?: number) => {
    setSelection((previous) => ({
      interest: typeof selection === 'number' ? selection : undefined,
      version: previous.version + 1,
    }))
    document
      .getElementById('contact')
      ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full'
    document.title =
      language === 'en'
        ? 'CreationWorks Studio LLC — Web, Software, AI & Digital Growth'
        : 'CreationWorks Studio LLC — Web, Software, IA y Marketing Digital'
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.intro)
    for (const key of ['og:title', 'twitter:title']) {
      document.querySelector(`meta[property="${key}"], meta[name="${key}"]`)?.setAttribute('content', document.title)
    }
    for (const key of ['og:description', 'twitter:description']) {
      document.querySelector(`meta[property="${key}"], meta[name="${key}"]`)?.setAttribute('content', copy.intro)
    }
    try {
      localStorage.setItem('cw-language', language)
    } catch {
      /* Preferences remain usable without browser storage. */
    }
    if (siteUrl) {
      let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = siteUrl
    }
  }, [language, reduced, copy.intro])
  return (
    <div ref={page} className={`site language-${language}`} data-entry={sceneReady || reduced ? 'ready' : 'loading'}>
      <div className="hero-world global-world"><BrandSculpture onReady={() => setSceneReady(true)} /></div><SpatialCursor reduced={reduced} language={language} />
      <a href="#main" className="skip-link">
        {language === 'en' ? 'Skip to content' : 'Ir al contenido'}
      </a>
      <Navbar copy={copy} language={language} setLanguage={setLanguage} onContact={openContact} />
      <main id="main" tabIndex={-1}>
        <Opening language={language} />
        <Hero copy={copy} language={language} onContact={openContact} />
        <Introduction copy={copy} language={language} />
        <ServicesRibbon language={language} />
        <Capabilities copy={copy} language={language} onContact={openContact} />
        <Work copy={copy} language={language} />
        <Studio copy={copy} language={language} onContact={openContact} />
        <Technology language={language} />
        <FAQ language={language} />
        <Contact copy={copy} language={language} selection={selection} />
      </main>
      <Footer
        copy={copy}
        language={language}
        reduced={reduced}
        motionLocked={systemReduced}
        toggleMotion={() => setManualReduced(!reduced)}
        onContact={openContact}
      />
    </div>
  )
}



