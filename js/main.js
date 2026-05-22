// Translations
const translations = {
  fr: {
    'nav.about':         'À propos',
    'nav.skills':        'Compétences',
    'nav.projects':      'Projets',
    'nav.experience':    'Expérience',
    'nav.contact':       'Contact',
    'hero.badge':        '● DISPONIBLE ALTERNANCE 2026→2028',
    'hero.subtitle':     'Développeur Full Stack',
    'hero.desc':         'Étudiant en Bachelor Développement Informatique à Metz Numeric School, je conçois des outils web métier avec PHP, MariaDB, Docker et JavaScript.',
    'hero.cta1':         'Voir mes projets',
    'hero.cta2':         'Me contacter',
    'hero.cvFr':         'CV Français ↓',
    'hero.cvEn':         'CV Anglais ↓',
    'skills.label':      'Compétences',
    'skills.title':      'Stack technique',
    'skills.tools':      'Outils',
    'projects.label':    'Projets',
    'projects.title':    "Ce que j'ai réalisé",
    'projects.p1.title': 'Gestion du courrier',
    'projects.p1.desc':  'Application web complète de gestion du courrier entrant et sortant. Déployée en production sur NAS Synology.',
    'projects.p1.client':'Mairie de Longeville-lès-Metz — Stage',
    'projects.p2.title': 'Module Congés',
    'projects.p2.desc':  'Calendrier interactif (FullCalendar) avec gestion des conflits inter-services et validation hiérarchique des demandes.',
    'projects.p2.client':'Mairie de Longeville-lès-Metz — Stage',
    'xp.label':          'Parcours',
    'xp.title':          'Formation & Expériences',
    'xp.item1.title':    'Bachelor Développement Informatique',
    'xp.item1.company':  'Metz Numeric School — Metz',
    'xp.item1.desc':     'Formation full stack : PHP, JavaScript, bases de données relationnelles, Docker et architecture logicielle. En alternance.',
    'xp.item2.title':    'Stage Développeur Web',
    'xp.item2.company':  'Mairie de Longeville-lès-Metz',
    'xp.item2.desc':     'Développement de deux applications métier : gestion du courrier et module congés. Stack : PHP · MariaDB · Docker · JavaScript.',
    'xp.item3.title':    'Baccalauréat STI2D — Mention Assez Bien',
    'xp.item3.company':  'Lycée Louis Vincent — Metz',
    'xp.item3.desc':     "Spécialité Sciences et Technologies de l'Industrie et du Développement Durable.",
    'contact.heading1':  'Travaillons',
    'contact.heading2':  'ensemble.',
    'contact.intro1':    'Disponible pour une alternance dès septembre 2026.',
    'contact.intro2':    "N'hésitez pas à me contacter.",
    'perso.label':       'Projets personnels',
    'perso.title':       'Ce que je construis pour moi',
    'perso.p1.title':    'Convertisseur Universel',
    'perso.p1.desc':     'Outil de conversion 100% local (images, documents, vidéos, audio). Aucun upload serveur — tout se passe dans le navigateur.',
    'perso.p1.link':     'Utiliser l\'outil →',
    'nav.converter':     'Convertisseur',
    'footer.copy':       '© 2026 William Stevens — Développeur Full Stack',
  },
  en: {
    'nav.about':         'About',
    'nav.skills':        'Skills',
    'nav.projects':      'Projects',
    'nav.experience':    'Experience',
    'nav.contact':       'Contact',
    'hero.badge':        '● AVAILABLE · WORK-STUDY 2026→2028',
    'hero.subtitle':     'Full Stack Developer',
    'hero.desc':         "Bachelor's student in Software Development at Metz Numeric School, I build business web tools using PHP, MariaDB, Docker and JavaScript.",
    'hero.cta1':         'View my projects',
    'hero.cta2':         'Contact me',
    'hero.cvFr':         'French CV ↓',
    'hero.cvEn':         'English CV ↓',
    'skills.label':      'Skills',
    'skills.title':      'Tech Stack',
    'skills.tools':      'Tools',
    'projects.label':    'Projects',
    'projects.title':    "What I've built",
    'projects.p1.title': 'Mail Management',
    'projects.p1.desc':  'Full web application for managing incoming and outgoing mail. Deployed in production on a Synology NAS.',
    'projects.p1.client':'Longeville-lès-Metz City Hall — Internship',
    'projects.p2.title': 'Leave Module',
    'projects.p2.desc':  'Interactive calendar (FullCalendar) with cross-department conflict management and hierarchical approval of leave requests.',
    'projects.p2.client':'Longeville-lès-Metz City Hall — Internship',
    'xp.label':          'Experience',
    'xp.title':          'Education & Experience',
    'xp.item1.title':    'Bachelor in Software Development',
    'xp.item1.company':  'Metz Numeric School — Metz',
    'xp.item1.desc':     'Full stack program: PHP, JavaScript, relational databases, Docker and software architecture. Work-study program.',
    'xp.item2.title':    'Web Developer Internship',
    'xp.item2.company':  'Longeville-lès-Metz City Hall',
    'xp.item2.desc':     'Built two business applications: mail management and leave module. Stack: PHP · MariaDB · Docker · JavaScript.',
    'xp.item3.title':    'French Baccalaureate STI2D — Honors',
    'xp.item3.company':  'Lycée Louis Vincent — Metz',
    'xp.item3.desc':     'Specialty: Science and Technology for Industry and Sustainable Development.',
    'contact.heading1':  "Let's work",
    'contact.heading2':  'together.',
    'contact.intro1':    'Available for an apprenticeship from September 2026.',
    'contact.intro2':    'Feel free to reach out.',
    'perso.label':       'Personal Projects',
    'perso.title':       'What I build for myself',
    'perso.p1.title':    'Universal Converter',
    'perso.p1.desc':     '100% local conversion tool (images, documents, video, audio). No server upload — everything runs in the browser.',
    'perso.p1.link':     'Use the tool →',
    'nav.converter':     'Converter',
    'footer.copy':       '© 2026 William Stevens — Full Stack Developer',
  }
};

function applyLanguage(lang) {
  if (!translations[lang]) lang = 'fr';
  const t = translations[lang];
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  document.querySelectorAll('.lang-opt').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  localStorage.setItem('lang', lang);
}

// Language toggle
const langToggle = document.querySelector('.lang-toggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    const current = localStorage.getItem('lang') || 'fr';
    applyLanguage(current === 'fr' ? 'en' : 'fr');
  });
}

applyLanguage(localStorage.getItem('lang') || 'fr');

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
