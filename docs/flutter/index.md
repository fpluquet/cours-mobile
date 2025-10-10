# Flutter – Introduction et bases
 
## 🎯 Qu'est-ce que Flutter ?

Flutter est un framework de développement d'applications mobiles créé par Google qui permet de créer des applications natives pour iOS et Android à partir d'une seule base de code. Contrairement à d'autres solutions cross-platform, Flutter ne se contente pas de traduire votre code : il dessine directement chaque pixel de l'interface utilisateur.

### Pourquoi choisir Flutter ?

**Avantages clés :**
- **Performance native** : Applications compilées en code machine
- **Hot reload** : Voir les changements instantanément pendant le développement
- **Interface cohérente** : Même apparence sur toutes les plateformes
- **Écosystème riche** : Packages pub.dev et widgets intégrés
- **Communauté active** : Support Google et communauté mondiale

**Cas d'usage idéaux :**
- Applications avec interface personnalisée
- Prototypage rapide
- Applications nécessitant une cohérence visuelle parfaite
- Équipes avec compétences Dart/OOP

::: info Flutter vs Développement natif
Flutter excelle quand vous voulez une interface cohérente et un développement rapide. Pour des applications nécessitant un accès très poussé aux APIs natives ou des performances extrêmes, le développement natif peut rester préférable.
:::

## 📁 Structure d'un projet Flutter

### Arborescence type

```
mon_app_flutter/
├── android/                 # Configuration Android
├── ios/                    # Configuration iOS  
├── lib/                    # Code Dart principal
│   ├── main.dart          # Point d'entrée
│   ├── models/            # Modèles de données
│   ├── screens/           # Écrans de l'app
│   ├── widgets/           # Widgets réutilisables
│   └── services/          # Services (API, DB)
├── test/                  # Tests unitaires
├── integration_test/      # Tests d'intégration
├── assets/               # Ressources statiques
│   ├── images/
│   ├── fonts/
│   └── data/
├── pubspec.yaml          # Configuration du projet
└── README.md
```

### Le fichier `pubspec.yaml`

C'est le fichier de configuration central de votre projet Flutter :

```yaml
name: mon_app_flutter
description: Une application Flutter de démonstration
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: ">=3.10.0"

dependencies:
  flutter:
    sdk: flutter
  
  # Packages utiles - Ajoutez-les avec les commandes suivantes :
  # flutter pub add http               # Client HTTP pour appels API REST et communication réseau
  # flutter pub add provider           # Gestion d'état simple et efficace, recommandée par Flutter
  # flutter pub add shared_preferences # Stockage persistant de données simples (paramètres utilisateur)
  # flutter pub add intl              # Support multilingue et formatage dates/nombres selon la locale

dev_dependencies:
  flutter_test:
    sdk: flutter
  # flutter pub add --dev flutter_lints # Règles de lint officielles pour un code Flutter de qualité

# Configuration des assets
flutter:
  uses-material-design: true
  
  assets:
    - assets/images/
    - assets/data/
  
  fonts:
    - family: Roboto
      fonts:
        - asset: assets/fonts/Roboto-Regular.ttf
        - asset: assets/fonts/Roboto-Bold.ttf
          weight: 700
```

::: warning Gestion des versions
Attention aux versions des packages. Utilisez `flutter pub deps` pour vérifier les conflits et `flutter pub upgrade` pour mettre à jour.
:::

## 🔄 Cycle de vie d'une application Flutter

### Point d'entrée : `main.dart`

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MonApplication());
}

class MonApplication extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mon App Flutter',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: EcranAccueil(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class EcranAccueil extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Accueil'),
      ),
      body: Center(
        child: Text(
          'Bienvenue dans Flutter !',
          style: Theme.of(context).textTheme.headlineMedium,
        ),
      ),
    );
  }
}
```

### MaterialApp vs CupertinoApp

Flutter propose deux designs systems :

```dart
// Material Design (Android style)
MaterialApp(
  title: 'App Material',
  theme: ThemeData(
    primarySwatch: Colors.blue,
    useMaterial3: true,
  ),
  home: MonEcran(),
)

// Cupertino Design (iOS style)
CupertinoApp(
  title: 'App Cupertino',
  theme: CupertinoThemeData(
    primaryColor: CupertinoColors.systemBlue,
  ),
  home: MonEcran(),
)

// Design adaptatif selon la plateforme
import 'dart:io';

Widget build(BuildContext context) {
  if (Platform.isIOS) {
    return CupertinoApp(/* config iOS */);
  } else {
    return MaterialApp(/* config Android */);
  }
}
```

## 🧩 Widgets fondamentaux

En Flutter, **tout est widget**. Un widget décrit une partie de l'interface utilisateur.

### Widgets de structure

```dart
class ExempleStructure extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Structure de base d'un écran
      appBar: AppBar(
        title: Text('Ma Page'),
        actions: [
          IconButton(
            icon: Icon(Icons.search),
            onPressed: () => print('Recherche'),
          ),
        ],
      ),
      
      // Corps principal
      body: Container(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text('Contenu principal'),
            // Autres widgets...
          ],
        ),
      ),
      
      // Menu en bas
      bottomNavigationBar: BottomNavigationBar(
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Accueil',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profil',
          ),
        ],
      ),
      
      // Bouton d'action flottant
      floatingActionButton: FloatingActionButton(
        onPressed: () => print('Action !'),
        child: Icon(Icons.add),
      ),
    );
  }
}
```

### Widgets d'affichage

```dart
class ExempleAffichage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Texte simple
        Text('Titre principal'),
        
        // Texte stylé
        Text(
          'Sous-titre avec style',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.blue,
          ),
        ),
        
        // Texte riche
        RichText(
          text: TextSpan(
            text: 'Texte ',
            style: DefaultTextStyle.of(context).style,
            children: [
              TextSpan(
                text: 'en gras',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              TextSpan(text: ' et normal.'),
            ],
          ),
        ),
        
        SizedBox(height: 20), // Espace vertical
        
        // Image depuis les assets
        Image.asset(
          'assets/images/logo.png',
          width: 100,
          height: 100,
        ),
        
        // Image depuis le réseau
        Image.network(
          'https://picsum.photos/200/200',
          loadingBuilder: (context, child, loadingProgress) {
            if (loadingProgress == null) return child;
            return CircularProgressIndicator();
          },
          errorBuilder: (context, error, stackTrace) {
            return Icon(Icons.error);
          },
        ),
        
        // Icône
        Icon(
          Icons.favorite,
          color: Colors.red,
          size: 30,
        ),
      ],
    );
  }
}
```

### Widgets d'interaction

```dart
class ExempleInteraction extends StatefulWidget {
  @override
  _ExempleInteractionState createState() => _ExempleInteractionState();
}

class _ExempleInteractionState extends State<ExempleInteraction> {
  String _texteInput = '';
  bool _switchValue = false;
  double _sliderValue = 50.0;
  String? _radioValue;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(16.0),
      child: Column(
        children: [
          // Champ de texte
          TextField(
            decoration: InputDecoration(
              labelText: 'Saisissez du texte',
              border: OutlineInputBorder(),
              prefixIcon: Icon(Icons.edit),
            ),
            onChanged: (value) {
              setState(() {
                _texteInput = value;
              });
            },
          ),
          
          SizedBox(height: 16),
          Text('Vous avez tapé: $_texteInput'),
          
          SizedBox(height: 20),
          
          // Boutons
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              ElevatedButton(
                onPressed: () => print('Bouton élevé'),
                child: Text('Élevé'),
              ),
              
              OutlinedButton(
                onPressed: () => print('Bouton contour'),
                child: Text('Contour'),
              ),
              
              TextButton(
                onPressed: () => print('Bouton texte'),
                child: Text('Texte'),
              ),
            ],
          ),
          
          // Switch
          SwitchListTile(
            title: Text('Activer les notifications'),
            value: _switchValue,
            onChanged: (value) {
              setState(() {
                _switchValue = value;
              });
            },
          ),
          
          // Slider
          Text('Valeur: ${_sliderValue.round()}'),
          Slider(
            value: _sliderValue,
            min: 0,
            max: 100,
            divisions: 10,
            label: _sliderValue.round().toString(),
            onChanged: (value) {
              setState(() {
                _sliderValue = value;
              });
            },
          ),
          
          // Radio buttons
          Text('Choisissez une option:'),
          Column(
            children: [
              RadioListTile<String>(
                title: Text('Option A'),
                value: 'A',
                groupValue: _radioValue,
                onChanged: (value) {
                  setState(() {
                    _radioValue = value;
                  });
                },
              ),
              RadioListTile<String>(
                title: Text('Option B'),
                value: 'B',
                groupValue: _radioValue,
                onChanged: (value) {
                  setState(() {
                    _radioValue = value;
                  });
                },
              ),
            ],
          ),
        ],
      ),
    );
  }
}
```

## 🎨 Système de thèmes

Flutter propose un système de thèmes puissant pour maintenir une cohérence visuelle :

```dart
class MonAppAvecTheme extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'App avec thème',
      theme: ThemeData(
        // Couleur principale
        primarySwatch: Colors.teal,
        
        // Utiliser Material 3
        useMaterial3: true,
        
        // Schéma de couleurs personnalisé
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.teal,
          brightness: Brightness.light,
        ),
        
        // Styles de texte
        textTheme: TextTheme(
          headlineLarge: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
          ),
          headlineMedium: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w600,
          ),
          bodyLarge: TextStyle(
            fontSize: 16,
            height: 1.5,
          ),
        ),
        
        // Style des boutons élevés
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
        
        // Style de l'AppBar
        appBarTheme: AppBarTheme(
          centerTitle: true,
          elevation: 0,
          backgroundColor: Colors.transparent,
          foregroundColor: Colors.teal,
        ),
      ),
      
      // Thème sombre
      darkTheme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.teal,
          brightness: Brightness.dark,
        ),
      ),
      
      // Suivre le thème système
      themeMode: ThemeMode.system,
      
      home: PageAvecTheme(),
    );
  }
}

class PageAvecTheme extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Accéder au thème actuel
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Scaffold(
      appBar: AppBar(
        title: Text('Thème personnalisé'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Titre principal',
              style: theme.textTheme.headlineLarge,
            ),
            SizedBox(height: 16),
            
            Text(
              'Sous-titre',
              style: theme.textTheme.headlineMedium,
            ),
            SizedBox(height: 16),
            
            Text(
              'Ceci est un texte utilisant le style de thème par défaut.',
              style: theme.textTheme.bodyLarge,
            ),
            SizedBox(height: 32),
            
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: colorScheme.primaryContainer,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                'Container avec couleur du thème',
                style: TextStyle(color: colorScheme.onPrimaryContainer),
              ),
            ),
            SizedBox(height: 16),
            
            ElevatedButton(
              onPressed: () {},
              child: Text('Bouton thématisé'),
            ),
          ],
        ),
      ),
    );
  }
}
```

## 🌳 Arborescence et hiérarchie des widgets

### Principe fondamental

Flutter utilise une architecture basée sur un arbre de widgets. Chaque widget peut avoir zéro, un ou plusieurs enfants :

```dart
class ExempleArborescence extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(        // Racine de la page
      body: Container(      // Enfant de Scaffold
        child: Column(      // Enfant de Container
          children: [       // Enfants de Column
            Text('Widget 1'),    // Premier enfant
            Row(                 // Deuxième enfant
              children: [        // Enfants de Row
                Icon(Icons.star),
                Text('Widget dans Row'),
              ],
            ),
            Container(           // Troisième enfant
              child: Text('Widget dans Container'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### Widgets de mise en page

```dart
class ExempleMiseEnPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Container avec décoration
            Container(
              width: double.infinity,
              height: 100,
              margin: EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: Colors.blue.shade100,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.blue),
              ),
              child: Center(
                child: Text('Container décoré'),
              ),
            ),
            
            // Mise en page avec Wrap
            Text('Wrap (débordement automatique):'),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: List.generate(10, (index) => 
                Chip(label: Text('Tag $index'))
              ),
            ),
            
            SizedBox(height: 20),
            
            // Card avec contenu
            Card(
              elevation: 4,
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Titre de la carte',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    SizedBox(height: 8),
                    Text('Contenu de la carte avec du texte explicatif.'),
                    SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton(
                          onPressed: () {},
                          child: Text('ANNULER'),
                        ),
                        SizedBox(width: 8),
                        ElevatedButton(
                          onPressed: () {},
                          child: Text('OK'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

## 📱 Exemple complet : "Hello Flutter"

Voici un exemple complet qui combine tous les concepts vus :

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(HelloFlutterApp());
}

class HelloFlutterApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Hello Flutter',
      theme: ThemeData(
        primarySwatch: Colors.indigo,
        useMaterial3: true,
      ),
      home: PageAccueil(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class PageAccueil extends StatefulWidget {
  @override
  _PageAccueilState createState() => _PageAccueilState();
}

class _PageAccueilState extends State<PageAccueil> {
  int _compteur = 0;
  String _nom = '';
  final TextEditingController _controller = TextEditingController();

  void _incrementer() {
    setState(() {
      _compteur++;
    });
  }

  void _decrementer() {
    setState(() {
      if (_compteur > 0) _compteur--;
    });
  }

  void _reinitialiser() {
    setState(() {
      _compteur = 0;
      _nom = '';
      _controller.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Hello Flutter !'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      
      body: Center(
        child: Padding(
          padding: EdgeInsets.all(20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Section de salutation
              Container(
                padding: EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.indigo.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.indigo.shade200),
                ),
                child: Column(
                  children: [
                    Icon(
                      Icons.waving_hand,
                      size: 48,
                      color: Colors.orange,
                    ),
                    SizedBox(height: 16),
                    Text(
                      _nom.isEmpty 
                        ? 'Bonjour !' 
                        : 'Bonjour $_nom !',
                      style: Theme.of(context).textTheme.headlineMedium,
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
              
              SizedBox(height: 32),
              
              // Champ de saisie du nom
              TextField(
                controller: _controller,
                decoration: InputDecoration(
                  labelText: 'Votre nom',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.person),
                ),
                onChanged: (value) {
                  setState(() {
                    _nom = value;
                  });
                },
              ),
              
              SizedBox(height: 32),
              
              // Section compteur
              Card(
                elevation: 4,
                child: Padding(
                  padding: EdgeInsets.all(20),
                  child: Column(
                    children: [
                      Text(
                        'Compteur',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      SizedBox(height: 16),
                      
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          IconButton(
                            onPressed: _decrementer,
                            icon: Icon(Icons.remove),
                            iconSize: 32,
                            style: IconButton.styleFrom(
                              backgroundColor: Colors.red.shade100,
                            ),
                          ),
                          
                          Padding(
                            padding: EdgeInsets.symmetric(horizontal: 24),
                            child: Text(
                              '$_compteur',
                              style: Theme.of(context).textTheme.displayMedium,
                            ),
                          ),
                          
                          IconButton(
                            onPressed: _incrementer,
                            icon: Icon(Icons.add),
                            iconSize: 32,
                            style: IconButton.styleFrom(
                              backgroundColor: Colors.green.shade100,
                            ),
                          ),
                        ],
                      ),
                      
                      SizedBox(height: 16),
                      
                      ElevatedButton.icon(
                        onPressed: _reinitialiser,
                        icon: Icon(Icons.refresh),
                        label: Text('Remettre à zéro'),
                        style: ElevatedButton.styleFrom(
                          padding: EdgeInsets.symmetric(
                            horizontal: 24, 
                            vertical: 12
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              
              SizedBox(height: 32),
              
              // Message conditionnel
              if (_compteur > 0)
                Container(
                  padding: EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: _compteur > 10 
                      ? Colors.orange.shade100 
                      : Colors.green.shade100,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        _compteur > 10 ? Icons.warning : Icons.check_circle,
                        color: _compteur > 10 ? Colors.orange : Colors.green,
                      ),
                      SizedBox(width: 8),
                      Text(
                        _compteur > 10 
                          ? 'Compteur élevé !' 
                          : 'Bonne progression !',
                        style: TextStyle(
                          color: _compteur > 10 ? Colors.orange.shade800 : Colors.green.shade800,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
```

::: tip Hot Reload
Pendant le développement, utilisez Hot Reload (Ctrl+S ou Cmd+S) pour voir vos modifications instantanément. Hot Restart (Ctrl+Shift+R) recharge complètement l'application.
:::

Cette introduction aux bases de Flutter vous donne les fondements nécessaires pour créer vos premières interfaces. Dans la section suivante, nous approfondirons les [widgets et la mise en page](./widgets.md) pour créer des interfaces plus complexes et attrayantes.