# Formulaire Contact Formspree — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un formulaire de contact accessible (RGAA) dans `#contact` via Formspree, avec blocage à 50 envois/mois via localStorage.

**Architecture:** 3 fichiers modifiés uniquement — `index.html` (HTML + CSP), `css/style.css` (styles formulaire), `js/main.js` (i18n + logique counter + soumission). Pas de nouveau fichier. La logique de counter est indépendante de la logique de soumission et des styles.

**Tech Stack:** Formspree (fetch JSON), localStorage, vanilla JS ES6, CSS custom properties existantes.

---

## Fichiers modifiés

| Fichier | Rôle |
|---------|------|
| `js/main.js` | Ajout clés i18n + fonctions counter + handler soumission |
| `css/style.css` | Styles formulaire (champs, bouton, encarts succès/limite) |
| `index.html` | HTML formulaire dans `#contact` + CSP mise à jour |

---

## Task 1 : Clés i18n dans `js/main.js`

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1 : Ajouter les clés FR dans l'objet `translations.fr`**

Dans `js/main.js`, après la ligne `'footer.copy': '© 2026 William Stevens — Développeur Full Stack',` (avant la virgule de fermeture du bloc `fr`), ajouter :

```js
    'contact.form.name':     'Nom',
    'contact.form.email':    'Email',
    'contact.form.subject':  'Sujet',
    'contact.form.message':  'Message',
    'contact.form.send':     'Envoyer →',
    'contact.form.sending':  'Envoi en cours...',
    'contact.form.required': 'Tous les champs sont requis.',
    'contact.form.success':  'Message envoyé ! Je te répondrai dans les plus brefs délais.',
    'contact.form.error':    'Une erreur est survenue. Réessaie ou contacte-moi directement.',
    'contact.form.limit':    'Le formulaire est temporairement désactivé.',
    'contact.form.limitSub': 'Écris-moi directement :',
```

- [ ] **Step 2 : Ajouter les clés EN dans l'objet `translations.en`**

Après la ligne `'footer.copy': '© 2026 William Stevens — Full Stack Developer',` (avant la virgule de fermeture du bloc `en`), ajouter :

```js
    'contact.form.name':     'Name',
    'contact.form.email':    'Email',
    'contact.form.subject':  'Subject',
    'contact.form.message':  'Message',
    'contact.form.send':     'Send →',
    'contact.form.sending':  'Sending...',
    'contact.form.required': 'All fields are required.',
    'contact.form.success':  'Message sent! I\'ll get back to you shortly.',
    'contact.form.error':    'Something went wrong. Retry or contact me directly.',
    'contact.form.limit':    'The form is temporarily unavailable.',
    'contact.form.limitSub': 'Write to me directly:',
```

- [ ] **Step 3 : Vérifier en console**

Ouvrir `index.html` dans le navigateur → console → taper :
```js
translations.fr['contact.form.send']   // → "Envoyer →"
translations.en['contact.form.limit']  // → "The form is temporarily unavailable."
```
Les deux doivent retourner les bonnes valeurs.

- [ ] **Step 4 : Commit**

```bash
git add js/main.js
git commit -m "feat: add i18n keys for contact form (FR/EN)"
```

---

## Task 2 : CSS du formulaire dans `css/style.css`

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1 : Ajouter les styles après le bloc `/* CONTACT */`**

Dans `css/style.css`, après la règle `.contact-item a:hover { color: var(--gold); }` (ligne ~606), ajouter :

```css
  /* CONTACT FORM */
  .contact-divider {
    border: none;
    border-top: 0.5px solid rgba(201,168,76,0.1);
    margin: 2rem 0;
    width: 100%;
  }

  .contact-form { text-align: left; width: 100%; }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1rem;
  }

  .form-group label {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .form-group input,
  .form-group textarea {
    background: var(--dark-2);
    border: 0.5px solid rgba(201,168,76,0.15);
    border-radius: 4px;
    padding: 0.75rem 1rem;
    color: var(--text);
    font-family: var(--sans);
    font-size: 14px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    border-color: rgba(201,168,76,0.5);
    box-shadow: 0 0 0 2px rgba(201,168,76,0.08);
  }

  .form-group textarea {
    resize: vertical;
    min-height: 120px;
  }

  .btn-submit {
    background: var(--gold);
    color: var(--dark);
    border: none;
    padding: 0.9rem 2.5rem;
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    width: 100%;
    transition: opacity 0.2s;
  }

  .btn-submit:hover:not(:disabled) { opacity: 0.85; }

  .btn-submit:disabled {
    background: var(--dark-3);
    color: var(--text-muted);
    cursor: not-allowed;
  }

  .form-feedback {
    font-size: 13px;
    color: var(--gold);
    min-height: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .form-limit,
  .form-success {
    background: var(--dark-2);
    border: 0.5px solid rgba(201,168,76,0.2);
    border-radius: 4px;
    padding: 2rem;
    text-align: center;
  }

  .form-limit p,
  .form-success p {
    color: var(--text-muted);
    font-size: 13px;
    margin-bottom: 0.5rem;
  }

  .form-limit a { color: var(--gold); text-decoration: underline; }

  .form-limit-icon,
  .form-success-icon {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
```

- [ ] **Step 2 : Ajouter les règles responsive dans `@media (max-width: 768px)`**

Dans le bloc `@media (max-width: 768px)` existant (en fin de fichier), avant l'accolade fermante `}`, ajouter :

```css
    .form-row { grid-template-columns: 1fr; }
```

- [ ] **Step 3 : Vérifier visuellement**

Ouvrir `index.html` — aller à `#contact`. Pas encore de formulaire visible mais aucun style ne doit casser. Passer en 375px de large : la grille doit toujours tenir.

- [ ] **Step 4 : Commit**

```bash
git add css/style.css
git commit -m "feat: add contact form CSS styles"
```

---

## Task 3 : HTML du formulaire dans `index.html`

**Files:**
- Modify: `index.html`

- [ ] **Step 1 : Ajouter la ligne de séparation et le formulaire après `.contact-info`**

Dans `index.html`, remplacer le bloc `<!-- CONTACT -->` existant :

```html
<!-- CONTACT -->
<section id="contact">
  <div class="contact-centered">
    <div class="section-label">Contact</div>
    <h2 class="contact-heading"><span data-i18n="contact.heading1">Travaillons</span><br><span class="heading-accent" data-i18n="contact.heading2">ensemble.</span></h2>
    <p class="contact-intro">
      <span data-i18n="contact.intro1">Disponible pour une alternance dès septembre 2026.</span><br>
      <span data-i18n="contact.intro2">N'hésitez pas à me contacter.</span>
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
    <hr class="contact-divider" aria-hidden="true">
    <form
      id="contact-form"
      class="contact-form"
      action="https://formspree.io/f/XXXXXXXX"
      method="POST"
      novalidate
    >
      <input type="text" name="_gotcha" style="display:none" aria-hidden="true" tabindex="-1">
      <div class="form-row">
        <div class="form-group">
          <label for="contact-name" data-i18n="contact.form.name">Nom</label>
          <input
            type="text"
            id="contact-name"
            name="name"
            autocomplete="name"
            aria-required="true"
          >
        </div>
        <div class="form-group">
          <label for="contact-email" data-i18n="contact.form.email">Email</label>
          <input
            type="email"
            id="contact-email"
            name="email"
            autocomplete="email"
            aria-required="true"
          >
        </div>
      </div>
      <div class="form-group">
        <label for="contact-subject" data-i18n="contact.form.subject">Sujet</label>
        <input
          type="text"
          id="contact-subject"
          name="subject"
          aria-required="true"
        >
      </div>
      <div class="form-group">
        <label for="contact-message" data-i18n="contact.form.message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          aria-required="true"
        ></textarea>
      </div>
      <div class="form-feedback" role="status" aria-live="polite" id="form-feedback"></div>
      <button type="submit" class="btn-submit" data-i18n="contact.form.send">Envoyer →</button>
    </form>
  </div>
</section>
```

- [ ] **Step 2 : Vérifier visuellement**

Ouvrir `index.html` → section `#contact` :
- Les 4 champs sont visibles et stylisés
- Les labels sont au-dessus des champs
- Le bouton "Envoyer →" est en or
- Nom/Email sont côte à côte sur desktop, empilés sur mobile (375px)
- Navigation clavier (Tab) passe dans l'ordre : Nom → Email → Sujet → Message → Bouton

- [ ] **Step 3 : Vérifier l'accessibilité**

Dans DevTools → accessibilité :
- Chaque champ a un label associé
- `aria-required="true"` présent sur les 4 champs
- `role="status"` et `aria-live="polite"` sur `#form-feedback`

- [ ] **Step 4 : Commit**

```bash
git add index.html
git commit -m "feat: add accessible contact form HTML (Formspree, RGAA)"
```

---

## Task 4 : Logique JS — counter + soumission dans `js/main.js`

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1 : Ajouter les fonctions counter et showContactLimit à la fin de `js/main.js`**

Ajouter après le dernier bloc existant (après la ligne `document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));`) :

```js
// Contact form
function getContactCounter() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  try {
    const raw = localStorage.getItem('contact_counter');
    if (!raw) return { count: 0, month: currentMonth };
    const data = JSON.parse(raw);
    if (data.month !== currentMonth) return { count: 0, month: currentMonth };
    return data;
  } catch {
    return { count: 0, month: currentMonth };
  }
}

function incrementContactCounter() {
  const counter = getContactCounter();
  counter.count += 1;
  localStorage.setItem('contact_counter', JSON.stringify(counter));
}

function isContactLimitReached() {
  return getContactCounter().count >= 50;
}

function showContactLimit() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const lang = localStorage.getItem('lang') || 'fr';
  const t = translations[lang] || translations.fr;
  const div = document.createElement('div');
  div.className = 'form-limit';
  const icon = document.createElement('div');
  icon.className = 'form-limit-icon';
  icon.textContent = '✉';
  const p1 = document.createElement('p');
  p1.setAttribute('data-i18n', 'contact.form.limit');
  p1.textContent = t['contact.form.limit'];
  const p2 = document.createElement('p');
  p2.setAttribute('data-i18n', 'contact.form.limitSub');
  p2.textContent = t['contact.form.limitSub'];
  const a = document.createElement('a');
  a.href = 'mailto:stevens.wrc@gmail.com';
  a.textContent = 'stevens.wrc@gmail.com';
  div.appendChild(icon);
  div.appendChild(p1);
  div.appendChild(p2);
  div.appendChild(a);
  form.replaceWith(div);
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  if (isContactLimitReached()) {
    showContactLimit();
  } else {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const lang = localStorage.getItem('lang') || 'fr';
      const t = translations[lang] || translations.fr;
      const btn = contactForm.querySelector('.btn-submit');
      const feedback = document.getElementById('form-feedback');

      const name    = document.getElementById('contact-name').value.trim();
      const email   = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !subject || !message) {
        feedback.textContent = t['contact.form.required'];
        return;
      }

      btn.disabled = true;
      btn.textContent = t['contact.form.sending'];
      feedback.textContent = '';

      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name, email, subject, message })
        });

        if (res.ok) {
          incrementContactCounter();
          const div = document.createElement('div');
          div.className = 'form-success';
          const icon = document.createElement('div');
          icon.className = 'form-success-icon';
          icon.textContent = '✓';
          const p = document.createElement('p');
          p.setAttribute('data-i18n', 'contact.form.success');
          p.textContent = t['contact.form.success'];
          div.appendChild(icon);
          div.appendChild(p);
          contactForm.replaceWith(div);
        } else {
          feedback.textContent = t['contact.form.error'];
          btn.disabled = false;
          btn.textContent = t['contact.form.send'];
        }
      } catch {
        feedback.textContent = t['contact.form.error'];
        btn.disabled = false;
        btn.textContent = t['contact.form.send'];
      }
    });
  }
}
```

- [ ] **Step 2 : Tester le counter en console**

Ouvrir `index.html` → console DevTools :
```js
// Simuler 50 envois
localStorage.setItem('contact_counter', JSON.stringify({ count: 50, month: new Date().toISOString().slice(0,7) }))
location.reload()
```
→ Le formulaire doit disparaître, remplacé par l'encart avec le lien email.

Remettre à zéro :
```js
localStorage.removeItem('contact_counter')
location.reload()
```
→ Le formulaire doit réapparaître.

- [ ] **Step 3 : Tester la validation**

Cliquer "Envoyer →" avec les champs vides → message "Tous les champs sont requis." doit apparaître dans `#form-feedback`.

- [ ] **Step 4 : Tester le toggle FR/EN**

Basculer en EN → les labels du formulaire passent en anglais, le bouton affiche "Send →". Basculer en FR → retour en français.

- [ ] **Step 5 : Commit**

```bash
git add js/main.js
git commit -m "feat: contact form logic (localStorage counter + Formspree fetch)"
```

---

## Task 5 : CSP + endpoint Formspree

**Files:**
- Modify: `index.html`

- [ ] **Step 1 : Mettre à jour le meta CSP**

Dans `index.html`, remplacer la ligne :
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self'; script-src 'self'; object-src 'none'; frame-src 'none';">
```
par :
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self'; script-src 'self'; connect-src https://formspree.io; object-src 'none'; frame-src 'none';">
```

- [ ] **Step 2 : Créer le compte Formspree et récupérer l'endpoint**

1. Aller sur https://formspree.io
2. Créer un compte avec `stevens.wrc@gmail.com`
3. Créer un nouveau formulaire (plan Free)
4. Copier l'endpoint — format : `https://formspree.io/f/xxxxxxxx`

- [ ] **Step 3 : Remplacer le placeholder dans `index.html`**

Dans `index.html`, remplacer :
```html
action="https://formspree.io/f/XXXXXXXX"
```
par l'endpoint réel récupéré à l'étape précédente, ex. :
```html
action="https://formspree.io/f/xpzgkbjw"
```

- [ ] **Step 4 : Tester l'envoi réel**

Remplir le formulaire avec de vraies données et soumettre. Vérifier dans la boîte mail `stevens.wrc@gmail.com` que le message est bien reçu. Le formulaire doit se remplacer par le message de confirmation.

- [ ] **Step 5 : Commit final**

```bash
git add index.html
git commit -m "feat: update CSP for Formspree + set real endpoint"
```

- [ ] **Step 6 : Push et vérifier en production**

```bash
git push origin master
```

Aller sur https://gb-william.github.io → section Contact → tester l'envoi. Vérifier réception mail.
