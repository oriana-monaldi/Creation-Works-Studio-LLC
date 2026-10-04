import { useEffect, useRef, type ReactNode } from 'react'
export function Modal({
  children,
  onClose,
  label,
  language,
  className = '',
}: {
  children: ReactNode
  onClose: () => void
  label: string
  language: 'es' | 'en'
  className?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    const previous = document.activeElement as HTMLElement | null
    dialog?.showModal()
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = old
      dialog?.close()
      previous?.focus()
    }
  }, [])
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-label={label}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="modal-inner">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label={`${language === 'es' ? 'Cerrar' : 'Close'}: ${label}`}
        >
          ×
        </button>
        {children}
      </div>
    </dialog>
  )
}
