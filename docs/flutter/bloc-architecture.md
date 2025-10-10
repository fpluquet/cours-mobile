# Flutter – Architecture BLoC
 
## 🏗️ Introduction au pattern BLoC

BLoC (Business Logic Component) est un pattern architectural développé par Google pour Flutter. Il sépare la logique métier de l'interface utilisateur en utilisant les **Streams** de Dart.

### Pourquoi utiliser une architecture ?

Dans les applications simples, `setState()` suffit. Mais à mesure que l'application grandit, plusieurs problèmes apparaissent :

- **État dispersé** : Difficile de savoir où se trouve la logique
- **Couplage fort** : Interface et logique mélangées  
- **Testabilité limitée** : Difficile de tester la logique métier
- **Réutilisabilité** : Code difficile à partager entre widgets

::: info Principe de BLoC
BLoC suit le principe : **"Tout est un Stream"**. Les événements entrent, la logique métier les traite, et des états en sortent.
:::

### Comparaison des architectures

| Architecture | Complexité | Testabilité | Cas d'usage |
|-------------|------------|-------------|------------|
| **setState** | Faible | Limitée | Widgets simples |
| **Provider** | Moyenne | Bonne | Apps moyennes |
| **BLoC** | Élevée | Excellente | Apps complexes |

## 📋 Concepts fondamentaux

### Les 3 composants principaux

1. **Events** : Actions déclenchées par l'utilisateur (AppuiBouton, SaisieTexte...)
2. **States** : États de l'application à un moment donné (Chargement, Succès, Erreur...)
3. **BLoC** : Convertit les Events en States (la logique métier)

```
UI → Event → BLoC → State → UI
```

### Flux de données unidirectionnel

Le BLoC garantit un flux de données prévisible :

1. **L'utilisateur** interagit avec l'UI (tap, saisie...)
2. **L'UI** envoie un Event au BLoC
3. **Le BLoC** traite l'Event et produit un nouvel State
4. **L'UI** se reconstruit selon le nouvel State

Cette séparation claire facilite la maintenance et les tests.

## 🔧 BLoC basique (sans package)

Comprendre d'abord les mécanismes fondamentaux :

### Structure des Events

Les Events représentent les actions que l'utilisateur peut effectuer :

```dart
abstract class CompteurEvent {}

class Incrementer extends CompteurEvent {}
class Decrementer extends CompteurEvent {}
class Reset extends CompteurEvent {}
```

### Structure des States  

Les States représentent les différents états de l'application :

```dart
abstract class CompteurState {}

class CompteurInitial extends CompteurState {}
class CompteurValeur extends CompteurState {
  final int valeur;
  CompteurValeur(this.valeur);
}
```

### Implémentation du BLoC

Le BLoC connecte Events et States via des Streams :

```dart
class CompteurBloc {
  int _compteur = 0;
  
  // Stream des états (sortie)
  final _stateController = StreamController<CompteurState>();
  Stream<CompteurState> get stateStream => _stateController.stream;
  
  // Sink des événements (entrée)
  final _eventController = StreamController<CompteurEvent>();
  Sink<CompteurEvent> get eventSink => _eventController.sink;
  
  CompteurBloc() {
    _eventController.stream.listen(_handleEvent);
    _stateController.add(CompteurInitial());
  }
  
  void _handleEvent(CompteurEvent event) {
    if (event is Incrementer) _compteur++;
    else if (event is Decrementer) _compteur--;
    else if (event is Reset) _compteur = 0;
    
    _stateController.add(CompteurValeur(_compteur));
  }
  
  void dispose() {
    _eventController.close();
    _stateController.close();
  }
}
```

### Utilisation dans l'UI

Connecter le BLoC à l'interface utilisateur :

```dart
class CompteurPage extends StatefulWidget {
  @override
  _CompteurPageState createState() => _CompteurPageState();
}

class _CompteurPageState extends State<CompteurPage> {
  late CompteurBloc _bloc;
  
  @override
  void initState() {
    super.initState();
    _bloc = CompteurBloc();
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Compteur BLoC')),
      body: Center(
        child: StreamBuilder<CompteurState>(
          stream: _bloc.stateStream,
          builder: (context, snapshot) {
            if (snapshot.hasData && snapshot.data is CompteurValeur) {
              final state = snapshot.data as CompteurValeur;
              return Text('${state.valeur}', style: TextStyle(fontSize: 48));
            }
            return Text('0', style: TextStyle(fontSize: 48));
          },
        ),
      ),
      floatingActionButton: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
            onPressed: () => _bloc.eventSink.add(Decrementer()),
            child: Icon(Icons.remove),
            heroTag: "decrement",
          ),
          SizedBox(width: 10),
          FloatingActionButton(
            onPressed: () => _bloc.eventSink.add(Incrementer()),
            child: Icon(Icons.add),
            heroTag: "increment",
          ),
        ],
      ),
    );
  }
  
  @override
  void dispose() {
    _bloc.dispose();
    super.dispose();
  }
}
```

::: warning Points importants
- **StreamController** : Gère les streams d'entrée et sortie
- **StreamBuilder** : Reconstruit l'UI quand l'état change
- **dispose()** : Fermer les streams pour éviter les fuites mémoire
:::

## 📦 Package flutter_bloc

Le package officiel simplifie grandement l'implémentation :

```bash
flutter pub add flutter_bloc equatable
```

### Avantages du package

Le package `flutter_bloc` apporte plusieurs améliorations :

- **Gestion automatique** du cycle de vie des streams
- **Widgets spécialisés** : BlocProvider, BlocBuilder, BlocListener...
- **Performance optimisée** avec rebuild intelligent
- **API simplifiée** pour créer des BLoCs
- **Intégration avec Equatable** pour comparer les états

### Structure avec flutter_bloc

#### Events avec Equatable

```dart
abstract class CounterEvent extends Equatable {
  @override
  List<Object> get props => [];
}

class CounterIncremented extends CounterEvent {}
class CounterDecremented extends CounterEvent {}
```

#### States avec Equatable

```dart
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
```

#### BLoC simplifié

```dart
class CounterBloc extends Bloc<CounterEvent, CounterState> {
  CounterBloc() : super(CounterInitial()) {
    on<CounterIncremented>(_onIncremented);
    on<CounterDecremented>(_onDecremented);
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
}
```

### Widgets BLoC essentiels

#### BlocProvider
Injecte un BLoC dans l'arbre de widgets :

```dart
BlocProvider(
  create: (context) => CounterBloc(),
  child: CounterPage(),
)
```

#### BlocBuilder
Reconstruit l'UI quand l'état change :

```dart
BlocBuilder<CounterBloc, CounterState>(
  builder: (context, state) {
    if (state is CounterValue) {
      return Text('${state.value}');
    }
    return Text('0');
  },
)
```

#### BlocListener
Exécute des actions lors des changements d'état :

```dart
BlocListener<CounterBloc, CounterState>(
  listener: (context, state) {
    if (state is CounterValue && state.value == 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Limite atteinte !')),
      );
    }
  },
  child: CounterWidget(),
)
```

#### BlocConsumer
Combine BlocBuilder et BlocListener :

```dart
BlocConsumer<CounterBloc, CounterState>(
  listener: (context, state) {
    // Actions à effectuer
  },
  builder: (context, state) {
    // Construction de l'UI
    return Text('${state is CounterValue ? state.value : 0}');
  },
)
```

### Envoi d'événements

```dart
// Depuis un widget
context.read<CounterBloc>().add(CounterIncremented());

// Ou via référence directe
final bloc = BlocProvider.of<CounterBloc>(context);
bloc.add(CounterIncremented());
```

## 🎯 Exemple pratique : Liste de tâches

Implémentons une application ToDo pour illustrer les concepts :

### Modèle Todo

```dart
class Todo {
  final String id;
  final String title;
  final bool completed;
  
  Todo({required this.id, required this.title, this.completed = false});
  
  Todo copyWith({String? title, bool? completed}) {
    return Todo(
      id: id,
      title: title ?? this.title,
      completed: completed ?? this.completed,
    );
  }
}
```

### Events

```dart
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
```

### States

```dart
abstract class TodoState extends Equatable {
  @override
  List<Object> get props => [];
}

class TodoInitial extends TodoState {}
class TodoLoading extends TodoState {}
class TodoLoaded extends TodoState {
  final List<Todo> todos;
  TodoLoaded(this.todos);
  @override
  List<Object> get props => [todos];
}
class TodoError extends TodoState {
  final String message;
  TodoError(this.message);
  @override
  List<Object> get props => [message];
}
```

### BLoC

```dart
class TodoBloc extends Bloc<TodoEvent, TodoState> {
  TodoBloc() : super(TodoInitial()) {
    on<LoadTodos>(_onLoadTodos);
    on<AddTodo>(_onAddTodo);
    on<ToggleTodo>(_onToggleTodo);
  }
  
  List<Todo> _todos = [];
  
  void _onLoadTodos(LoadTodos event, Emitter<TodoState> emit) async {
    emit(TodoLoading());
    // Simulation chargement
    await Future.delayed(Duration(seconds: 1));
    _todos = [
      Todo(id: '1', title: 'Apprendre Flutter'),
      Todo(id: '2', title: 'Maîtriser BLoC'),
    ];
    emit(TodoLoaded(_todos));
  }
  
  void _onAddTodo(AddTodo event, Emitter<TodoState> emit) {
    final newTodo = Todo(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: event.title,
    );
    _todos = [..._todos, newTodo];
    emit(TodoLoaded(_todos));
  }
  
  void _onToggleTodo(ToggleTodo event, Emitter<TodoState> emit) {
    _todos = _todos.map((todo) {
      return todo.id == event.id 
          ? todo.copyWith(completed: !todo.completed)
          : todo;
    }).toList();
    emit(TodoLoaded(_todos));
  }
}
```

### Interface utilisateur

```dart
class TodoPage extends StatelessWidget {
  final _textController = TextEditingController();
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Todo BLoC')),
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
                    decoration: InputDecoration(hintText: 'Nouvelle tâche...'),
                  ),
                ),
                ElevatedButton(
                  onPressed: () {
                    if (_textController.text.isNotEmpty) {
                      context.read<TodoBloc>().add(AddTodo(_textController.text));
                      _textController.clear();
                    }
                  },
                  child: Text('Ajouter'),
                ),
              ],
            ),
          ),
          
          // Liste des todos
          Expanded(
            child: BlocBuilder<TodoBloc, TodoState>(
              builder: (context, state) {
                if (state is TodoLoading) {
                  return Center(child: CircularProgressIndicator());
                }
                
                if (state is TodoLoaded) {
                  return ListView.builder(
                    itemCount: state.todos.length,
                    itemBuilder: (context, index) {
                      final todo = state.todos[index];
                      return ListTile(
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
                                : null,
                          ),
                        ),
                      );
                    },
                  );
                }
                
                if (state is TodoError) {
                  return Center(child: Text('Erreur: ${state.message}'));
                }
                
                return Center(child: Text('Appuyez pour charger'));
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.read<TodoBloc>().add(LoadTodos()),
        child: Icon(Icons.refresh),
      ),
    );
  }
}
```

## 🧪 Tests et debugging

### Tests unitaires d'un BLoC

```dart
void main() {
  group('TodoBloc', () {
    late TodoBloc todoBloc;
    
    setUp(() {
      todoBloc = TodoBloc();
    });
    
    tearDown(() {
      todoBloc.close();
    });
    
    test('état initial est TodoInitial', () {
      expect(todoBloc.state, TodoInitial());
    });
    
    blocTest<TodoBloc, TodoState>(
      'émet TodoLoaded quand LoadTodos est ajouté',
      build: () => todoBloc,
      act: (bloc) => bloc.add(LoadTodos()),
      expect: () => [TodoLoading(), isA<TodoLoaded>()],
    );
  });
}
```

### Debug avec BlocObserver

```dart
class AppBlocObserver extends BlocObserver {
  @override
  void onChange(BlocBase bloc, Change change) {
    super.onChange(bloc, change);
    print('${bloc.runtimeType} $change');
  }
  
  @override
  void onError(BlocBase bloc, Object error, StackTrace stackTrace) {
    super.onError(bloc, error, stackTrace);
    print('${bloc.runtimeType} $error $stackTrace');
  }
}

void main() {
  Bloc.observer = AppBlocObserver();
  runApp(MyApp());
}
```

## ✅ Bonnes pratiques

### Organisation des fichiers

```
lib/
  blocs/
    todo/
      todo_bloc.dart
      todo_event.dart
      todo_state.dart
  models/
    todo.dart
  screens/
    todo_screen.dart
```

### Conventions de nommage

- **Events** : Verbes à l'impératif (LoadTodos, AddTodo)
- **States** : Noms ou adjectifs (TodoLoading, TodoLoaded)
- **BLoCs** : Suffixe "Bloc" (TodoBloc, UserBloc)

### Gestion d'erreurs

```dart
void _onLoadTodos(LoadTodos event, Emitter<TodoState> emit) async {
  emit(TodoLoading());
  try {
    final todos = await _repository.getTodos();
    emit(TodoLoaded(todos));
  } catch (e) {
    emit(TodoError(e.toString()));
  }
}
```

::: tip Avantages du pattern BLoC
- **Séparation claire** : UI et logique métier découplées
- **Testabilité** : Facile de tester la logique sans l'UI
- **Réutilisabilité** : Même BLoC utilisable sur différentes plateformes
- **Prédictibilité** : Flux unidirectionnel facile à comprendre
- **Débogage** : États et événements facilement traçables
:::

::: warning Points d'attention
- **Courbe d'apprentissage** : Plus complexe que setState
- **Boilerplate** : Nécessite plus de code initial
- **Performance** : Attention aux rebuilds inutiles
- **Architecture** : Bien structurer pour éviter la complexité
:::

L'architecture BLoC apporte structure et maintenabilité à vos applications Flutter. Dans la section suivante, nous explorerons l'intégration avec [Firebase et Cloud Firestore](./firebase-firestore.md) pour ajouter une base de données temps réel à vos applications.