import { supabase, isSupabaseConfigured } from './supabase'

export type SocialLink = {
  id?: string
  name: string
  handle: string
  href: string
  color: string
  bg: string
  active: boolean
  sort_order?: number
}

export const defaultLinks: SocialLink[] = [
  { id: 'whatsapp', name: 'WhatsApp',  handle: 'Chat with us',  href: 'https://wa.me/67570083806', color: '#ffffff', bg: '#25D366', active: true, sort_order: 1 },
  { id: 'telegram', name: 'Telegram',  handle: 'Message us',    href: 'https://t.me/Investment_Co_ltd', color: '#ffffff', bg: '#2AABEE', active: true, sort_order: 2 },
  { id: 'zangi',    name: 'Zangi',     handle: 'Talk on Zangi', href: 'https://zangi.me/6745477134', color: '#ffffff', bg: '#7B5EA7', active: true, sort_order: 3 },
  { id: 'signal',   name: 'Signal',    handle: 'Secure chat',   href: 'https://signal.me/#p/+14245108660', color: '#ffffff', bg: '#3A76F0', active: true, sort_order: 4 },
]

const KEY = 'ksocial_links'

function formatWhatsAppLink(val: string): string {
  if (!val) return val
  const trimmed = val.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  // Strip spaces, dashes, parentheses, plus
  const digits = trimmed.replace(/[^0-9]/g, '')
  return digits ? `https://wa.me/${digits}` : trimmed
}

export function getLinks(): SocialLink[] {
  if (typeof window === 'undefined') return defaultLinks
  try {
    const stored = localStorage.getItem(KEY)
    if (!stored) return defaultLinks
    const parsed: SocialLink[] = JSON.parse(stored)
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultLinks

    return defaultLinks.map((def) => {
      const saved = parsed.find((l) => {
        const lId = String(l.id || '').toLowerCase().trim()
        const defId = String(def.id || '').toLowerCase().trim()
        const lName = String(l.name || '').toLowerCase().trim()
        const defName = String(def.name || '').toLowerCase().trim()
        return (lId && (lId === defId || lId === defName)) || (lName && lName === defName)
      })
      if (saved) {
        let href = saved.href || def.href
        if (def.name.toLowerCase() === 'whatsapp') {
          href = formatWhatsAppLink(href)
        }
        return {
          ...def,
          ...saved,
          href,
        }
      }
      return def
    })
  } catch {
    return defaultLinks
  }
}

export function saveLinks(links: SocialLink[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(links))
  } catch (err) {
    console.warn('Failed to save to localStorage:', err)
  }
}

export async function fetchSocialLinks(): Promise<SocialLink[]> {
  if (!supabase || !isSupabaseConfigured) {
    return getLinks()
  }

  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.warn('[Supabase fetch notice]:', error.message, error.details || '')
      return getLinks()
    }

    if (!data || data.length === 0) {
      console.warn('[Supabase notice]: Table social_links returned 0 rows. Using default links.')
      return getLinks()
    }

    console.log('[Supabase social_links loaded from DB]:', data)

    // Map and merge remote data with default metadata
    const mergedLinks = defaultLinks.map((def) => {
      const remote = data.find((row) => {
        const rowId = String(row.id || '').toLowerCase().trim()
        const defId = String(def.id || '').toLowerCase().trim()
        const rowName = String(row.name || '').toLowerCase().trim()
        const defName = String(def.name || '').toLowerCase().trim()
        return (rowId && (rowId === defId || rowId === defName)) || (rowName && rowName === defName)
      })

      if (remote) {
        let href = remote.href || remote.url || remote.link || remote.phone || remote.number || def.href
        if (def.name.toLowerCase() === 'whatsapp') {
          href = formatWhatsAppLink(href)
        }

        return {
          id: remote.id || def.id,
          name: remote.name || def.name,
          handle: remote.handle ?? def.handle,
          href,
          color: remote.color || def.color,
          bg: remote.bg || def.bg,
          active: typeof remote.active === 'boolean' ? remote.active : def.active,
          sort_order: remote.sort_order ?? def.sort_order,
        }
      }
      return def
    })

    // Also include any extra platforms added in Supabase
    data.forEach((row) => {
      const exists = mergedLinks.some((m) => {
        const mId = String(m.id || '').toLowerCase().trim()
        const rId = String(row.id || '').toLowerCase().trim()
        const mName = String(m.name || '').toLowerCase().trim()
        const rName = String(row.name || '').toLowerCase().trim()
        return (mId && mId === rId) || (mName && mName === rName)
      })

      if (!exists && row.name) {
        let href = row.href || row.url || row.link || ''
        if (String(row.name).toLowerCase() === 'whatsapp') {
          href = formatWhatsAppLink(href)
        }
        mergedLinks.push({
          id: row.id || row.name.toLowerCase().replace(/\s+/g, '-'),
          name: row.name,
          handle: row.handle || 'Contact us',
          href,
          color: row.color || '#ffffff',
          bg: row.bg || '#334155',
          active: typeof row.active === 'boolean' ? row.active : true,
          sort_order: row.sort_order ?? 99,
        })
      }
    })

    saveLinks(mergedLinks)
    return mergedLinks
  } catch (err) {
    console.error('Error fetching social links from Supabase:', err)
    return getLinks()
  }
}

export async function saveSocialLinks(links: SocialLink[]): Promise<{ success: boolean; error?: string }> {
  // Format WhatsApp numbers if user entered raw numbers
  const formattedLinks = links.map((l) => {
    if (l.name.toLowerCase() === 'whatsapp') {
      return { ...l, href: formatWhatsAppLink(l.href) }
    }
    return l
  })

  saveLinks(formattedLinks)

  if (!supabase || !isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase is not configured. Saved to browser storage only.',
    }
  }

  try {
    const rows = formattedLinks.map((link, index) => ({
      id: link.id || link.name.toLowerCase().replace(/\s+/g, '-'),
      name: link.name,
      handle: link.handle,
      href: link.href,
      color: link.color,
      bg: link.bg,
      active: link.active,
      sort_order: link.sort_order ?? index + 1,
      updated_at: new Date().toISOString(),
    }))

    const { error } = await supabase
      .from('social_links')
      .upsert(rows, { onConflict: 'id' })

    if (error) {
      console.error('Supabase save error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Supabase save error:', err)
    return { success: false, error: err?.message || 'Failed to save to Supabase' }
  }
}
