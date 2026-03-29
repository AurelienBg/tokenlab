# Tokenlab — CDC (Cahier des Charges)
> Version 0.2 — Mis à jour le 28/03/2026

Voir spec complète : `/Users/Aurelien/Downloads/tokenlab_spec.md`

---

## Statut implémentation

### V1 (MVP — actuel)

| Fonctionnalité | Statut |
|---|---|
| Création de projet (contexte, type, stade, blockchain) | ✅ |
| Étape 0 — Token Decision Tree | ✅ |
| Module 1 — Token Topology & Utility | ✅ |
| Module 2 — Agents & Policies | ✅ |
| Module 3 — Value Flow (Sinks & Faucets) | ✅ |
| Module 4 — Supply-Side & Emission | ✅ |
| Module 5 — Distribution & Allocation (avec bar chart) | ✅ |
| Module 6 — Vesting & Sell Pressure | ✅ |
| Module 7 — TGE & Stratégie de Liquidité | ✅ |
| Module 8 — Gouvernance | ✅ |
| Module 9 — Compliance (MiCA/SEC/VARA) | ✅ |
| Coach IA (streaming, context-aware) | ✅ |
| Dashboard (score de santé, progression modules) | ✅ |
| localStorage (MVP sans auth) | ✅ |
| Score de cohérence (health score) | ✅ |
| Mode jour/nuit (toggle + persistance localStorage) | ✅ |
| Internationalisation FR/EN (toggle + persistance localStorage) | ✅ |
| UX — auto-save (debounce 1.5s) + Cmd/Ctrl+S | ✅ |
| UX — progress stepper + bouton "Module suivant" | ✅ |
| UX — delete inline (confirmation sans modal native) | ✅ |
| Export PDF (rapport tokenomics complet) | ✅ |

### V2 (actuel)

| Fonctionnalité | Statut |
|---|---|
| Visualisation Value Flow interactive (SVG temps réel) | ✅ |
| Auth Supabase (email/password + Google OAuth) | ✅ |
| Cloud sync localStorage → Supabase au login | ✅ |
| Multi-device sync (pull Supabase → localStorage) | ✅ |

### Backlog / Hors scope V2

#### Bloquants infra
| Fonctionnalité | Prévu |
|---|---|
| **Setup Supabase prod** (upgrade plan / libérer un slot + schema SQL + env vars Vercel) | À faire — bloquant |
| **Google OAuth — configuration prod** (Google Cloud credentials + redirect URL Supabase) | À faire |

#### Quick wins V2 (~30 min chacun)
| Fonctionnalité | Prévu |
|---|---|
| 🗑️ Suppression projet (confirmation inline) | ✅ v0.2 |
| ✏️ Édition infos projet (nom, ticker, blockchain, description depuis le dashboard) | ✅ v0.3.1 |
| 📱 Mobile — sidebar responsive + hero lisible sur petit écran | ✅ v0.3.1 |

#### Landing page
| Fonctionnalité | Prévu |
|---|---|
| 💬 Photo / background hero | À faire |
| 🔍 SEO — meta description + og:image pour partage LinkedIn/X | À faire |

#### Features produit
| Fonctionnalité | Prévu |
|---|---|
| 🔗 Lien de partage lecture seule (sans compte) | V3 |
| Duplicate projet | V3 |
| Multi-utilisateurs par projet | V3 |
| Export Notion | V3 |
| MOOC théorique | V3 |
| Simulation dynamique (graphe supply dans le temps) | V3 |
| Benchmark on-chain automatique | V3 |

---

## Stack technique

| Couche | Choix |
|---|---|
| Framework | Next.js 16 (App Router) + Tailwind CSS v4 |
| Backend | Next.js API Routes |
| Déploiement | Vercel (`tokenlabapp.vercel.app`) |
| IA | Anthropic API — `claude-sonnet-4-20250514` |
| Stockage V1 | localStorage (pas d'auth) |
| Stockage V2 | Supabase (PostgreSQL) + RLS par projet |

---

## Décisions d'implémentation

- **Pas d'auth en V1** : tout en localStorage, migration Supabase prévue V2
- **Module data** : un objet par module key en localStorage, jsonb en Supabase
- **Health score** : calculé localement via `lib/healthScore.ts`, pas d'API
- **Coach IA** : streaming SSE via `/api/coach`, contexte projet sérialisé en markdown
- **Thème** : CSS vars dans `@layer base` pour que Tailwind v4 ne purge pas `[data-theme="light"]`
- **i18n** : LangProvider context, `lib/i18n.ts` avec clés FR/EN, persisté en localStorage
- **Auto-save** : hook `lib/useAutoSave.ts` (debounce 1.5s + Cmd/Ctrl+S), wired dans tous les modules
- **Export PDF** : `@react-pdf/renderer` v4, lazy-loaded (ssr:false), bouton sur le dashboard

---

## Versions

| Version | Date | Changements |
|---|---|---|
| v0.1 | 28/01/2026 | MVP initial — 10 modules, Coach IA, Dashboard, localStorage |
| v0.2 | 28/03/2026 | Mode jour/nuit, FR/EN, auto-save, progress stepper, export PDF |
| v0.3 | 28/03/2026 | Value Flow diagram SVG interactif, Auth Supabase + cloud sync |
| v0.3.1 | 29/03/2026 | Landing page, édition projet, mobile responsive, i18n complète, favicon |
