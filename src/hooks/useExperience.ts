import { useEffect, useState } from 'react'

export function useExperience() {
  const [systemReduced, setSystemReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [manualReduced, setManualReduced] = useState(() => {
    try { return localStorage.getItem('cw-reduced-motion') === 'true' } catch { return false }
  })
  useEffect(() => {
    try { localStorage.setItem('cw-reduced-motion', String(manualReduced)) } catch { /* Storage is optional. */ }
  }, [manualReduced])
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setSystemReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return { reduced: systemReduced || manualReduced, systemReduced, setManualReduced }
}
