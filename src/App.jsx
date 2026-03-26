import { useEffect, useMemo, useState } from 'react'

const GITHUB_USERNAME = 'Kushal298'
const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`
const GITHUB_AVATAR_URL = `https://github.com/${GITHUB_USERNAME}.png?size=200`
const DISPLAY_NAME = 'Kushal Bhatta'

// Optional: if GitHub does not expose your email, you can paste it here.
const EMAIL_FALLBACK = ''

// TODO: Replace `/resume.pdf` with your real resume URL/path once you provide the PDF.
const RESUME_URL = '/resume.pdf'

const PROJECTS = [
  {
    name: 'weather-app',
    description: 'A simple weather app UI built with frontend basics.',
    url: `https://github.com/${GITHUB_USERNAME}/weather-app`,
    tags: ['JavaScript', 'UI'],
  },
  {
    name: 'TODO-REACT-APP',
    description: 'A clean React TODO app (add, complete, and manage tasks).',
    url: `https://github.com/${GITHUB_USERNAME}/TODO-REACT-APP`,
    tags: ['React', 'JavaScript'],
  },
]

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [showTop, setShowTop] = useState(false)

  // Toast-like feedback without extra libraries.
  const [toast, setToast] = useState('')

  // Contact form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [contactError, setContactError] = useState('')
  const [contactStatus, setContactStatus] = useState('')

  const [toEmail, setToEmail] = useState(EMAIL_FALLBACK)
  const hasEmail = toEmail.trim().length > 0

  const skills = useMemo(
    () => ['React', 'JavaScript', 'Tailwind CSS', 'HTML', 'CSS'],
    [],
  )

  useEffect(() => {
    let cancelled = false

    // Try to fetch public email from GitHub so buttons work without editing the code.
    // (If your email is private/unavailable, we simply keep the fallback.)
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: {
        Accept: 'application/vnd.github+json',
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (typeof data?.email === 'string' && data.email.trim().length > 0) {
          setToEmail(data.email)
        }
      })
      .catch(() => {
        // Ignore: copy/contact will fall back to a no-recipient mailto.
      })

    const ids = ['home', 'about', 'projects', 'contact']

    const onScroll = () => {
      const y = window.scrollY || 0
      setShowTop(y > 600)

      const offsets = ids
        .map((id) => {
          const el = document.getElementById(id)
          if (!el) return null
          const top = el.getBoundingClientRect().top + window.scrollY
          return { id, top }
        })
        .filter(Boolean)

      // Pick the last section whose top is above the viewport threshold.
      const current =
        offsets
          .sort((a, b) => a.top - b.top)
          .filter((o) => o.top <= y + 140)
          .at(-1)?.id || 'home'
      setActiveSection(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelled = true
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(t)
  }, [toast])

  const copyEmail = async () => {
    if (!hasEmail) {
      setToast('GitHub email not available. Add EMAIL_FALLBACK in src/App.jsx.')
      return
    }
    try {
      await navigator.clipboard.writeText(toEmail)
      setToast('Email copied!')
    } catch {
      setToast('Could not copy email. Try selecting it manually.')
    }
  }

  const openResume = () => {
    window.open(RESUME_URL, '_blank', 'noopener,noreferrer')
  }

  const submitContact = (e) => {
    e.preventDefault()
    setContactError('')
    setContactStatus('')

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()

    if (trimmedName.length < 2) {
      setContactError('Please enter your name (at least 2 characters).')
      return
    }

    // Basic email format check.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setContactError('Please enter a valid email address.')
      return
    }

    if (trimmedMessage.length < 10) {
      setContactError('Message should be at least 10 characters.')
      return
    }

    const subject = `Portfolio contact: ${trimmedName}`
    const body = `Name: ${trimmedName}\nEmail: ${trimmedEmail}\n\nMessage:\n${trimmedMessage}\n`
    const recipient = hasEmail ? encodeURIComponent(toEmail) : ''
    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`

    // Opening a mail client is the "functional" action (no backend needed).
    window.location.href = mailto
    setContactStatus('Opening your email app...')

    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <a
        href="#projects"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-sky-50 focus:px-3 focus:py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
      >
        Skip to projects
      </a>

      <header className="sticky top-0 z-40 border-b border-sky-100/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 overflow-hidden rounded-xl bg-sky-50 ring-1 ring-sky-200/70">
              <img
                src={GITHUB_AVATAR_URL}
                alt="GitHub logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">
                {DISPLAY_NAME}
              </div>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-1">
            {[
              ['home', 'Home'],
              ['about', 'About'],
              ['projects', 'Projects'],
              ['contact', 'Contact'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToId(id)}
                className={classNames(
                  'rounded-lg px-3 py-2 text-sm transition',
                  activeSection === id
                    ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-200'
                    : 'text-slate-700 hover:bg-sky-50 hover:text-sky-700',
                )}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={openResume}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              Resume
            </button>
          </nav>

          <div className="flex items-center gap-2 sm:hidden">
            <button
              type="button"
              className="rounded-xl border border-sky-100 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-sky-50"
              onClick={() => scrollToId('projects')}
            >
              Explore
            </button>
            <button
              type="button"
              className="rounded-xl border border-sky-100 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
              onClick={openResume}
            >
              Resume
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-16">
        <section id="about" className="pt-10">
          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">About</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              I build minimal, user-friendly interfaces with React and modern frontend
              fundamentals. Right now I’m focused on improving UI structure, component
              design, and clean interaction flows.
            </p>

            <div className="mt-4">
              <div className="text-sm font-semibold text-slate-900">Skills</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-sky-50 px-3 py-1 text-sm text-sky-700 ring-1 ring-sky-200/70"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => scrollToId('projects')}
                className="rounded-xl bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 ring-1 ring-sky-200/70 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                See Projects
              </button>
            </div>
          </div>
        </section>

        <section id="home" className="mt-10">
          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center gap-3">
              <div>
                <p className="mt-2 text-base text-slate-600">
                  Aspiring frontend developer focused on clean, minimal UI.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  Copy Email
                </button>

                <button
                  type="button"
                  onClick={() => window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')}
                  className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  View GitHub
                </button>

                <button
                  type="button"
                  onClick={openResume}
                  className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  Download Resume
                </button>
              </div>

              {toast ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-1 rounded-xl bg-sky-50 px-4 py-2 text-sm text-sky-800 ring-1 ring-sky-200"
                >
                  {toast}
                </div>
              ) : (
                <div className="text-xs text-slate-500">Tailwind + React</div>
              )}
            </div>
          </div>
        </section>

        <section id="projects" className="mt-10">
          <div className="rounded-2xl border border-sky-100 bg-white p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Projects</h2>
              </div>
              <button
                type="button"
                onClick={() => window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')}
                className="hidden sm:inline-flex rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                All on GitHub
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {PROJECTS.map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-2xl border border-sky-100 bg-white p-5 hover:border-sky-200 hover:bg-sky-50 transition focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold text-slate-900">{p.name}</div>
                      <div className="mt-2 text-sm text-slate-600 leading-relaxed">
                        {p.description}
                      </div>
                    </div>
                    <div className="rounded-xl bg-sky-50 px-3 py-2 text-sm text-sky-700 ring-1 ring-sky-200/70">
                      Open
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-white px-3 py-1 text-xs text-slate-600 ring-1 ring-slate-200/60 group-hover:ring-sky-200/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mt-10">
          <div className="rounded-2xl border border-sky-100 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
            <p className="mt-2 text-slate-600">
              Send a message using your email app.
            </p>

            <form onSubmit={submitContact} className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="block text-sm font-semibold text-slate-900" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-sky-100 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-sky-200 focus:ring-2 focus:ring-sky-200"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-sm font-semibold text-slate-900" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-sky-100 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-sky-200 focus:ring-2 focus:ring-sky-200"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  className="block text-sm font-semibold text-slate-900"
                  htmlFor="message"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-2 min-h-28 w-full resize-y rounded-xl border border-sky-100 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-sky-200 focus:ring-2 focus:ring-sky-200"
                  placeholder="Write a short message..."
                />
              </div>

              {contactError ? (
                <div
                  role="alert"
                  className="sm:col-span-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200"
                >
                  {contactError}
                </div>
              ) : null}

              {contactStatus ? (
                <div className="sm:col-span-2 rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-800 ring-1 ring-sky-200">
                  {contactStatus}
                </div>
              ) : null}

              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setName('')
                    setEmail('')
                    setMessage('')
                    setContactError('')
                    setContactStatus('')
                    setToast('')
                  }}
                  className="rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </section>

        <footer className="mt-10 border-t border-sky-100 pt-6 text-center text-sm text-slate-500">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <div>© {new Date().getFullYear()} Kushal Bhatta</div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')}
                className="rounded-xl border border-sky-200 bg-white px-3 py-1.5 text-sm font-semibold text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                GitHub
              </button>
              <button
                type="button"
                onClick={() => scrollToId('home')}
                className="rounded-xl border border-sky-200 bg-white px-3 py-1.5 text-sm font-semibold text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                Top
              </button>
            </div>
          </div>
        </footer>
      </main>

      {showTop ? (
        <button
          type="button"
          onClick={() => scrollToId('home')}
          className="fixed bottom-6 right-6 z-50 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
        >
          Back to top
        </button>
      ) : null}
    </div>
  )
}

