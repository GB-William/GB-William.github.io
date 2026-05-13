# Portfolio v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrer le portfolio de `portfolio-william-stevens.html` (single-file) vers une structure 3 fichiers (`index.html` + `css/style.css` + `js/main.js`), remplacer les sections placeholder par le contenu réel, et affiner le hero avec photo circulaire + badge "Disponible alternance".

**Architecture:** Migration directe puis modifications section par section. Pas de framework, pas de build step. Fichiers statiques purs. Chaque tâche produit un résultat visuel vérifiable dans le browser. Le site source `C:\Perso\Portfolio\portfolio-william-stevens.html` sert de base de travail — ne pas le supprimer avant la fin.

**Tech Stack:** HTML5, CSS3 (variables custom `--gold`, `--dark`, etc.), JavaScript vanilla, Google Fonts (Playfair Display + DM Sans), IntersectionObserver API natif.

---

### Task 1: File scaffold — migrer le single-file en 3 fichiers

**Files:**
- Create: `C:\Perso\Portfolio\index.html`
- Create: `C:\Perso\Portfolio\css\style.css`
- Create: `C:\Perso\Portfolio\js\main.js`
- Reference (source, ne pas modifier): `C:\Perso\Portfolio\portfolio-william-stevens.html`

- [ ] **Step 1: Ouvrir la source dans un browser pour référence visuelle**

Ouvre `C:\Perso\Portfolio\portfolio-william-stevens.html` dans Chrome ou Edge (File → Open, ou glisser-déposer). Mémorise l'apparence — cette tâche doit produire un résultat **visuellement identique**.

- [ ] **Step 2: Créer `css/style.css`**

Crée le dossier `css/` et le fichier `css/style.css`. Déplace **tout le contenu du bloc `<style>`** (lignes 8–660 dans `portfolio-william-stevens.html`) vers ce fichier. Ajoute l'import Google Fonts en **première ligne** (il remplace le `<link>` qui sera supprimé du HTML) :

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

/* Tout le contenu CSS extrait de <style>…</style> vient ici */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --gold: #C9A84C;
  --gold-light: #E8D5A0;
  --dark: #0E0E0E;
  --dark-2: #1A1A1A;
  --dark-3: #252525;
  --text: #F0EDE6;
  --text-muted: #8A8680;
  --accent: #C9A84C;
  --serif: 'Playfair Display', Georgia, serif;
  --sans: 'DM Sans', sans-serif;
}
/* ... puis toute la suite des règles CSS jusqu'à la fin du bloc <style> */
```

- [ ] **Step 3: Créer `js/main.js`**

Crée le dossier `js/` et le fichier `js/main.js`. Copie-y le contenu du `<script>` inline (les 8 lignes entre `<script>` et `</script>` à la fin du fichier source) :

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
```

- [ ] **Step 4: Créer `index.html`**

Crée `index.html` avec le contenu HTML ci-dessous. Le `<head>` référence `css/style.css` au lieu des balises `<link>` Google Fonts et `<style>`. Le `<body>` est **identique** au body de `portfolio-william-stevens.html` (lignes 662–904), sans les balises `<style>` ni `<script>`. Ajoute `<script src="js/main.js"></script>` juste avant `</body>`.

```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>William Stevens — Développeur Full Stack</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body>

<!-- NAVIGATION -->
<nav>
  <div class="nav-logo">W. Stevens</div>
  <ul class="nav-links">
    <li><a href="#about">À propos</a></li>
    <li><a href="#skills">Compétences</a></li>
    <li><a href="#projects">Projets</a></li>
    <li><a href="#xp">Expérience</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>

<!-- HERO -->
<div class="hero" id="about">
  <div class="hero-grid">
    <div class="hero-content">
      <div class="hero-eyebrow">Développeur Full Stack</div>
      <h1>William<br><span>Stevens.</span></h1>
      <p class="hero-desc">
        Étudiant en Bachelor Développement Informatique à Metz Numeric School.
        Passionné par la conception d'outils métier et l'architecture logicielle,
        je cherche à créer des expériences web élégantes et fonctionnelles.
      </p>
      <div class="hero-ctas">
        <a href="#projects" class="btn-primary">Voir mes projets</a>
        <a href="#contact" class="btn-outline">Me contacter</a>
      </div>
    </div>

    <div class="hero-visual">
      <div class="hero-photo-frame">
        <div class="hero-photo-bg"></div>
        <div class="hero-photo-placeholder">
          <div class="avatar-circle">WS</div>
          <span class="photo-label">Votre photo ici</span>
        </div>
        <div class="hero-langs">
          <p>Langues</p>
          <div class="lang-item"><span class="lang-dot"></span>Français — Natif</div>
          <div class="lang-item"><span class="lang-dot"></span>Anglais — Natif</div>
          <div class="lang-item"><span class="lang-dot" style="opacity:0.3"></span>Espagnol — Notions</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- SKILLS -->
<div class="skills-section" id="skills">
  <section>
    <div class="section-label">Compétences</div>
    <h2 class="section-title">Ce que je maîtrise</h2>
    <div class="skills-grid">
      <div class="skill-card fade-in">
        <div class="skill-icon">🌐</div>
        <div class="skill-name">HTML / CSS</div>
        <div class="skill-level">Fondamentaux solides</div>
        <div class="skill-bar"><div class="skill-fill" style="width:70%"></div></div>
      </div>
      <div class="skill-card fade-in" style="transition-delay:0.05s">
        <div class="skill-icon">⚡</div>
        <div class="skill-name">JavaScript</div>
        <div class="skill-level">En apprentissage</div>
        <div class="skill-bar"><div class="skill-fill" style="width:45%"></div></div>
      </div>
      <div class="skill-card fade-in" style="transition-delay:0.1s">
        <div class="skill-icon">🐍</div>
        <div class="skill-name">Python</div>
        <div class="skill-level">Bases acquises</div>
        <div class="skill-bar"><div class="skill-fill" style="width:40%"></div></div>
      </div>
      <div class="skill-card fade-in" style="transition-delay:0.15s">
        <div class="skill-icon">🗄️</div>
        <div class="skill-name">SQL</div>
        <div class="skill-level">Bases acquises</div>
        <div class="skill-bar"><div class="skill-fill" style="width:35%"></div></div>
      </div>
      <div class="skill-card fade-in" style="transition-delay:0.2s">
        <div class="skill-icon">🐙</div>
        <div class="skill-name">GitHub</div>
        <div class="skill-level">Gestion de versions</div>
        <div class="skill-bar"><div class="skill-fill" style="width:55%"></div></div>
      </div>
      <div class="skill-card fade-in" style="transition-delay:0.25s">
        <div class="skill-icon">📦</div>
        <div class="skill-name">VS Code</div>
        <div class="skill-level">Environnement de travail</div>
        <div class="skill-bar"><div class="skill-fill" style="width:75%"></div></div>
      </div>
    </div>
  </section>
</div>

<!-- PROJECTS -->
<section id="projects">
  <div class="section-label">Projets</div>
  <h2 class="section-title">Ce que j'ai réalisé</h2>
  <div class="projects-grid">
    <div class="project-card fade-in">
      <div class="project-number">01</div>
      <div class="project-tags">
        <span class="tag">JavaScript</span>
        <span class="tag">HTML/CSS</span>
      </div>
      <h3 class="project-title">Outil de facturation clients</h3>
      <p class="project-desc">Application web permettant la création, gestion et export de factures clients. Interface intuitive pensée pour les indépendants et PME.</p>
      <span class="project-link">Voir le projet</span>
    </div>

    <div class="project-card fade-in" style="transition-delay:0.1s">
      <div class="project-number">02</div>
      <div class="project-tags">
        <span class="tag">À venir</span>
      </div>
      <h3 class="project-title">Votre prochain projet</h3>
      <p class="project-desc">Un nouveau projet en cours de développement.</p>
      <span class="project-link">En cours</span>
    </div>
  </div>
</section>

<!-- EXPERIENCE / FORMATION -->
<div style="background: var(--dark-2);" id="xp">
  <section>
    <div class="section-label">Parcours</div>
    <h2 class="section-title">Formation & Expériences</h2>
    <div class="timeline">

      <div class="timeline-item fade-in">
        <div class="timeline-date">2025 → 2028</div>
        <div class="timeline-content">
          <h4>Bachelor Développement Informatique</h4>
          <div class="company">Metz Numeric School — Metz</div>
          <p>Formation en développement full stack, architecture logicielle et conception d'outils métier.</p>
        </div>
      </div>

      <div class="timeline-item fade-in" style="transition-delay:0.1s">
        <div class="timeline-date">Juillet 2024</div>
        <div class="timeline-content">
          <h4>Emploi étudiant — Facility Département</h4>
          <div class="company">Banque De Luxembourg</div>
          <p>Travail en équipe, gestion logistique des espaces et déplacement d'œuvres d'art dans un environnement international.</p>
        </div>
      </div>

      <div class="timeline-item fade-in" style="transition-delay:0.2s">
        <div class="timeline-date">2025</div>
        <div class="timeline-content">
          <h4>Baccalauréat STI2D — Mention Assez Bien</h4>
          <div class="company">Lycée Louis Vincent — Metz</div>
          <p>Spécialité Sciences et Technologies de l'Industrie et du Développement Durable.</p>
        </div>
      </div>

      <div class="timeline-item fade-in" style="transition-delay:0.3s">
        <div class="timeline-date">Décembre 2021</div>
        <div class="timeline-content">
          <h4>Stage — Opticien</h4>
          <div class="company">DENY OPTIC</div>
          <p>Accueil et prise en charge clients, conseil produits et assemblage de lunettes.</p>
        </div>
      </div>

    </div>
  </section>
</div>

<!-- CONTACT -->
<section id="contact">
  <div class="contact-grid">
    <div>
      <div class="section-label">Contact</div>
      <h2 class="contact-heading">Travaillons<br><span>ensemble.</span></h2>
      <p style="font-size: 14px; color: var(--text-muted); line-height: 1.8;">
        Disponible pour des stages, alternances ou projets freelance.
        N'hésitez pas à me contacter pour discuter de vos besoins.
      </p>
      <div class="contact-info">
        <div class="contact-item">
          <div class="contact-item-icon">✉</div>
          <a href="mailto:stevens.wrc@gmail.com" style="color: var(--text-muted); text-decoration: none;">stevens.wrc@gmail.com</a>
        </div>
        <div class="contact-item">
          <div class="contact-item-icon">📞</div>
          <a href="tel:+33660852860" style="color: var(--text-muted); text-decoration: none;">+33 6 60 85 28 60</a>
        </div>
        <div class="contact-item">
          <div class="contact-item-icon">📍</div>
          Longeville-lès-Metz, France
        </div>
        <div class="contact-item">
          <div class="contact-item-icon">🎓</div>
          Metz Numeric School
        </div>
      </div>
    </div>

    <div>
      <div class="form-group">
        <label class="form-label">Votre nom</label>
        <input type="text" class="form-input" placeholder="Jean Dupont">
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" class="form-input" placeholder="jean@example.com">
      </div>
      <div class="form-group">
        <label class="form-label">Sujet</label>
        <input type="text" class="form-input" placeholder="Stage, alternance, projet...">
      </div>
      <div class="form-group">
        <label class="form-label">Message</label>
        <textarea class="form-input" placeholder="Votre message..."></textarea>
      </div>
      <button class="btn-primary" style="width: 100%;">Envoyer le message</button>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-logo">W. Stevens</div>
  <div>© 2025 William Stevens — Développeur Full Stack</div>
  <div style="display: flex; gap: 1.5rem;">
    <a href="https://github.com/" target="_blank">GitHub</a>
    <a href="https://linkedin.com/" target="_blank">LinkedIn</a>
  </div>
</footer>

<script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 5: Vérifier dans le browser**

Ouvre `C:\Perso\Portfolio\index.html` dans le browser. Vérifie :
- La nav est fixe avec le logo "W. Stevens" et les 5 liens
- Le hero affiche le titre "William Stevens." et les 2 boutons
- La section skills affiche les 6 cards avec barres de progression
- La timeline affiche 4 entrées
- La section contact affiche le formulaire

Si quelque chose est cassé (police manquante, layout brisé), compare avec `portfolio-william-stevens.html` et identifie ce qui diffère.

- [ ] **Step 6: Commit**

```
git add index.html css/style.css js/main.js
git commit -m "feat: migrate portfolio to 3-file structure (index.html + css/style.css + js/main.js)"
```

---

### Task 2: Hero section — badge disponible + photo circulaire

**Files:**
- Modify: `C:\Perso\Portfolio\index.html`
- Modify: `C:\Perso\Portfolio\css\style.css`

**But de la tâche :** Remplacer le hero v1 (frame rectangulaire + hero-eyebrow) par le hero v2 : badge "DISPONIBLE ALTERNANCE", photo circulaire dorée, sous-titre "Développeur Web Full Stack".

- [ ] **Step 1: Remplacer le HTML du hero dans `index.html`**

Localise le bloc `<!-- HERO -->` et remplace le contenu de `<div class="hero-grid">` par :

```html
<div class="hero-grid">
  <div class="hero-content">
    <div class="available-badge">● DISPONIBLE ALTERNANCE 2025→2028</div>
    <h1>William <span>Stevens</span></h1>
    <div class="hero-subtitle">Développeur Web Full Stack</div>
    <p class="hero-desc">
      Étudiant en Bachelor Développement Informatique à Metz Numeric School,
      je conçois des outils web métier avec PHP, MariaDB, Docker et JavaScript.
    </p>
    <div class="hero-ctas">
      <a href="#projects" class="btn-primary">Voir mes projets</a>
      <a href="#contact" class="btn-outline">Me contacter</a>
    </div>
  </div>

  <div class="hero-visual">
    <div class="hero-photo-circle">
      <!-- Quand tu as ta photo : retire la ligne initiales, décommente la ligne img -->
      <!-- <img src="photo.jpg" alt="William Stevens"> -->
      <div class="hero-photo-initials">WS</div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Supprimer les anciennes règles CSS du hero dans `css/style.css`**

Dans `style.css`, supprime les blocs suivants (ils ne seront plus utilisés) :
- `.hero-eyebrow { ... }` et `.hero-eyebrow::before { ... }`
- `.hero-photo-frame { ... }`
- `.hero-photo-bg { ... }`
- `.hero-photo-placeholder { ... }` et `.hero-photo-placeholder img { ... }`
- `.avatar-circle { ... }`
- `.photo-label { ... }`
- `.hero-langs { ... }` et `.hero-langs p { ... }`
- `.lang-item { ... }`
- `.lang-dot { ... }`

- [ ] **Step 3: Ajouter les nouvelles règles CSS du hero dans `css/style.css`**

Ajoute ces règles dans la section `/* HERO */`, après `.hero-grid { ... }` :

```css
.available-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(201,168,76,0.08);
  color: var(--gold);
  border: 0.5px solid rgba(201,168,76,0.3);
  padding: 0.4rem 1.2rem;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 1.8rem;
  font-family: var(--sans);
}

.hero-subtitle {
  font-size: 13px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 1.5rem;
  font-family: var(--sans);
  margin-top: -0.8rem;
}

.hero-photo-circle {
  width: 280px;
  height: 280px;
  border-radius: 50%;
  border: 2px solid var(--gold);
  background: var(--dark-3);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 0 50px rgba(201,168,76,0.1);
}

.hero-photo-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-photo-initials {
  font-family: var(--serif);
  font-size: 3.5rem;
  color: var(--gold);
  opacity: 0.45;
  user-select: none;
}
```

- [ ] **Step 4: Mettre à jour le responsive pour `.hero-visual`**

Dans le bloc `@media (max-width: 768px)`, la règle `.hero-visual { display: none; }` existe déjà — elle est correcte, garde-la telle quelle.

- [ ] **Step 5: Vérifier dans le browser**

Recharge `index.html`. Vérifie :
- Le badge "● DISPONIBLE ALTERNANCE 2025→2028" est visible en or en haut du bloc texte
- Le titre "William Stevens" est affiché (Playfair Display, grand)
- Sous le titre : "DÉVELOPPEUR WEB FULL STACK" en or, lettre-espacé
- À droite : un cercle doré avec "WS" en initiales
- Les 2 boutons "Voir mes projets" et "Me contacter" sont présents

- [ ] **Step 6: Commit**

```
git add index.html css/style.css
git commit -m "feat: hero v2 — available badge, circular photo, subtitle"
```

---

### Task 3: Skills section — pills par catégorie

**Files:**
- Modify: `C:\Perso\Portfolio\index.html`
- Modify: `C:\Perso\Portfolio\css\style.css`

**But de la tâche :** Remplacer les 6 skill-cards avec barres de progression par des pills groupées en 3 catégories (Backend / Frontend / Outils).

- [ ] **Step 1: Remplacer le HTML de la section skills dans `index.html`**

Localise `<!-- SKILLS -->` et remplace le contenu entre `<h2 class="section-title">` et `</section>` par :

```html
<h2 class="section-title">Stack technique</h2>
<div class="skills-categories">
  <div class="skill-category fade-in">
    <div class="skill-category-label">Backend</div>
    <div class="skill-pills">
      <span class="skill-pill">PHP</span>
      <span class="skill-pill">Python</span>
      <span class="skill-pill">MariaDB</span>
    </div>
  </div>
  <div class="skill-category fade-in" style="transition-delay:0.1s">
    <div class="skill-category-label">Frontend</div>
    <div class="skill-pills">
      <span class="skill-pill">JavaScript</span>
      <span class="skill-pill">HTML / CSS</span>
    </div>
  </div>
  <div class="skill-category fade-in" style="transition-delay:0.2s">
    <div class="skill-category-label">Outils</div>
    <div class="skill-pills">
      <span class="skill-pill">Docker</span>
      <span class="skill-pill">Git</span>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Supprimer les anciennes règles CSS dans `css/style.css`**

Dans `style.css`, supprime les blocs suivants :
- `.skills-grid { ... }`
- `.skill-card { ... }` et `.skill-card:hover { ... }`
- `.skill-icon { ... }`
- `.skill-name { ... }`
- `.skill-level { ... }`
- `.skill-bar { ... }`
- `.skill-fill { ... }`

- [ ] **Step 3: Ajouter les nouvelles règles CSS dans `css/style.css`**

Ajoute ces règles dans la section `/* SKILLS */` :

```css
.skills-categories {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.skill-category-label {
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.skill-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.skill-pill {
  background: rgba(201,168,76,0.08);
  color: var(--gold);
  border: 0.5px solid rgba(201,168,76,0.25);
  padding: 0.5rem 1.2rem;
  font-size: 13px;
  font-family: var(--sans);
  letter-spacing: 0.04em;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.skill-pill:hover {
  background: rgba(201,168,76,0.15);
  border-color: rgba(201,168,76,0.5);
}
```

- [ ] **Step 4: Vérifier dans le browser**

Recharge `index.html` et scrolle jusqu'à la section "Compétences". Vérifie :
- Le titre est "Stack technique"
- 3 groupes visibles : "BACKEND", "FRONTEND", "OUTILS"
- Les pills sont des badges dorés (fond or transparent, bordure or)
- Pas de barres de progression en vue
- Hover sur une pill : fond légèrement plus opaque

- [ ] **Step 5: Commit**

```
git add index.html css/style.css
git commit -m "feat: skills section — replace progress bars with category pills"
```

---

### Task 4: Projects section — 2 vrais projets Mairie

**Files:**
- Modify: `C:\Perso\Portfolio\index.html`
- Modify: `C:\Perso\Portfolio\css\style.css`

**But de la tâche :** Remplacer les cards placeholder par les 2 vrais projets du stage Mairie de Longeville-lès-Metz. Chaque card est un lien `<a>` (GitHub à renseigner plus tard).

- [ ] **Step 1: Remplacer le HTML de la section projects dans `index.html`**

Localise `<!-- PROJECTS -->` et remplace le contenu de `<div class="projects-grid">` par :

```html
<div class="projects-grid">
  <a href="#" class="project-card fade-in" target="_blank" rel="noopener">
    <div class="project-number">01</div>
    <div class="project-tags">
      <span class="tag">PHP</span>
      <span class="tag">MariaDB</span>
      <span class="tag">Docker</span>
      <span class="tag">JavaScript</span>
    </div>
    <h3 class="project-title">Gestion du courrier</h3>
    <p class="project-desc">Application web complète de gestion du courrier entrant et sortant. Déployée en production sur NAS Synology.</p>
    <span class="project-client">Mairie de Longeville-lès-Metz — Stage réel</span>
    <span class="project-link">Voir sur GitHub</span>
  </a>

  <a href="#" class="project-card fade-in" style="transition-delay:0.1s" target="_blank" rel="noopener">
    <div class="project-number">02</div>
    <div class="project-tags">
      <span class="tag">PHP</span>
      <span class="tag">MariaDB</span>
      <span class="tag">Docker</span>
      <span class="tag">JS OOP</span>
    </div>
    <h3 class="project-title">Module Congés</h3>
    <p class="project-desc">Calendrier interactif (FullCalendar) avec gestion des conflits inter-services et validation hiérarchique des demandes.</p>
    <span class="project-client">Mairie de Longeville-lès-Metz — Stage réel</span>
    <span class="project-link">Voir sur GitHub</span>
  </a>
</div>
```

- [ ] **Step 2: Ajouter le CSS pour `.project-client` dans `css/style.css`**

Dans la section `/* PROJECTS */`, ajoute après `.project-desc { ... }` :

```css
.project-client {
  display: block;
  font-size: 11px;
  color: var(--gold);
  letter-spacing: 0.08em;
  opacity: 0.7;
  margin-bottom: 1.2rem;
  font-family: var(--sans);
}
```

- [ ] **Step 3: Vérifier dans le browser**

Scrolle jusqu'à la section "Projets". Vérifie :
- 2 cards uniquement (plus de 3e card placeholder)
- Card 01 : "Gestion du courrier", tags PHP/MariaDB/Docker/JavaScript, mention "Mairie de Longeville-lès-Metz — Stage réel"
- Card 02 : "Module Congés", tags PHP/MariaDB/Docker/JS OOP, même mention
- Hover sur les cards : bordure or, déplacement vertical, barre or en bas

- [ ] **Step 4: Commit**

```
git add index.html css/style.css
git commit -m "feat: projects section — 2 real Mairie projects"
```

---

### Task 5: Timeline — mettre à jour les entrées de parcours

**Files:**
- Modify: `C:\Perso\Portfolio\index.html`

**But de la tâche :** Garder uniquement les 2 entrées pertinentes pour une candidature développeur : Metz Numeric School + Stage Mairie. Supprimer l'emploi Banque De Luxembourg, le stage opticien, et mettre à jour le bac.

- [ ] **Step 1: Remplacer le HTML de la timeline dans `index.html`**

Localise `<!-- EXPERIENCE / FORMATION -->` et remplace le contenu de `<div class="timeline">` par :

```html
<div class="timeline">

  <div class="timeline-item fade-in">
    <div class="timeline-date">2025 → 2028</div>
    <div class="timeline-content">
      <h4>Bachelor Développement Informatique</h4>
      <div class="company">Metz Numeric School — Metz</div>
      <p>Formation full stack : PHP, JavaScript, bases de données relationnelles, Docker et architecture logicielle. En alternance.</p>
    </div>
  </div>

  <div class="timeline-item fade-in" style="transition-delay:0.1s">
    <div class="timeline-date">Printemps 2025</div>
    <div class="timeline-content">
      <h4>Stage Développeur Web</h4>
      <div class="company">Mairie de Longeville-lès-Metz</div>
      <p>Développement de deux applications métier : gestion du courrier et module congés. Stack : PHP · MariaDB · Docker · JavaScript.</p>
    </div>
  </div>

  <div class="timeline-item fade-in" style="transition-delay:0.2s">
    <div class="timeline-date">2025</div>
    <div class="timeline-content">
      <h4>Baccalauréat STI2D — Mention Assez Bien</h4>
      <div class="company">Lycée Louis Vincent — Metz</div>
      <p>Spécialité Sciences et Technologies de l'Industrie et du Développement Durable.</p>
    </div>
  </div>

</div>
```

- [ ] **Step 2: Vérifier dans le browser**

Scrolle jusqu'à "Formation & Expériences". Vérifie :
- 3 entrées uniquement (MNS, Stage Mairie, Bac)
- Pas d'entrée "Banque De Luxembourg" ni "DENY OPTIC"
- La timeline verticale est correctement alignée
- Les points dorés de la timeline sont visibles

- [ ] **Step 3: Commit**

```
git add index.html
git commit -m "feat: timeline — keep MNS + stage Mairie + bac, remove non-dev entries"
```

---

### Task 6: Contact — supprimer le formulaire, centrer en 1 colonne

**Files:**
- Modify: `C:\Perso\Portfolio\index.html`
- Modify: `C:\Perso\Portfolio\css\style.css`

**But de la tâche :** La section contact avait une grille 2 colonnes (infos + formulaire). Le formulaire est supprimé. La section passe en 1 colonne centrée.

- [ ] **Step 1: Remplacer le HTML de la section contact dans `index.html`**

Localise `<!-- CONTACT -->` et remplace l'intégralité de la `<section id="contact">` par :

```html
<section id="contact">
  <div class="contact-centered">
    <div class="section-label">Contact</div>
    <h2 class="contact-heading">Travaillons<br><span>ensemble.</span></h2>
    <p class="contact-intro">
      Disponible pour une alternance dès septembre 2025.
      N'hésitez pas à me contacter.
    </p>
    <div class="contact-info">
      <div class="contact-item">
        <div class="contact-item-icon">✉</div>
        <a href="mailto:stevens.wrc@gmail.com">stevens.wrc@gmail.com</a>
      </div>
      <div class="contact-item">
        <div class="contact-item-icon">📞</div>
        <a href="tel:+33660852860">+33 6 60 85 28 60</a>
      </div>
      <div class="contact-item">
        <div class="contact-item-icon">📍</div>
        <span>Longeville-lès-Metz, France</span>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Supprimer les CSS du formulaire et de la grille dans `css/style.css`**

Dans `style.css`, supprime les blocs :
- `.contact-grid { ... }`
- `.form-group { ... }`
- `.form-label { ... }`
- `.form-input { ... }` (les 3 règles : base, `:focus`, `::placeholder`)
- `textarea.form-input { ... }`

- [ ] **Step 3: Ajouter les nouveaux CSS contact dans `css/style.css`**

Dans la section `/* CONTACT */`, remplace `.contact-grid` par :

```css
.contact-centered {
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
}

.contact-intro {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: 2.5rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.contact-item a {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.contact-item a:hover { color: var(--gold); }
```

- [ ] **Step 4: Mettre à jour le responsive contact dans `css/style.css`**

Dans `@media (max-width: 768px)`, supprime la règle `.contact-grid { grid-template-columns: 1fr; gap: 2.5rem; }` — elle ne sert plus.

- [ ] **Step 5: Vérifier dans le browser**

Scrolle jusqu'à "Contact". Vérifie :
- La section est centrée (1 colonne)
- 3 items : email cliquable, téléphone cliquable, localisation
- Pas de formulaire visible
- Le texte "Disponible pour une alternance dès septembre 2025" est affiché
- Hover sur email/téléphone : couleur or

- [ ] **Step 6: Commit**

```
git add index.html css/style.css
git commit -m "feat: contact section — remove form, 1-column centered layout"
```

---

### Task 7: Burger menu mobile

**Files:**
- Modify: `C:\Perso\Portfolio\index.html`
- Modify: `C:\Perso\Portfolio\css\style.css`
- Modify: `C:\Perso\Portfolio\js\main.js`

**But de la tâche :** Ajouter un burger menu fonctionnel pour mobile. Sur desktop (> 768px) : invisible. Sur mobile : affiche 3 barres, au clic ouvre les nav-links en colonne, les barres s'animent en croix.

- [ ] **Step 1: Ajouter le bouton burger dans le HTML**

Dans `index.html`, localise `<nav>` et ajoute le bouton burger **après** `</ul>` (après la fermeture de `.nav-links`) :

```html
<nav>
  <div class="nav-logo">W. Stevens</div>
  <ul class="nav-links">
    <li><a href="#about">À propos</a></li>
    <li><a href="#skills">Compétences</a></li>
    <li><a href="#projects">Projets</a></li>
    <li><a href="#xp">Expérience</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
  <button class="nav-burger" aria-label="Menu" aria-expanded="false">
    <span></span>
    <span></span>
    <span></span>
  </button>
</nav>
```

- [ ] **Step 2: Ajouter le CSS du burger dans `css/style.css`**

À la fin de la section `/* NAV */` (avant `/* HERO */`), ajoute :

```css
.nav-burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 0.4rem;
  background: none;
  border: none;
  cursor: pointer;
}

.nav-burger span {
  display: block;
  width: 22px;
  height: 1.5px;
  background: var(--text-muted);
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.nav-burger[aria-expanded="true"] span:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
}
.nav-burger[aria-expanded="true"] span:nth-child(2) {
  opacity: 0;
}
.nav-burger[aria-expanded="true"] span:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}
```

- [ ] **Step 3: Mettre à jour le bloc responsive dans `css/style.css`**

Dans `@media (max-width: 768px)`, **remplace** la règle `.nav-links { display: none; }` par :

```css
.nav-burger { display: flex; }

.nav-links {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(14,14,14,0.97);
  flex-direction: column;
  padding: 1.5rem 3rem;
  gap: 1.5rem;
  border-bottom: 0.5px solid rgba(201,168,76,0.15);
  backdrop-filter: blur(12px);
}

.nav-links.open {
  display: flex;
}
```

- [ ] **Step 4: Ajouter la logique burger dans `js/main.js`**

**Remplace** le contenu actuel de `js/main.js` par :

```js
// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Mobile burger menu
const burger = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}
```

- [ ] **Step 5: Vérifier en desktop**

Recharge `index.html` en desktop. Le bouton burger ne doit **pas** être visible. La nav doit fonctionner normalement.

- [ ] **Step 6: Vérifier en mobile**

Dans Chrome DevTools, active le mode mobile (F12 → icône téléphone). Sélectionne une taille ≤ 768px (ex : "iPhone SE" = 375px). Vérifie :
- Le burger (3 barres) est visible en haut à droite
- Clic burger : les liens apparaissent en colonne, les barres forment une croix
- Clic sur un lien : ferme le menu
- Re-clic burger : ferme le menu, barres reviennent en horizontal

- [ ] **Step 7: Commit**

```
git add index.html css/style.css js/main.js
git commit -m "feat: mobile burger menu with animated icon and nav toggle"
```

---

## Self-Review

### 1. Spec coverage

| Requirement spec | Tâche |
|---|---|
| Architecture : 3 fichiers (index.html + css/style.css + js/main.js) | Task 1 |
| Dark Luxe, variables CSS conservées | Task 1 (migration 1:1) |
| Nav fixe, blur, burger mobile | Task 1 (migration) + Task 7 (burger) |
| Hero : badge DISPONIBLE, photo circulaire, 2 CTAs | Task 2 |
| Skills : pills par catégorie (Backend/Frontend/Outils) | Task 3 |
| Projets : 2 cards Mairie (Courrier + Congés) | Task 4 |
| Timeline : MNS 2025→2028 + Stage Mairie | Task 5 |
| Contact : 1 colonne, email/tel/localisation, pas de formulaire | Task 6 |
| Footer : logo + copyright + GitHub + LinkedIn | Task 1 (migration, liens déjà présents) |
| Animations fade-in IntersectionObserver | Task 1 (migration) + Task 7 (JS final) |

Tout est couvert.

### 2. Placeholder scan

Aucun "TBD" ou "TODO" dans le plan. Les hrefs GitHub sont des `#` valides (à renseigner par Steve après). Les dates du stage sont "Printemps 2025" (approximatif mais factuel).

### 3. Type consistency

- La classe `.available-badge` est définie en Task 2 CSS et utilisée en Task 2 HTML ✓
- La classe `.hero-photo-circle` est définie en Task 2 CSS et utilisée en Task 2 HTML ✓
- La classe `.hero-subtitle` est définie en Task 2 CSS et utilisée en Task 2 HTML ✓
- La classe `.skills-categories` / `.skill-category` / `.skill-pills` / `.skill-pill` : définies et utilisées en Task 3 ✓
- La classe `.project-client` : définie en Task 4 CSS, utilisée en Task 4 HTML ✓
- La classe `.contact-centered` / `.contact-intro` : définies en Task 6 CSS, utilisées en Task 6 HTML ✓
- La classe `.nav-burger` : définie en Task 7 CSS, utilisée en Task 7 HTML et JS ✓
