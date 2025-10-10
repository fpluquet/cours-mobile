# Flutter – Gestion de l'état
 
## 🎯 Comprendre l'état en Flutter

L'état (state) représente les données qui peuvent changer pendant le cycle de vie d'un widget. La gestion de l'état est l'un des concepts les plus importants en Flutter, car elle détermine comment votre interface utilisateur réagit aux changements de données.

### Types d'état

**État local (Widget State) :**
- État spécifique à un widget
- Ne concerne qu'un seul écran ou composant
- Exemples : valeur d'un compteur, texte d'un champ de saisie

**État global (App State) :**
- État partagé entre plusieurs widgets
- Persiste à travers différents écrans
- Exemples : données utilisateur, préférences, panier d'achat

::: info État vs Données
L'état représente des données qui changent et affectent l'UI. Les données statiques (comme une liste de pays) ne constituent pas un état.
:::

## 🔄 StatelessWidget vs StatefulWidget

### StatelessWidget

Un `StatelessWidget` est **immutable** : il ne peut pas changer son état après sa création. Une fois construit, ses propriétés restent fixes.

**Quand l'utiliser :**
- Pour afficher des données qui ne changent pas
- Pour des widgets de présentation pure
- Quand on reçoit des données du widget parent

```dart
class AffichageUtilisateur extends StatelessWidget {
  final String nom;
  final int age;
  
  const AffichageUtilisateur({
    Key? key,
    required this.nom,
    required this.age,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Text(nom, style: Theme.of(context).textTheme.titleLarge),
            Text('$age ans'),
          ],
        ),
      ),
    );
  }
}
```

::: tip Astuce
Utilisez `const` autant que possible avec `StatelessWidget` pour optimiser les performances et éviter les reconstructions inutiles.
:::

### StatefulWidget

Un `StatefulWidget` peut **changer son état** et se redessiner automatiquement. Il est composé de deux classes :
1. **La classe widget** : définit la configuration
2. **La classe State** : contient l'état mutable et la logique

**Quand l'utiliser :**
- Quand des données peuvent changer (compteur, formulaire, etc.)
- Pour gérer des interactions utilisateur
- Quand vous avez besoin de `setState()`

```dart
class Compteur extends StatefulWidget {
  @override
  _CompteurState createState() => _CompteurState();
}

class _CompteurState extends State<Compteur> {
  int _valeur = 0; // État mutable
  
  void _incrementer() {
    setState(() { // Déclenche un rebuild
      _valeur++;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Compteur: $_valeur'),
        ElevatedButton(
          onPressed: _incrementer,
          child: Text('Incrémenter'),
        ),
      ],
    );
  }
}
```

::: info setState()
`setState()` informe Flutter qu'un changement a eu lieu et qu'il faut redessiner le widget. **Tout le code qui modifie l'état doit être dans setState()**.
:::
  
## 🔄 Cycle de vie d'un StatefulWidget

Le cycle de vie détermine **quand et comment** votre widget est créé, mis à jour et détruit. Comprendre ce cycle est essentiel pour bien gérer les ressources et éviter les fuites mémoire.

### Les principales méthodes

**1. `initState()`** - Initialisation unique
- Appelée une seule fois, après la création du widget
- Utilisée pour initialiser les données, créer des controllers, etc.

**2. `build()`** - Construction de l'interface
- Appelée à chaque fois que le widget doit être redessiné
- Doit retourner l'arbre de widgets à afficher

**3. `dispose()`** - Nettoyage final
- Appelée avant la destruction du widget
- **OBLIGATOIRE** pour libérer les ressources (controllers, timers, etc.)

```dart
class ExempleCycleDeVie extends StatefulWidget {
  @override
  _ExempleCycleDeVieState createState() => _ExempleCycleDeVieState();
}

class _ExempleCycleDeVieState extends State<ExempleCycleDeVie> {
  late TextEditingController _controller;
  String _statut = 'Prêt';
  
  @override
  void initState() {
    super.initState();
    print('✅ Widget créé');
    _controller = TextEditingController();
    _chargerDonnees();
  }
  
  @override
  Widget build(BuildContext context) {
    print('🔄 Interface redessinée');
    return Scaffold(
      appBar: AppBar(title: Text('Cycle de vie')),
      body: Center(
        child: Column(
          children: [
            Text('Statut: $_statut'),
            TextField(controller: _controller),
            ElevatedButton(
              onPressed: () => setState(() => _statut = 'Mis à jour'),
              child: Text('Mettre à jour'),
            ),
          ],
        ),
      ),
    );
  }
  
  @override
  void dispose() {
    print('🗑️ Widget détruit - nettoyage');
    _controller.dispose(); // IMPORTANT !
    super.dispose();
  }
  
  void _chargerDonnees() async {
    await Future.delayed(Duration(seconds: 1));
    if (mounted) { // Vérifier que le widget existe encore
      setState(() => _statut = 'Données chargées');
    }
  }
}
```

::: warning Attention !
- **Toujours** appeler `dispose()` sur les controllers et streams
- **Vérifier `mounted`** avant `setState()` dans les callbacks asynchrones
- **Ne jamais** oublier `super.initState()` et `super.dispose()`
:::
            
## 🎛️ setState() - La base de la gestion d'état

`setState()` est la méthode fondamentale pour modifier l'état local d'un widget. Elle indique à Flutter qu'il faut redessiner le widget car des données ont changé.

### Principe de fonctionnement

1. **Modifier les données** dans la fonction passée à `setState()`
2. **Flutter redessine** automatiquement le widget
3. **L'interface se met à jour** avec les nouvelles valeurs

### Exemple simple : Liste de tâches

```dart
class ListeTaches extends StatefulWidget {
  @override
  _ListeTachesState createState() => _ListeTachesState();
}

class _ListeTachesState extends State<ListeTaches> {
  List<String> _taches = [];
  final _controller = TextEditingController();
  
  void _ajouterTache() {
    if (_controller.text.trim().isNotEmpty) {
      setState(() {
        _taches.add(_controller.text.trim());
      });
      _controller.clear();
    }
  }
  
  void _supprimerTache(int index) {
    setState(() {
      _taches.removeAt(index);
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Mes tâches (${_taches.length})')),
      body: Column(
        children: [
          // Formulaire d'ajout
          Padding(
            padding: EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(hintText: 'Nouvelle tâche...'),
                    onSubmitted: (_) => _ajouterTache(),
                  ),
                ),
                IconButton(
                  onPressed: _ajouterTache,
                  icon: Icon(Icons.add),
                ),
              ],
            ),
          ),
          
          // Liste des tâches
          Expanded(
            child: _taches.isEmpty
                ? Center(child: Text('Aucune tâche'))
                : ListView.builder(
                    itemCount: _taches.length,
                    itemBuilder: (context, index) {
                      return ListTile(
                        title: Text(_taches[index]),
                        trailing: IconButton(
                          icon: Icon(Icons.delete),
                          onPressed: () => _supprimerTache(index),
                        ),
                      );
                    },
                  ),
          ),
        ],
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

### Bonnes pratiques avec setState()

**✅ À faire :**
- Modifier l'état uniquement dans `setState()`
- Garder les modifications simples et rapides
- Grouper les modifications liées

**❌ À éviter :**
- Appeler `setState()` dans `build()`
- Modifications lourdes dans `setState()`
- `setState()` après `dispose()`

::: tip Performance
Plus votre méthode `setState()` est légère, plus votre interface sera fluide. Évitez les calculs complexes à l'intérieur.
:::
## 🌊 FutureBuilder et StreamBuilder

Ces widgets permettent de construire une interface **réactive** qui s'adapte automatiquement aux données asynchrones.

### FutureBuilder - Pour les opérations ponctuelles

`FutureBuilder` est parfait pour les appels API, le chargement de fichiers, ou toute opération qui retourne **une seule valeur** après un délai.

**Quand l'utiliser :**
- Appels API REST
- Lecture de fichiers
- Opérations de base de données ponctuelles

```dart
class ExempleFutureBuilder extends StatelessWidget {
  // Simulation d'un appel API
  Future<List<String>> _chargerDonnees() async {
    await Future.delayed(Duration(seconds: 2)); // Simulation réseau
    return ['Élément 1', 'Élément 2', 'Élément 3'];
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Chargement de données')),
      body: FutureBuilder<List<String>>(
        future: _chargerDonnees(),
        builder: (context, snapshot) {
          // État de chargement
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text('Chargement...'),
                ],
              ),
            );
          }
          
          // Gestion d'erreur
          if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error, size: 64, color: Colors.red),
                  Text('Erreur: ${snapshot.error}'),
                  ElevatedButton(
                    onPressed: () => (context as Element).markNeedsBuild(),
                    child: Text('Réessayer'),
                  ),
                ],
              ),
            );
          }
          
          // Données disponibles
          final donnees = snapshot.data!;
          return ListView.builder(
            itemCount: donnees.length,
            itemBuilder: (context, index) => ListTile(
              title: Text(donnees[index]),
            ),
          );
        },
      ),
    );
  }
}
```
### StreamBuilder - Pour les données temps réel

`StreamBuilder` écoute un **flux continu** de données et reconstruit l'interface à chaque nouvelle valeur.

**Quand l'utiliser :**
- Messages en temps réel (chat, notifications)
- Données capteurs (GPS, accéléromètre)
- Événements utilisateur continus

```dart
class ExempleStreamBuilder extends StatefulWidget {
  @override
  _ExempleStreamBuilderState createState() => _ExempleStreamBuilderState();
}

class _ExempleStreamBuilderState extends State<ExempleStreamBuilder> {
  late StreamController<int> _compteurController;
  int _compteur = 0;
  Timer? _timer;
  
  @override
  void initState() {
    super.initState();
    _compteurController = StreamController<int>();
    _demarrerCompteur();
  }
  
  void _demarrerCompteur() {
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      _compteur++;
      _compteurController.add(_compteur); // Envoyer nouvelle valeur
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Compteur temps réel')),
      body: Center(
        child: StreamBuilder<int>(
          stream: _compteurController.stream,
          initialData: 0, // Valeur initiale
          builder: (context, snapshot) {
            return Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Compteur:',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                Text(
                  '${snapshot.data}',
                  style: Theme.of(context).textTheme.displayLarge?.copyWith(
                    color: Colors.blue,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                ElevatedButton(
                  onPressed: () {
                    _compteur = 0;
                    _compteurController.add(_compteur);
                  },
                  child: Text('Reset'),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
  
  @override
  void dispose() {
    _timer?.cancel();
    _compteurController.close(); // IMPORTANT !
    super.dispose();
  }
}
```

::: tip Bonnes pratiques
- **FutureBuilder** : pour une seule opération asynchrone
- **StreamBuilder** : pour des données qui changent en continu  
- Toujours **fermer les StreamController** dans `dispose()`
- Utiliser **`initialData`** pour éviter l'état de chargement initial
:::

## ⚡ Optimisation des performances

La gestion d'état peut impacter les performances si elle n'est pas bien maîtrisée. Voici les principes essentiels pour optimiser votre application.

### Comprendre les rebuilds

Chaque fois que `setState()` est appelée, Flutter **redessine tout le widget** et ses enfants. C'est pourquoi il faut minimiser les rebuilds inutiles.

### Technique 1 : Utiliser `const`

Les widgets marqués `const` ne sont **jamais reconstruits**, même si leur parent change.

```dart
class ExempleOptimisation extends StatefulWidget {
  @override
  _ExempleOptimisationState createState() => _ExempleOptimisationState();
}

class _ExempleOptimisationState extends State<ExempleOptimisation> {
  int _compteur = 0;
  
  @override
  Widget build(BuildContext context) {
    print('Build appelé pour compteur: $_compteur'); // Debug
    
    return Scaffold(
      appBar: AppBar(title: Text('Optimisation')),
      body: Column(
        children: [
          // ❌ Se redessine à chaque setState()
          Container(
            padding: EdgeInsets.all(20),
            child: Text('Compteur: $_compteur'),
          ),
          
          // ✅ Ne se redessine jamais grâce à const
          const EnteteStatique(),
          
          ElevatedButton(
            onPressed: () => setState(() => _compteur++),
            child: Text('Incrémenter'),
          ),
        ],
      ),
    );
  }
}

class EnteteStatique extends StatelessWidget {
  const EnteteStatique({Key? key}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    print('EnteteStatique build - ne devrait être appelé qu\'une fois');
    return Container(
      padding: EdgeInsets.all(20),
      color: Colors.blue.shade100,
      child: Text('Titre statique'),
    );
  }
}
```

### Technique 2 : Séparer les widgets

Isolez les parties qui changent dans des widgets distincts pour limiter l'impact des rebuilds.

```dart
// ❌ Mauvais : tout se redessine
class CompteurNonOptimise extends StatefulWidget {
  @override
  _CompteurNonOptimiseState createState() => _CompteurNonOptimiseState();
}

class _CompteurNonOptimiseState extends State<CompteurNonOptimise> {
  int _compteur = 0;
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Application Compteur'), // Se redessine inutilement
        Text('Compteur: $_compteur'),
        ElevatedButton(
          onPressed: () => setState(() => _compteur++),
          child: Text('Plus'),
        ),
        Text('Footer statique'), // Se redessine inutilement
      ],
    );
  }
}

// ✅ Bon : seul le compteur se redessine
class CompteurOptimise extends StatefulWidget {
  @override
  _CompteurOptimiseState createState() => _CompteurOptimiseState();
}

class _CompteurOptimiseState extends State<CompteurOptimise> {
  int _compteur = 0;
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Text('Application Compteur'), // const = pas de rebuild
        AffichageCompteur(valeur: _compteur), // Widget séparé
        BoutonIncrement(onPressed: () => setState(() => _compteur++)),
        const Text('Footer statique'), // const = pas de rebuild
      ],
    );
  }
}

class AffichageCompteur extends StatelessWidget {
  final int valeur;
  
  const AffichageCompteur({Key? key, required this.valeur}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Text('Compteur: $valeur');
  }
}

class BoutonIncrement extends StatelessWidget {
  final VoidCallback onPressed;
  
  const BoutonIncrement({Key? key, required this.onPressed}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      child: Text('Plus'),
    );
  }
}
```

### Technique 3 : Utiliser des keys

Les keys aident Flutter à identifier quels widgets ont vraiment changé.

```dart
// ✅ Bon usage des keys
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ItemWidget(
      key: ValueKey(items[index].id), // Key unique
      item: items[index],
    );
  },
)
```

### Bonnes pratiques pour les performances

**✅ À faire :**
- Utiliser `const` autant que possible
- Séparer les widgets qui changent souvent
- Éviter les calculs lourds dans `build()`
- Utiliser des keys appropriées pour les listes

**❌ À éviter :**
- Créer des widgets dans `build()` sans `const`
- Calculations complexes directement dans `build()`
- setState() trop fréquents
- Widgets trop larges (qui font trop de choses)

::: tip Conseil de debug
Utilisez `print()` dans vos méthodes `build()` pour voir quels widgets se reconstruisent. Cela vous aidera à identifier les optimisations possibles.
:::

---

La gestion d'état avec `setState()` est parfaite pour l'état local simple. Pour des applications plus complexes, explorez l'[architecture BLoC](./bloc-architecture.md) qui offre une approche plus structurée et testable.