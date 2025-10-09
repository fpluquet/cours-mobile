# Introduction au développement mobile
 
## 🌍 L'écosystème du développement mobile

Le développement d'applications mobiles a considérablement évolué ces dernières années. Comprendre les différentes approches disponibles est essentiel pour faire les bons choix technologiques.

### Développement natif

Le développement natif consiste à créer des applications spécifiquement pour une plateforme donnée en utilisant les langages et outils officiels :

- **iOS** : Swift ou Objective-C avec Xcode
- **Android** : Kotlin ou Java avec Android Studio

**Avantages :**
- Performances optimales
- Accès complet aux APIs natives
- Interface utilisateur parfaitement adaptée à chaque plateforme

**Inconvénients :**
- Besoin de maintenir deux bases de code distinctes
- Coût de développement plus élevé
- Expertise requise sur chaque plateforme

### Développement hybride

Les applications hybrides utilisent des technologies web (HTML, CSS, JavaScript) encapsulées dans un conteneur natif.

**Exemples :** Apache Cordova, Ionic

**Avantages :**
- Base de code unique
- Utilisation de compétences web existantes

**Inconvénients :**
- Performances limitées
- Interface utilisateur moins native
- Accès limité aux fonctionnalités natives

### Développement cross-platform

Cette approche moderne permet de créer des applications natives à partir d'une base de code unique.

**Exemples :** Flutter, React Native, Xamarin

**Avantages :**
- Code partagé entre plateformes
- Performances proches du natif
- Écosystème riche et communauté active

## 📱 Flutter vs React Native

Dans ce cours, nous nous concentrons sur deux solutions cross-platform leaders :

### Flutter

**Créé par :** Google  
**Langage :** Dart  
**Première version :** 2017

Flutter utilise son propre moteur de rendu pour dessiner chaque pixel de l'interface, garantissant une cohérence visuelle parfaite entre plateformes.

**Points forts :**
- Interface utilisateur cohérente
- Performances excellentes
- Hot reload très rapide
- Riche collection de widgets

### React Native

**Créé par :** Meta (Facebook)  
**Langage :** JavaScript/TypeScript  
**Première version :** 2015

React Native traduit les composants JavaScript en composants natifs de chaque plateforme.

**Points forts :**
- Écosystème JavaScript mature
- Facilité d'adoption pour les développeurs React
- Composants vraiment natifs
- Communauté très active

::: info Choix technologique
Le choix entre Flutter et React Native dépend souvent de l'équipe, du projet et de l'écosystème existant. Les deux technologies permettent de créer d'excellentes applications mobiles.
:::

## 🛠️ Installation et configuration des environnements

### Configuration Flutter

#### 1. Installation du Flutter SDK

**Sur macOS :**
```bash
# Télécharger Flutter SDK
git clone https://github.com/flutter/flutter.git -b stable

# Ajouter Flutter au PATH
export PATH="$PATH:`pwd`/flutter/bin"

# Vérifier l'installation
flutter doctor
```

**Sur Windows :**
- Télécharger le SDK depuis [flutter.dev](https://flutter.dev)
- Extraire l'archive et ajouter le dossier `bin` au PATH
- Exécuter `flutter doctor` dans le terminal

#### 2. Installation d'Android Studio

1. Télécharger Android Studio
2. Installer les SDK Android nécessaires
3. Configurer l'émulateur Android

#### 3. Configuration VS Code

Extensions recommandées :
- Flutter (officielle)
- Dart (officielle)
- Flutter Widget Snippets

### Configuration React Native

#### 1. Installation de Node.js et npm

```bash
# Vérifier Node.js (version 16 ou supérieure)
node --version
npm --version
```

#### 2. Installation d'Expo CLI

```bash
# Installation globale d'Expo CLI
npm install -g @expo/cli

# Vérifier l'installation
expo --version
```

#### 3. React Native CLI (optionnel)

```bash
# Pour les projets sans Expo
npm install -g react-native-cli
```

::: tip Conseil pratique
Commencez par Expo pour React Native : c'est plus simple pour débuter et permet de tester rapidement sur appareil physique.
:::

## 📁 Structure de base des projets

### Projet Flutter

```
mon_app_flutter/
├── android/           # Code spécifique Android
├── ios/              # Code spécifique iOS
├── lib/              # Code Dart principal
│   ├── main.dart     # Point d'entrée
│   └── ...
├── test/             # Tests unitaires
├── assets/           # Ressources (images, fonts)
└── pubspec.yaml      # Configuration et dépendances
```

**Fichier `pubspec.yaml` exemple :**
```yaml
name: mon_app_flutter
description: Une nouvelle application Flutter

version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
```

### Projet React Native

```
MonAppRN/
├── android/          # Code spécifique Android
├── ios/             # Code spécifique iOS
├── src/             # Code source JavaScript
│   ├── components/  # Composants réutilisables
│   ├── screens/     # Écrans de l'application
│   └── ...
├── App.js           # Composant racine
└── package.json     # Configuration et dépendances
```

**Fichier `package.json` exemple :**
```json
{
  "name": "MonAppRN",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.0",
    "expo": "~49.0.0"
  }
}
```

## 🔄 Cycle de vie d'une application mobile

### Cycle de vie Flutter

Une application Flutter passe par plusieurs états :

```dart
class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    switch (state) {
      case AppLifecycleState.resumed:
        print('App au premier plan');
        break;
      case AppLifecycleState.inactive:
        print('App inactive');
        break;
      case AppLifecycleState.paused:
        print('App en arrière-plan');
        break;
      case AppLifecycleState.detached:
        print('App fermée');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Mon App')),
        body: Center(child: Text('Hello Flutter!')),
      ),
    );
  }
}
```

### Cycle de vie React Native

```jsx
import React, { useEffect } from 'react';
import { AppState, View, Text } from 'react-native';

export default function App() {
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      switch (nextAppState) {
        case 'active':
          console.log('App au premier plan');
          break;
        case 'background':
          console.log('App en arrière-plan');
          break;
        case 'inactive':
          console.log('App inactive');
          break;
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => subscription?.remove();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello React Native!</Text>
    </View>
  );
}
```

::: warning Gestion du cycle de vie
La gestion appropriée du cycle de vie est cruciale pour les performances et l'expérience utilisateur. Pensez à nettoyer les ressources (timers, listeners) lors de la fermeture de l'application.
:::

## 🎯 Premiers pas pratiques

### Créer votre première app Flutter

```bash
# Créer un nouveau projet
flutter create ma_premiere_app

# Naviguer dans le dossier
cd ma_premiere_app

# Lancer l'application
flutter run
```

### Créer votre première app React Native

```bash
# Avec Expo
npx create-expo-app MaPremiereAppRN

# Naviguer dans le dossier
cd MaPremiereAppRN

# Lancer l'application
npm start
```

## 📚 Ressources recommandées

### Documentation officielle
- [Flutter.dev](https://flutter.dev) - Documentation complète Flutter
- [Dart.dev](https://dart.dev) - Guide du langage Dart
- [React Native](https://reactnative.dev) - Documentation React Native

### Outils de développement
- **Android Studio** - IDE principal pour le développement Android
- **VS Code** - Éditeur léger avec excellentes extensions
- **Flipper** - Débogage avancé pour React Native

### Communautés
- **Stack Overflow** - Questions techniques
- **GitHub** - Code source et exemples
- **Discord/Slack** - Communautés développeurs

Dans la prochaine section, nous plongerons dans les [fondamentaux du langage Dart](./dart/), la base indispensable pour maîtriser Flutter.