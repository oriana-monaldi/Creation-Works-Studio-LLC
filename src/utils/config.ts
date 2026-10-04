// Set verified contact details at deployment. No invented business contact details.
export const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || ''
export const socialUrl = import.meta.env.VITE_SOCIAL_URL || ''
export const siteUrl = import.meta.env.VITE_SITE_URL || ''
export const whatsappNumber = '5491158083844'
export const whatsappUrl = (message = '') =>
  `https://wa.me/${whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`
