# Programmation Asynchrone en Dart
 
## 🎯 L'asynchrone en Dart vs C#/Java

La programmation asynchrone en Dart est similaire à C# ou JS `async/await` et Java `CompletableFuture`, mais optimisée pour les applications mobiles et Flutter.


**Concepts clés :**

- **Single-threaded** : Dart s'exécute sur un seul thread, ce qui signifie qu'il ne peut traiter qu'une seule opération à la fois. Cependant, grâce à l'asynchronisme, il peut gérer plusieurs tâches sans les exécuter simultanément.
- **Event loop** : L'event loop (boucle d'événements) est le mécanisme qui permet à Dart de gérer les opérations asynchrones. Elle surveille la file d'attente des tâches et exécute les callbacks lorsque le thread principal est disponible.
- **Non-blocking** : Les opérations asynchrones (comme les requêtes réseau ou la lecture de fichiers) n'empêchent pas le reste du programme de s'exécuter. Dart continue d'exécuter d'autres instructions pendant que ces opérations sont en attente.

## ⚡ Future : valeurs futures

### Comprendre les Futures

Un `Future<T>` représente une valeur qui sera disponible dans le futur - exactement comme `Task<T>` en C# ou `Promise<T>` en JavaScript.

```dart
Future<String> getUserName(int id) async {
  // Simulation d'un appel réseau
  await Future.delayed(Duration(seconds: 2));
  return 'Utilisateur $id';
}

Future<int> getUserAge(int id) async {
  await Future.delayed(Duration(seconds: 1));
  return 25;
}
```

:::info Note
Notez que les fonctions `async` retournent toujours un `Future`, même si vous retournez une valeur simple. Le mot-clé `await` peut seulement être utilisé dans une fonction marquée `async`. Le mot clé `async` doit se trouver avant le type de retour (en fin de signature et non pas au début comme en C#/Javascript).
:::

:::warning Attention
Remarque importante : un `Future` **ne démarre pas** tant que vous ne l'avez pas appelé ou attendu avec `await`. C'est une promesse paresseuse.
:::

### Async/Await : syntaxe familière

La syntaxe `async`/`await` en Dart est très similaire à C# ou JavaScript, rendant le code asynchrone aussi lisible que du code synchrone.

```dart
// Utilisation basique (comme C#/Java)
Future<void> displayUserInfo() async {
  try {
    print('Chargement...');
    
    String name = await getUserName(123);
    int age = await getUserAge(123);
    
    print('$name a $age ans');
  } catch (e) {
    print('Erreur: $e');
  }
}

// Appels parallèles (comme Task.WhenAll en C#)
Future<void> displayUserInfoParallel() async {
  try {
    print('Chargement en parallèle...');
    
    // Les deux appels se font en parallèle
    var results = await Future.wait([
      getUserName(123),
      getUserAge(123),
    ]);
    
    String name = results[0];
    int age = results[1];
    
    print('$name a $age ans');
  } catch (e) {
    print('Erreur: $e');
  }
}
```

### Gestion d'erreurs robuste

Les erreurs dans les `Future` sont gérées avec des exceptions, similaires à C# ou Javascript. Vous pouvez utiliser `try/catch` pour capturer les erreurs.

Voici un exemple plus avancé avec un modèle `Result` pour une gestion d'erreurs typée, ainsi qu'une alternative utilisant des exceptions personnalisées.

```dart
// Modèle Result pour gestion d'erreurs typée
sealed class Result<T, E> {}

class Success<T, E> extends Result<T, E> {
  final T value;
  Success(this.value);
}

class Failure<T, E> extends Result<T, E> {
  final E error;
  Failure(this.error);
}

// Service avec gestion d'erreurs propre
class UserService {
  Future<Result<User, String>> getUser(int id) async {
    try {
      if (id <= 0) {
        return Failure('ID invalide');
      }
      
      // Simulation appel API
      await Future.delayed(Duration(seconds: 1));
      
      if (id == 404) {
        return Failure('Utilisateur non trouvé');
      }
      
      return Success(User('User $id', 25));
    } catch (e) {
      return Failure('Erreur réseau: $e');
    }
  }
  
  // Alternative avec exceptions
  Future<User?> getUserSafe(int id) async {
    try {
      return await _getUserFromApi(id);
    } on NotFoundException {
      return null; // Utilisateur non trouvé
    } on NetworkException catch (e) {
      print('Erreur réseau: ${e.message}');
      return null;
    } catch (e) {
      print('Erreur inconnue: $e');
      return null;
    }
  }
  
  Future<User> _getUserFromApi(int id) async {
    // Implémentation avec vraies exceptions
    throw UnimplementedError();
  }
}
```

### Futures sans async/await

Comme en C# ou JavaScript, vous pouvez aussi utiliser les callbacks avec `then`, `catchError` et `whenComplete`. C'est moins lisible mais parfois utile pour des chaînes de transformations.

```dart
// Style callback (moins lisible, mais utile parfois)
Future<void> fetchUserCallback() {
  return getUserName(123)
    .then((name) {
      print('Nom: $name');
      return getUserAge(123);
    })
    .then((age) {
      print('Age: $age');
    })
    .catchError((error) {
      print('Erreur: $error');
    });
}

// Transformation et chaînage
Future<String> getUserDisplayName(int id) {
  return getUserName(id)
    .then((name) => name.toUpperCase())
    .timeout(Duration(seconds: 5)); // Timeout automatique
}
```

## 🌊 Streams : flux de données

### Concept des Streams

Les Streams sont comme `IObservable` en C# ou les `Stream` en Java - des flux continus de données.

Les flux de données (`Stream`) en Dart peuvent provenir de différentes sources : une API WebSocket, des capteurs, ou une base de données. Une fois le flux créé, il peut être transformé à l’aide d’opérateurs comme `map`, `where` ou `distinct` pour filtrer ou modifier les données. Enfin, le flux est consommé par des écouteurs : dans une application Flutter, on utilise souvent `StreamBuilder` pour afficher les données en temps réel, ou bien les méthodes `listen` et `await for` pour réagir aux événements dans le code.

**Résumé du pipeline d’un Stream :**

1. **Source de données** : API WebSocket, capteurs, base de données…
2. **Stream** : création du flux.
3. **Transformation** : opérateurs (`map`, `where`, `distinct`…).
4. **Écoute** : consommation via `StreamBuilder`, `listen`, ou `await for`.

### Création de Streams

Il y a plusieurs façons de créer des streams en Dart : avec des générateurs `async*`, des `StreamController` (équivalent de `Subject` en C#), ou en utilisant des APIs natives.

```dart
// Stream simple avec générateur async*
Stream<int> numberStream() async* {
  for (int i = 1; i <= 5; i++) {
    await Future.delayed(Duration(seconds: 1));
    yield i; // Émet une valeur
  }
}

// Stream de messages de chat
Stream<String> chatMessages() async* {
  await for (var message in webSocketStream) {
    if (message.isNotEmpty) {
      yield message;
    }
  }
```

Le mot-clé `yield` est utilisé pour émettre des valeurs dans le flux. Le mot-clé `await for` permet d'attendre et de traiter chaque élément d'un autre flux de manière asynchrone. A la différence d'un `return`, `yield` n'interrompt pas la fonction : elle continue à s'exécuter et peut émettre plusieurs valeurs au fil du temps.

Voyons maintenant comment utiliser un `StreamController` pour créer un flux contrôlé.

```dart
// Stream avec StreamController (équivalent Subject en C#)
class MessageService {
  final StreamController<String> _controller = StreamController<String>();
  
  Stream<String> get messages => _controller.stream;
  
  void sendMessage(String message) {
    _controller.add(message);
  }
  
  void sendError(String error) {
    _controller.addError(error);
  }
  
  void close() {
    _controller.close();
  }
}
```

On crée un `StreamController` qui gère un flux de messages. La méthode `add` émet une nouvelle valeur, tandis que `addError` émet une erreur. N'oubliez pas de fermer le contrôleur avec `close` pour libérer les ressources.

### Consommation de Streams

Une fois le flux créé, il faut l'écouter. Vous pouvez utiliser `await for` pour une boucle asynchrone, ou `listen` pour un écouteur non-bloquant.

```dart
// Avec await for (équivalent foreach async en C#)
Future<void> listenToNumbers() async {
  await for (int number in numberStream()) {
    print('Reçu: $number');
    
    if (number == 3) {
      break; // Arrêter l'écoute
    }
  }
}
```

Le `await for` permet de traiter chaque élément du flux de manière asynchrone, similaire à un `foreach` asynchrone en C#. Vous pouvez utiliser `break` pour arrêter l'écoute à tout moment. Il s'arrête automatiquement lorsque le flux est fermé.

```dart
// Avec listen (non-bloquant)
void listenToMessages() {
  var service = MessageService();
  
  var subscription = service.messages.listen(
    (message) => print('Message: $message'),
    onError: (error) => print('Erreur: $error'),
    onDone: () => print('Stream fermé'),
  );
  
  // Envoyer des messages
  service.sendMessage('Hello');
  service.sendMessage('World');
  
  // Arrêter l'écoute après 10 secondes
  Future.delayed(Duration(seconds: 10), () {
    subscription.cancel();
    service.close();
  });
}
```

Le `listen` crée un abonnement au flux, avec des callbacks pour les nouvelles valeurs, les erreurs, et la fermeture du flux. Vous pouvez annuler l'abonnement à tout moment avec `cancel`.

### Transformation de Streams

On peut transformer et combiner des flux avec des opérateurs fonctionnels, similaires à LINQ en C#. L'idée est de chaîner des opérations pour filtrer, transformer, ou combiner les données, dès la source jusqu'à la consommation.

Prenons un exemple de transformation :
```dart
// Transformation et filtrage (comme LINQ en C#)
Stream<String> processMessages(Stream<String> input) {
  return input
    .where((message) => message.isNotEmpty)           // Filtrer
    .map((message) => message.toUpperCase())          // Transformer
    .distinct()                                       // Éliminer doublons
    .take(10);                                        // Limiter à 10
}
```

Ici on filtre les messages vides, les convertit en majuscules, élimine les doublons, et ne garde que les 10 premiers. Vous pouvez combiner plusieurs flux avec `StreamGroup` ou `async*`. Cette fonction retourne un nouveau flux transformé et peut être consommé comme n'importe quel autre flux.


## 🔧 Patterns avancés

### Isolates : vraie concurrence

On peut utiliser des `Isolates` pour exécuter du code dans un thread séparé, utile pour les calculs lourds. C'est similaire aux `Task.Run` en C# ou aux `ExecutorService` en Java.

```dart
import 'dart:isolate';

// Calcul lourd dans un isolate séparé
Future<int> heavyComputation(int n) async {
  return await Isolate.run(() {
    // Cette fonction s'exécute dans un thread séparé
    int result = 0;
    for (int i = 0; i < n; i++) {
      result += i * i;
    }
    return result;
  });
}

// Service de calcul avec isolate
class ComputationService {
  static Future<List<int>> processNumbers(List<int> numbers) async {
    return await Isolate.run(() {
      return numbers.map((n) => n * n).toList();
    });
  }
}
```

### Timeouts et retry

On peut ajouter des timeouts et des retries aux appels réseau pour plus de robustesse, comme en C# avec `CancellationToken` ou en Java avec des bibliothèques tierces.

```dart
// Extensions pour faciliter timeout et retry
extension FutureExtensions<T> on Future<T> {
  Future<T> withTimeout(Duration timeout) {
    return this.timeout(timeout);
  }
  
  Future<T> retry(int maxAttempts) async {
    for (int attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await this;
      } catch (e) {
        if (attempt == maxAttempts) rethrow;
        await Future.delayed(Duration(seconds: attempt));
      }
    }
    throw StateError('Should not reach here');
  }
}

// Service robuste avec retry et timeout
class RobustApiService {
  Future<String> fetchData(String url) async {
    return http.get(Uri.parse(url))
      .then((response) => response.body)
      .withTimeout(Duration(seconds: 10))
      .retry(3);
  }
}
```

### Debouncing et throttling

Le debouncing et le throttling sont des techniques pour limiter la fréquence des appels, utiles pour les entrées utilisateur ou les événements fréquents. Le debouncing attend que l'utilisateur ait fini de taper avant d'exécuter une action, tandis que le throttling limite le nombre d'exécutions sur une période donnée.

```dart
import 'dart:async';
import 'dart:io';

// Debounce pour éviter trop d'appels
class Debouncer {
  final Duration delay;
  Timer? _timer;
  
  Debouncer({required this.delay});
  
  void run(VoidCallback action) {
    _timer?.cancel();
    _timer = Timer(delay, action);
  }
  
  void dispose() {
    _timer?.cancel();
  }
}

void main() {
  final debouncer = Debouncer(delay: Duration(milliseconds: 500));
  print('Tapez votre recherche (appuyez sur Entrée après chaque lettre) :');

  stdin.lineMode = false;
  stdin.echoMode = false;

  String buffer = '';
  StreamSubscription<List<int>>? sub;

  sub = stdin.listen((event) {
    for (var byte in event) {
      if (byte == 10 || byte == 13) continue; // Ignore Enter
      if (byte == 127 || byte == 8) { // Backspace
        if (buffer.isNotEmpty) buffer = buffer.substring(0, buffer.length - 1);
      } else {
        buffer += String.fromCharCode(byte);
      }
      debouncer.run(() {
        print('\nRecherche: $buffer');
      });
    }
  });

  // Arrêter proprement (Ctrl+C)
  ProcessSignal.sigint.watch().listen((_) {
    debouncer.dispose();
    sub?.cancel();
    exit(0);
  });
}
```

### Conclusion

La programmation asynchrone en Dart est puissante et flexible, avec des concepts similaires à ceux de C# et Java, mais adaptés aux besoins des applications mobiles. En maîtrisant les `Future`, `Stream`, et les patterns avancés comme les `Isolates`, vous serez capable de construire des applications réactives, performantes, et robustes avec Flutter. N'hésitez pas à expérimenter avec ces concepts pour bien les assimiler !

Continuons à découvrir Dart avec la **manipulation de données** dans le prochain chapitre.