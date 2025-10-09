# Langage Dart – Fondamentaux
 
## 🎯 Dart

Comme vous maîtrisez déjà C# et Java, Dart va vous sembler familier tout en apportant des améliorations modernes qui rendent le développement mobile plus agréable. Ce chapitre se concentre sur **les fondamentaux essentiels** pour commencer avec Dart.


## 🎭 Variables et inférence de type

### Types de base

Comme dans C# et Java, Dart est un langage **typé statiquement**. Voici les types de base les plus courants :

| Type      | Description                | Exemple          |
|-----------|----------------------------|------------------|
| `int`     | Entiers                    | `42`, `-7`       |
| `double`  | Nombres à virgule flottante| `3.14`, `-0.001` |
| `String`  | Chaînes de caractères      | `'Hello'`, `"Dart"` |
| `bool`    | Booléens (vrai/faux)       | `true`, `false`  |
| `List<T>` | Listes (tableaux dynamiques)| `[1, 2, 3]`, `['a', 'b']` |
| `Map<K, V>` | Dictionnaires clé-valeur | `{'key': 'value'}` |
| `Set<T>` | Collections sans doublons | `{1, 2, 3}`      |


### Déclaration de variables

Une variable peut être déclarée avec un type explicite ou en utilisant `var` pour l'inférence de type automatique.

```dart
// Types explicites
String name = 'Alice';
int age = 25;
double height = 1.75;
bool isStudent = true;

// Inférence de type avec var
var userName = 'Bob';        // String inféré
var userAge = 30;           // int inféré
var isActive = false;       // bool inféré
var scores = [85, 90, 78];  // List<int> inféré
```

Une fois assignée, une variable typée ne peut pas changer de type. Par exemple, `name` est toujours une `String`.

```dart
name = 42;  // Erreur de compilation
```

Et pour les variables déclarées avec `var`, le type est fixé à la première assignation.

```dart
var count = 10; // count est de type int
count = 'dix'; // Erreur de compilation
```

Le mot-clé `late` permet de déclarer une variable qui sera initialisée plus tard, mais avant son utilisation.

```dart
// late : initialisation différée
late String configValue;    // Sera initialisé plus tard
```

### Le type `dynamic` : quand on ne connaît pas le type

Le type `dynamic` permet de déclarer des variables dont le type n'est pas connu à la compilation. C'est un peu comme `var` en JavaScript ou `object` en C#, mais avec plus de flexibilité.

```dart
// Une variable dynamic peut contenir n'importe quoi
dynamic data = 'Hello';
data = 42;          // OK
data = [1, 2, 3];   // OK aussi
data = true;        // Toujours OK

// Accès aux propriétés/méthodes
print(data.length);         // Fonctionne si data a une propriété length
print(data.toUpperCase());  // Crash à l'exécution si data n'est pas un String
```

::: warning ⚠️ Utilisez `dynamic` avec parcimonie
`dynamic` désactive complètement la vérification de type. Vous perdez l'aide de l'IDE (autocomplétion, détection d'erreurs) et risquez des erreurs à l'exécution. Préférez toujours les types explicites quand c'est possible !
:::

**Cas d'usage légitimes pour `dynamic` :**
- Données provenant d'APIs externes (JSON)
- Interopérabilité avec du code JavaScript
- Prototypage rapide
- Bibliothèques très génériques

```dart
// Exemple : traitement de JSON
dynamic jsonData = jsonDecode('{"name": "Alice", "age": 25}');
String name = jsonData['name'];  // Conversion explicite nécessaire
int age = jsonData['age'];
```

### Interpolation de chaînes

Dart permet d'insérer des variables et des expressions directement dans les chaînes de caractères avec `$` et `${}` (interpolation).

```dart
String name = 'Alice';
int age = 25;

// Simple
print('Bonjour $name');

// Avec expressions
print('$name a $age ans');
print('L\'année prochaine, $name aura ${age + 1} ans');

// Expressions complexes
print('Statut: ${age >= 18 ? "Majeur" : "Mineur"}');
```

## 🛡️ Null Safety : fini les exceptions liées aux null

### Le problème en Java/C#

Dans les langages comme C# ou Java, une variable peut contenir la valeur `null`, ce qui peut entraîner des erreurs d'exécution si on tente d'accéder à une propriété ou méthode sur une référence nulle. Le langage ne peut pas toujours garantir qu'une variable n'est pas `null`, ce qui peut provoquer des exceptions comme `NullReferenceException` ou `NullPointerException`.

En C# par exemple :

```csharp
// C# - Le piège classique
User user = GetUser(id);
string name = user.Name.ToUpper(); // 💥 NullReferenceException possible si user.Name est null
```

### La solution Dart : types nullable vs non-nullable

Pour éviter ces problèmes, Dart introduit la **null safety**. Par défaut, toutes les variables sont **non-nullables**, ce qui signifie qu'elles ne peuvent jamais contenir la valeur `null`. Si vous essayez de leur assigner `null`, le code ne compilera pas. Cela garantit que vous ne rencontrerez jamais d'erreurs liées aux références nulles à l'exécution, si votre code est bien typé.

```dart
// Dart - Sécurité garantie
String name = 'Alice';        // Ne peut JAMAIS être null
String? nickname = null;      // Peut être null (le ? l'indique)

// Cette ligne ne compilera jamais :
// String invalid = null;     // ❌ Erreur de compilation !
```

### Les opérateurs essentiels

Dart fournit plusieurs opérateurs pour travailler avec les types nullable en toute sécurité : le safe navigation (`?.`), le null coalescing (`??`), et le null assertion (`!`).

Supposons que `userInput` peut être `null` :
```dart
String? userInput = getUserInput();
```

Le safe navigation (`?.`) permet d'accéder à une propriété ou méthode seulement si l'objet n'est pas `null`. Si l'objet est `null`, l'expression retourne `null` au lieu de lancer une exception.
```dart
// 1. Safe navigation (?.)
print(userInput?.length);     // null si userInput est null
```

Le null coalescing (`??`) permet de fournir une valeur par défaut si l'expression de gauche est `null`. Si elle n'est pas `null`, cette valeur est utilisée.

```dart
// 2. Null coalescing (??)
String display = userInput ?? 'Anonyme';  // Valeur par défaut
```

Le null assertion (`!`) force le compilateur à traiter une variable nullable comme non-nullable. Utilisez-le uniquement lorsque vous êtes certain que la valeur n'est pas `null`, sinon une exception sera levée à l'exécution et le programme plantera. Cette opération est risquée et doit être utilisée avec précaution.
```dart
// 3. Null assertion (!)
String confirmed = userInput!;  // "Je sais qu'il n'est pas null"
```

::: warning ⚠️ Attention avec `!`
Utilisez `!` seulement quand vous êtes **absolument certain** que la valeur n'est pas null ! Sinon tout le principe de la null safety est contourné et vous risquez une exception à l'exécution.
:::

## 🔧 Fonctions et lambdas

### Fonctions de base

Comme en C# et Java, une fonction en Dart est définie avec un type de retour, un nom et des paramètres. Dart supporte aussi les fonctions fléchées (arrow functions) pour les expressions simples.

```dart
// Fonction classique
String greet(String name) {
  return 'Bonjour $name !';
}

// Fonction arrow (expression)
String greetShort(String name) => 'Bonjour $name !';

// Fonction sans retour
void printMessage(String message) {
  print('📧 $message');
}
```

### Paramètres postionnels, optionnels et nommés

Dart va différencier les *paramètres de position* et les *paramètres nommés*. 

#### Paramètres postionnels
Les paramètres de position sont comme ceux de Java ou JavaScript, où l'ordre des arguments compte. Par contre, les paramètres positionnels peuvent être rendus optionnels en les entourant de crochets `[]`.

```dart
void printInfo(String name, [int age = 0]) {
  print('Nom: $name, Âge: $age');
}
```

Dans cet exemple, `age` est optionnel et a une valeur par défaut de `0` si non fourni. Les appels peuvent omettre ce paramètre.

```dart
printInfo('Alice');        // Nom: Alice, Âge: 0
printInfo('Bob', 30);     // Nom: Bob, Âge: 30
```

#### Paramètres nommés

Les paramètres nommés sont entourés d'accolades `{}` et peuvent être rendus obligatoires avec le mot-clé `required`. Cela améliore la lisibilité lors de l'appel de la fonction.


```dart
// Paramètres nommés (très Flutter !)
String createProfile({
  required String name,        // Obligatoire
  required int age,           // Obligatoire
  String city = 'Inconnue',   // Optionnel avec défaut
  bool isPublic = false,      // Optionnel avec défaut
}) {
  return '$name ($age ans) à $city';
}

// Utilisation
var profile = createProfile(
  name: 'Alice',
  age: 25,
  city: 'Paris',
);
```

On peut mélanger paramètres positionnels et nommés dans une même fonction.

```dart
void setupAccount(String username, {required String email, String role = 'user'}) {
  print('Compte: $username, Email: $email, Rôle: $role');
}
setupAccount('alice123', email: 'alice@example.com');
```

### Fonctions comme variables (lambdas)

Comme dans beaucoup de langages modernes, les fonctions sont des citoyens de première classe en Dart. Vous pouvez les assigner à des variables, les
passer en paramètres, et les retourner depuis d'autres fonctions.

```dart
// Fonction comme variable
var multiply = (int a, int b) => a * b;
print(multiply(3, 4)); // 12

// Fonction d'ordre supérieur
void processNumbers(List<int> numbers, Function(int) processor) {
  for (var number in numbers) {
    processor(number);
  }
}

// Utilisation avec lambda
processNumbers([1, 2, 3], (n) => print('Nombre: $n'));
```

## Collections : List, Map, Set

Il y a trois collections principales en Dart : **List** (tableaux dynamiques), **Map** (dictionnaires clé-valeur), et **Set** (collections sans doublons). Dart offre une syntaxe moderne et des méthodes fonctionnelles pour manipuler ces collections facilement.

### Lists 

Les listes sont des tableaux dynamiques qui peuvent contenir des éléments de n'importe quel type. Vous pouvez créer une liste avec des crochets `[]` et utiliser des méthodes pour ajouter, supprimer, et parcourir les éléments.

```dart
// Création de listes
var fruits = ['pomme', 'banane', 'orange'];
List<String> legumes = ['carotte', 'tomate'];

// Opérations de base
fruits.add('kiwi');                    // Ajouter un élément
fruits.addAll(['mangue', 'ananas']);   // Ajouter plusieurs
fruits.insert(1, 'fraise');           // Insérer à un index
fruits.remove('banane');              // Supprimer par valeur
fruits.removeAt(0);                   // Supprimer par index

// Accès aux données
print(fruits[0]);           // Premier élément
print(fruits.length);       // Taille
print(fruits.isEmpty);      // Vérifier si vide
print(fruits.contains('pomme')); // Rechercher

// Méthodes fonctionnelles (très utiles !)
var majuscules = fruits.map((fruit) => fruit.toUpperCase()).toList();
var fruitsA = fruits.where((fruit) => fruit.startsWith('a')).toList();
```

### Maps 

Les maps sont des collections clé-valeur, similaires aux dictionnaires en Python ou aux objets en JavaScript. Vous pouvez créer une map avec des accolades `{}`.

```dart
// Création de maps
var ages = <String, int>{
  'Alice': 25,
  'Bob': 30,
  'Charlie': 28
};

// Opérations
ages['Diana'] = 26;          // Ajouter/modifier
ages.remove('Bob');          // Supprimer
int? aliceAge = ages['Alice']; // Accès (nullable)
int safeAge = ages['Zoe'] ?? 0; // Avec valeur par défaut

// Parcours
ages.forEach((nom, age) {
  print('$nom a $age ans');
});

// Conversion
List<String> noms = ages.keys.toList();
List<int> listeAges = ages.values.toList();
```

### Sets

Les sets sont des collections non ordonnées d'éléments uniques. Ils sont utiles pour éviter les doublons.

```dart
// Création de sets
var couleurs = {'rouge', 'vert', 'bleu'};
var nombres = {1, 2, 3, 2, 1}; // Résultat: {1, 2, 3}

// Opérations
couleurs.add('jaune');
couleurs.remove('rouge');
bool contientVert = couleurs.contains('vert');

// Opérations d'ensemble
var set1 = {1, 2, 3};
var set2 = {2, 3, 4};

var union = set1.union(set2);         // {1, 2, 3, 4}
var intersection = set1.intersection(set2); // {2, 3}
var difference = set1.difference(set2);     // {1}
```

### Collections modernes : syntaxe déclarative

```dart
// Innovation Dart : conditions et spread dans les collections
bool includeExtra = true;
var adminItems = ['admin1', 'admin2'];

var menuItems = [
  'Accueil',
  'Profil',
  if (includeExtra) 'Extra',           // Condition
  if (user.isAdmin) ...adminItems,     // Spread conditionnel
  for (var i in [1, 2, 3]) 'Item$i',  // Boucle
];
```

Le `if` dans les collections permet d'inclure des éléments conditionnellement, et le `for` permet de générer des éléments dynamiquement. Le `...` (spread operator) insère tous les éléments d'une autre collection. C'est un peu déroutant au début, mais c'est très puissant !

**Avantage :** Code plus lisible et déclaratif qu'avec des if/for séparés !

## 🔄 Prochaines étapes

Vous avez maintenant les bases pour commencer à écrire du code Dart efficace et sûr. La prochaine étape est de plonger dans la **programmation orientée objet (POO)** avec Dart, qui est essentielle pour structurer vos applications Flutter.