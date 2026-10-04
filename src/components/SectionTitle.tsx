export function SectionTitle({ id, first, second }: { id: string; first: string; second: string }) {
  return (
    <h2 id={id} className="section-title" data-reveal>
      <span className="section-title-first">{first}</span>
      <span className="section-title-second">{second}</span>
    </h2>
  )
}
