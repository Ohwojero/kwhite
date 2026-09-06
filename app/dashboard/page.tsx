'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, RotateCcw, CheckCircle2 } from 'lucide-react'
import { getLinks, saveLinks, defaultLinks, type SocialLink } from '@/lib/links'

const platformColors: Record<string, string> = {
  WhatsApp: '#25D366',
  Telegram: '#2AABEE',
  Zangi:    '#7B5EA7',
  Signal:   '#3A76F0',
}

export default function Dashboard() {
  const router = useRouter()
  const [links, setLinks] = useState<SocialLink[]>(defaultLinks)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setLinks(getLinks())
  }, [])

  function update(index: number, field: keyof SocialLink, value: string | boolean) {
    setLinks(prev => {
      const updated = prev.map((l, i) => i === index ? { ...l, [field]: value } : l)
      saveLinks(updated)
      return updated
    })
    setSaved(false)
  }

  function handleSave() {
    saveLinks(links)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function handleReset() {
    setLinks(defaultLinks)
    saveLinks(defaultLinks)
    setSaved(false)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex size-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/70"
              aria-label="Back to home"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage your social links</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 py-2 text-xs text-secondary-foreground transition-colors hover:bg-secondary/70"
            >
              <RotateCcw className="size-3" />
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground transition-all hover:brightness-110"
            >
              {saved ? <CheckCircle2 className="size-3.5" /> : <Save className="size-3.5" />}
              {saved ? 'Saved!' : 'Save changes'}
            </button>
          </div>
        </div>

        {/* Saved banner */}
        {saved && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            <CheckCircle2 className="size-4 shrink-0" />
            Changes saved — your social links have been updated.
          </div>
        )}

        {/* Cards */}
        <div className="grid gap-4">
          {links.map((link, i) => (
            <div
              key={link.name}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              {/* Platform label bar */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ background: platformColors[link.name] ?? '#334155' }}
              >
                <span className="text-xs font-bold uppercase tracking-widest text-white">{link.name}</span>
                <button
                  type="button"
                  onClick={() => update(i, 'active', !link.active)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    link.active ? 'bg-white/30' : 'bg-black/30'
                  }`}
                  aria-label={link.active ? `Deactivate ${link.name}` : `Activate ${link.name}`}
                  role="switch"
                  aria-checked={link.active}
                >
                  <span className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${
                    link.active ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Fields — hidden when inactive */}
              <div className={`grid gap-3 p-4 sm:grid-cols-2 transition-opacity ${
                link.active ? 'opacity-100' : 'opacity-40 pointer-events-none'
              }`}>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    URL / Link
                  </label>
                  <input
                    type="url"
                    value={link.href}
                    onChange={e => update(i, 'href', e.target.value)}
                    placeholder="https://"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Display name
                  </label>
                  <input
                    type="text"
                    value={link.name}
                    onChange={e => update(i, 'name', e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Handle / Tagline
                  </label>
                  <input
                    type="text"
                    value={link.handle}
                    onChange={e => update(i, 'handle', e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom save */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110"
          >
            {saved ? <CheckCircle2 className="size-4" /> : <Save className="size-4" />}
            {saved ? 'All changes saved!' : 'Save changes'}
          </button>
        </div>
      </div>
    </main>
  )
}
