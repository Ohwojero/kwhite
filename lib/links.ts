export type SocialLink = {
  name: string
  handle: string
  href: string
  color: string
  bg: string
}

export const defaultLinks: SocialLink[] = [
  { name: 'WhatsApp',  handle: 'Chat with us',    href: 'https://wa.me/',                color: '#ffffff', bg: '#25D366' },
  { name: 'Telegram',  handle: 'Message us',      href: 'https://t.me/',                 color: '#ffffff', bg: '#2AABEE' },
  { name: 'Zangi',     handle: 'Talk on Zangi',   href: 'https://zangi.com/',            color: '#ffffff', bg: '#7B5EA7' },
  { name: 'Signal',    handle: 'Secure chat',     href: 'https://signal.org/',           color: '#ffffff', bg: '#3A76F0' },
]

const KEY = 'ksocial_links'

export function getLinks(): SocialLink[] {
  if (typeof window === 'undefined') return defaultLinks
  try {
    const stored = localStorage.getItem(KEY)
    return stored ? JSON.parse(stored) : defaultLinks
  } catch {
    return defaultLinks
  }
}

export function saveLinks(links: SocialLink[]): void {
  localStorage.setItem(KEY, JSON.stringify(links))
}
