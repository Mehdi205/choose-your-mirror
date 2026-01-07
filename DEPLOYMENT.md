# 🚀 Guide de Déploiement Complet - Choose Your Mirror

Ce guide vous accompagne étape par étape pour mettre votre site en ligne **GRATUITEMENT** !

## 🎯 Options de Déploiement Gratuit

### 1. Vercel (⭐ RECOMMANDÉ)
- ✅ Gratuit à vie
- ✅ Déploiement en 2 minutes
- ✅ HTTPS automatique
- ✅ CDN mondial
- ✅ Domaine gratuit (.vercel.app)

### 2. Netlify
- ✅ Alternative gratuite
- ✅ Interface simple
- ✅ Build automatique

### 3. GitHub Pages + Next.js Static Export
- ✅ 100% gratuit
- ⚠️ Configuration plus complexe

---

## 📋 Avant de Commencer

### Checklist de Préparation

- [ ] Node.js 18+ installé sur votre ordinateur
- [ ] Compte GitHub créé (gratuit)
- [ ] Git installé localement
- [ ] Numéro WhatsApp configuré dans le code

### Configuration WhatsApp

1. Ouvrez le fichier : `lib/whatsapp.ts`
2. Modifiez cette ligne :
```typescript
export const ADMIN_WHATSAPP = '212612345678'; // VOTRE NUMÉRO
```

**Format du numéro :**
- Maroc : `212` + numéro sans le 0
- France : `33` + numéro sans le 0
- Exemple : +212 612 34 56 78 → `212612345678`

---

## 🌐 MÉTHODE 1 : Déploiement via Vercel (Le plus simple)

### Étape 1 : Créer un Compte Vercel

1. Allez sur **https://vercel.com**
2. Cliquez sur **"Sign Up"**
3. Connectez-vous avec **GitHub** (plus simple)
4. Autorisez Vercel à accéder à votre GitHub

### Étape 2 : Préparer votre Code sur GitHub

#### A. Créer un Repository GitHub

1. Allez sur **https://github.com**
2. Cliquez sur le **"+"** en haut à droite
3. Sélectionnez **"New repository"**
4. Remplissez :
   - Repository name : `choose-your-mirror`
   - Description : "Site e-commerce de miroirs personnalisés"
   - Public ou Private : **Public** (recommandé pour Vercel gratuit)
5. Ne cochez rien d'autre
6. Cliquez sur **"Create repository"**

#### B. Pousser votre Code

Ouvrez un terminal dans le dossier `choose-your-mirror` :

```bash
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "🪞 Initial commit - Choose Your Mirror"

# Lier à votre repository GitHub
git remote add origin https://github.com/VOTRE_USERNAME/choose-your-mirror.git

# Pousser le code
git branch -M main
git push -u origin main
```

**Remplacez** `VOTRE_USERNAME` par votre nom d'utilisateur GitHub !

### Étape 3 : Déployer sur Vercel

1. Retournez sur **https://vercel.com**
2. Cliquez sur **"New Project"**
3. Cliquez sur **"Import Git Repository"**
4. Sélectionnez votre repository `choose-your-mirror`
5. Vercel détecte automatiquement Next.js
6. Ne changez rien dans les paramètres
7. Cliquez sur **"Deploy"**
8. ⏳ Attendez 1-2 minutes...
9. ✅ **VOTRE SITE EST EN LIGNE !**

### Étape 4 : Accéder à votre Site

Vercel vous donne une URL comme :
```
https://choose-your-mirror-xxxxx.vercel.app
```

🎉 **Félicitations !** Votre site est maintenant accessible par tout le monde !

### Étape 5 : Mises à Jour Futures

Pour mettre à jour votre site :

```bash
# Faites vos modifications dans le code
# Puis :

git add .
git commit -m "✨ Ajout de nouveaux produits"
git push
```

Vercel **redéploie automatiquement** en 1-2 minutes ! 🚀

---

## 🔧 MÉTHODE 2 : Déploiement via Vercel CLI

Si vous préférez la ligne de commande :

### Installation

```bash
npm install -g vercel
```

### Déploiement

```bash
cd choose-your-mirror
vercel
```

Suivez les instructions :
1. "Set up and deploy" → Yes
2. "Which scope" → Votre compte
3. "Link to existing project" → No
4. "What's your project's name" → choose-your-mirror
5. "In which directory" → ./ (appuyez sur Entrée)
6. "Want to override settings" → No

✅ Le site est déployé !

---

## 🎨 BONUS : Configurer un Domaine Personnalisé

### Option 1 : Domaine Gratuit Vercel

Vous avez déjà un domaine gratuit : `votre-site.vercel.app`

### Option 2 : Acheter un Domaine Custom

1. Achetez un domaine sur :
   - **Namecheap** (~10 DH/an)
   - **OVH** (~20 DH/an)
   - **GoDaddy**

2. Dans Vercel :
   - Allez dans **Settings** de votre projet
   - Cliquez sur **Domains**
   - Ajoutez votre domaine : `www.chooseyourmirror.ma`
   - Suivez les instructions pour configurer le DNS

---

## 📊 Tester votre Site en Ligne

### Checklist de Test

- [ ] Page d'accueil s'affiche correctement
- [ ] Navigation fonctionne (menu, footer)
- [ ] Page produits affiche les produits
- [ ] Ajout au panier fonctionne
- [ ] Page panier affiche les articles
- [ ] Formulaire de commande se remplit
- [ ] Bouton WhatsApp redirige correctement
- [ ] Dashboard admin accessible sur `/admin`
- [ ] Connexion admin fonctionne (mdp: admin123)
- [ ] Ajout de produit fonctionne dans l'admin

### URLs à Tester

- `https://votre-site.vercel.app/` - Accueil
- `https://votre-site.vercel.app/products` - Produits
- `https://votre-site.vercel.app/cart` - Panier
- `https://votre-site.vercel.app/admin` - Admin

---

## 🛠️ Dépannage

### Problème : Le site ne se déploie pas

**Solution :**
1. Vérifiez que `package.json` est présent
2. Vérifiez qu'il n'y a pas d'erreurs dans le code
3. Regardez les logs Vercel pour voir l'erreur

### Problème : WhatsApp ne s'ouvre pas

**Solution :**
1. Vérifiez le numéro dans `lib/whatsapp.ts`
2. Format : code pays + numéro (sans espaces, sans +)
3. Testez sur un vrai téléphone (pas émulateur)

### Problème : Les images ne s'affichent pas

**Solution :**
1. Utilisez des URLs complètes pour les images
2. Services gratuits : Imgur, Cloudinary, Unsplash
3. Ou hébergez les images dans `/public/images/`

### Problème : Le localStorage ne fonctionne pas

**Solution :**
- C'est normal ! Le localStorage est local à chaque navigateur
- Les produits ajoutés par l'admin sont visibles uniquement sur son navigateur
- Pour partager les produits : utilisez une vraie base de données (voir README)

---

## 📈 Optimisations Post-Déploiement

### 1. Ajouter Google Analytics

Dans `app/layout.tsx`, ajoutez :
```tsx
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_ID" />
```

### 2. Améliorer le SEO

- Ajoutez des métadonnées dans chaque page
- Créez un `sitemap.xml`
- Ajoutez un `robots.txt`

### 3. Performances

- Optimisez les images (WebP, tailles appropriées)
- Activez la mise en cache
- Utilisez lazy loading

---

## 🎓 Ressources Utiles

- **Documentation Vercel** : https://vercel.com/docs
- **Documentation Next.js** : https://nextjs.org/docs
- **Tailwind CSS** : https://tailwindcss.com/docs
- **WhatsApp Business API** : https://business.whatsapp.com

---

## 💡 Conseils Pro

1. **Sauvegardez votre code** régulièrement sur GitHub
2. **Testez sur mobile** avant de partager le lien
3. **Changez le mot de passe admin** immédiatement
4. **Activez HTTPS** (automatique sur Vercel)
5. **Surveillez les performances** avec Vercel Analytics

---

## 🎉 Vous êtes Prêt !

Votre site **Choose Your Mirror** est maintenant en ligne et accessible par vos clients ! 

### Prochaines Étapes

1. ✅ Ajoutez vos vrais produits dans l'admin
2. ✅ Testez une commande WhatsApp complète
3. ✅ Partagez le lien avec vos clients
4. ✅ Commencez à vendre !

**Besoin d'aide ?** Contactez-nous sur WhatsApp ! 💬

---

*Guide créé avec ❤️ pour Choose Your Mirror*
