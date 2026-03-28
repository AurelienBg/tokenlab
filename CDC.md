# Tokenlab — CDC (Cahier des Charges)
> Version 0.2 — Basé sur la spec XRPL Commons (28/01/2026)

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
| Module 5 — Distribution & Allocation (avec camembert bar) | ✅ |
| Module 6 — Vesting & Sell Pressure | ✅ |
| Module 7 — TGE & Stratégie de Liquidité | ✅ |
| Module 8 — Gouvernance | ✅ |
| Module 9 — Compliance (MiCA/SEC/VARA) | ✅ |
| Coach IA (streaming, context-aware) | ✅ |
| Dashboard (score de santé, progression modules) | ✅ |
| localStorage (MVP sans auth) | ✅ |
| Score de cohérence (health score) | ✅ |
| Mode jour/nuit (toggle + persistance localStorage) | ✅ |

### Hors scope V1

| Fonctionnalité | Prévu |
|---|---|
| Auth Supabase + cloud sync | V2 |
| Multi-utilisateurs par projet | V2 |
| Export PDF | V2 |
| Export Notion | V3 |
| MOOC théorique | V2 |
| Simulation dynamique (Machinations) | V3 |
| Benchmark on-chain automatique | V3 |
| Visualisation Value Flow interactive | V2 |

---

## Stack technique

| Couche | Choix |
|---|---|
| Framework | Next.js 16 (App Router) + Tailwind CSS v4 |
| Backend | Next.js API Routes |
| Déploiement | Vercel |
| IA | Anthropic API — `claude-sonnet-4-20250514` |
| Stockage V1 | localStorage (pas d'auth) |
| Stockage V2 | Supabase (PostgreSQL) + RLS par projet |

---

## Décisions d'implémentation

- **Pas d'auth en V1** : tout en localStorage, migration Supabase prévue V2
- **Module data** : un objet par module key en localStorage, jsonb en Supabase
- **Health score** : calculé localement via `lib/healthScore.ts`, pas d'API
- **Coach IA** : streaming SSE via `/api/coach`, contexte projet sérialisé en markdown
