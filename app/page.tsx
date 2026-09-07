'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Check, ExternalLink, MessageCircle, X } from 'lucide-react'
import { getLinks, type SocialLink } from '@/lib/links'

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
)

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
)

const ZangiIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 6.5h-3.25l-4.5 7H12l-4.5 7h3.25l4.5-7H12l4.5-7z" />
  </svg>
)

const platformIcons: Record<string, React.ReactNode> = {
  WhatsApp: <WhatsAppIcon />,
  Telegram: <TelegramIcon />,
  Zangi:    <ZangiIcon />,
  Signal:   <Image src="/images.png" alt="Signal" width={18} height={18} className="object-contain" />,
}

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [showInstallHint, setShowInstallHint] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      setSocialLinks(getLinks())
      closeRef.current?.focus()
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event)
    }

    const handleAppInstalled = () => {
      setInstallPrompt(null)
      setShowInstallHint(false)
    }

    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      if (outcome === 'accepted') {
        setInstallPrompt(null)
      }
      return
    }

    setShowInstallHint(true)
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 sm:py-8">
        <header className="flex items-center justify-between gap-3">
          <a href="#top" className="flex items-center gap-3" aria-label="K Social — home">
            <span className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">K</span>
            <span className="font-sans text-sm font-semibold tracking-[0.18em] text-foreground uppercase">Social</span>
          </a>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleInstallClick}
              className="relative hidden overflow-hidden rounded-xl border border-accent/60 bg-accent/12 px-3 py-2 text-xs font-semibold text-accent shadow-[0_0_0_1px_rgba(236,240,241,0.18),0_0_22px_rgba(236,240,241,0.18)] transition-all duration-300 hover:scale-[1.02] hover:bg-accent/18 sm:inline-flex"
            >
              <span className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,rgba(236,240,241,0.18),transparent_60%)]" aria-hidden="true" />
              <span className="absolute -inset-[1px] rounded-xl border border-accent/40 animate-pulse" aria-hidden="true" />
              <span className="relative">Install now</span>
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 px-3 py-2 text-xs font-medium text-[#25D366]">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#25D366] opacity-75" />
                <span className="relative flex size-2 rounded-full bg-[#25D366]" />
              </span>
              Active 24/7
            </div>
          </div>
        </header>

        <section id="top" className="flex flex-1 items-center py-10 sm:py-24">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
            <div>
              <p className="mb-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
                <span className="h-px w-8 bg-accent" aria-hidden="true" />
                Communication made easy
              </p>

              {/* Person + platform icons illustration */}
              <div className="mb-10 flex justify-center pl-0 sm:justify-start sm:pl-6" aria-hidden="true">
                <div className="relative inline-block">
                  {/* Person SVG */}
                  <svg width="110" height="110" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="24" r="11" fill="#ecf0f1" opacity="0.9"/>
                    <path d="M20 66c0-11.046 8.954-20 20-20s20 8.954 20 20" stroke="#ecf0f1" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
                    <rect x="31" y="42" width="18" height="26" rx="3" fill="#34495e" stroke="#ecf0f1" strokeWidth="1.5" opacity="0.95"/>
                    <rect x="33" y="45" width="14" height="18" rx="1.5" fill="#2AABEE" opacity="0.8"/>
                    <circle cx="40" cy="66" r="1.5" fill="#ecf0f1" opacity="0.6"/>
                    <line x1="49" y1="22" x2="62" y2="12" stroke="#ecf0f1" strokeWidth="1" strokeDasharray="2 2" opacity="0.25"/>
                    <line x1="31" y1="28" x2="18" y2="20" stroke="#ecf0f1" strokeWidth="1" strokeDasharray="2 2" opacity="0.25"/>
                    <line x1="50" y1="36" x2="63" y2="44" stroke="#ecf0f1" strokeWidth="1" strokeDasharray="2 2" opacity="0.25"/>
                    <line x1="30" y1="40" x2="15" y2="48" stroke="#ecf0f1" strokeWidth="1" strokeDasharray="2 2" opacity="0.25"/>
                  </svg>

                  {/* WhatsApp — top right */}
                  <span className="icon-vibrate absolute -top-4 -right-6 flex size-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg" style={{ animationDelay: '0s' }}>
                    <span className="icon-ring-pulse absolute inset-0 rounded-full bg-[#25D366]" style={{ animationDelay: '0s' }} />
                    <WhatsAppIcon />
                  </span>
                  {/* Telegram — top left */}
                  <span className="icon-vibrate absolute -top-3 -left-7 flex size-10 items-center justify-center rounded-full bg-[#2AABEE] text-white shadow-lg" style={{ animationDelay: '0.6s' }}>
                    <span className="icon-ring-pulse absolute inset-0 rounded-full bg-[#2AABEE]" style={{ animationDelay: '0.6s' }} />
                    <TelegramIcon />
                  </span>
                  {/* Zangi — bottom right */}
                  <span className="icon-vibrate absolute -bottom-4 -right-7 flex size-10 items-center justify-center rounded-full bg-[#7B5EA7] text-white shadow-lg" style={{ animationDelay: '1.2s' }}>
                    <span className="icon-ring-pulse absolute inset-0 rounded-full bg-[#7B5EA7]" style={{ animationDelay: '1.2s' }} />
                    <ZangiIcon />
                  </span>
                  {/* Signal — bottom left */}
                  <span className="icon-vibrate absolute -bottom-4 -left-6 flex size-11 items-center justify-center rounded-full bg-[#3A76F0] shadow-lg overflow-hidden" style={{ animationDelay: '1.8s' }}>
                    <span className="icon-ring-pulse absolute inset-0 rounded-full bg-[#3A76F0]" style={{ animationDelay: '1.8s' }} />
                    <Image src="/images.png" alt="Signal" width={24} height={24} className="object-contain relative z-10" />
                  </span>

                  {/* Pulse ring */}
                  <span className="absolute -inset-4 rounded-full border border-accent/15 animate-ping" style={{ animationDuration: '3s' }} />
                </div>
              </div>

              <h1 className="max-w-4xl font-sans text-4xl font-medium leading-[0.98] tracking-[-0.07em] text-balance sm:text-7xl lg:text-[7.2rem]">
                Find us where
                <span className="block text-accent">good stuff happens.</span>
              </h1>
            </div>

            <div className="max-w-sm lg:justify-self-end">
              <p className="mb-6 text-base leading-7 text-muted-foreground sm:text-lg">
                A small corner of the internet for big ideas, honest conversations, and the people who make it all worth following.
              </p>
              <div className="flex flex-col gap-3 border-t border-border/70 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <Check className="size-4 text-accent" aria-hidden="true" />
                  <span>Open, friendly, always in motion.</span>
                </div>
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="relative inline-flex items-center justify-center overflow-hidden rounded-lg border border-accent/60 bg-accent/12 px-3 py-2 text-[11px] font-semibold text-accent shadow-[0_0_0_1px_rgba(236,240,241,0.18),0_0_16px_rgba(236,240,241,0.18)] transition-all duration-300 hover:scale-[1.02] hover:bg-accent/18"
                >
                  <span className="absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_center,rgba(236,240,241,0.18),transparent_60%)]" aria-hidden="true" />
                  <span className="absolute -inset-[1px] rounded-lg border border-accent/40 animate-pulse" aria-hidden="true" />
                  <span className="relative">Install now</span>
                </button>
              </div>
              {showInstallHint && (
                <p className="mt-3 text-[11px] text-muted-foreground">
                  Open your browser menu and choose “Add to Home Screen” to install this app.
                </p>
              )}
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-border/70 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} K Social</span>
          <span>Follow the conversation</span>
        </footer>
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group fixed right-4 bottom-4 z-40 flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-xl shadow-black/30 transition-all hover:scale-110 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:right-6 sm:bottom-6"
        aria-label="Open social links"
        aria-haspopup="dialog"
        aria-expanded={isOpen || undefined}
      >
        <MessageCircle className="size-6 transition-transform group-hover:-rotate-12" aria-hidden="true" />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#25D366] opacity-75" />
            <span className="relative flex size-3 rounded-full bg-[#25D366]" />
          </span>
        )}
        <span className="sr-only">Open social links</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-md sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="social-dialog-title"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setIsOpen(false) }}
        >
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300 sm:slide-in-from-bottom-0 sm:zoom-in-95">
            {/* Spinning border wrapper */}
            <div className="relative rounded-3xl p-[3px]" style={{ background: 'conic-gradient(from var(--angle,0deg), #25D366, #2AABEE, #7B5EA7, #3A76F0, #25D366)', animation: 'spin-border 3s linear infinite' }}>
              {/* Card */}
              <div className="overflow-hidden rounded-[22px] bg-card text-card-foreground shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <Image src="/icon.svg" alt="K Social" width={38} height={38} className="rounded-xl" />
                    <div>
                      <h2 id="social-dialog-title" className="text-base font-semibold tracking-tight">K Social</h2>
                      <p className="text-xs text-muted-foreground">Find us on your favourite platform</p>
                    </div>
                  </div>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex size-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Close"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Links */}
                <div className="grid gap-2 p-4">
                  {socialLinks.filter(l => l.active).map(({ name, handle, href, color, bg }) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-background/30 p-3.5 transition-all hover:border-border hover:bg-background/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span
                        className="flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-sm"
                        style={{ background: bg, color }}
                      >
                        {platformIcons[name] ?? <ExternalLink className="size-5" />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-tight">{name}</p>
                        <p className="text-xs text-muted-foreground truncate">{handle}</p>
                      </div>
                      <ExternalLink className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </a>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-border/60 px-6 py-4 text-center text-[11px] text-muted-foreground">
                  Tap any platform to connect
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
