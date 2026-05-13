# Design — Portfolio William Stevens v2

**Date :** 2026-05-13  
**Statut :** Approuvé  
**Dossier cible :** `C:\Perso\Portfolio\`

---

## Résumé

Refonte partielle du portfolio existant (dark luxe noir + or). On garde le design et la structure générale, on corrige le contenu, on découpe le single-file en 3 fichiers séparés, et on affine le visuel.

Objectif : candidatures alternance — Bachelor Dev Info, Metz Numeric School 2025→2028.

---

## Architecture

```
C:\Perso\Portfolio\
├── index.html       — structure HTML, sections, liens vers css/js
├── css/
│   └── style.css    — variables, dark theme, tous composants
└── js/
    └── main.js      — animations, nav, interactions
```

Migration depuis `portfolio-william-stevens.html` (single-file CSS+JS inline) vers structure 3 fichiers.

---

## Design

- **Thème :** Dark Luxe affiné — fond `#0E0E0E`, accent or `#C9A84C`
- **Variables CSS conservées :** `--gold`, `--dark`, `--dark-2`, `--dark-3`, `--text`, `--text-muted`, `--accent`, `--serif`, `--sans`
- **Polices :** Playfair Display (titres) + DM Sans (corps) — Google Fonts
- **Raffinement :** espacement plus généreux, transitions plus fluides (0.3s ease), hiérarchie typographique plus soignée

---

## Sections

### Navigation
- Inchangée : fixe, `backdrop-filter: blur(12px)`, fond semi-transparent
- Logo "W. Stevens" à gauche, liens à droite
- Burger menu mobile conservé

### Hero (`#about`)
- Grid 2 colonnes : texte à gauche, photo ronde à droite
- Badge **"● DISPONIBLE ALTERNANCE"** en accent or, bien visible en haut du bloc texte
- Titre : "William Stevens" (Playfair Display, grand)
- Sous-titre : "Développeur Web Full Stack"
- Description courte : étudiant Bachelor Dev, Metz Numeric School
- 2 CTAs : **"Voir mes projets"** (bouton or plein) + **"Me contacter"** (bouton outline)
- Photo : circulaire, bordure or, à fournir par Steve (placeholder WS en attendant)

### Compétences (`#skills`)
- Suppression des barres de progression (remplacées)
- Pills par catégorie :
  - **Backend** : PHP, Python, MariaDB
  - **Frontend** : JavaScript, HTML/CSS
  - **Outils** : Docker, Git

### Projets (`#projects`)
- 2 cartes uniquement :
  1. **Gestion du courrier — Mairie de Longeville-lès-Metz** : app web complète pour gérer le courrier entrant/sortant. PHP · MariaDB · Docker · JS vanilla. Stage réel.
  2. **Module Congés — Mairie de Longeville-lès-Metz** : calendrier FullCalendar avec gestion des conflits inter-services. PHP · MariaDB · Docker · JS OOP. Stage réel.
- Chaque carte : titre, description 2 lignes, pills stack, lien GitHub (à renseigner)
- Numérotation conservée (01, 02)

### Parcours (`#xp`)
- Timeline conservée
- Entrées : Metz Numeric School (2025→2028) + Stage mairie (avec dates)

### Contact (`#contact`)
- Affichage simple : email `stevens.wrc@gmail.com` + téléphone `+33 6 60 85 28 60` + localisation Longeville-lès-Metz
- **Pas de formulaire dans cette version** — Formspree prévu en v2 (compte à créer, endpoint à coller)
- Disposition 1 colonne centrée (le formulaire est supprimé, 2 colonnes n'a plus de sens)

### Footer
- Logo + copyright
- Liens GitHub + LinkedIn (URLs à renseigner par Steve)

---

## Ce qui change par rapport à v1

| Élément | Avant | Après |
|---|---|---|
| Architecture | Single-file HTML+CSS+JS | 3 fichiers séparés |
| Skills | Barres de progression % | Pills par catégorie |
| Projets | Cards placeholder | 2 vrais projets Mairie |
| Hero | Pas de badge dispo | Badge "Disponible alternance" |
| Photo | Placeholder masqué | Vraie photo (à fournir) |
| Footer | Liens vides | GitHub + LinkedIn (à renseigner) |
| Formulaire contact | HTML présent mais non connecté | Supprimé (Formspree en v2) |

---

## Ce qui N'est PAS inclus (v2 plus tard)

- Formulaire Formspree (décision reportée)
- Version mobile-first (reste desktop-first `max-width: 768px`)
- Blog / articles
- Mode clair

---

## Dépendances externes

| Ressource | Usage |
|---|---|
| Google Fonts (Playfair Display + DM Sans) | Typographie |
| IntersectionObserver (natif) | Animations `.fade-in` au scroll |
