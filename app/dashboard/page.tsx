'use client'

import { useEffect, useState, FormEvent } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  Key,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import { getLinks, fetchSocialLinks, saveSocialLinks, defaultLinks, type SocialLink } from '@/lib/links'
import { supabase, signInAdmin, signOutAdmin, getAdminSession } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const platformColors: Record<string, string> = {
  WhatsApp: '#25D366',
  Telegram: '#2AABEE',
  Zangi:    '#7B5EA7',
  Signal:   '#3A76F0',
}

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Auth form state
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authSubmitting, setAuthSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Dashboard content state
  const [links, setLinks] = useState<SocialLink[]>(defaultLinks)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    // Check active Supabase session
    getAdminSession()
      .then((session) => {
        if (!mounted) return
        if (session?.user) {
          setCurrentUser(session.user)
          loadLinks()
        }
        setCheckingAuth(false)
      })
      .catch((err) => {
        console.error('Session check failed:', err)
        if (mounted) setCheckingAuth(false)
      })

    // Listen to Supabase auth state changes
    const { data: authListener } = supabase?.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      if (session?.user) {
        setCurrentUser(session.user)
        loadLinks()
      } else {
        setCurrentUser(null)
      }
    }) ?? { data: null }

    return () => {
      mounted = false
      authListener?.subscription.unsubscribe()
    }
  }, [])

  function loadLinks() {
    setLinks(getLinks())
    fetchSocialLinks()
      .then((data) => {
        setLinks(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load links:', err)
        setLoading(false)
      })
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    if (!emailInput.trim() || !passwordInput.trim()) {
      setAuthError('Please enter both your admin email and password.')
      return
    }

    setAuthSubmitting(true)
    setAuthError(null)

    const { user, error } = await signInAdmin(emailInput.trim(), passwordInput)
    setAuthSubmitting(false)

    if (error) {
      setAuthError(error)
    } else if (user) {
      setCurrentUser(user)
      loadLinks()
    }
  }

  async function handleSignOut() {
    await signOutAdmin()
    setCurrentUser(null)
    setEmailInput('')
    setPasswordInput('')
    setAuthError(null)
  }

  function update(index: number, field: keyof SocialLink, value: string | boolean) {
    setLinks(prev => {
      return prev.map((l, i) => i === index ? { ...l, [field]: value } : l)
    })
    setSaved(false)
    setErrorMessage(null)
  }

  async function handleSave() {
    setSaving(true)
    setErrorMessage(null)
    const res = await saveSocialLinks(links)
    setSaving(false)

    if (res.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3500)
    } else {
      setErrorMessage(res.error || 'Failed to save changes to Supabase.')
    }
  }

  async function handleReset() {
    if (!confirm('Are you sure you want to reset all links to default values?')) return
    setLinks(defaultLinks)
    setSaving(true)
    setErrorMessage(null)
    const res = await saveSocialLinks(defaultLinks)
    setSaving(false)

    if (res.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3500)
    } else {
      setErrorMessage(res.error || 'Failed to reset on Supabase.')
    }
  }

  // 1. Not logged in: Show dedicated Admin Login page
  if (!currentUser) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-accent/10 blur-[100px]" />
        </div>

        <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
          <div className="overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-2xl sm:p-8">
            {/* Header */}
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-2xl border border-accent/40 bg-accent/15 text-accent shadow-sm">
                <Lock className="size-6" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Admin Sign In</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Enter your admin credentials to access the dashboard.
              </p>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-border bg-background py-2.5 pr-3 pl-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <Key className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-border bg-background py-2.5 pr-10 pl-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-all hover:brightness-110 disabled:opacity-50"
              >
                {authSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock className="size-4" />
                    Sign In to Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Back link */}
            <div className="mt-6 flex items-center justify-center border-t border-border/60 pt-4 text-xs text-muted-foreground">
              <Link
                href="/"
                className="flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                Return to home page
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // 3. Logged in: Render the Full Admin Dashboard
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8">
        <header className="mb-8 rounded-2xl border border-border/70 bg-card/80 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-2.5" aria-label="chathandles home">
                <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-full border border-accent/60 bg-accent text-sm font-bold text-accent-foreground shadow-[0_0_0_1px_rgba(236,240,241,0.18)]">
                  <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)]" aria-hidden="true" />
                  <span className="relative">C</span>
                </span>
                <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-foreground uppercase sm:text-xs">chathandles</span>
              </a>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-border/60 bg-secondary/60 px-2.5 py-1 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-accent" />
                <span className="max-w-[160px] truncate">{currentUser.email}</span>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex size-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/70 hover:text-red-400"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="size-4" />
              </button>
              <Link
                href="/"
                className="flex size-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/70"
                aria-label="Back to home"
              >
                <ArrowLeft className="size-4" />
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Title & Actions */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight">Admin Dashboard</h1>
              {loading && (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Loader2 className="size-3 animate-spin" /> Syncing...
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Manage your live social links (persisted in Supabase)</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 py-2 text-xs text-secondary-foreground transition-colors hover:bg-secondary/70 disabled:opacity-50"
            >
              <RotateCcw className="size-3" />
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground transition-all hover:brightness-110 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : saved ? (
                <CheckCircle2 className="size-3.5" />
              ) : (
                <Save className="size-3.5" />
              )}
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save changes'}
            </button>
          </div>
        </div>

        {/* Saved banner */}
        {saved && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            <CheckCircle2 className="size-4 shrink-0" />
            Changes saved to database — your social links are updated for all visitors!
          </div>
        )}

        {/* Error banner */}
        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="size-4 shrink-0" />
              Could not update database
            </div>
            <p className="mt-1 text-xs opacity-90">{errorMessage}</p>
          </div>
        )}

        {/* Cards */}
        <div className="grid gap-4">
          {links.map((link, i) => (
            <div
              key={link.id || link.name}
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

              {/* Fields */}
              <div className={`grid gap-3 p-4 sm:grid-cols-2 transition-opacity ${
                link.active ? 'opacity-100' : 'opacity-40 pointer-events-none'
              }`}>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    URL / Link (e.g. WhatsApp Link or Number)
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
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <Save className="size-4" />
            )}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save changes'}
          </button>
        </div>
      </div>
    </main>
  )
}
