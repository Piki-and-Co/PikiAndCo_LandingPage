# Piki & Co — Site vitrine + Blog

Site web de l'entreprise Piki & Co, incluant le blog éditorial et la landing page du produit Biumiz.

## Stack technique

- **Framework** : [Astro](https://astro.build) v4 (génération statique)
- **Hébergement** : GitHub Pages (`beta.piki-and-co.com`)
- **CMS blog** : fichiers Markdown dans `src/content/blog/`
- **Recherche** : Pagefind (index généré au build)
- **Formulaire** : Brevo (ex-Sendinblue) embed
- **Consentement cookies** : TarteAuCitron.js
- **Polices** : Montserrat (Google Fonts) + Caveat Brush (local, zone Biumiz)

## Architecture des zones visuelles

| Zone | URL | Layout | Ton |
|------|-----|--------|-----|
| Entreprise | `/`, `/blog/` | `PikiCoLayout` | Sobre, blanc, éditorial |
| Produit | `/biumiz/` | `BiumizLayout` | Vibrant, dégradé violet |
| Inscription | `/inscription/` | `BiumizLayout` | Vibrant (CTA produit) |

---

## Lancer le projet en local

```bash
npm install
npm run dev
```

> **Windows** : si npm échoue sur le cache, utiliser `npm install --cache "C:\Users\<toi>\.npm-cache"`

Le site est disponible sur `http://localhost:4321`.

La recherche Pagefind nécessite d'avoir lancé `npm run build` au moins une fois (l'index est écrit dans `public/pagefind/` et persiste). Après ce premier build, la recherche fonctionne aussi bien en `dev` qu'en `preview`.

```bash
npm run build   # génère dist/ + l'index Pagefind dans public/pagefind/
npm run dev     # la recherche est désormais disponible
```

---

## Ajouter un article de blog

### 1. Créer le fichier Markdown

Créer `src/content/blog/mon-article.md` (le nom du fichier devient l'URL : `/blog/mon-article`).

```markdown
---
title: "Titre de l'article"
description: "Résumé court (160 car. max) — affiché dans la liste et utilisé pour le SEO."
pubDate: 2026-06-08
author: "L'équipe Piki & Co"
tags: ["cps", "science", "biumiz"]
draft: false
image: "/assets/blog/mon-article-cover.jpg"  # optionnel — utilisé pour l'OG image
---

Contenu de l'article en Markdown.

## Section

Un paragraphe...
```

### Champs du frontmatter

| Champ | Requis | Description |
|-------|--------|-------------|
| `title` | ✅ | Titre affiché et utilisé en `<title>` SEO |
| `description` | ✅ | Résumé SEO, affiché dans les cartes blog |
| `pubDate` | ✅ | Date de publication (`YYYY-MM-DD`) |
| `author` | — | Défaut : `"Piki & Co"` |
| `tags` | — | Liste de tags (génère des pages `/blog/tags/<tag>`) |
| `draft` | — | `true` = exclu du build et du RSS |
| `image` | — | Chemin vers l'image de couverture (OG image, JSON-LD) |

### 2. Ce qui est automatisé à chaque build

Aucune modification manuelle n'est nécessaire en dehors du fichier Markdown :

| Élément | Mécanisme |
|---------|-----------|
| URL de l'article | Nom du fichier `.md` → `/blog/<nom-fichier>` |
| Page de tag | `getStaticPaths()` génère `/blog/tags/<tag>` automatiquement |
| Sitemap | `@astrojs/sitemap` régénère `sitemap-index.xml` avec toutes les URLs |
| Flux RSS | `rss.xml.ts` relit la collection et régénère `/rss.xml` |
| Index de recherche | Pagefind re-indexe tout le contenu `data-pagefind-body` |
| JSON-LD BlogPosting | `BlogPostLayout` génère le schéma à partir du frontmatter |
| OG / Twitter Cards | `PikiCoLayout` génère les balises à partir du frontmatter |

### 3. Tester en local avant de pousser

```bash
npm run build && npm run preview
```

Vérifier sur `http://localhost:4321/blog/mon-article` que l'article s'affiche correctement, puis que `/blog/` liste le nouvel article et que la recherche le trouve.

### 4. Publier

```bash
git add src/content/blog/mon-article.md
git commit -m "content: article «Titre de l'article»"
git push origin main
```

Le déploiement se déclenche automatiquement via GitHub Actions (voir section Déploiement).

---

## Structure du projet

```
src/
├── content/
│   ├── config.ts           # schéma Zod des collections (blog)
│   └── blog/               # articles Markdown (un fichier = un article)
├── layouts/
│   ├── PikiCoLayout.astro  # layout zone entreprise (SEO, OG, JSON-LD Organization)
│   ├── BiumizLayout.astro  # layout zone produit (SEO, OG, JSON-LD SoftwareApplication)
│   └── BlogPostLayout.astro # layout article (JSON-LD BlogPosting)
├── pages/
│   ├── index.astro         # accueil entreprise
│   ├── rss.xml.ts          # flux RSS du blog (auto-généré)
│   ├── blog/
│   │   ├── index.astro     # liste des articles + recherche Pagefind
│   │   ├── [slug].astro    # article individuel
│   │   └── tags/
│   │       └── [tag].astro # liste filtrée par tag (auto-généré)
│   ├── biumiz/
│   │   └── index.astro     # landing page produit (JSON-LD FAQPage)
│   ├── inscription/
│   │   ├── index.astro     # formulaire Brevo
│   │   ├── confirmation-inscription.astro
│   │   └── confirmation-email.astro
│   └── legal/
│       ├── mention.astro
│       ├── privacy.astro
│       └── cookies.astro
└── styles/
    ├── pikico.css           # tokens design Piki & Co (sobre)
    └── biumiz.css           # tokens design Biumiz (vibrant)

public/
├── assets/                 # images, logos, icônes, polices locales
├── js/
│   └── tarteaucitron-init.js
├── CNAME                   # domaine custom GitHub Pages
└── robots.txt              # directives crawlers + lien sitemap
```

---

## Design system

### Palette Piki & Co (zone sobre)

| Token | Valeur | Usage |
|-------|--------|-------|
| `--pikico-title` | `#1E1040` | Titres |
| `--pikico-text` | `#374151` | Corps de texte |
| `--pikico-accent` | `#6B46A0` | Liens, accents |
| `--pikico-cta` | `#FFC23B` | Boutons CTA |
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

---

## Déploiement GitHub Pages

### Workflow CI/CD

Le fichier `.github/workflows/deploy.yml` gère le déploiement automatiquement.

**Déclencheurs :**
- Push sur `main` → déploiement automatique
- Bouton **Run workflow** dans l'onglet Actions → déploiement manuel (utile depuis une branche de test)

**Étapes du pipeline :**

```
Checkout → Install (npm ci) → astro build → pagefind --site dist → upload dist/ → deploy Pages
```

Tout ce qui suit est **régénéré à chaque déploiement sans intervention manuelle** :
- `sitemap-index.xml` (toutes les pages publiques)
- `rss.xml` (tous les articles non-brouillon)
- `dist/pagefind/` (index de recherche)
- Pages de tags (`/blog/tags/*`)

### Configuration requise (une seule fois)

Dans `Settings > Pages` du repo GitHub :
- **Source** → `GitHub Actions`
- **Custom domain** → `beta.piki-and-co.com`
- Cocher **Enforce HTTPS** après génération du certificat

DNS chez l'hébergeur du domaine :
```
Type  : CNAME
Nom   : beta
Valeur: piki-and-co.github.io
```

### Passer en production sur piki-and-co.com

Quand le site est validé sur `beta.piki-and-co.com` :

1. Modifier `public/CNAME` → `piki-and-co.com`
2. Modifier `astro.config.mjs` → `site: 'https://piki-and-co.com'`
3. Mettre à jour le DNS chez l'hébergeur — pour un apex domain, utiliser 4 enregistrements `A` (pas de CNAME possible à la racine) :
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
4. Mettre à jour le custom domain dans `Settings > Pages`
