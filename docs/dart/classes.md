# Classes et Programmation Orientée Objet
 
## 🎯 POO en Dart

Dart reprend les concepts familiers tout en ajoutant des améliorations modernes qui simplifient le développement Flutter.

## 🏗️ Classes de base

### Anatomie d'une classe Dart

Une classe Dart ressemble beaucoup à celles de C# ou Java, mais avec une syntaxe plus concise.

```dart
class User {
  // Propriétés
  final String name;     // Immutable (recommandé Flutter)
  final int age;
  String? email;         // Mutable et nullable
  
  // Constructeur principal
  User(this.name, this.age, {this.email});
  
  // Constructeur nommé
  User.guest() : name = 'Invité', age = 0;
  
  // Méthodes
  String greet() => 'Bonjour, je suis $name';
  
  bool get isAdult => age >= 18;  // Getter
  
  set userEmail(String? email) {  // Setter
    this.email = email?.toLowerCase();
  }
  
  @override
  String toString() => 'User($name, $age ans)';
}
```

### Comparaison avec C#/Java

| Aspect | C#/Java | Dart |
|--------|---------|------|
| Constructeur | `public User(String name) { this.name = name; }` | `User(this.name);` |
| Propriété | `public String Name { get; set; }` | `String name;` |
| Getter | `public bool IsAdult() { return age >= 18; }` | `bool get isAdult => age >= 18;` |
| Final/Readonly | `readonly string name;` | `final String name;` |

### Visibilité et convention de nommage avec `_`

Contrairement à C# et Java qui utilisent des mots-clés explicites (`private`, `protected`, `public`), Dart utilise une **convention de nommage** simple et puissante : **tout ce qui commence par un underscore `_` est privé**.

Cette règle s'applique à **tous les éléments** :

```dart
class BankAccount {
  // Propriétés publiques (accessibles depuis l'extérieur)
  final String accountNumber;
  final String ownerName;
  
  // Propriétés privées (préfixées par _)
  double _balance;
  List<String> _transactions = [];
  DateTime _lastAccess = DateTime.now();
  
  // Constructeur public
  BankAccount(this.accountNumber, this.ownerName, double initialBalance)
    : _balance = initialBalance;
  
  // Méthodes publiques
  double get balance => _balance;
  List<String> get transactions => List.unmodifiable(_transactions);
  
  void deposit(double amount) {
    _validateAmount(amount);
    _balance += amount;
    _addTransaction('Dépôt: +$amount');
    _updateLastAccess();
  }
  
  // Méthodes privées (préfixées par _)
  void _validateAmount(double amount) {
    if (amount <= 0) {
      throw ArgumentError('Le montant doit être positif');
    }
  }
  
  void _addTransaction(String description) {
    _transactions.add('${DateTime.now()}: $description');
  }
  
  void _updateLastAccess() {
    _lastAccess = DateTime.now();
  }
  
  // Getter/setter privés
  DateTime get _formattedLastAccess => _lastAccess;
  set _internalBalance(double value) => _balance = value;
}

// Classes privées (tout le fichier devient privé aux autres bibliothèques)
class _InternalAuditLog {
  static void _logAccess(String accountNumber) {
    print('Accès au compte: $accountNumber');
  }
}
```

#### Portée de la visibilité privée

**Important :** En Dart, "privé" signifie **privé au niveau de la bibliothèque** (fichier `.dart`), pas au niveau de la classe comme en C#/Java.

```dart
// Dans le même fichier (account.dart)
class BankAccount {
  double _balance = 0.0;
  void _internalMethod() => print('Privé');
}

class BankManager {
  void auditAccount(BankAccount account) {
    // ✅ AUTORISÉ : même fichier, donc accès aux membres privés
    print('Solde: ${account._balance}');
    account._internalMethod();
  }
}

// Dans un autre fichier (main.dart)
import 'account.dart';

void main() {
  var account = BankAccount('123', 'Alice', 1000.0);
  
  // ✅ AUTORISÉ : membres publics
  print('Solde: ${account.balance}');
  account.deposit(100.0);
  
  // ❌ ERREUR : membres privés inaccessibles depuis un autre fichier
  // print(account._balance);      // Erreur de compilation
  // account._validateAmount(50);  // Erreur de compilation
}
```

#### Conventions et bonnes pratiques

| Élément | Convention | Exemple |
|---------|------------|---------|
| **Propriétés privées** | `_nomPropriete` | `_balance`, `_isValid` |
| **Méthodes privées** | `_nomMethode()` | `_validateData()`, `_processInternal()` |
| **Classes privées** | `_NomClasse` | `_DatabaseHelper`, `_InternalCache` |
| **Constantes privées** | `_CONSTANTE` | `_MAX_RETRIES`, `_DEFAULT_TIMEOUT` |
| **Getters/Setters privés** | `_propriete` | `get _formattedValue`, `set _internalState` |

```dart
class UserService {
  // Configuration privée
  static const int _MAX_RETRY_ATTEMPTS = 3;
  static const Duration _TIMEOUT_DURATION = Duration(seconds: 30);
  
  // État interne privé
  bool _isInitialized = false;
  Map<String, dynamic> _cache = {};
  
  // Méthodes d'API publiques
  Future<User?> getUser(String id) async {
    _ensureInitialized();
    return await _fetchUserWithRetry(id);
  }
  
  // Logique interne privée
  void _ensureInitialized() {
    if (!_isInitialized) {
      throw StateError('Service not initialized');
    }
  }
  
  Future<User?> _fetchUserWithRetry(String id) async {
    for (int attempt = 1; attempt <= _MAX_RETRY_ATTEMPTS; attempt++) {
      try {
        return await _performRequest(id);
      } catch (e) {
        if (attempt == _MAX_RETRY_ATTEMPTS) rethrow;
        await _waitBeforeRetry(attempt);
      }
    }
    return null;
  }
  
  Future<User?> _performRequest(String id) async {
    // Implémentation de la requête...
    throw UnimplementedError();
  }
  
  Future<void> _waitBeforeRetry(int attempt) async {
    await Future.delayed(Duration(seconds: attempt * 2));
  }
}
```

:::tip Conseil Flutter
En Flutter, utilisez systématiquement `_` pour l'état interne des widgets, les méthodes de callback privées, et toute logique qui ne doit pas être exposée. Cela rend votre code plus maintenable et évite les utilisations non intentionnelles.
:::

:::warning Attention
N'oubliez pas que "privé" en Dart = "privé au fichier", pas à la classe. Si vous voulez une vraie encapsulation au niveau classe, séparez vos classes dans des fichiers différents.
:::

## 🔧 Constructeurs avancés

### Constructeurs nommés : clarté et flexibilité

Les constructeurs nommés permettent de créer des instances d'une classe avec des valeurs par défaut ou des initialisations spécifiques, améliorant ainsi la lisibilité du code. Il n'utilise pas de surcharge comme en C#/Java, mais des noms explicites. Celui-ci est particulièrement utile pour les classes avec plusieurs façons de s'initialiser et le rend le code client plus expressif.

```dart
class Point {
  final double x, y;
  
  // Constructeur principal
  Point(this.x, this.y);
  
  // Constructeurs nommés (plus expressifs qu'en C#/Java)
  Point.origin() : x = 0, y = 0;
  
  Point.fromJson(Map<String, dynamic> json)
    : x = json['x']?.toDouble() ?? 0.0,
      y = json['y']?.toDouble() ?? 0.0;
  
  Point.polar(double radius, double angle)
    : x = radius * cos(angle),
      y = radius * sin(angle);
  
  // Factory constructor (pattern singleton, cache, etc.)
  factory Point.cached(double x, double y) {
    // Logique de cache...
    return Point(x, y);
  }
}

// Utilisation très expressive
var origin = Point.origin();
var fromData = Point.fromJson({'x': 1.5, 'y': 2.5});
var polar = Point.polar(5.0, pi / 4);
```

On voit que les constructeurs nommés (`Point.origin`, `Point.fromJson`, etc.) rendent le code plus lisible et évitent les erreurs liées à la surcharge.

### Factory constructors : contrôle total

Les `factory` constructors permettent de retourner des instances existantes, d'implémenter des singletons, ou de choisir dynamiquement la sous-classe à instancier. Une factory n'est pas obligée de retourner une nouvelle instance mais doit toujours retourner une instance de la classe (ou de ses sous-classes).

```dart
class Shape {
  factory Shape(String type) {
    switch (type) {
      case 'circle':
        return Circle();
      case 'square':
        return Square();
      default:
        throw ArgumentError('Unknown shape type');
    }
  }
}
class Circle extends Shape {
  Circle() {
    print('Cercle créé');
  }
}
class Square extends Shape {
  Square() {
    print('Carré créé');
  }
}

var shape1 = Shape('circle'); // Crée un Circle
var shape2 = Shape('square'); // Crée un Square
```

### Initialisation et validation

Il est indispensable de comprendre comment initialiser les propriétés et valider les données dans les constructeurs. Toutes les propriétés `final` doivent être initialisées avant la fin du constructeur et tous les attributs non-nullables doivent être assignés avant de sortir du constructeur.

Dart va donc séparer l'initialisation des propriétés (dans la liste d'initialisation) et le corps du constructeur (pour la logique de validation ou autres).

La liste d'initialisation (après les `:`) est obligatoire pour les `final` et les `late final`.

La validation des paramètres peut se faire dans le corps du constructeur.

```dart
class BankAccount {
  final String accountNumber;
  double _balance;
  final List<String> _transactions = [];
  
  BankAccount(this.accountNumber, double initialBalance)
    : _balance = initialBalance {
    // Corps du constructeur (après initialisation)
    if (initialBalance < 0) {
      throw ArgumentError('Balance cannot be negative');
    }
    _transactions.add('Account created with balance: $initialBalance');
  }
  
  // Factory pour comptes spéciaux
  factory BankAccount.savings(String number) {
    return BankAccount(number, 100.0); // Bonus ouverture
  }
  
  double get balance => _balance;
  List<String> get transactions => List.unmodifiable(_transactions);
  
  
}
```

On voit que la validation de `initialBalance` se fait dans le corps du constructeur, après l'initialisation de `_balance` (et `accountNumber` via le `this.accountNumber`).

## 🧬 Héritage et polymorphisme

Dart supporte l'héritage simple avec le mot-clé `extends`, et le polymorphisme via les méthodes virtuelles (override). Les classes abstraites sont déclarées avec `abstract` et peuvent contenir des méthodes sans implémentation.

### Héritage classique

```dart
// Classe de base
abstract class Animal {
  final String name;
  int age;
  
  Animal(this.name, this.age);
  
  void sleep() => print('$name dort');
  
  // Méthode abstraite
  void makeSound();
  
  // Getter virtuel
  String get description => '$name ($age ans)';
}

// Classes dérivées
class Dog extends Animal {
  final String breed;
  
  Dog(String name, int age, this.breed) : super(name, age);
  
  @override
  void makeSound() => print('$name aboie: Woof!');
  
  @override
  String get description => '${super.description}, race: $breed';
  
  void fetch() => print('$name rapporte la balle');
}

class Cat extends Animal {
  bool isIndoor;
  
  Cat(String name, int age, {this.isIndoor = true}) : super(name, age);
  
  @override
  void makeSound() => print('$name miaule: Meow!');
  
  void climb() => print('$name grimpe');
}
```

### Polymorphisme en action

Le polymorphisme permet de traiter des objets de différentes classes dérivées via une référence de la classe de base. Les méthodes surchargées sont appelées dynamiquement selon le type réel de l'objet. Il fonctionne comme en Java.

```dart
void animalShelter() {
  List<Animal> animals = [
    Dog('Rex', 3, 'Labrador'),
    Cat('Whiskers', 2),
    Dog('Bella', 5, 'Golden Retriever'),
  ];
  
  // Polymorphisme : chaque animal se comporte selon son type
  for (Animal animal in animals) {
    print(animal.description);
    animal.makeSound();
    animal.sleep();
    
    // Type checking et casting
    if (animal is Dog) {
      animal.fetch(); // Méthode spécifique au chien
    } else if (animal is Cat) {
      animal.climb(); // Méthode spécifique au chat
    }
    print('---');
  }
}
```

## 🎭 Mixins : composition moderne

### Le problème de l'héritage multiple

En C#/Java, vous ne pouvez hériter que d'une seule classe. Les mixins Dart résolvent ce problème élégamment. 

Les mixins permettent de réutiliser du code entre plusieurs classes sans recourir à l'héritage multiple. Ils sont déclarés avec le mot-clé `mixin` et peuvent être appliqués à n'importe quelle classe avec le mot-clé `with`.

Le mixin ne peut pas avoir de constructeur, mais peut contenir des propriétés et des méthodes.

Le code contenu dans un mixin est copié dans la classe qui l'utilise, ce qui évite les problèmes liés à l'héritage multiple.

```dart
// Mixins : fonctionnalités réutilisables
mixin Flyable {
  double altitude = 0.0;
  
  void fly() {
    altitude = 100.0;
    print('En vol à ${altitude}m');
  }
  
  void land() {
    altitude = 0.0;
    print('Atterrissage');
  }
}

mixin Swimmable {
  double depth = 0.0;
  
  void swim() {
    depth = 5.0;
    print('Nage à ${depth}m de profondeur');
  }
  
  void surface() {
    depth = 0.0;
    print('Remonte à la surface');
  }
}

mixin Debuggable {
  void debug(String message) {
    print('[${runtimeType}] $message');
  }
}

// Composition avec mixins
class Duck extends Animal with Flyable, Swimmable, Debuggable {
  Duck(String name, int age) : super(name, age);
  
  @override
  void makeSound() => print('$name fait: Coin coin!');
  
  void migrate() {
    debug('Starting migration');
    fly();
    debug('Flying to destination');
    land();
    swim();
    debug('Migration complete');
  }
}

// Usage
void duckLife() {
  var donald = Duck('Donald', 4);
  donald.makeSound();
  donald.migrate();
}
```

### Mixins pour services (pattern Flutter courant)

Pour vous montrer un exemple concret, voici comment utiliser des mixins pour ajouter des fonctionnalités de logging et de caching à un service.

```dart
mixin LoggerMixin {
  void logInfo(String message) => print('[INFO] $message');
  void logError(String message) => print('[ERROR] $message');
}

mixin CacheMixin<T> { // remarquez le type générique
  final Map<String, T> _cache = {};
  
  void cacheValue(String key, T value) => _cache[key] = value;
  T? getCachedValue(String key) => _cache[key];
  void clearCache() => _cache.clear();
}

class UserService with LoggerMixin, CacheMixin<User> {
  Future<User> getUser(String id) async {
    logInfo('Fetching user $id');
    
    // Vérifier le cache
    var cached = getCachedValue(id);
    if (cached != null) {
      logInfo('User $id found in cache');
      return cached;
    }
    
    // Simuler appel API
    await Future.delayed(Duration(seconds: 1));
    var user = User('User $id', 25);
    
    // Mettre en cache
    cacheValue(id, user);
    logInfo('User $id cached');
    
    return user;
  }
}
```

## 🔌 Interfaces et contrats

### Interfaces implicites

En C#/Java, une interface est un contrat formel et doit être déclarée avec le mot-clé `interface`.

En Dart, toute classe peut servir d'interface avec `implements` :

```dart
// "Interface" (en fait une classe normale)
class Drawable {
  void draw() => print('Drawing something');
  void erase() => print('Erasing');
}

class Resizable {
  void resize(double factor) => print('Resizing by $factor');
}

// Implémentation d'interfaces multiples
class Rectangle implements Drawable, Resizable {
  double width, height;
  
  Rectangle(this.width, this.height);
  
  @override
  void draw() => print('Drawing rectangle ${width}x$height');
  
  @override
  void erase() => print('Erasing rectangle');
  
  @override
  void resize(double factor) {
    width *= factor;
    height *= factor;
    print('Rectangle resized to ${width}x$height');
  }
  
  double get area => width * height;
}
```

Qu'est-ce que cela change ? Grâce à cette approche, vous pouvez définir des interfaces ad-hoc sans créer de types supplémentaires. Cependant, cela peut rendre le code moins explicite.

Voici un exemple qui utilise Drawable et Resizable comme interfaces.

```dart
void interfaceDemo() {
    Drawable rect = Rectangle(10, 20);
    rect.draw();
    rect.erase();
    Resizable resizableRect = rect as Resizable;
    resizableRect.resize(1.5);
    rect.draw();
}
```


### Interfaces abstraites pures

Il est possible de créer des interfaces pures en utilisant `abstract` et en ne fournissant que des signatures de méthodes (sans implémentation). Cela ressemble plus à une interface classique.

```dart
// Interface pure (recommandé pour les contrats)
abstract interface class PaymentProcessor {
  Future<PaymentResult> processPayment(double amount);
  Future<bool> refund(String transactionId);
  String get providerName;
}

// Implémentations
class StripeProcessor implements PaymentProcessor {
  @override
  String get providerName => 'Stripe';
  
  @override
  Future<PaymentResult> processPayment(double amount) async {
    // Logique Stripe
    await Future.delayed(Duration(seconds: 2));
    return PaymentResult(success: true, transactionId: 'stripe_${DateTime.now().millisecondsSinceEpoch}');
  }
  
  @override
  Future<bool> refund(String transactionId) async {
    // Logique de remboursement Stripe
    return true;
  }
}

class PayPalProcessor implements PaymentProcessor {
  @override
  String get providerName => 'PayPal';
  
  @override
  Future<PaymentResult> processPayment(double amount) async {
    // Logique PayPal
    await Future.delayed(Duration(seconds: 3));
    return PaymentResult(success: true, transactionId: 'pp_${DateTime.now().millisecondsSinceEpoch}');
  }
  
  @override
  Future<bool> refund(String transactionId) async {
    // Logique de remboursement PayPal
    return true;
  }
}

// Classe de résultat
class PaymentResult {
  final bool success;
  final String transactionId;
  final String? errorMessage;
  
  PaymentResult({
    required this.success,
    required this.transactionId,
    this.errorMessage,
  });
}
```

## 🎪 Extensions : étendre l'existant

Voici un concept très puissant de Dart qui n'existe pas en C#/Java : les extensions. Elles permettent d'ajouter des méthodes et des propriétés à des classes existantes, même celles que vous ne contrôlez pas (comme les types primitifs ou les classes de bibliothèques tierces). Cela améliore la lisibilité et la réutilisabilité du code.

On déclare une extension avec le mot-clé `extension` suivi d'un nom et de la classe cible. On y peut définir des méthodes, getters, setters, et même des opérateurs.

```dart
extension IntExtensions on int {
  String toBinary() {
    return toRadixString(2);
  }

  String toHexadecimal() {
    return toRadixString(16);
  }

  bool get isEven => this % 2 == 0;
}
```

### Extensions sur types primitifs

Prenons quelques exemples pratiques d'extensions sur le type `String` :

```dart
extension StringValidation on String {
  bool get isValidEmail {
    return contains('@') && contains('.') && length > 5;
  }
  
  bool get isValidPassword {
    return length >= 8 && 
           contains(RegExp(r'[A-Z]')) && 
           contains(RegExp(r'[0-9]'));
  }
  
  String get capitalize {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1).toLowerCase()}';
  }
  
  String truncate(int maxLength) {
    if (length <= maxLength) return this;
    return '${substring(0, maxLength)}...';
  }
}

// Utilisation
void stringExtensionsDemo() {
  var email = 'user@example.com';
  var password = 'MyPass123';
  var name = 'alice dupont';
  
  print('Email valide: ${email.isValidEmail}');
  print('Mot de passe valide: ${password.isValidPassword}');
  print('Nom formaté: ${name.capitalize}');
  print('Texte tronqué: ${'Un très long texte'.truncate(10)}');
}
```

### Extensions sur types complexes

On peut aussi créer des extensions des types plus complexes, comme sur des collections comme `List` et `Map` par exemple pour ajouter des fonctionnalités utiles.

```dart
extension ListUtils<T> on List<T> {
  List<T> get safeCopy => List.unmodifiable(this);
  
  T? get firstOrNull => isEmpty ? null : first;
  T? get lastOrNull => isEmpty ? null : last;
  
  List<T> chunks(int chunkSize) {
    List<List<T>> chunks = [];
    for (int i = 0; i < length; i += chunkSize) {
      chunks.add(sublist(i, math.min(i + chunkSize, length)));
    }
    return chunks.expand((chunk) => chunk).toList();
  }
}

extension MapUtils<K, V> on Map<K, V> {
  Map<K, V> get safeCopy => Map.unmodifiable(this);
  
  V? getValue(K key) => containsKey(key) ? this[key] : null;
  
  Map<K, V> whereValues(bool Function(V) test) {
    return Map.fromEntries(
      entries.where((entry) => test(entry.value))
    );
  }
}
```

Voici comment utiliser ces extensions :

```dart
void collectionExtensionsDemo() {
  var numbers = [1, 2, 3, 4, 5];
  var emptyList = <int>[];
  
  print('Premier élément: ${numbers.firstOrNull}');
  print('Dernier élément: ${numbers.lastOrNull}');
  print('Liste vide premier élément: ${emptyList.firstOrNull}');
  
  var chunked = numbers.chunks(2);
  print('Chunks de taille 2: $chunked');
  
  var userMap = {'alice': 30, 'bob': 25, 'charlie': 35};
  var adults = userMap.whereValues((age) => age >= 30);
  print('Utilisateurs adultes: $adults');
}
```

## @immutable et bonnes pratiques

En Flutter, il est recommandé de rendre les classes immuables pour éviter les effets de bord et faciliter la gestion de l'état. On utilise l'annotation `@immutable` pour indiquer qu'une classe ne doit pas être modifiée après sa création. Toutes les propriétés doivent être `final`.

```dart
import 'package:meta/meta.dart';
@immutable
class Product {
    final String id;
    final String name;
    final double price;
    final String? description;

    const Product({
        required this.id,
        required this.name,
        required this.price,
        this.description,
    });
    @override
    String toString() => 'Product(id: $id, name: $name, price: $price)';
}
```

Cette approche améliore la prévisibilité et la testabilité du code, surtout dans les applications Flutter où l'état change fréquemment. Toute instance de `Product` ne peut pas être modifiée après sa création, ce qui évite les bugs liés aux modifications inattendues.


## 🔄 Prochaines étapes

Maintenant que vous avez une bonne compréhension des classes, de l'héritage, des mixins, et des extensions en Dart, vous êtes prêt à plonger dans des concepts plus avancés comme la **programmation asynchrone** avec `Future`, `async/await`, et `Stream`.