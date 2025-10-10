# Flutter – Architecture BLoC
 
## 🏗️ Introduction au pattern BLoC

BLoC (Business Logic Component) est un pattern architectural développé par Google pour Flutter. Il sépare la logique métier de l'interface utilisateur en utilisant les **Streams** de Dart. Cette architecture rend le code plus maintenable, testable et réutilisable.

### Pourquoi utiliser une architecture ?

Dans les applications simples, `setState()` suffit. Mais à mesure que l'application grandit, plusieurs problèmes apparaissent :

- **État dispersé** : Difficile de savoir où se trouve la logique
- **Couplage fort** : Interface et logique mélangées
- **Testabilité limitée** : Difficile de tester la logique métier
- **Réutilisabilité** : Code difficile à partager entre widgets

### Comparaison des architectures

| Architecture | Complexité | Testabilité | Réutilisabilité | Cas d'usage |
|-------------|------------|-------------|-----------------|------------|
| **setState** | Faible | Limitée | Faible | Widgets simples |
| **Provider** | Moyenne | Bonne | Moyenne | Apps moyennes |
| **BLoC** | Élevée | Excellente | Excellente | Apps complexes |
| **Riverpod** | Moyenne | Excellente | Excellente | Alternative moderne |

::: info Principe de BLoC
BLoC suit le principe : **"Tout est un Stream"**. Les événements entrent, la logique métier les traite, et des états en sortent.
:::

## 📋 Concepts fondamentaux de BLoC

### Les 3 composants principaux

1. **Events** : Actions déclenchées par l'utilisateur
2. **States** : États de l'application à un moment donné  
3. **BLoC** : Convertit les Events en States

```
UI → Event → BLoC → State → UI
```

### Exemple conceptuel

```dart
// Events - Ce que l'utilisateur peut faire
abstract class CompteurEvent {}

class Incrementer extends CompteurEvent {}
class Decrementer extends CompteurEvent {}
class Reset extends CompteurEvent {}

// States - Les différents états possibles
abstract class CompteurState {}

class CompteurInitial extends CompteurState {}
class CompteurValeur extends CompteurState {
  final int valeur;
  CompteurValeur(this.valeur);
}

// BLoC - La logique métier
class CompteurBloc {
  int _compteur = 0;
  
  // Stream des états
  Stream<CompteurState> get stateStream => _stateController.stream;
  final _stateController = StreamController<CompteurState>();
  
  // Sink des événements  
  Sink<CompteurEvent> get eventSink => _eventController.sink;
  final _eventController = StreamController<CompteurEvent>();
  
  CompteurBloc() {
    // Écouter les événements et produire des états
    _eventController.stream.listen(_handleEvent);
    // Émettre l'état initial
    _stateController.add(CompteurInitial());
  }
  
  void _handleEvent(CompteurEvent event) {
    if (event is Incrementer) {
      _compteur++;
    } else if (event is Decrementer) {
      _compteur--;
    } else if (event is Reset) {
      _compteur = 0;
    }
    
    _stateController.add(CompteurValeur(_compteur));
  }
  
  void dispose() {
    _eventController.close();
    _stateController.close();
  }
}
```

## 🔧 BLoC sans librairie externe

Créons d'abord un BLoC simple sans dépendances externes pour comprendre les mécanismes :

### Modèle de données

```dart
class Produit {
  final String id;
  final String nom;
  final double prix;
  final String description;
  final bool enStock;
  
  Produit({
    required this.id,
    required this.nom,
    required this.prix,
    required this.description,
    this.enStock = true,
  });
  
  @override
  String toString() => '$nom (${prix}€)';
  
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Produit && id == other.id;
  
  @override
  int get hashCode => id.hashCode;
}
```

### Events

```dart
abstract class ProduitEvent {}

class ChargerProduits extends ProduitEvent {}

class AjouterProduit extends ProduitEvent {
  final Produit produit;
  AjouterProduit(this.produit);
}

class SupprimerProduit extends ProduitEvent {
  final String produitId;
  SupprimerProduit(this.produitId);
}

class FiltrerProduits extends ProduitEvent {
  final String? filtre;
  FiltrerProduits(this.filtre);
}
```

### States

```dart
abstract class ProduitState {}

class ProduitInitial extends ProduitState {}

class ProduitLoading extends ProduitState {}

class ProduitLoaded extends ProduitState {
  final List<Produit> produits;
  final List<Produit> produitsFiltres;
  final String? filtreActuel;
  
  ProduitLoaded({
    required this.produits,
    required this.produitsFiltres,
    this.filtreActuel,
  });
  
  int get nombreTotal => produits.length;
  int get nombreFiltres => produitsFiltres.length;
}

class ProduitError extends ProduitState {
  final String message;
  ProduitError(this.message);
}
```

### BLoC Implementation

```dart
class ProduitBloc {
  // Données privées
  List<Produit> _produits = [];
  String? _filtreActuel;
  
  // Streams
  final _stateController = StreamController<ProduitState>.broadcast();
  final _eventController = StreamController<ProduitEvent>();
  
  // Getters publics
  Stream<ProduitState> get state => _stateController.stream;
  Sink<ProduitEvent> get add => _eventController.sink;
  
  ProduitBloc() {
    _eventController.stream.listen(_handleEvent);
    _emitState(ProduitInitial());
  }
  
  void _handleEvent(ProduitEvent event) async {
    try {
      if (event is ChargerProduits) {
        await _handleChargerProduits();
      } else if (event is AjouterProduit) {
        await _handleAjouterProduit(event);
      } else if (event is SupprimerProduit) {
        await _handleSupprimerProduit(event);
      } else if (event is FiltrerProduits) {
        _handleFiltrerProduits(event);
      }
    } catch (e) {
      _emitState(ProduitError('Erreur: ${e.toString()}'));
    }
  }
  
  Future<void> _handleChargerProduits() async {
    _emitState(ProduitLoading());
    
    // Simulation d'un appel API
    await Future.delayed(Duration(seconds: 1));
    
    _produits = [
      Produit(id: '1', nom: 'iPhone 14', prix: 999.99, description: 'Smartphone Apple'),
      Produit(id: '2', nom: 'MacBook Pro', prix: 1999.99, description: 'Ordinateur portable'),
      Produit(id: '3', nom: 'AirPods', prix: 199.99, description: 'Écouteurs sans fil'),
      Produit(id: '4', nom: 'iPad', prix: 599.99, description: 'Tablette Apple'),
    ];
    
    _emitProduitLoaded();
  }
  
  Future<void> _handleAjouterProduit(AjouterProduit event) async {
    _produits.add(event.produit);
    _emitProduitLoaded();
  }
  
  Future<void> _handleSupprimerProduit(SupprimerProduit event) async {
    _produits.removeWhere((p) => p.id == event.produitId);
    _emitProduitLoaded();
  }
  
  void _handleFiltrerProduits(FiltrerProduits event) {
    _filtreActuel = event.filtre;
    _emitProduitLoaded();
  }
  
  void _emitProduitLoaded() {
    List<Produit> produitsFiltres = _produits;
    
    if (_filtreActuel != null && _filtreActuel!.isNotEmpty) {
      produitsFiltres = _produits.where((p) => 
        p.nom.toLowerCase().contains(_filtreActuel!.toLowerCase()) ||
        p.description.toLowerCase().contains(_filtreActuel!.toLowerCase())
      ).toList();
    }
    
    _emitState(ProduitLoaded(
      produits: List.from(_produits),
      produitsFiltres: produitsFiltres,
      filtreActuel: _filtreActuel,
    ));
  }
  
  void _emitState(ProduitState state) {
    _stateController.add(state);
  }
  
  void dispose() {
    _eventController.close();
    _stateController.close();
  }
}
```

### Interface utilisateur avec le BLoC

```dart
class ProduitApp extends StatefulWidget {
  @override
  _ProduitAppState createState() => _ProduitAppState();
}

class _ProduitAppState extends State<ProduitApp> {
  late ProduitBloc _bloc;
  final TextEditingController _rechercheController = TextEditingController();
  
  @override
  void initState() {
    super.initState();
    _bloc = ProduitBloc();
    _bloc.add.add(ChargerProduits());
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Gestion Produits - BLoC'),
        actions: [
          IconButton(
            icon: Icon(Icons.add),
            onPressed: _ajouterProduit,
          ),
        ],
      ),
      body: Column(
        children: [
          // Barre de recherche
          Padding(
            padding: EdgeInsets.all(16),
            child: TextField(
              controller: _rechercheController,
              decoration: InputDecoration(
                hintText: 'Rechercher un produit...',
                prefixIcon: Icon(Icons.search),
                border: OutlineInputBorder(),
              ),
              onChanged: (query) {
                _bloc.add.add(FiltrerProduits(query.isEmpty ? null : query));
              },
            ),
          ),
          
          // Liste des produits
          Expanded(
            child: StreamBuilder<ProduitState>(
              stream: _bloc.state,
              builder: (context, snapshot) {
                if (!snapshot.hasData) {
                  return Center(child: Text('Initialisation...'));
                }
                
                final state = snapshot.data!;
                
                if (state is ProduitInitial) {
                  return Center(child: Text('Prêt à charger'));
                }
                
                if (state is ProduitLoading) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(),
                        SizedBox(height: 16),
                        Text('Chargement des produits...'),
                      ],
                    ),
                  );
                }
                
                if (state is ProduitError) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.error, size: 64, color: Colors.red),
                        SizedBox(height: 16),
                        Text(state.message),
                        ElevatedButton(
                          onPressed: () => _bloc.add.add(ChargerProduits()),
                          child: Text('Réessayer'),
                        ),
                      ],
                    ),
                  );
                }
                
                if (state is ProduitLoaded) {
                  return _buildProduitsList(state);
                }
                
                return Container();
              },
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildProduitsList(ProduitLoaded state) {
    if (state.produitsFiltres.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.search_off, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text(
              state.filtreActuel != null 
                ? 'Aucun produit trouvé pour "${state.filtreActuel}"'
                : 'Aucun produit disponible',
              textAlign: TextAlign.center,
            ),
          ],
        ),
      );
    }
    
    return Column(
      children: [
        // Statistiques
        Container(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.blue.shade50,
            border: Border(bottom: BorderSide(color: Colors.blue.shade200)),
          ),
          child: Row(
            children: [
              Text('${state.nombreFiltres} produit(s)'),
              if (state.filtreActuel != null) ...[
                Text(' sur ${state.nombreTotal}'),
                Spacer(),
                TextButton(
                  onPressed: () {
                    _rechercheController.clear();
                    _bloc.add.add(FiltrerProduits(null));
                  },
                  child: Text('Effacer filtre'),
                ),
              ],
            ],
          ),
        ),
        
        // Liste
        Expanded(
          child: ListView.builder(
            itemCount: state.produitsFiltres.length,
            itemBuilder: (context, index) {
              final produit = state.produitsFiltres[index];
              return _buildProduitItem(produit);
            },
          ),
        ),
      ],
    );
  }
  
  Widget _buildProduitItem(Produit produit) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Colors.blue,
          child: Text(produit.nom[0]),
        ),
        title: Text(produit.nom),
        subtitle: Text('${produit.description}\n${produit.prix.toStringAsFixed(2)}€'),
        isThreeLine: true,
        trailing: IconButton(
          icon: Icon(Icons.delete, color: Colors.red),
          onPressed: () => _supprimerProduit(produit),
        ),
      ),
    );
  }
  
  void _ajouterProduit() {
    showDialog(
      context: context,
      builder: (context) => AjoutProduitDialog(
        onAjouter: (produit) {
          _bloc.add.add(AjouterProduit(produit));
        },
      ),
    );
  }
  
  void _supprimerProduit(Produit produit) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Confirmer la suppression'),
        content: Text('Voulez-vous vraiment supprimer "${produit.nom}" ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _bloc.add.add(SupprimerProduit(produit.id));
            },
            child: Text('Supprimer'),
          ),
        ],
      ),
    );
  }
  
  @override
  void dispose() {
    _bloc.dispose();
    _rechercheController.dispose();
    super.dispose();
  }
}

// Dialog pour ajouter un produit
class AjoutProduitDialog extends StatefulWidget {
  final Function(Produit) onAjouter;
  
  const AjoutProduitDialog({Key? key, required this.onAjouter}) : super(key: key);
  
  @override
  _AjoutProduitDialogState createState() => _AjoutProduitDialogState();
}

class _AjoutProduitDialogState extends State<AjoutProduitDialog> {
  final _formKey = GlobalKey<FormState>();
  final _nomController = TextEditingController();
  final _prixController = TextEditingController();
  final _descriptionController = TextEditingController();
  
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('Ajouter un produit'),
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              controller: _nomController,
              decoration: InputDecoration(labelText: 'Nom'),
              validator: (value) => value?.isEmpty == true ? 'Requis' : null,
            ),
            TextFormField(
              controller: _prixController,
              decoration: InputDecoration(labelText: 'Prix'),
              keyboardType: TextInputType.number,
              validator: (value) {
                if (value?.isEmpty == true) return 'Requis';
                if (double.tryParse(value!) == null) return 'Nombre invalide';
                return null;
              },
            ),
            TextFormField(
              controller: _descriptionController,
              decoration: InputDecoration(labelText: 'Description'),
              validator: (value) => value?.isEmpty == true ? 'Requis' : null,
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: Text('Annuler'),
        ),
        ElevatedButton(
          onPressed: _valider,
          child: Text('Ajouter'),
        ),
      ],
    );
  }
  
  void _valider() {
    if (_formKey.currentState!.validate()) {
      final produit = Produit(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        nom: _nomController.text,
        prix: double.parse(_prixController.text),
        description: _descriptionController.text,
      );
      
      widget.onAjouter(produit);
      Navigator.pop(context);
    }
  }
  
  @override
  void dispose() {
    _nomController.dispose();
    _prixController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }
}
```

## 📦 Package flutter_bloc

Le package officiel `flutter_bloc` simplifie grandement l'implémentation du pattern BLoC.

### Installation

```bash
# Package officiel pour implémenter le pattern BLoC avec widgets dédiés et gestion automatique du cycle de vie
flutter pub add flutter_bloc

# Package utilitaire pour simplifier la comparaison d'objets et optimiser les performances des BLoCs
flutter pub add equatable
```

### BLoC avec flutter_bloc

```dart
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

// Events avec Equatable pour la comparaison
abstract class CounterEvent extends Equatable {
  @override
  List<Object> get props => [];
}

class CounterIncremented extends CounterEvent {}
class CounterDecremented extends CounterEvent {}
class CounterReset extends CounterEvent {}

// States avec Equatable
abstract class CounterState extends Equatable {
  @override
  List<Object> get props => [];
}

class CounterInitial extends CounterState {}

class CounterValue extends CounterState {
  final int value;
  
  CounterValue(this.value);
  
  @override
  List<Object> get props => [value];
}

// BLoC utilisant flutter_bloc
class CounterBloc extends Bloc<CounterEvent, CounterState> {
  CounterBloc() : super(CounterInitial()) {
    // Enregistrer les handlers pour chaque événement
    on<CounterIncremented>(_onIncremented);
    on<CounterDecremented>(_onDecremented);
    on<CounterReset>(_onReset);
  }
  
  int _counter = 0;
  
  void _onIncremented(CounterIncremented event, Emitter<CounterState> emit) {
    _counter++;
    emit(CounterValue(_counter));
  }
  
  void _onDecremented(CounterDecremented event, Emitter<CounterState> emit) {
    _counter--;
    emit(CounterValue(_counter));
  }
  
  void _onReset(CounterReset event, Emitter<CounterState> emit) {
    _counter = 0;
    emit(CounterValue(_counter));
  }
}
```

### Interface avec BlocProvider et BlocBuilder

```dart
class CounterAppBloc extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Counter BLoC',
      home: BlocProvider(
        create: (context) => CounterBloc(),
        child: CounterPage(),
      ),
    );
  }
}

class CounterPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Counter avec BLoC')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Vous avez appuyé sur le bouton:',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            SizedBox(height: 16),
            
            // BlocBuilder reconstruit automatiquement quand l'état change
            BlocBuilder<CounterBloc, CounterState>(
              builder: (context, state) {
                if (state is CounterInitial) {
                  return Text(
                    '0',
                    style: Theme.of(context).textTheme.displayLarge,
                  );
                }
                
                if (state is CounterValue) {
                  return Text(
                    '${state.value}',
                    style: Theme.of(context).textTheme.displayLarge,
                  );
                }
                
                return Text('État inconnu');
              },
            ),
            
            SizedBox(height: 32),
            
            // Boutons pour déclencher des événements
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                FloatingActionButton(
                  onPressed: () {
                    context.read<CounterBloc>().add(CounterDecremented());
                  },
                  tooltip: 'Décrémenter',
                  child: Icon(Icons.remove),
                  heroTag: 'decrement',
                ),
                SizedBox(width: 16),
                FloatingActionButton(
                  onPressed: () {
                    context.read<CounterBloc>().add(CounterReset());
                  },
                  tooltip: 'Reset',
                  child: Icon(Icons.refresh),
                  heroTag: 'reset',
                ),
                SizedBox(width: 16),
                FloatingActionButton(
                  onPressed: () {
                    context.read<CounterBloc>().add(CounterIncremented());
                  },
                  tooltip: 'Incrémenter',
                  child: Icon(Icons.add),
                  heroTag: 'increment',
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

### BlocConsumer pour combiner builder et listener

```dart
// Pour réagir aux changements d'état ET reconstruire l'UI
BlocConsumer<CounterBloc, CounterState>(
  listener: (context, state) {
    // Actions à effectuer quand l'état change (snackbars, navigation, etc.)
    if (state is CounterValue && state.value == 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Vous avez atteint 10 !')),
      );
    }
  },
  builder: (context, state) {
    // Reconstruction de l'UI
    return Text('${state is CounterValue ? state.value : 0}');
  },
)
```

## 🎯 Exemple complet : Application ToDo avec BLoC

Créons une application complète pour illustrer tous les concepts :

```dart
// Modèle
class Todo {
  final String id;
  final String title;
  final bool completed;
  final DateTime createdAt;
  
  Todo({
    required this.id,
    required this.title,
    this.completed = false,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();
  
  Todo copyWith({
    String? id,
    String? title,
    bool? completed,
    DateTime? createdAt,
  }) {
    return Todo(
      id: id ?? this.id,
      title: title ?? this.title,
      completed: completed ?? this.completed,
      createdAt: createdAt ?? this.createdAt,
    );
  }
  
  @override
  String toString() => 'Todo { id: $id, title: $title, completed: $completed }';
}

// Events
abstract class TodoEvent extends Equatable {
  @override
  List<Object> get props => [];
}

class LoadTodos extends TodoEvent {}

class AddTodo extends TodoEvent {
  final String title;
  AddTodo(this.title);
  
  @override
  List<Object> get props => [title];
}

class ToggleTodo extends TodoEvent {
  final String id;
  ToggleTodo(this.id);
  
  @override
  List<Object> get props => [id];
}

class DeleteTodo extends TodoEvent {
  final String id;
  DeleteTodo(this.id);
  
  @override
  List<Object> get props => [id];
}

class FilterTodos extends TodoEvent {
  final TodoFilter filter;
  FilterTodos(this.filter);
  
  @override
  List<Object> get props => [filter];
}

enum TodoFilter { all, active, completed }

// States
abstract class TodoState extends Equatable {
  @override
  List<Object> get props => [];
}

class TodoInitial extends TodoState {}

class TodoLoading extends TodoState {}

class TodoLoaded extends TodoState {
  final List<Todo> todos;
  final TodoFilter filter;
  
  TodoLoaded({
    required this.todos,
    this.filter = TodoFilter.all,
  });
  
  List<Todo> get filteredTodos {
    switch (filter) {
      case TodoFilter.active:
        return todos.where((todo) => !todo.completed).toList();
      case TodoFilter.completed:
        return todos.where((todo) => todo.completed).toList();
      case TodoFilter.all:
      default:
        return todos;
    }
  }
  
  int get completedCount => todos.where((todo) => todo.completed).length;
  int get activeCount => todos.where((todo) => !todo.completed).length;
  
  @override
  List<Object> get props => [todos, filter];
}

class TodoError extends TodoState {
  final String message;
  TodoError(this.message);
  
  @override
  List<Object> get props => [message];
}

// BLoC
class TodoBloc extends Bloc<TodoEvent, TodoState> {
  TodoBloc() : super(TodoInitial()) {
    on<LoadTodos>(_onLoadTodos);
    on<AddTodo>(_onAddTodo);
    on<ToggleTodo>(_onToggleTodo);
    on<DeleteTodo>(_onDeleteTodo);
    on<FilterTodos>(_onFilterTodos);
  }
  
  List<Todo> _todos = [];
  TodoFilter _currentFilter = TodoFilter.all;
  
  void _onLoadTodos(LoadTodos event, Emitter<TodoState> emit) async {
    emit(TodoLoading());
    
    try {
      // Simulation d'un appel API
      await Future.delayed(Duration(seconds: 1));
      
      _todos = [
        Todo(id: '1', title: 'Apprendre Flutter'),
        Todo(id: '2', title: 'Maîtriser BLoC'),
        Todo(id: '3', title: 'Créer une app', completed: true),
      ];
      
      emit(TodoLoaded(todos: _todos, filter: _currentFilter));
    } catch (e) {
      emit(TodoError('Erreur lors du chargement: $e'));
    }
  }
  
  void _onAddTodo(AddTodo event, Emitter<TodoState> emit) {
    final newTodo = Todo(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: event.title,
    );
    
    _todos = [..._todos, newTodo];
    emit(TodoLoaded(todos: _todos, filter: _currentFilter));
  }
  
  void _onToggleTodo(ToggleTodo event, Emitter<TodoState> emit) {
    _todos = _todos.map((todo) {
      return todo.id == event.id 
          ? todo.copyWith(completed: !todo.completed)
          : todo;
    }).toList();
    
    emit(TodoLoaded(todos: _todos, filter: _currentFilter));
  }
  
  void _onDeleteTodo(DeleteTodo event, Emitter<TodoState> emit) {
    _todos = _todos.where((todo) => todo.id != event.id).toList();
    emit(TodoLoaded(todos: _todos, filter: _currentFilter));
  }
  
  void _onFilterTodos(FilterTodos event, Emitter<TodoState> emit) {
    _currentFilter = event.filter;
    emit(TodoLoaded(todos: _todos, filter: _currentFilter));
  }
}

// Interface utilisateur
class TodoApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Todo BLoC',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: BlocProvider(
        create: (context) => TodoBloc()..add(LoadTodos()),
        child: TodoPage(),
      ),
    );
  }
}

class TodoPage extends StatelessWidget {
  final TextEditingController _textController = TextEditingController();
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Todo List'),
        actions: [
          PopupMenuButton<TodoFilter>(
            onSelected: (filter) {
              context.read<TodoBloc>().add(FilterTodos(filter));
            },
            itemBuilder: (context) => [
              PopupMenuItem(
                value: TodoFilter.all,
                child: Text('Tous'),
              ),
              PopupMenuItem(
                value: TodoFilter.active,
                child: Text('Actifs'),
              ),
              PopupMenuItem(
                value: TodoFilter.completed,
                child: Text('Terminés'),
              ),
            ],
          ),
        ],
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
                    controller: _textController,
                    decoration: InputDecoration(
                      hintText: 'Ajouter une tâche...',
                      border: OutlineInputBorder(),
                    ),
                    onSubmitted: (value) => _addTodo(context, value),
                  ),
                ),
                SizedBox(width: 8),
                ElevatedButton(
                  onPressed: () => _addTodo(context, _textController.text),
                  child: Icon(Icons.add),
                ),
              ],
            ),
          ),
          
          // Liste des todos
          Expanded(
            child: BlocBuilder<TodoBloc, TodoState>(
              builder: (context, state) {
                if (state is TodoInitial) {
                  return Center(child: Text('Initialisation...'));
                }
                
                if (state is TodoLoading) {
                  return Center(child: CircularProgressIndicator());
                }
                
                if (state is TodoError) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.error, size: 64, color: Colors.red),
                        SizedBox(height: 16),
                        Text(state.message),
                        ElevatedButton(
                          onPressed: () {
                            context.read<TodoBloc>().add(LoadTodos());
                          },
                          child: Text('Réessayer'),
                        ),
                      ],
                    ),
                  );
                }
                
                if (state is TodoLoaded) {
                  return _buildTodoList(context, state);
                }
                
                return Container();
              },
            ),
          ),
          
          // Statistiques
          BlocBuilder<TodoBloc, TodoState>(
            builder: (context, state) {
              if (state is TodoLoaded) {
                return _buildStats(state);
              }
              return Container();
            },
          ),
        ],
      ),
    );
  }
  
  Widget _buildTodoList(BuildContext context, TodoLoaded state) {
    final todos = state.filteredTodos;
    
    if (todos.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.check_circle_outline, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text('Aucune tâche', style: TextStyle(fontSize: 18)),
          ],
        ),
      );
    }
    
    return ListView.builder(
      itemCount: todos.length,
      itemBuilder: (context, index) {
        final todo = todos[index];
        return _buildTodoItem(context, todo);
      },
    );
  }
  
  Widget _buildTodoItem(BuildContext context, Todo todo) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: ListTile(
        leading: Checkbox(
          value: todo.completed,
          onChanged: (_) {
            context.read<TodoBloc>().add(ToggleTodo(todo.id));
          },
        ),
        title: Text(
          todo.title,
          style: TextStyle(
            decoration: todo.completed 
                ? TextDecoration.lineThrough 
                : TextDecoration.none,
          ),
        ),
        subtitle: Text(
          'Créé le ${todo.createdAt.day}/${todo.createdAt.month}',
          style: TextStyle(fontSize: 12),
        ),
        trailing: IconButton(
          icon: Icon(Icons.delete, color: Colors.red),
          onPressed: () {
            context.read<TodoBloc>().add(DeleteTodo(todo.id));
          },
        ),
      ),
    );
  }
  
  Widget _buildStats(TodoLoaded state) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.blue.shade50,
        border: Border(top: BorderSide(color: Colors.blue.shade200)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildStatItem('Total', state.todos.length.toString()),
          _buildStatItem('Actives', state.activeCount.toString()),
          _buildStatItem('Terminées', state.completedCount.toString()),
        ],
      ),
    );
  }
  
  Widget _buildStatItem(String label, String value) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.blue,
          ),
        ),
        Text(label, style: TextStyle(fontSize: 12)),
      ],
    );
  }
  
  void _addTodo(BuildContext context, String title) {
    if (title.trim().isNotEmpty) {
      context.read<TodoBloc>().add(AddTodo(title.trim()));
      _textController.clear();
    }
  }
}
```

::: tip Avantages du pattern BLoC
- **Séparation claire** : UI et logique métier complètement découplées
- **Testabilité** : Facile de tester la logique sans l'UI
- **Réutilisabilité** : Le même BLoC peut être utilisé sur différentes plateformes
- **Prédictibilité** : Flux unidirectionnel facile à comprendre
- **Débogage** : États et événements facilement traçables
:::

L'architecture BLoC apporte structure et maintenabilité à vos applications Flutter. Dans la section suivante, nous explorerons l'intégration avec [Firebase et Cloud Firestore](./firebase-firestore.md) pour ajouter une base de données temps réel à vos applications.