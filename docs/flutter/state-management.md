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

Un `StatelessWidget` est immutable : il ne peut pas changer son état après sa création.

```dart
class MonWidgetStateless extends StatelessWidget {
  final String titre;
  final int valeur;
  
  const MonWidgetStateless({
    Key? key,
    required this.titre,
    required this.valeur,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Text(
              titre,
              style: Theme.of(context).textTheme.titleLarge,
            ),
            SizedBox(height: 8),
            Text(
              'Valeur: $valeur',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
          ],
        ),
      ),
    );
  }
}

// Utilisation
MonWidgetStateless(titre: 'Mon titre', valeur: 42)
```

### StatefulWidget

Un `StatefulWidget` peut changer son état et se redessiner en conséquence.

```dart
class MonWidgetStateful extends StatefulWidget {
  final String titre;
  final int valeurInitiale;
  
  const MonWidgetStateful({
    Key? key,
    required this.titre,
    this.valeurInitiale = 0,
  }) : super(key: key);
  
  @override
  _MonWidgetStatefulState createState() => _MonWidgetStatefulState();
}

class _MonWidgetStatefulState extends State<MonWidgetStateful> {
  late int _compteur;
  
  @override
  void initState() {
    super.initState();
    _compteur = widget.valeurInitiale;
  }
  
  void _incrementer() {
    setState(() {
      _compteur++;
    });
  }
  
  void _decrementer() {
    setState(() {
      _compteur--;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Text(
              widget.titre,
              style: Theme.of(context).textTheme.titleLarge,
            ),
            SizedBox(height: 16),
            
            Text(
              '$_compteur',
              style: Theme.of(context).textTheme.displayMedium,
            ),
            SizedBox(height: 16),
            
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                IconButton(
                  onPressed: _decrementer,
                  icon: Icon(Icons.remove),
                  style: IconButton.styleFrom(
                    backgroundColor: Colors.red.shade100,
                  ),
                ),
                SizedBox(width: 16),
                IconButton(
                  onPressed: _incrementer,
                  icon: Icon(Icons.add),
                  style: IconButton.styleFrom(
                    backgroundColor: Colors.green.shade100,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
```

## 🔄 Cycle de vie d'un StatefulWidget

Comprendre le cycle de vie est essentiel pour une gestion d'état efficace :

```dart
class ExempleCycleDeVie extends StatefulWidget {
  @override
  _ExempleCycleDeVieState createState() => _ExempleCycleDeVieState();
}

class _ExempleCycleDeVieState extends State<ExempleCycleDeVie> {
  String _statut = 'Initialisation';
  
  @override
  void initState() {
    super.initState();
    print('1. initState() - Widget créé');
    _statut = 'Initialisé';
    
    // Ici : initialisation des données, listeners, timers
    _initialiserDonnees();
  }
  
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    print('2. didChangeDependencies() - Dépendances changées');
    
    // Ici : réagir aux changements de thème, locale, etc.
  }
  
  @override
  Widget build(BuildContext context) {
    print('3. build() - Construction de l\'UI');
    
    return Scaffold(
      appBar: AppBar(title: Text('Cycle de vie')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Statut: $_statut',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            SizedBox(height: 32),
            
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _statut = 'Mis à jour - ${DateTime.now().millisecondsSinceEpoch}';
                });
              },
              child: Text('Mettre à jour l\'état'),
            ),
          ],
        ),
      ),
    );
  }
  
  @override
  void didUpdateWidget(ExempleCycleDeVie oldWidget) {
    super.didUpdateWidget(oldWidget);
    print('4. didUpdateWidget() - Widget parent modifié');
    
    // Ici : réagir aux changements de propriétés du widget parent
  }
  
  @override
  void deactivate() {
    print('5. deactivate() - Widget désactivé');
    super.deactivate();
  }
  
  @override
  void dispose() {
    print('6. dispose() - Widget détruit');
    
    // IMPORTANT : Nettoyer les ressources
    _nettoyerRessources();
    
    super.dispose();
  }
  
  void _initialiserDonnees() {
    // Simulation d'initialisation asynchrone
    Future.delayed(Duration(seconds: 1), () {
      if (mounted) { // Vérifier que le widget existe encore
        setState(() {
          _statut = 'Données chargées';
        });
      }
    });
  }
  
  void _nettoyerRessources() {
    // Annuler les timers, fermer les streams, etc.
    print('Nettoyage des ressources...');
  }
}
```

::: warning Attention au mounted
Toujours vérifier `mounted` avant d'appeler `setState()` dans des callbacks asynchrones pour éviter les erreurs si le widget a été détruit.
:::

## 🎛️ setState() - Gestion d'état locale

`setState()` est la méthode la plus simple pour gérer l'état local d'un widget.

### Exemple pratique : Liste de tâches

```dart
class ListeTaches extends StatefulWidget {
  @override
  _ListeTachesState createState() => _ListeTachesState();
}

class _ListeTachesState extends State<ListeTaches> {
  List<Tache> _taches = [];
  final TextEditingController _controller = TextEditingController();
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Mes tâches (${_taches.length})'),
      ),
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
                    decoration: InputDecoration(
                      hintText: 'Nouvelle tâche...',
                      border: OutlineInputBorder(),
                    ),
                    onSubmitted: _ajouterTache,
                  ),
                ),
                SizedBox(width: 12),
                ElevatedButton(
                  onPressed: () => _ajouterTache(_controller.text),
                  child: Icon(Icons.add),
                ),
              ],
            ),
          ),
          
          // Liste des tâches
          Expanded(
            child: _taches.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    itemCount: _taches.length,
                    itemBuilder: (context, index) {
                      return _buildTacheItem(_taches[index], index);
                    },
                  ),
          ),
          
          // Statistiques
          if (_taches.isNotEmpty) _buildStatistiques(),
        ],
      ),
    );
  }
  
  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.task_alt, size: 64, color: Colors.grey),
          SizedBox(height: 16),
          Text(
            'Aucune tâche',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              color: Colors.grey,
            ),
          ),
          Text(
            'Ajoutez votre première tâche ci-dessus',
            style: TextStyle(color: Colors.grey),
          ),
        ],
      ),
    );
  }
  
  Widget _buildTacheItem(Tache tache, int index) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: ListTile(
        leading: Checkbox(
          value: tache.estTerminee,
          onChanged: (value) => _toggleTache(index),
        ),
        title: Text(
          tache.titre,
          style: TextStyle(
            decoration: tache.estTerminee 
                ? TextDecoration.lineThrough 
                : TextDecoration.none,
            color: tache.estTerminee 
                ? Colors.grey 
                : null,
          ),
        ),
        subtitle: Text(
          'Créée le ${_formatDate(tache.dateCreation)}',
          style: TextStyle(fontSize: 12),
        ),
        trailing: IconButton(
          icon: Icon(Icons.delete, color: Colors.red),
          onPressed: () => _supprimerTache(index),
        ),
      ),
    );
  }
  
  Widget _buildStatistiques() {
    int terminees = _taches.where((t) => t.estTerminee).length;
    double pourcentage = terminees / _taches.length;
    
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.blue.shade50,
        border: Border(top: BorderSide(color: Colors.blue.shade200)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildStatItem('Total', _taches.length.toString(), Icons.list),
          _buildStatItem('Terminées', terminees.toString(), Icons.check_circle),
          _buildStatItem('Progression', '${(pourcentage * 100).round()}%', Icons.trending_up),
        ],
      ),
    );
  }
  
  Widget _buildStatItem(String label, String valeur, IconData icon) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, color: Colors.blue),
        SizedBox(height: 4),
        Text(
          valeur,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
            color: Colors.blue.shade800,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.blue.shade600,
          ),
        ),
      ],
    );
  }
  
  void _ajouterTache(String titre) {
    if (titre.trim().isEmpty) return;
    
    setState(() {
      _taches.add(Tache(
        titre: titre.trim(),
        dateCreation: DateTime.now(),
      ));
    });
    
    _controller.clear();
  }
  
  void _toggleTache(int index) {
    setState(() {
      _taches[index].estTerminee = !_taches[index].estTerminee;
    });
  }
  
  void _supprimerTache(int index) {
    setState(() {
      _taches.removeAt(index);
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Tâche supprimée'),
        action: SnackBarAction(
          label: 'Annuler',
          onPressed: () {
            // Ici, on pourrait implémenter un système d'annulation
          },
        ),
      ),
    );
  }
  
  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}

class Tache {
  String titre;
  DateTime dateCreation;
  bool estTerminee;
  
  Tache({
    required this.titre,
    required this.dateCreation,
    this.estTerminee = false,
  });
}
```

## 🌊 StreamBuilder et FutureBuilder

Ces widgets permettent de construire une interface réactive basée sur des données asynchrones.

### FutureBuilder

Pour les opérations asynchrones qui retournent une seule valeur :

```dart
class ExempleFutureBuilder extends StatelessWidget {
  // Simulation d'un appel API
  Future<List<String>> _chargerDonnees() async {
    await Future.delayed(Duration(seconds: 2)); // Simulation latence réseau
    
    // Simulation d'erreur aléatoire
    if (Random().nextBool()) {
      throw Exception('Erreur de connexion au serveur');
    }
    
    return List.generate(10, (index) => 'Élément ${index + 1}');
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('FutureBuilder')),
      body: FutureBuilder<List<String>>(
        future: _chargerDonnees(),
        builder: (context, snapshot) {
          // Gestion des différents états
          if (snapshot.connectionState == ConnectionState.waiting) {
            return _buildLoadingState();
          }
          
          if (snapshot.hasError) {
            return _buildErrorState(snapshot.error.toString());
          }
          
          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return _buildEmptyState();
          }
          
          // Données disponibles
          return _buildDataState(snapshot.data!);
        },
      ),
    );
  }
  
  Widget _buildLoadingState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(),
          SizedBox(height: 16),
          Text('Chargement des données...'),
        ],
      ),
    );
  }
  
  Widget _buildErrorState(String error) {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error, size: 64, color: Colors.red),
            SizedBox(height: 16),
            Text(
              'Erreur de chargement',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text(
              error,
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.red),
            ),
            SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () {
                // Redéclencher le build pour relancer le Future
                (context as Element).markNeedsBuild();
              },
              icon: Icon(Icons.refresh),
              label: Text('Réessayer'),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.inbox, size: 64, color: Colors.grey),
          SizedBox(height: 16),
          Text('Aucune donnée disponible'),
        ],
      ),
    );
  }
  
  Widget _buildDataState(List<String> data) {
    return RefreshIndicator(
      onRefresh: () async {
        // Relancer le chargement
        await _chargerDonnees();
      },
      child: ListView.builder(
        padding: EdgeInsets.all(16),
        itemCount: data.length,
        itemBuilder: (context, index) {
          return Card(
            margin: EdgeInsets.only(bottom: 8),
            child: ListTile(
              leading: CircleAvatar(
                child: Text('${index + 1}'),
              ),
              title: Text(data[index]),
              subtitle: Text('Chargé depuis le serveur'),
              trailing: Icon(Icons.arrow_forward_ios),
            ),
          );
        },
      ),
    );
  }
}
```

### StreamBuilder

Pour les données qui changent en temps réel :

```dart
class ExempleStreamBuilder extends StatefulWidget {
  @override
  _ExempleStreamBuilderState createState() => _ExempleStreamBuilderState();
}

class _ExempleStreamBuilderState extends State<ExempleStreamBuilder> {
  late StreamController<int> _compteurController;
  late StreamController<String> _messageController;
  
  int _compteur = 0;
  Timer? _timer;
  
  @override
  void initState() {
    super.initState();
    
    // Initialiser les streams
    _compteurController = StreamController<int>();
    _messageController = StreamController<String>();
    
    // Démarrer le compteur automatique
    _demarrerCompteur();
  }
  
  void _demarrerCompteur() {
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      _compteur++;
      _compteurController.add(_compteur);
      
      // Ajouter des messages périodiques
      if (_compteur % 5 == 0) {
        _messageController.add('Milestone atteint: $_compteur');
      }
    });
  }
  
  void _ajouterMessage(String message) {
    _messageController.add('$message (à ${DateTime.now().second}s)');
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('StreamBuilder'),
        actions: [
          IconButton(
            icon: Icon(_timer?.isActive == true ? Icons.pause : Icons.play_arrow),
            onPressed: _toggleTimer,
          ),
        ],
      ),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            // Compteur en temps réel
            Card(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Column(
                  children: [
                    Text(
                      'Compteur en temps réel',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    SizedBox(height: 16),
                    StreamBuilder<int>(
                      stream: _compteurController.stream,
                      initialData: 0,
                      builder: (context, snapshot) {
                        return Text(
                          '${snapshot.data}',
                          style: Theme.of(context).textTheme.displayLarge?.copyWith(
                            color: Colors.blue,
                            fontWeight: FontWeight.bold,
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
            
            SizedBox(height: 16),
            
            // Boutons d'action
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: () => _ajouterMessage('Bouton 1 pressé'),
                  child: Text('Action 1'),
                ),
                ElevatedButton(
                  onPressed: () => _ajouterMessage('Bouton 2 pressé'),
                  child: Text('Action 2'),
                ),
                ElevatedButton(
                  onPressed: _resetCompteur,
                  child: Text('Reset'),
                ),
              ],
            ),
            
            SizedBox(height: 16),
            
            // Messages en temps réel
            Expanded(
              child: Card(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: EdgeInsets.all(16),
                      child: Text(
                        'Messages en temps réel',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                    ),
                    Expanded(
                      child: StreamBuilder<String>(
                        stream: _messageController.stream,
                        builder: (context, snapshot) {
                          if (!snapshot.hasData) {
                            return Center(
                              child: Text('En attente de messages...'),
                            );
                          }
                          
                          return ListView(
                            reverse: true, // Derniers messages en bas
                            padding: EdgeInsets.all(16),
                            children: [
                              Container(
                                margin: EdgeInsets.only(bottom: 8),
                                padding: EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: Colors.blue.shade50,
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: Colors.blue.shade200),
                                ),
                                child: Text(snapshot.data!),
                              ),
                            ],
                          );
                        },
                      ),
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
  
  void _toggleTimer() {
    setState(() {
      if (_timer?.isActive == true) {
        _timer?.cancel();
      } else {
        _demarrerCompteur();
      }
    });
  }
  
  void _resetCompteur() {
    _compteur = 0;
    _compteurController.add(_compteur);
    _ajouterMessage('Compteur remis à zéro');
  }
  
  @override
  void dispose() {
    _timer?.cancel();
    _compteurController.close();
    _messageController.close();
    super.dispose();
  }
}
```

::: tip Bonnes pratiques avec les Streams
- Toujours fermer les `StreamController` dans `dispose()`
- Utiliser `initialData` pour éviter l'état de loading initial
- Gérer les états d'erreur et de chargement appropriément
- Préférer `StreamBuilder` pour les données temps réel, `FutureBuilder` pour les appels ponctuels
:::

## ⚡ Optimisation des rebuilds

### Éviter les rebuilds inutiles

```dart
class OptimisationExample extends StatefulWidget {
  @override
  _OptimisationExampleState createState() => _OptimisationExampleState();
}

class _OptimisationExampleState extends State<OptimisationExample> {
  int _compteur = 0;
  String _texte = 'Texte initial';
  
  @override
  Widget build(BuildContext context) {
    print('Build() appelé - compteur: $_compteur'); // Pour debug
    
    return Scaffold(
      appBar: AppBar(title: Text('Optimisation')),
      body: Column(
        children: [
          // Widget qui change souvent
          Container(
            padding: EdgeInsets.all(20),
            color: Colors.blue.shade100,
            child: Text(
              'Compteur: $_compteur',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ),
          
          SizedBox(height: 20),
          
          // Widget statique - on peut l'optimiser
          const WidgetStatique(), // const évite les rebuilds inutiles
          
          SizedBox(height: 20),
          
          // Widget avec builder pour isoler les rebuilds
          Builder(
            builder: (context) {
              print('Builder texte appelé'); // Pour debug
              return Container(
                padding: EdgeInsets.all(20),
                color: Colors.green.shade100,
                child: Text('Texte: $_texte'),
              );
            },
          ),
          
          Spacer(),
          
          // Boutons d'action
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    _compteur++;
                  });
                },
                child: Text('+ Compteur'),
              ),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    _texte = 'Nouveau texte ${DateTime.now().second}';
                  });
                },
                child: Text('Changer texte'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// Widget statique qui ne devrait jamais être reconstruit
class WidgetStatique extends StatelessWidget {
  const WidgetStatique({Key? key}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    print('WidgetStatique build() - ne devrait être appelé qu\'une fois');
    
    return Container(
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.orange.shade100,
        border: Border.all(color: Colors.orange),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Icon(Icons.info, size: 32, color: Colors.orange),
          SizedBox(height: 8),
          Text(
            'Widget statique',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.orange.shade800,
            ),
          ),
          Text(
            'Ce widget ne change jamais',
            style: TextStyle(color: Colors.orange.shade600),
          ),
        ],
      ),
    );
  }
}
```

### Techniques d'optimisation

```dart
// 1. Séparer les widgets qui changent
class CompteurOptimise extends StatefulWidget {
  @override
  _CompteurOptimiseState createState() => _CompteurOptimiseState();
}

class _CompteurOptimiseState extends State<CompteurOptimise> {
  int _compteur = 0;
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Compteur optimisé')),
      body: Column(
        children: [
          // Partie qui ne change pas
          const EnteteStatique(),
          
          // Partie qui change - isolée dans son propre widget
          AffichageCompteur(compteur: _compteur),
          
          // Boutons
          BoutonsAction(
            onIncrement: () => setState(() => _compteur++),
            onDecrement: () => setState(() => _compteur--),
            onReset: () => setState(() => _compteur = 0),
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
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(20),
      color: Colors.blue.shade100,
      child: Text(
        'Compteur Application',
        style: Theme.of(context).textTheme.headlineMedium,
        textAlign: TextAlign.center,
      ),
    );
  }
}

class AffichageCompteur extends StatelessWidget {
  final int compteur;
  
  const AffichageCompteur({Key? key, required this.compteur}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Center(
        child: Text(
          '$compteur',
          style: Theme.of(context).textTheme.displayLarge,
        ),
      ),
    );
  }
}

class BoutonsAction extends StatelessWidget {
  final VoidCallback onIncrement;
  final VoidCallback onDecrement;
  final VoidCallback onReset;
  
  const BoutonsAction({
    Key? key,
    required this.onIncrement,
    required this.onDecrement,
    required this.onReset,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          FloatingActionButton(
            onPressed: onDecrement,
            child: Icon(Icons.remove),
            heroTag: 'decrement',
          ),
          FloatingActionButton(
            onPressed: onReset,
            child: Icon(Icons.refresh),
            heroTag: 'reset',
          ),
          FloatingActionButton(
            onPressed: onIncrement,
            child: Icon(Icons.add),
            heroTag: 'increment',
          ),
        ],
      ),
    );
  }
}
```

La gestion d'état avec `setState()` est parfaite pour l'état local simple. Dans la prochaine section, nous découvrirons l'[architecture BLoC](./bloc-architecture.md) pour gérer l'état de manière plus structurée dans des applications complexes.