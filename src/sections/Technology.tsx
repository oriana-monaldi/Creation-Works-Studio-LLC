import { corporate } from '../data/corporate'
import type { Language } from '../data/content'
import { SectionTitle } from '../components/SectionTitle'
const technologyGroups = [
  {
    titles: ['Web & software', 'Web y software'],
    tools: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'React Native', 'Flutter', 'WordPress', 'Webflow'],
  },
  {
    titles: ['AI & operations', 'IA y operaciones'],
    tools: ['OpenAI', 'AI agents', 'n8n', 'Make', 'Zapier', 'REST APIs', 'Webhooks', 'PostgreSQL', 'Firebase'],
  },
  {
    titles: ['E-commerce & growth', 'E-commerce y crecimiento'],
    tools: ['Shopify', 'Tiendanube', 'WooCommerce', 'Stripe', 'Google Ads', 'Meta Ads', 'GA4'],
  },
]
export function Technology({ language }: { language: Language }) {
  const text = corporate[language]
  return (
    <section className="technology section-padding" aria-labelledby="technology-title">
      <span className="section-kicker">
        <span className="orange-square" />
        {text.techLabel}
      </span>
      <div className="heading-row">
        <SectionTitle id="technology-title"
          first={language === 'es' ? 'La tecnología adecuada' : 'The right technology.'}
          second={language === 'es' ? 'para tu negocio.' : 'for your business.'} />
        <p>{text.techDescription}</p>
      </div>
      <div className="technology-groups">
        {technologyGroups.map((group) => (
          <div key={group.titles[0]}>
            <h3>{group.titles[language === 'en' ? 0 : 1]}</h3>
            <div>
              {group.tools.map((tool) => (
                <span key={tool}>{language === 'es' && tool === 'AI agents' ? 'Agentes de IA' : tool}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
export function FAQ({ language }: { language: Language }) {
  const text = corporate[language]
  return (
    <section className="faq section-padding" aria-labelledby="faq-title">
      <div>
        <span className="section-kicker">
          <span className="orange-square" />
          {text.faqLabel}
        </span>
        <SectionTitle id="faq-title"
          first={language === 'es' ? 'Algunas preguntas' : 'A few things'}
          second={language === 'es' ? 'que podés tener.' : 'you might be wondering.'} />
      </div>
      <div className="faq-list">
        {text.faqs.map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <span>+</span>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
