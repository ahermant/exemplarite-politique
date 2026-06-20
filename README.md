# Veille citoyenne

Suivi citoyen des enquêtes, mises en examen et condamnations des élus français en activité. Un outil de transparence démocratique basé sur les données publiques.

## Contexte

Ce site recense l'ensemble des élus français en activité et affiche, pour chacun, le nombre d'affaires judiciaires les concernant directement. Chaque affaire est documentée avec :

- Le statut judiciaire (enquête, mise en examen, condamnation, relaxe...)
- La catégorie (détournement de fonds, favoritisme, violence, diffamation...)
- Un résumé des faits et les peines éventuelles
- Des liens vers les sources

Le projet est **non partisan** : il agrège des données factuelles issues de sources publiques, sans commentaire éditorial.

## Sources

Les données proviennent de **[Poligraph](https://poligraph.fr)**, une plateforme qui agrège les informations judiciaires concernant les personnalités politiques françaises à partir de :

- Articles de presse (Mediapart, Le Monde, France Info, Libération, etc.)
- Pages Wikipédia
- Décisions de justice publiques

Les données sont mises à jour **mensuellement** (le 1er de chaque mois).

### Limites

- **Couverture non exhaustive** : seules les affaires relayées par les médias sont recensées
- **Délai de mise à jour** : les évolutions judiciaires récentes peuvent ne pas encore apparaître
- **Périmètre** : élus en activité + candidats déclarés à la présidentielle

## Fonctionnement

### Stack technique

- **[Astro](https://astro.build)** — Générateur de site statique
- **[Tailwind CSS](https://tailwindcss.com)** — Design moderne et minimaliste
- **JSON** — Base de données légère, sans serveur
- **[GitHub Pages](https://pages.github.com)** — Hébergement gratuit
- **[GitHub Actions](https://github.com/features/actions)** — Rafraîchissement mensuel automatique

### Architecture

```
données CSV → conversion JSON → build Astro → site statique → GitHub Pages
                    ↑
          GitHub Actions (cron mensuel)
```

### Développement local

```bash
# Prérequis : Node.js 20+
npm install
npm run dev        # http://localhost:4321
npm run build      # Génère le site dans dist/
```

### Rafraîchissement des données

```bash
# Conversion manuelle des CSV en JSON
npm run convert

# Rafraîchissement complet (fetch + convert + build)
npm run refresh
```

Pour le rafraîchissement automatique mensuel, configurer les secrets GitHub Actions :

- `POLITIQUES_CSV_URL` — URL du fichier politiques.csv
- `AFFAIRES_CSV_URL` — URL du fichier affaires.csv
- `CANDIDATS_CSV_URL` — URL du fichier candidats.csv

### Ajout manuel de candidats

Éditer `candidats.csv` (même format que `politiques.csv`), puis relancer `npm run convert`.

## Catégories d'affaires

Les 267 affaires recensées sont classées en 4 catégories exhaustives :

| Catégorie | Statuts inclus |
|-----------|---------------|
| **Enquêtes** | Enquête préliminaire |
| **Mises en examen** | Mise en examen, Instruction, Renvoi devant le tribunal, Procès en cours |
| **Condamnations** | Condamnation 1ère instance, Condamnation définitive, Appel en cours |
| **Relaxe/Classement** | Relaxe, Classement sans suite, Non-lieu, Prescription |

Seules les affaires où l'élu est **Mis en cause** (et non Plaignant ou Mentionné) sont comptabilisées.

## Déploiement

1. Pousser le dépôt sur GitHub
2. Activer GitHub Pages dans Settings > Pages (branche `gh-pages`)
3. Le workflow `.github/workflows/refresh-data.yml` s'exécute automatiquement le 1er de chaque mois

## Licence

Données : sources publiques (presse, justice).  
Code : libre de réutilisation.
