'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLang } from '@/components/LangProvider'
import { useTheme } from '@/components/ThemeProvider'

// ── Copy ─────────────────────────────────────────────────────────────────────

const copy = {
  fr: {
    nav: { cta: 'Commencer gratuitement', login: 'Se connecter' },
    hero: {
      badge: 'Outil post-workshop',
      title: 'Structurez votre tokenomics,\nétape par étape.',
      subtitle: 'Tokenlab guide les fondateurs Web3 de la décision d\'émettre un token jusqu\'à la stratégie TGE — avec un Coach IA qui connaît votre projet.',
      cta: 'Créer mon premier projet',
      sub: 'Gratuit · Aucune carte requise',
    },
    modules: {
      title: '9 modules. Un protocole complet.',
      subtitle: 'Chaque module couvre une dimension critique de votre tokenomics.',
      items: [
        { icon: '⬡', label: 'Token Decision Tree', desc: 'Avez-vous vraiment besoin d\'un token ?' },
        { icon: '◈', label: 'Topology & Utility', desc: 'Type, standard technique, utilité réelle' },
        { icon: '◎', label: 'Agents & Policies', desc: 'Qui interagit, quelles règles ?' },
        { icon: '⇄', label: 'Value Flow', desc: 'Sources et destructions de tokens' },
        { icon: '△', label: 'Supply & Emission', desc: 'Supply totale, modèle d\'émission' },
        { icon: '⊞', label: 'Distribution', desc: 'Allocation par catégorie' },
        { icon: '⏱', label: 'Vesting', desc: 'Calendrier de déblocage' },
        { icon: '◈', label: 'TGE & Liquidity', desc: 'Lancement, DEX, market makers' },
        { icon: '⚖', label: 'Compliance', desc: 'MiCA, SEC, VARA' },
      ],
    },
    features: {
      title: 'Tout ce dont vous avez besoin après le workshop.',
      items: [
        { icon: '✦', title: 'Coach IA context-aware', desc: 'Le Coach connaît votre projet complet. Posez vos questions, obtenez des réponses précises — pas du contenu générique.' },
        { icon: '◉', title: 'Score de cohérence', desc: 'Un health score calculé en temps réel détecte les incohérences dans votre modèle avant qu\'elles deviennent des problèmes.' },
        { icon: '⬡', title: 'Value Flow interactif', desc: 'Visualisez vos flux tokenomiques en SVG interactif. Sinks, faucets, agents — tout sur un seul écran.' },
        { icon: '↓', title: 'Export PDF complet', desc: 'Générez un rapport tokenomics complet prêt à partager avec vos investisseurs ou votre équipe.' },
      ],
    },
    testimonials: {
      title: 'Ils ont structuré leur tokenomics avec Tokenlab.',
      items: [
        {
          quote: 'Après le workshop, j\'avais des notes éparses. Tokenlab m\'a forcé à formaliser chaque décision. Le Coach IA a repéré deux incohérences majeures dans mon modèle d\'émission.',
          name: 'Marc L.',
          role: 'Fondateur, DeFi Protocol · XRPL',
        },
        {
          quote: 'Le Value Flow diagram m\'a permis de présenter notre tokenomics à des investisseurs sans slides. En 10 minutes, ils avaient compris la mécanique complète.',
          name: 'Sarah K.',
          role: 'Co-fondatrice, RWA Platform · Ethereum',
        },
        {
          quote: 'On avait 3 semaines avant notre TGE. Tokenlab nous a aidé à identifier que notre vesting créait une pression vendeuse catastrophique au mois 6. On a revu tout ça à temps.',
          name: 'Thomas R.',
          role: 'CTO, GameFi Studio · Solana',
        },
      ],
    },
    pricing: {
      title: 'Simple. Transparent.',
      subtitle: 'Commencez gratuitement, passez au coaching quand vous en avez besoin.',
      plans: [
        {
          name: 'Free',
          price: '0€',
          period: '',
          desc: 'Pour structurer votre tokenomics en autonomie.',
          features: [
            'Projets illimités',
            '9 modules tokenomics',
            'Coach IA (10 messages/jour)',
            'Export PDF',
            'Value Flow diagram',
            'Score de cohérence',
          ],
          cta: 'Commencer gratuitement',
          href: '/projects/new',
          highlight: false,
        },
        {
          name: 'Coaching',
          price: '290€',
          period: '/ session',
          desc: 'Une session 1:1 avec un expert tokenomics pour aller plus loin.',
          features: [
            'Tout Free inclus',
            'Session 90 min avec un expert',
            'Revue complète de votre modèle',
            'Recommandations personnalisées',
            'Compte-rendu écrit',
            'Suivi 30 jours par email',
          ],
          cta: 'Réserver une session',
          href: 'mailto:hello@tokenlabapp.com',
          highlight: true,
        },
      ],
    },
    faq: {
      title: 'Questions fréquentes',
      items: [
        {
          q: 'Tokenlab remplace-t-il un expert tokenomics ?',
          a: 'Non — Tokenlab est un outil de structuration. Il vous guide à travers les bonnes questions et détecte les incohérences. Pour des décisions critiques (TGE, levée), une session de coaching avec un expert reste recommandée.',
        },
        {
          q: 'Mes données sont-elles sécurisées ?',
          a: 'En mode gratuit, vos projets sont stockés localement dans votre navigateur. Avec un compte, ils sont sauvegardés sur Supabase avec authentification et RLS (Row Level Security) — seul vous pouvez accéder à vos projets.',
        },
        {
          q: 'Le Coach IA utilise quel modèle ?',
          a: 'Claude Sonnet (Anthropic). Le Coach reçoit le contexte complet de votre projet à chaque message — il ne répond pas dans le vide, il connaît votre supply, vos agents, votre vesting.',
        },
        {
          q: 'Puis-je utiliser Tokenlab sans avoir fait un workshop ?',
          a: 'Oui. Les modules sont auto-suffisants. Si vous débutez, commencez par le Token Decision Tree (Étape 1) — il vous aide à déterminer si vous avez vraiment besoin d\'un token.',
        },
        {
          q: 'Comment fonctionne le plan Free ?',
          a: 'Projets illimités, tous les modules, export PDF et Coach IA (10 messages/jour). Aucune carte de crédit requise. Le plan Free restera gratuit.',
        },
      ],
    },
    footer: {
      tagline: 'Tokenomics structurées pour les fondateurs Web3.',
      links: [{ label: 'App', href: '/projects' }, { label: 'Connexion', href: '/auth/login' }],
    },
  },
  en: {
    nav: { cta: 'Get started free', login: 'Sign in' },
    hero: {
      badge: 'Post-workshop tool',
      title: 'Structure your tokenomics,\nstep by step.',
      subtitle: 'Tokenlab guides Web3 founders from the token emission decision all the way to TGE strategy — with an AI Coach that knows your project.',
      cta: 'Create my first project',
      sub: 'Free · No credit card required',
    },
    modules: {
      title: '9 modules. A complete protocol.',
      subtitle: 'Each module covers a critical dimension of your tokenomics.',
      items: [
        { icon: '⬡', label: 'Token Decision Tree', desc: 'Do you really need a token?' },
        { icon: '◈', label: 'Topology & Utility', desc: 'Type, technical standard, real utility' },
        { icon: '◎', label: 'Agents & Policies', desc: 'Who interacts, what rules?' },
        { icon: '⇄', label: 'Value Flow', desc: 'Token sources and sinks' },
        { icon: '△', label: 'Supply & Emission', desc: 'Total supply, emission model' },
        { icon: '⊞', label: 'Distribution', desc: 'Allocation by category' },
        { icon: '⏱', label: 'Vesting', desc: 'Unlock schedule' },
        { icon: '◈', label: 'TGE & Liquidity', desc: 'Launch, DEX, market makers' },
        { icon: '⚖', label: 'Compliance', desc: 'MiCA, SEC, VARA' },
      ],
    },
    features: {
      title: 'Everything you need after the workshop.',
      items: [
        { icon: '✦', title: 'Context-aware AI Coach', desc: 'The Coach knows your full project. Ask questions, get precise answers — not generic content.' },
        { icon: '◉', title: 'Coherence score', desc: 'A real-time health score detects inconsistencies in your model before they become problems.' },
        { icon: '⬡', title: 'Interactive Value Flow', desc: 'Visualise your tokenomic flows in interactive SVG. Sinks, faucets, agents — all in one screen.' },
        { icon: '↓', title: 'Full PDF export', desc: 'Generate a complete tokenomics report ready to share with investors or your team.' },
      ],
    },
    testimonials: {
      title: 'They structured their tokenomics with Tokenlab.',
      items: [
        {
          quote: 'After the workshop I had scattered notes. Tokenlab forced me to formalise every decision. The AI Coach caught two major inconsistencies in my emission model.',
          name: 'Marc L.',
          role: 'Founder, DeFi Protocol · XRPL',
        },
        {
          quote: 'The Value Flow diagram let me present our tokenomics to investors without slides. In 10 minutes they understood the full mechanics.',
          name: 'Sarah K.',
          role: 'Co-founder, RWA Platform · Ethereum',
        },
        {
          quote: 'We had 3 weeks before our TGE. Tokenlab helped us realise our vesting was creating catastrophic sell pressure at month 6. We reworked it just in time.',
          name: 'Thomas R.',
          role: 'CTO, GameFi Studio · Solana',
        },
      ],
    },
    pricing: {
      title: 'Simple. Transparent.',
      subtitle: 'Start free, upgrade to coaching when you need it.',
      plans: [
        {
          name: 'Free',
          price: '€0',
          period: '',
          desc: 'To structure your tokenomics independently.',
          features: [
            'Unlimited projects',
            '9 tokenomics modules',
            'AI Coach (10 messages/day)',
            'PDF export',
            'Value Flow diagram',
            'Coherence score',
          ],
          cta: 'Get started free',
          href: '/projects/new',
          highlight: false,
        },
        {
          name: 'Coaching',
          price: '€290',
          period: '/ session',
          desc: 'A 1:1 session with a tokenomics expert to go further.',
          features: [
            'Everything in Free',
            '90-min session with an expert',
            'Full model review',
            'Personalised recommendations',
            'Written summary',
            '30-day email follow-up',
          ],
          cta: 'Book a session',
          href: 'mailto:hello@tokenlabapp.com',
          highlight: true,
        },
      ],
    },
    faq: {
      title: 'Frequently asked questions',
      items: [
        {
          q: 'Does Tokenlab replace a tokenomics expert?',
          a: 'No — Tokenlab is a structuring tool. It guides you through the right questions and detects inconsistencies. For critical decisions (TGE, fundraise), a coaching session with an expert is still recommended.',
        },
        {
          q: 'Is my data secure?',
          a: 'In free mode, your projects are stored locally in your browser. With an account, they are saved on Supabase with authentication and RLS (Row Level Security) — only you can access your projects.',
        },
        {
          q: 'Which AI model does the Coach use?',
          a: 'Claude Sonnet (Anthropic). The Coach receives the full context of your project with every message — it knows your supply, agents, and vesting.',
        },
        {
          q: 'Can I use Tokenlab without having done a workshop?',
          a: 'Yes. The modules are self-contained. If you\'re just starting out, begin with the Token Decision Tree (Step 1) — it helps you determine if you actually need a token.',
        },
        {
          q: 'How does the Free plan work?',
          a: 'Unlimited projects, all modules, PDF export and AI Coach (10 messages/day). No credit card required. The Free plan will remain free.',
        },
      ],
    },
    footer: {
      tagline: 'Structured tokenomics for Web3 founders.',
      links: [{ label: 'App', href: '/projects' }, { label: 'Sign in', href: '/auth/login' }],
    },
  },
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { lang, toggle: toggleLang } = useLang()
  const { theme, toggle: toggleTheme } = useTheme()
  const c = copy[lang]
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TokenlabIcon />
            <span className="font-bold tracking-tight">Tokenlab</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="text-xs text-muted hover:text-foreground transition-colors font-mono font-semibold"
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>
            <button onClick={toggleTheme} className="text-muted hover:text-foreground transition-colors">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <Link href="/auth/login" className="text-sm text-muted hover:text-foreground transition-colors">
              {c.nav.login}
            </Link>
            <Link href="/projects/new" className="btn btn-primary text-sm px-4 py-2">
              {c.nav.cta}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Network background SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <radialGradient id="heroGlow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0A0A0F" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1200" height="520" fill="url(#heroGlow)" />
          {/* Lines */}
          <line x1="160" y1="80"  x2="420" y2="180" stroke="#7C3AED" strokeOpacity="0.2" strokeWidth="1" />
          <line x1="420" y1="180" x2="680" y2="100" stroke="#7C3AED" strokeOpacity="0.2" strokeWidth="1" />
          <line x1="680" y1="100" x2="960" y2="260" stroke="#7C3AED" strokeOpacity="0.15" strokeWidth="1" />
          <line x1="420" y1="180" x2="560" y2="340" stroke="#7C3AED" strokeOpacity="0.15" strokeWidth="1" />
          <line x1="560" y1="340" x2="800" y2="360" stroke="#7C3AED" strokeOpacity="0.12" strokeWidth="1" />
          <line x1="160" y1="80"  x2="240" y2="280" stroke="#7C3AED" strokeOpacity="0.12" strokeWidth="1" />
          <line x1="240" y1="280" x2="420" y2="180" stroke="#7C3AED" strokeOpacity="0.15" strokeWidth="1" />
          <line x1="680" y1="100" x2="760" y2="40"  stroke="#7C3AED" strokeOpacity="0.12" strokeWidth="1" />
          <line x1="960" y1="260" x2="1060" y2="130" stroke="#7C3AED" strokeOpacity="0.12" strokeWidth="1" />
          <line x1="560" y1="340" x2="960" y2="260" stroke="#7C3AED" strokeOpacity="0.1"  strokeWidth="1" />
          <line x1="240" y1="280" x2="560" y2="340" stroke="#7C3AED" strokeOpacity="0.1"  strokeWidth="1" />
          <line x1="100" y1="240" x2="240" y2="280" stroke="#7C3AED" strokeOpacity="0.1"  strokeWidth="1" />
          <line x1="800" y1="360" x2="960" y2="260" stroke="#7C3AED" strokeOpacity="0.1"  strokeWidth="1" />
          {/* Nodes */}
          <circle cx="160"  cy="80"  r="4" fill="#7C3AED" fillOpacity="0.8" />
          <circle cx="420"  cy="180" r="6" fill="#7C3AED" fillOpacity="0.9" />
          <circle cx="680"  cy="100" r="4" fill="#7C3AED" fillOpacity="0.7" />
          <circle cx="960"  cy="260" r="5" fill="#7C3AED" fillOpacity="0.6" />
          <circle cx="560"  cy="340" r="4" fill="#7C3AED" fillOpacity="0.5" />
          <circle cx="240"  cy="280" r="3" fill="#7C3AED" fillOpacity="0.5" />
          <circle cx="760"  cy="40"  r="3" fill="#7C3AED" fillOpacity="0.4" />
          <circle cx="1060" cy="130" r="3" fill="#7C3AED" fillOpacity="0.4" />
          <circle cx="100"  cy="240" r="2" fill="#7C3AED" fillOpacity="0.3" />
          <circle cx="800"  cy="360" r="3" fill="#7C3AED" fillOpacity="0.4" />
        </svg>

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1.5 rounded-full mb-6 border border-accent/20">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {c.hero.badge}
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-foreground mb-6 whitespace-pre-line">
            {c.hero.title}
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            {c.hero.subtitle}
          </p>
          <div className="flex flex-col items-center gap-3">
            <Link href="/projects/new" className="btn btn-primary text-base px-8 py-3">
              {c.hero.cta} →
            </Link>
            <span className="text-xs text-muted">{c.hero.sub}</span>
          </div>
        </div>
      </section>

      {/* Modules grid */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-border">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">{c.modules.title}</h2>
          <p className="text-muted">{c.modules.subtitle}</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {c.modules.items.map((m, i) => (
            <div key={i} className="card hover:border-accent/30 transition-colors group">
              <div className="flex items-start gap-3">
                <span className="text-accent text-lg shrink-0 mt-0.5">{m.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">{m.label}</p>
                  <p className="text-xs text-muted mt-0.5">{m.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-border">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">{c.features.title}</h2>
        <div className="grid grid-cols-2 gap-6">
          {c.features.items.map((f, i) => (
            <div key={i} className="card">
              <div className="text-accent text-xl mb-3">{f.icon}</div>
              <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-border">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">{c.testimonials.title}</h2>
        <div className="grid grid-cols-3 gap-5">
          {c.testimonials.items.map((t, i) => (
            <div key={i} className="card flex flex-col gap-4">
              <p className="text-sm text-muted leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-auto pt-3 border-t border-border">
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-border">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">{c.pricing.title}</h2>
          <p className="text-muted">{c.pricing.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
          {c.pricing.plans.map((plan, i) => (
            <div key={i} className={`card flex flex-col gap-5 ${plan.highlight ? 'border-accent/50 shadow-lg shadow-accent/10' : ''}`}>
              {plan.highlight && (
                <div className="text-[10px] font-semibold text-accent uppercase tracking-widest">
                  {lang === 'fr' ? 'Recommandé' : 'Recommended'}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && <span className="text-sm text-muted">{plan.period}</span>}
                </div>
                <p className="text-xs text-muted mt-2">{plan.desc}</p>
              </div>
              <ul className="space-y-2 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-muted">
                    <span className="text-green text-xs">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`btn w-full ${plan.highlight ? 'btn-primary' : 'btn-ghost'}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 py-20 border-t border-border">
        <h2 className="text-3xl font-bold text-foreground mb-10 text-center">{c.faq.title}</h2>
        <div className="space-y-2">
          {c.faq.items.map((item, i) => (
            <div
              key={i}
              className="card cursor-pointer select-none"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{item.q}</p>
                <span className={`text-muted shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </div>
              {openFaq === i && (
                <p className="text-sm text-muted mt-3 pt-3 border-t border-border leading-relaxed">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TokenlabIcon />
            <span className="text-sm text-muted">{c.footer.tagline}</span>
          </div>
          <div className="flex items-center gap-4">
            {c.footer.links.map((l, i) => (
              <Link key={i} href={l.href} className="text-xs text-muted hover:text-foreground transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function TokenlabIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="10" stroke="#7C3AED" strokeWidth="1.5"/>
      <circle cx="11" cy="11" r="6" fill="#7C3AED" opacity="0.2"/>
      <circle cx="11" cy="11" r="3" fill="#7C3AED"/>
      <path d="M11 1 L11 4 M11 18 L11 21 M1 11 L4 11 M18 11 L21 11" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}
