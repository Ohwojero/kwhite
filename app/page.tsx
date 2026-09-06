'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Check, ExternalLink, LayoutDashboard, MessageCircle, X } from 'lucide-react'
import { getLinks, type SocialLink } from '@/lib/links'

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
)

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
)

const ZangiIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 6.5h-3.25l-4.5 7H12l-4.5 7h3.25l4.5-7H12l4.5-7z" />
  </svg>
)

const SignalIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path d="M12.001 0a.66.66 0 0 0-.167.022L9.49.69a.66.66 0 0 0-.476.8l.233.87a9.958 9.958 0 0 0-2.808 1.628l-.8-.453a.66.66 0 0 0-.902.242L4.08 5.43a.66.66 0 0 0 .242.901l.793.45A9.944 9.944 0 0 0 4.02 9.49l-.888-.163a.66.66 0 0 0-.768.528l-.43 2.35a.66.66 0 0 0 .527.768l.896.164a9.944 9.944 0 0 0 1.14 2.588l-.634.634a.66.66 0 0 0 0 .933l1.664 1.664a.66.66 0 0 0 .933 0l.622-.622a9.95 9.95 0 0 0 2.64 1.194l-.163.888a.66.66 0 0 0 .527.768l2.35.43a.66.66 0 0 0 .768-.527l.164-.896a9.944 9.944 0 0 0 2.64-1.097l.622.622a.66.66 0 0 0 .933 0l1.664-1.664a.66.66 0 0 0 0-.933l-.622-.622a9.95 9.95 0 0 0 1.097-2.64l.896.163a.66.66 0 0 0 .768-.527l.43-2.35a.66.66 0 0 0-.527-.768l-.888-.163a9.944 9.944 0 0 0-1.097-2.64l.622-.622a.66.66 0 0 0 0-.933L19.52 4.08a.66.66 0 0 0-.933 0l-.622.622A9.95 9.95 0 0 0 15.376 3.6l.163-.888a.66.66 0 0 0-.527-.768L12.662.514A.66.66 0 0 0 12.001 0zm.001 5.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13z" />
  </svg>
)

const platformIcons: Record<string, React.ReactNode> = {
  WhatsApp: <WhatsAppIcon />,
  Telegram: <TelegramIcon />,
  Zangi:    <ZangiIcon />,
  Signal:   <SignalIcon />,
}

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      setSocialLinks(getLinks())
      closeRef.current?.focus()
    }
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 sm:py-8">
        <header className="flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3" aria-label="K Social — home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-sm font-bold text-accent-foreground">K</span>
            <span className="font-sans text-sm font-semibold tracking-[0.18em] text-foreground uppercase">Social</span>
          </a>
          <a
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/70"
          >
            <LayoutDashboard className="size-3.5" aria-hidden="true" />
            Dashboard
          </a>
        </header>

        <section id="top" className="flex flex-1 items-center py-16 sm:py-24">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
            <div>
              <p className="mb-7 flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
                <span className="h-px w-8 bg-accent" aria-hidden="true" />
                Communication made easy
              </p>
              <h1 className="max-w-4xl font-sans text-5xl font-medium leading-[0.98] tracking-[-0.07em] text-balance sm:text-7xl lg:text-[7.2rem]">
                Find us where
                <span className="block text-accent">good stuff happens.</span>
              </h1>
            </div>

            <div className="max-w-sm lg:justify-self-end">
              <p className="mb-6 text-base leading-7 text-muted-foreground sm:text-lg">
                A small corner of the internet for big ideas, honest conversations, and the people who make it all worth following.
              </p>
              <div className="flex items-center gap-3 border-t border-border/70 pt-5 text-xs text-muted-foreground">
                <Check className="size-4 text-accent" aria-hidden="true" />
                <span>Open, friendly, always in motion.</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-border/70 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
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
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-md sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="social-dialog-title"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setIsOpen(false) }}
        >
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300 sm:slide-in-from-bottom-0 sm:zoom-in-95">
            {/* Spinning border wrapper */}
            <div className="relative rounded-3xl p-[3px]" style={{ background: 'conic-gradient(from var(--angle,0deg), #25D366, #2AABEE, #7B5EA7, #3A76F0, #25D366)', animation: 'spin-border 3s linear infinite' }}>
            {/* Card */}
            <div className="overflow-hidden rounded-[22px] border-0 bg-card text-card-foreground shadow-2xl">

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
                    {/* Brand icon */}
                    <span
                      className="flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-sm"
                      style={{ background: bg, color }}
                    >
                      {platformIcons[name] ?? <ExternalLink className="size-5" />}
                    </span>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-tight">{name}</p>
                      <p className="text-xs text-muted-foreground truncate">{handle}</p>
                    </div>

                    {/* Arrow */}
                    <ExternalLink className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </a>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border/60 px-4 py-3">
                <span className="text-[11px] text-muted-foreground">Tap any platform to connect</span>
                <a
                  href="/dashboard"
                  className="flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-[11px] font-medium text-secondary-foreground transition-colors hover:bg-secondary/70"
                >
                  <LayoutDashboard className="size-3" aria-hidden="true" />
                  Dashboard
                </a>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
