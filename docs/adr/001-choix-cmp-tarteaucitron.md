# ADR-001 : Choix de tarteaucitron.js comme plateforme de gestion du consentement (CMP)

**Date** : 2026-04-07
**Statut** : Accepté
**Auteur** : Kevin B.
**Concerne** : Conformité cookies, RGPD/CNIL, gestion du consentement

## Contexte

Le site vitrine [piki-and-co.com](https://www.piki-and-co.com/) utilise Matomo (auto-hébergé) pour la mesure d'audience. L'ajout prochain d'outils marketing (Google Ads, GA4, Meta Pixel) impose la mise en place d'une CMP (Consent Management Platform) conforme aux exigences de la CNIL.

Exigences identifiées :

- Aucun cookie analytics ou marketing ne doit être déposé avant consentement explicite.
- Un bouton « Tout refuser » doit être aussi visible que « Tout accepter » (recommandation CNIL 2022).
- Le consentement doit être mémorisé (6 mois max recommandé).
- L'utilisateur doit pouvoir retirer son consentement à tout moment via un lien permanent.
- La solution doit être simple à maintenir sur un site HTML statique sans build tooling.

## Options évaluées

### Option A : tarteaucitron.js (open source, gratuit)

- Licence MIT, code ouvert, hébergé sur GitHub.
- Service Matomo intégré nativement (+ possibilité de service custom).
- Services Google (GA4, Ads) et Meta Pixel intégrés.
- Support du Google Consent Mode v2 depuis la version 1.17.
- Configuration JS simple, pas de dépendance.
- Projet français, documentation en français, aligné CNIL.
- Pas de compte SaaS ni d'abonnement.

### Option B : Axeptio

- UX soignée, interface configurable via dashboard.
- Freemium : gratuit jusqu'à un seuil de pages vues, puis payant.
- Hébergement SaaS (données chez un tiers).
- Moins de contrôle sur le code et le comportement exact.

### Option C : Cookiebot (Usercentrics)

- Leader du marché, très complet.
- Payant au-delà de 100 pages (le site est petit, mais la contrainte existe).
- Hébergement SaaS hors UE (Usercentrics GmbH, Allemagne, mais CDN mondial).
- Scan automatique des cookies (intéressant mais pas indispensable ici).
- Plus complexe à intégrer sur un site statique sans CMS.

### Option D : Implémentation maison

- Contrôle total.
- Coût de développement et de maintenance élevé.
- Risque de non-conformité si les recommandations CNIL évoluent.
- Pas de catalogue de services pré-intégrés.

## Décision

**Option A retenue : tarteaucitron.js**

## Justification

| Critère                        | tarteaucitron | Axeptio    | Cookiebot  | Maison     |
|-------------------------------|:---:|:---:|:---:|:---:|
| Gratuit sans limite           | Oui           | Non        | Non        | Oui        |
| Open source                   | Oui           | Non        | Non        | Oui        |
| Pas de SaaS / données chez soi| Oui           | Non        | Non        | Oui        |
| Matomo intégré                | Oui           | Oui        | Oui        | Manuel     |
| Google Consent Mode v2        | Oui (>= 1.17)| Oui        | Oui        | Manuel     |
| Meta Pixel intégré            | Oui           | Oui        | Oui        | Manuel     |
| Simple sur site statique      | Oui           | Moyen      | Moyen      | Complexe   |
| Maintenance faible            | Oui           | Oui        | Oui        | Non        |
| Communauté / support          | GitHub actif  | Support pro| Support pro| Aucun      |
| Aligné CNIL (projet FR)      | Oui           | Oui        | Partiel    | Dépend     |

Raisons principales :

1. **Gratuité totale et sans limite** : pas de plafond de pages vues, pas d'abonnement. Adapté au budget d'une startup.
2. **Pas de dépendance SaaS** : aucune donnée de consentement ne transite par un tiers. Le cookie de consentement est first-party. Compatible avec une politique de sobriété numérique.
3. **Catalogue de services riche** : Matomo, GA4, Google Ads, Meta Pixel, YouTube, etc. sont pré-intégrés. L'ajout d'un nouveau service se fait en 2-3 lignes de JS.
4. **Conformité CNIL native** : `highPrivacy: true` bloque tout avant consentement. Bouton « Tout refuser » intégré. Projet maintenu par une communauté française sensible aux exigences CNIL.
5. **Simplicité d'intégration** : un seul fichier JS à charger, pas de build, pas de framework. Compatible avec le site statique actuel.
6. **Possibilité d'auto-hébergement** : le fichier `tarteaucitron.js` peut être servi depuis notre propre serveur OVH, évitant tout transfert d'IP vers un CDN tiers.

## Risques identifiés

- **Noms de services instables** : les identifiants de services (ex: `faboraliaspixel`, `gaboraliasgtag`) changent parfois entre versions de tarteaucitron. Mitigation : épingler une version ou vérifier après chaque mise à jour.
- **Pas de scan automatique** : contrairement à Cookiebot, tarteaucitron ne détecte pas automatiquement les cookies. Mitigation : maintenir manuellement la page politique de cookies à jour.
- **UX par défaut basique** : l'interface du bandeau est fonctionnelle mais moins soignée qu'Axeptio. Mitigation : le CSS est personnalisable si besoin.
- **CDN tiers (jsDelivr)** : si on charge depuis le CDN, l'IP du visiteur transite par jsDelivr. Mitigation : auto-héberger `tarteaucitron.js` pour une conformité stricte.

## Conséquences

- Le script Matomo actuel (inline dans chaque page HTML) est supprimé et remplacé par un service tarteaucitron.
- Un fichier unique `js/tarteaucitron-init.js` centralise la configuration et les déclarations de services.
- Chaque page HTML importe ce fichier via une balise `<script>`.
- La page `legal/cookies.html` est mise à jour pour lister les cookies déposés.
- Un lien « Gérer mes cookies » est ajouté dans le footer de chaque page.
