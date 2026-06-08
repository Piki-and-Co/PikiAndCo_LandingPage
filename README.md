# Piki & Co — Site vitrine + Blog

Site web de l'entreprise Piki & Co, incluant le blog éditorial et la landing page du produit Biumiz.

## Stack technique

- **Framework** : [Astro](https://astro.build) v4 (génération statique)
- **Hébergement** : GitHub Pages
- **CMS blog** : fichiers Markdown dans `src/content/blog/`
- **Formulaire** : Brevo (ex-Sendinblue) embed
- **Consentement cookies** : TarteAuCitron.js
- **Polices** : Montserrat (Google Fonts) + Caveat Brush (local, zone Biumiz)

## Architecture des zones visuelles

| Zone | URL | Layout | Ton |
|------|-----|--------|-----|
| Entreprise | `/`, `/blog/` | `PikiCoLayout` | Sobre, blanc, éditorial |
| Produit | `/biumiz/` | `BiumizLayout` | Vibrant, dégradé violet |
| Inscription | `/inscription/` | `BiumizLayout` | Vibrant (CTA produit) |

## Lancer le projet en local

```bash
npm install --cache "C:\Users\<toi>\.npm-cache"
npm run dev
```

Le site est disponible sur `http://localhost:4321`.

## Construire pour la production

```bash
npm run build    # génère le site dans dist/
npm run preview  # prévisualise le build en local
```

## Structure du projet

```
src/
├── content/
│   ├── config.ts          # schéma des collections (blog)
│   └── blog/              # articles Markdown (un fichier = un article)
├── layouts/
│   ├── PikiCoLayout.astro # layout zone entreprise
│   ├── BiumizLayout.astro # layout zone produit
│   └── BlogPostLayout.astro
├── pages/
│   ├── index.astro        # accueil entreprise
│   ├── blog/
│   │   ├── index.astro    # liste des articles
│   │   └── [slug].astro   # article individuel
│   ├── biumiz/
│   │   └── index.astro    # landing page produit
│   └── inscription/
│       ├── index.astro    # formulaire Brevo
│       ├── confirmation-inscription.astro
│       └── confirmation-email.astro
└── styles/
    ├── pikico.css          # tokens design Piki & Co (sobre)
    └── biumiz.css          # tokens design Biumiz (vibrant)

public/
├── assets/                # images, logos, icônes, polices
├── js/
│   └── tarteaucitron-init.js
└── legal/                 # pages légales HTML statiques
```

## Ajouter un article de blog

Créer un fichier `src/content/blog/mon-article.md` :

```markdown
---
title: "Titre de l'article"
description: "Résumé court affiché dans la liste et le SEO."
pubDate: 2026-06-07
author: "L'équipe Piki & Co"
tags: ["biumiz", "science", "équipe"]
draft: false
---

Contenu de l'article en Markdown...
```

Le fichier est automatiquement publié à `/blog/mon-article` au prochain build.  
Pour garder un brouillon, passer `draft: true`.

## Design system

### Palette Piki & Co (zone sobre)

| Token | Valeur | Usage |
|-------|--------|-------|
| `--pikico-title` | `#1E1040` | Titres |
| `--pikico-text` | `#374151` | Corps de texte |
| `--pikico-accent` | `#6B46A0` | Liens, accents |
| `--pikico-cta` | `#FFC23B` | Boutons CTA (usage limité) |
| `--pikico-bg-tinted` | `#F7F5FF` | Sections alternées |

### Palette Biumiz (zone produit)

| Token | Valeur | Usage |
|-------|--------|-------|
| `--dark-yellow` | `#FFC23B` | CTA principal |
| `--star-pink` | `#FF88FE` | Accents |
| `--star-turquoise` | `#5BFFBA` | Accents secondaires |
| `--hair-blue` | `#92C5FC` | Liens |
| Fond | `#180F32` → `#691D6E` | Dégradé page |

**Règle** : `Caveat Brush` est réservé à la zone Biumiz. La zone Piki & Co utilise uniquement `Montserrat`.

## Déploiement GitHub Pages

Le déploiement se fait via la branche `main`. Configurer GitHub Actions avec :

```yaml
- run: npm run build
- uses: actions/upload-pages-artifact@v3
  with:
    path: dist/
```
