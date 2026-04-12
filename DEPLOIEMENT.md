# 🎓 Taté v2.0 — Guide de déploiement

## Étapes avant déploiement

### 1. Variables d'environnement (backend .env)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...   # Ton URI Atlas
JWT_SECRET=...                  # Chaîne aléatoire 64 chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=...          # Autre chaîne aléatoire
JWT_REFRESH_EXPIRES_IN=7d
ANTHROPIC_API_KEY=sk-ant-...
ADMIN_EMAIL=admin@tate.sn
ADMIN_PASSWORD=TateAdmin2024!
ADMIN_NOM=Administrateur Taté
FRONTEND_URL=https://tate.sn
```

### 2. Lancer le seed (une seule fois)
```bash
npm run seed
```
Crée l'admin, les matières (académiques + langues africaines), les chapitres.

### 3. Démarrer le backend
```bash
npm start
```

### 4. Frontend — variables (.env)
```
VITE_API_URL=https://api.tate.sn/api
```

### 5. Build frontend
```bash
npm run build
```
→ Le dossier `dist/` est à servir via Nginx/Vercel/Netlify.

---

## Ce qui est prêt ✅

### Espace Élève
- Accueil avec matières académiques + boutons Langues et Tutorat
- **Progression IA adaptative** : l'IA évalue après chaque batch et décide de continuer, faire de la remédiation, ou déclarer la maîtrise
- Cours de **Wolof, Pulaar, Arabe, Russe, Mandingue, Sérère**
- Page Tutorat avec réservation + paiement **Wave / Orange Money / Carte**

### Niveaux disponibles
- Primaire : CM1, CM2
- Collège : 6ème, 5ème, 4ème, 3ème
- Lycée : **Seconde, Première, Terminale** ← nouveau

### Espace Professeur
- Dashboard, Préparer un cours avec Claude, Mes élèves, Mes leçons

### Espace Admin
- Gestion utilisateurs, chapitres, leçons, stats

### Espace Parent
- Suivi progression enfant

---

## Intégrations paiement à connecter

Les endpoints sont prêts, les URLs de redirection Wave/Orange Money sont simulées.
Pour la production :
- **Wave** : utiliser l'API Wave Business
- **Orange Money** : utiliser l'API OM Sénégal
- Les endpoints `/api/reservations/:id/payer` et `/api/reservations/:id/confirmer-paiement` sont prêts.
