export function Opening({ language }: { language: 'en' | 'es' }) {
  return <section id="top" className="brand-opening" aria-label="CreationWorks Studio LLC">
    <div className="opening-viewport">
      <div className="opening-wordmark" aria-label="CreationWorks Studio LLC" lang="en" translate="no">
        <span>CreationWorks</span>
        <span>Studio</span>
        <small>LLC</small>
      </div>
      <div className="opening-caption"><span>{language === 'es' ? 'TECNOLOGÍA · INTELIGENCIA · EXPERIENCIAS' : 'TECHNOLOGY · INTELLIGENCE · EXPERIENCES'}</span><span>{language === 'es' ? 'DESLIZÁ PARA ENTRAR' : 'SCROLL TO ENTER'} ↓</span></div>
    </div>
  </section>
}
