import type { Copy, Language } from '../data/content'
import { corporate } from '../data/corporate'
import { Arrow } from '../components/Icons'
import { SectionTitle } from '../components/SectionTitle'
export function Studio({
  copy,
  language,
  onContact,
}: {
  copy: Copy
  language: Language
  onContact: () => void
}) {
  const text = corporate[language]
  return (
    <section id="studio" className="studio section-padding" aria-labelledby="studio-title">
      <span className="section-kicker">
        <span className="orange-square" />
        {copy.studioLabel}
      </span>
      <div className="studio-layout">
        <SectionTitle id="studio-title" first={copy.studioTitle[0]} second={copy.studioTitle[1]} />
        <div>
          <p className="studio-description">{copy.studioText}</p>
          <button className="text-link" onClick={onContact}>
            {copy.start}
            <Arrow diagonal />
          </button>
        </div>
      </div>
      <div className="reasons-grid">
        {text.reasons.map(([title, description], i) => (
          <article key={title}>
            <span>0{i + 1} /</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
      <div className="process-heading">
        <span className="section-kicker">{text.processLabel}</span>
      </div>
      <ol className="process">
        {copy.process.map((step, i) => (
          <li key={step}>
            <span className="process-number">
              0{i + 1}
              <Arrow />
            </span>
            <h3>{step}</h3>
            <p>{copy.processDescriptions[i]}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
