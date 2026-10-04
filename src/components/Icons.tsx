export function Arrow({
  diagonal = false,
  className = '',
}: {
  diagonal?: boolean
  className?: string
}) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15M13 5l7 7-7 7'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
export function Mark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="31"
      height="33"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
    >
      <path d="M18 2 34 11v14L18 34 2 25V11L18 2Z" stroke="currentColor" strokeWidth="2.5" />
      <path d="m2 11 16 9 16-9M18 20v14M10 7l16 9v13" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  )
}
