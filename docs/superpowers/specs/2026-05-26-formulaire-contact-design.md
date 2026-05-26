# Design — Formulaire Contact Formspree

**Date** : 2026-05-26
**Projet** : Portfolio William Stevens (`C:\Perso\Portfolio`)
**Fichiers concernés** : `index.html`, `css/style.css`, `js/main.js`

---

## Objectif

Ajouter un formulaire de contact fonctionnel dans la section `#contact` du portfolio, via Formspree (plan gratuit). Le formulaire doit être accessible (RGAA) et bloquer les envois après 50 soumissions par mois pour rester dans la limite gratuite.

---

## Layout

La section `#contact` existante conserve les informations de contact en haut (email, téléphone, localisation). Une ligne de séparation dorée (`rgba(201,168,76,0.1)`) divise les infos du formulaire, qui apparaît juste en dessous.

Structure HTML finale :

```
#contact
  .contact-centered
    .section-label
    .contact-heading
    .contact-intro
    .contact-info          ← email / tel / localisation (existant)
    <hr class="contact-divider">
    <form id="contact-form">
      nom, email, sujet, message, bouton
      .form-feedback        ← zone succès / erreur / limite
```

---

## Champs du formulaire

| Champ   | Type     | Requis | Formspree name |
|---------|----------|--------|----------------|
| Nom     | text     | oui    | `name`         |
| Email   | email    | oui    | `email`        |
| Sujet   | text     | oui    | `subject`      |
| Message | textarea | oui    | `message`      |

Champ honeypot caché `_gotcha` pour bloquer les bots (natif Formspree) : `display:none` en CSS + `aria-hidden="true"` + `tabindex="-1"`.

---

## Accessibilité (RGAA)

- `<label for="...">` associé à chaque champ via `id` correspondant
- `aria-required="true"` sur chaque `<input>` et `<textarea>`
- `aria-describedby="field-error"` sur les champs avec message d'erreur inline
- `.form-feedback` : `role="status"` + `aria-live="polite"` pour les messages dynamiques (succès, erreur réseau, limite atteinte)
- Ordre de tabulation naturel (DOM order)
- Contrastes : `#F0EDE6` sur `#1A1A1A` (ratio > 7:1), bouton `#0E0E0E` sur `#C9A84C` (ratio > 5:1)
- `<button type="submit">` avec texte visible (pas d'icône seule)
- Pas de `placeholder` utilisé comme label

---

## Blocage à 50 envois/mois

### Stockage

`localStorage` clé `contact_counter` :

```json
{ "count": 12, "month": "2026-05" }
```

### Logique

Au chargement de la page :
1. Lire `contact_counter` depuis `localStorage`
2. Si `month` ≠ mois courant (format `YYYY-MM`) → reset `{ count: 0, month: "YYYY-MM" }`
3. Si `count >= 50` → afficher l'encart "limite atteinte" à la place du formulaire

À chaque soumission réussie :
1. Incrémenter `count`
2. Sauvegarder dans `localStorage`

### Encart "limite atteinte"

Remplace le `<form>` :

```
✉
Le formulaire est temporairement désactivé.
Écris-moi directement :
[stevens.wrc@gmail.com] (lien mailto)
```

Style : `background #1A1A1A`, bordure `rgba(201,168,76,0.2)`, centré, même largeur que le formulaire.

---

## États du formulaire

### Succès

Après envoi Formspree OK (status 200) :
- Incrémenter le compteur
- Remplacer le `<form>` par un bloc de confirmation (même style que l'encart limite)
- Texte : "Message envoyé ! Je te répondrai dans les plus brefs délais."

### Erreur réseau

Si Formspree renvoie une erreur :
- Afficher un message d'alerte dans `.form-feedback` (via `aria-live`)
- Le formulaire reste visible et modifiable
- Texte : "Une erreur est survenue. Réessaie ou contacte-moi directement."

### Envoi en cours

- Bouton désactivé (`disabled`) + texte "Envoi en cours..."
- Prévient le double-clic

---

## Intégration Formspree

1. Créer un compte sur formspree.io avec `stevens.wrc@gmail.com`
2. Créer un nouveau formulaire → récupérer l'endpoint `https://formspree.io/f/XXXXXXXX`
3. Coller l'endpoint dans `action` du `<form>`

L'envoi se fait en `fetch` (JS) avec `Content-Type: application/json` pour rester sur la page (pas de redirect Formspree).

---

## i18n (FR/EN)

Tous les textes visibles ont un attribut `data-i18n`. Nouvelles clés à ajouter dans `translations` dans `js/main.js` :

| Clé | FR | EN |
|-----|----|----|
| `contact.form.name` | Nom | Name |
| `contact.form.email` | Email | Email |
| `contact.form.subject` | Sujet | Subject |
| `contact.form.message` | Message | Message |
| `contact.form.send` | Envoyer → | Send → |
| `contact.form.sending` | Envoi en cours... | Sending... |
| `contact.form.success` | Message envoyé ! Je te répondrai dans les plus brefs délais. | Message sent! I'll get back to you shortly. |
| `contact.form.error` | Une erreur est survenue. Réessaie ou contacte-moi directement. | Something went wrong. Retry or contact me directly. |
| `contact.form.limit` | Le formulaire est temporairement désactivé. | The form is temporarily unavailable. |
| `contact.form.limitSub` | Écris-moi directement : | Write to me directly: |

---

## CSS

Nouvelles classes dans `style.css` (mobile-first, `max-width: 768px` exception maintenue) :

- `.contact-divider` — séparateur horizontal
- `.contact-form` — grille 2 colonnes (nom + email sur la même ligne desktop)
- `.form-group` — wrapper label + input
- `.form-group label` — label accessible
- `.form-group input`, `.form-group textarea` — champs stylisés thème dark
- `.form-group input:focus`, `.form-group textarea:focus` — outline or
- `.form-feedback` — zone messages dynamiques
- `.form-limit` — encart limite/succès
- `.btn-submit` — bouton envoi (style `.btn-primary` adapté)

---

## Fichiers modifiés

| Fichier | Changement |
|---------|-----------|
| `index.html` | Ajout `<form>` dans `#contact`, endpoint Formspree à renseigner |
| `css/style.css` | Nouvelles classes formulaire |
| `js/main.js` | Logique soumission, compteur localStorage, gestion états, nouvelles clés i18n |
