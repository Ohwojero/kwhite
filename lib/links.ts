export type SocialLink = {
  name: string
  handle: string
  href: string
  color: string
  bg: string
  active: boolean
}

export const defaultLinks: SocialLink[] = [
  { name: 'WhatsApp',  handle: 'Chat with us',  href: 'https://wa.me/67570083806', color: '#ffffff', bg: '#25D366', active: true },
  { name: 'Telegram',  handle: 'Message us',    href: 'https://t.me/Investment_Co_ltd', color: '#ffffff', bg: '#2AABEE', active: true },
  { name: 'Zangi',     handle: 'Talk on Zangi', href: 'https://zangi.me/6745477134', color: '#ffffff', bg: '#7B5EA7', active: true },
  { name: 'Signal',    handle: 'Secure chat',   href: 'https://signal.me/#p/+14245108660', color: '#ffffff', bg: '#3A76F0', active: true },
]

const KEY = 'ksocial_links'

export function getLinks(): SocialLink[] {
  if (typeof window === 'undefined') return defaultLinks
  try {
    const stored = localStorage.getItem(KEY)
    if (!stored) return defaultLinks
    const parsed: SocialLink[] = JSON.parse(stored)
    // merge with defaults to ensure all fields (incl. active) are always present
    return defaultLinks.map((def) => {
      const saved = parsed.find((l) => l.name === def.name)
      const merged = saved ? { ...def, ...saved } : def
      return {
        ...merged,
        handle: def.handle,
      }
    })
  } catch {
    return defaultLinks
  }
}

export function saveLinks(links: SocialLink[]): void {
  localStorage.setItem(KEY, JSON.stringify(links))
}
