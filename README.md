# Syllabus de Développement Mobile - Flutter & React Native

## 📱 Description

Ce projet contient le syllabus complet pour le cours de développement mobile destiné aux étudiants de BAC 3 en informatique de la Haute École Louvain en Hainaut (HELHa).

Le syllabus couvre deux technologies principales :
- **Flutter** avec le langage Dart
- **React Native** avec JavaScript/TypeScript

## 📚 Contenu du cours

### Section Dart
- Fondamentaux du langage Dart
- Syntaxe avancée et patterns modernes
- Programmation asynchrone
- Null safety et gestion d'erreurs

### Section Flutter
- Introduction au framework Flutter
- Architecture basée sur les widgets
- Gestion d'état (StatefulWidget, Provider, BLoC)
- Intégration Firebase et Firestore
- Exemples d'applications complètes

### Section React Native
- Introduction et installation
- Composants et mise en page avec Flexbox
- Navigation avec React Navigation
- Hooks et patterns modernes
- Exemples pratiques détaillés

## 🛠️ Installation

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation des dépendances

```bash
# Cloner ou télécharger le projet
# Puis installer les dépendances
npm install
```

### Lancement du serveur de développement

```bash
# Lancer VitePress en mode développement
npm run dev
# ou
npm run docs:dev
```

Le site sera accessible à l'adresse : `http://localhost:5173`

### Construction pour la production

```bash
# Construire le site statique
npm run build
# ou
npm run docs:build
```

### Prévisualisation de la version de production

```bash
# Prévisualiser la version construite
npm run preview
# ou
npm run docs:preview
```

## 📁 Structure du projet

```
├── docs/                           # Documentation source
│   ├── .vitepress/                 # Configuration VitePress
│   │   └── config.js               # Configuration principale
│   ├── index.md                    # Page d'accueil
│   ├── introduction.md             # Introduction générale
│   ├── dart/                       # Section Dart
│   │   ├── index.md               # Fondamentaux Dart
│   │   └── syntaxe-avancee.md     # Syntaxe avancée
│   ├── flutter/                    # Section Flutter
│   │   ├── index.md               # Introduction Flutter
│   │   ├── widgets.md             # Widgets avancés
│   │   ├── state-management.md    # Gestion d'état
│   │   ├── bloc-architecture.md   # Architecture BLoC
│   │   └── firebase-firestore.md  # Firebase intégration
│   └── react-native/               # Section React Native
│       ├── index.md               # Introduction RN
│       ├── composants.md          # Composants et layout
│       └── navigation.md          # Navigation
├── package.json                    # Configuration npm
├── .gitignore                      # Fichiers ignorés par Git
└── README.md                       # Ce fichier
```

## 🎯 Objectifs pédagogiques

À la fin de ce cours, les étudiants seront capables de :

1. **Maîtriser les fondamentaux** du développement mobile multiplateforme
2. **Développer des applications Flutter** avec une architecture propre
3. **Créer des applications React Native** en exploitant leurs connaissances web
4. **Choisir la technologie appropriée** selon le contexte du projet
5. **Intégrer des services backend** (Firebase, APIs REST)
6. **Optimiser les performances** et l'expérience utilisateur

## 🔧 Technologies utilisées

- **VitePress** : Générateur de site statique pour la documentation
- **Markdown** : Format de rédaction du contenu
- **Vue.js** : Framework sous-jacent de VitePress
- **Node.js** : Environnement d'exécution

## 📝 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Construit le site pour la production |
| `npm run preview` | Prévisualise la version de production |
| `npm run serve` | Sert la version construite |

## 🎨 Personnalisation

Le thème et la configuration peuvent être modifiés dans le fichier `docs/.vitepress/config.js`.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 👥 Auteurs

- **Haute École Louvain en Hainaut (HELHa)**
- Cours de développement mobile BAC 3 Informatique

---

📚 **Bonne apprentissage du développement mobile !**