'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Check, ExternalLink, MessageCircle, X } from 'lucide-react'

type SocialLink = {
  name: string
  handle: string
  href: string
  color: string
  bg: string
  icon: React.ReactNode
}

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
)

const socialLinks: SocialLink[] = [
  {
    name: 'TikTok',
    handle: '@ksocial',
    href: 'https://www.tiktok.com/',
    color: '#ffffff',
    bg: '#111111',
    icon: <TikTokIcon />,
  },
  {
    name: 'WhatsApp',
    handle: 'Chat with us',
    href: 'https://www.whatsapp.com/',
    color: '#ffffff',
    bg: '#25D366',
    icon: <WhatsAppIcon />,
  },
  {
    name: 'Facebook',
    handle: 'K Social',
    href: 'https://www.facebook.com/',
    color: '#ffffff',
    bg: '#1877F2',
    icon: <FacebookIcon />,
  },
  {
    name: 'Instagram',
    handle: '@ksocial',
    href: 'https://www.instagram.com/',
    color: '#ffffff',
    bg: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
    icon: <InstagramIcon />,
  },
]

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) closeRef.current?.focus()
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
          <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Social studio</span>
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
            <div className="relative rounded-3xl p-[3px]" style={{ background: 'conic-gradient(from var(--angle,0deg), #25D366, #1877F2, #E4405F, #111111, #f09433, #25D366)', animation: 'spin-border 3s linear infinite' }}>
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
                {socialLinks.map(({ name, handle, href, color, bg, icon }) => (
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
                      {icon}
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
              <div className="border-t border-border/60 px-6 py-4 text-center text-[11px] text-muted-foreground">
                Tap any platform to visit our page
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
