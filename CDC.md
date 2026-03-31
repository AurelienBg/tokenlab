# Tokenlab — CDC (Cahier des Charges)
> Version 0.3 — Mis à jour le 31/03/2026

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

---

## Roadmap complète

### 🔴 Bloquants infra (à faire en priorité — sans ça, pas d'auth)

| # | Feature | Détail | Owner |
|---|---|---|---|
| I-1 | **Setup Supabase prod** | Libérer un slot, appliquer le schema SQL, configurer RLS | Toi |
| I-2 | **Env vars Vercel** | Ajouter `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans Vercel Dashboard | Toi |
| I-3 | **Google OAuth prod** | Créer credentials dans Google Cloud Console, ajouter redirect URI Supabase, activer provider dans Supabase Dashboard | Toi |

---

### ✅ Sprint 1–4 (livré)

| Feature | Version |
|---|---|
| 10 modules tokenomics (Step 0 → M9) | v1.0 |
| Coach IA streaming context-aware | v1.0 |
| Dashboard health score + progression | v1.0 |
| localStorage sans auth | v1.0 |
| Export PDF rapport complet | v1.0 |
| Mode jour/nuit | v2.0 |
| i18n FR/EN complète | v2.0 |
| Auto-save debounce 1.5s + Cmd/Ctrl+S | v2.0 |
| Value Flow SVG interactif | v2.0 |
| Auth Supabase email/password + cloud sync | v2.0 |
| Landing page bilingue (hero, modules, pricing, FAQ) | v3.0 |
| Hero background SVG réseau de nœuds | v3.0 |
| SEO — og:image 1200×630 + meta Twitter/OG | v3.0 |
| Favicon icon.tsx ImageResponse | v3.0 |
| Mobile sidebar hamburger + overlay | v3.0 |
| Édition projet inline depuis dashboard | v3.0 |
| Formulaire nouveau projet simplifié (sans token name/ticker) | v4.0 |
| Cards projets redesign (grid, avatar, tags, date) | v4.0 |
| Lien de partage read-only base64 `/share/[token]` | v4.0 |
| Page `/share/[token]` publique + bouton "Importer" | v4.0 |
| Duplicate projet (copy/copie selon langue) | v4.0 |
| Suppression projet depuis le dashboard | v4.0 |
| Simulation supply `/simulation` (graphe SVG stacked 48m) | v4.0 |
| Mini-chart simulation sur le dashboard | v4.0 |
| Barre de progression segmentée (1 segment / module) | v4.0 |
| Checkmark vert dans le nav quand module complet | v4.0 |
| Tooltips CSS sur les boutons d'action | v4.0 |
| Sidebar : icône grille + badge nb projets sur "All projects" | v4.0 |
| Banner "Save to cloud" / "Data saved" dans sidebar | v4.0 |

---

### 🟡 Sprint 5 — IA & Export (V5)

| # | Feature | Détail | Effort |
|---|---|---|---|
| S5-1 | **Coach IA proactif** | Message d'alerte sur le dashboard si health score < 40 ou gaps critiques détectés. Suggestions cliquables → renvoie vers le bon module | M |
| S5-2 | **Auto-fill par le Coach** | Depuis la page Coach, bouton "Remplir ce module" → le Coach génère un draft JSON pour le module actif à partir d'une description textuelle | L |
| S5-3 | **Export PDF avec simulation** | Inclure le graphe supply (SVG → canvas → image) dans le rapport PDF existant, après la section M6 | M |
| S5-4 | **Simulation dans la share page** | Afficher le mini-chart sur `/share/[token]` si les données M4+M5 sont présentes | S |
| S5-5 | **Alertes simulation améliorées** | Sur `/simulation` : détecter cliff overlaps, TGE > 30%, supply > 80% en circulation à M12, et proposer des corrections | S |

---

### 🟡 Sprint 6 — Growth & UX (V5)

| # | Feature | Détail | Effort |
|---|---|---|---|
| S6-1 | **Onboarding tooltip** | Au premier projet : highlight séquentiel (Step 0 → modules → dashboard). Dismissible, persisté en localStorage | M |
| S6-2 | **Templates projets** | 4 templates pré-remplis : DeFi, DAO, RWA, Social Impact. Sélectable à la création du projet | M |
| S6-3 | **Analyse comparative** | Page `/compare` — sélectionner 2 projets, afficher côte à côte : health score, allocations, supply curve | L |
| S6-4 | **Historique des modifications** | Par module : stocker les 5 dernières versions avec timestamp. Bouton "Voir l'historique" → modal diff simplifié | L |
| S6-5 | **Image OG par projet** | Route `/api/og/[id]` générant une ImageResponse 1200×630 avec nom du projet, health score, graphe supply minimaliste | M |
| S6-6 | **Embed widget** | Snippet `<iframe>` pour intégrer le graphe simulation sur un site / deck externe. Page `/embed/[id]` sans sidebar | M |
| S6-7 | **Waitlist landing** | Formulaire email sur la landing page → stocké en Supabase. Email de confirmation automatique | S |
| S6-8 | **Mobile : tester + fixer les modules** | Scroll horizontal sur M5 bar chart, inputs trop petits sur M6, layout M3 SVG sur < 400px | S |

---

### 🔵 Sprint 7 — Collaboration (V6, après Supabase)

| # | Feature | Détail | Effort |
|---|---|---|---|
| S7-1 | **Lien de partage V2 court** | UUID en DB, lien court `/s/[uuid]`, toujours à jour (pas de base64) | M |
| S7-2 | **Multi-utilisateurs par projet** | Inviter des collaborateurs par email. Rôles : Owner / Editor / Viewer. RLS Supabase par projet | L |
| S7-3 | **Commentaires sur les modules** | Thread de commentaires par module (comme Notion/Figma). Notifications email | L |
| S7-4 | **Versioning cloud** | Snapshots nommés d'un projet complet ("v1 seed round", "v2 post-audit"). Restauration en 1 clic | L |

---

### 🔵 Sprint 8 — Données & Intégrations (V6)

| # | Feature | Détail | Effort |
|---|---|---|---|
| S8-1 | **Benchmark on-chain automatique** | API CoinGecko/DefiLlama : comparer les tokenomics du projet avec des projets similaires on-chain (supply, vesting, TGE %) | XL |
| S8-2 | **Export Notion** | Exporter le rapport tokenomics en page Notion via Notion API. Inclure les tableaux M5/M6 et le graphe simulation | L |
| S8-3 | **MOOC théorique** | Section learning : articles courts par module (théorie tokenomics). Gated pour les users connectés | XL |
| S8-4 | **Simulation Monte Carlo** | Sur `/simulation` : mode avancé avec fourchettes (min/max supply, vesting incertain) → afficher percentiles P10/P50/P90 | XL |
| S8-5 | **Webhook / API publique** | API REST pour récupérer les données d'un projet (lecture seule, clé API par user). Pour intégrations externes | L |

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
| v2.0 | 29/03/2026 | Landing page, édition projet, mobile responsive, i18n complète, favicon |
| v3.0 | 30/03/2026 | Hero background SVG réseau de nœuds, SEO og:image, meta Twitter/OG |
| v4.0 | 31/03/2026 | Cards projets, share link, duplicate, simulation supply, mini-chart dashboard, progress segmentée, delete dashboard, tooltips, sidebar polish |
