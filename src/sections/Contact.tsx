import { useEffect, useState, type FormEvent } from 'react'
import { capabilities, type Copy, type Language } from '../data/content'
import { corporate, serviceDetails } from '../data/corporate'
import { Arrow } from '../components/Icons'
import { contactEmail, whatsappUrl } from '../utils/config'
import { SectionTitle } from '../components/SectionTitle'

export function Contact({
  copy,
  language,
  selection,
}: {
  copy: Copy
  language: Language
  selection: { interest?: number; version: number }
}) {
  const text = corporate[language]
  const [service, setService] = useState('')
  const [brief, setBrief] = useState('')
  const [status, setStatus] = useState<'editing' | 'prepared'>(
    'editing',
  )
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  useEffect(() => {
    if (typeof selection.interest === 'number') {
      setService(capabilities[selection.interest].title)
      setStatus('editing')
    }
  }, [selection])
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget).entries())
    const selectedIndex = capabilities.findIndex((item) => item.title === data.interest)
    const serviceLabel = selectedIndex >= 0
      ? serviceDetails[selectedIndex].titles[language === 'en' ? 0 : 1]
      : language === 'es' ? 'Todavía no sé' : 'Not sure yet'
    const prepared = language === 'es'
      ? `CREATIONWORKS STUDIO LLC — CONSULTA DE PROYECTO\n\nNombre: ${data.name}\nEmail: ${data.email}\nEmpresa: ${data.company || '—'}\nServicio: ${serviceLabel}\n\nDetalles del proyecto:\n${data.message}\n`
      : `CREATIONWORKS STUDIO LLC — PROJECT INQUIRY\n\nName: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || '—'}\nService: ${serviceLabel}\n\nProject details:\n${data.message}\n`
    setBrief(prepared)
    setCopied(false)
    setCopyError(false)
    setStatus('prepared')
    window.open(whatsappUrl(prepared), '_blank', 'noopener,noreferrer')
  }
  function download() {
    const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'creationworks-project-brief.txt'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief)
      setCopied(true)
      setCopyError(false)
    } catch {
      setCopyError(true)
    }
  }
  return (
    <section id="contact" className="contact section-padding" aria-labelledby="contact-title">
      <div className="contact-copy">
        <span className="section-kicker">
          <span className="orange-square" />
          {text.contactLabel}
        </span>
        <SectionTitle id="contact-title" first={copy.finalTitle[0]} second={copy.finalTitle[1]} />
        <p>{copy.finalText}</p>
        <div className="contact-help">
          <span>↗</span>
          <p>{text.contactServices}</p>
        </div>
        <div className="contact-info">
          <span>
            {copy.studioLocation} · {copy.studioGlobal}
          </span>
          <span>ENGLISH / ESPAÑOL</span>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            {language === 'es' ? 'Escribinos por WhatsApp' : 'Chat with us on WhatsApp'}
            <Arrow diagonal />
          </a>
          <span>+54 9 11 5808-3844</span>
          {contactEmail && (
            <a href={`mailto:${contactEmail}`}>
              {contactEmail}
              <Arrow diagonal />
            </a>
          )}
        </div>
      </div>
      <div className="inquiry-panel">
        {status === 'prepared' ? (
          <div className="brief-success" role="status">
            <span className="success-symbol">↗</span>
            <h3>{copy.success}</h3>
            <p>{copy.successText}</p>
            <div className="brief-actions">
              <a className="button primary" href={whatsappUrl(brief)} target="_blank" rel="noopener noreferrer">
                {language === 'es' ? 'Abrir WhatsApp con mi consulta' : 'Open WhatsApp with my inquiry'}
                <Arrow diagonal />
              </a>
              {contactEmail && (
                <a
                  className="button outline"
                  href={`mailto:${contactEmail}?subject=${encodeURIComponent('Project inquiry — CreationWorks')}&body=${encodeURIComponent(brief)}`}
                >
                  {copy.emailDraft}
                  <Arrow diagonal />
                </a>
              )}
              <button
                className="button outline"
                onClick={download}
              >
                {copy.download}
                <Arrow />
              </button>
              <button className="text-link" onClick={copyBrief}>
                {copied ? copy.copied : copy.copy}
              </button>
            </div>
            {contactEmail && <p>{copy.emailNotice}</p>}
            {copyError && (
              <p>
                {language === 'en'
                  ? 'Copy is unavailable. You can download your brief.'
                  : 'No se pudo copiar. Podés descargar el brief.'}
              </p>
            )}
            <details className="brief-preview">
              <summary>{language === 'en' ? 'Review your brief' : 'Revisar tu brief'}</summary>
              <pre>{brief}</pre>
            </details>
            <button
              className="text-link"
              onClick={() => {
                setStatus('editing')
                setCopied(false)
              }}
            >
              {copy.reset}
              <Arrow />
            </button>
          </div>
        ) : (
          <>
            <h3>{copy.contactTitle}</h3>
            <p>{copy.contactText}</p>
            <form onSubmit={submit}>
              <fieldset>
                <div className="form-row">
                  <label>
                    {copy.name}
                    <input name="name" autoComplete="name" required maxLength={100} />
                  </label>
                  <label>
                    {copy.email}
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={200}
                    />
                  </label>
                </div>
                <label>
                  {copy.company}
                  <input name="company" autoComplete="organization" maxLength={150} />
                </label>
                <label>
                  {copy.interest}
                  <select
                    name="interest"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      {copy.select}
                    </option>
                    {capabilities.map((item, i) => (
                      <option key={item.title} value={item.title}>
                        {serviceDetails[i].titles[language === 'en' ? 0 : 1]}
                      </option>
                    ))}
                    <option value="Not sure yet">
                      {language === 'en'
                        ? 'Not sure yet — help me define it'
                        : 'Todavía no sé — necesito orientación'}
                    </option>
                  </select>
                </label>
                <label>
                  {copy.message}
                  <textarea
                    name="message"
                    rows={4}
                    minLength={10}
                    maxLength={3000}
                    required
                    placeholder={
                      language === 'en'
                        ? 'Your goal, your challenge or what you have in mind…'
                        : 'Tu objetivo, tu desafío o lo que tenés en mente…'
                    }
                  />
                </label>
                <button className="button primary" type="submit">
                  {copy.submit}
                  <Arrow diagonal />
                </button>
                <small className="form-privacy">
                  {language === 'es'
                    ? 'Se abrirá WhatsApp con tus datos. Revisá el mensaje y tocá Enviar para que nos llegue.'
                    : 'WhatsApp will open with your details. Review the message and tap Send so we receive it.'}
                </small>
              </fieldset>
            </form>
          </>
        )}
      </div>
    </section>
  )
}
