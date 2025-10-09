# Dart – Syntaxe avancée
 
## 🚀 Extensions

Les extensions permettent d'ajouter des fonctionnalités à des types existants sans modifier leur code source. C'est particulièrement utile pour étendre les types natifs ou les classes de bibliothèques tierces.

### Extensions sur types natifs

```dart
// Extension sur String
extension StringExtensions on String {
  // Vérifier si une chaîne est un email valide
  bool get isValidEmail {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(this);
  }
  
  // Capitaliser la première lettre
  String get capitalize {
    if (isEmpty) return this;
    return this[0].toUpperCase() + substring(1).toLowerCase();
  }
  
  // Répéter une chaîne n fois
  String repeat(int times) {
    return List.filled(times, this).join();
  }
  
  // Inverser une chaîne
  String get reverse {
    return split('').reversed.join();
  }
}

// Utilisation
void main() {
  String email = 'alice@example.com';
  print(email.isValidEmail); // true
  
  String nom = 'alice';
  print(nom.capitalize); // Alice
  
  String motif = 'Ha';
  print(motif.repeat(3)); // HaHaHa
  
  String texte = 'Bonjour';
  print(texte.reverse); // ruojnoB
}
```

### Extensions sur List

```dart
extension ListExtensions<T> on List<T> {
  // Obtenir un élément de manière sécurisée
  T? getAt(int index) {
    if (index < 0 || index >= length) return null;
    return this[index];
  }
  
  // Diviser une liste en chunks
  List<List<T>> chunk(int size) {
    List<List<T>> chunks = [];
    for (int i = 0; i < length; i += size) {
      chunks.add(sublist(i, (i + size > length) ? length : i + size));
    }
    return chunks;
  }
  
  // Supprimer les doublons en gardant l'ordre
  List<T> get unique {
    Set<T> seen = {};
    return where((element) => seen.add(element)).toList();
  }
}

// Extension sur List<int> spécifiquement
extension IntListExtensions on List<int> {
  int get sum => fold(0, (a, b) => a + b);
  double get average => sum / length;
  int get max => reduce((a, b) => a > b ? a : b);
  int get min => reduce((a, b) => a < b ? a : b);
}

// Utilisation
void main() {
  List<String> noms = ['Alice', 'Bob', 'Charlie', 'Alice', 'Diana'];
  print(noms.getAt(10)); // null (sécurisé)
  print(noms.unique); // [Alice, Bob, Charlie, Diana]
  print(noms.chunk(2)); // [[Alice, Bob], [Charlie, Alice], [Diana]]
  
  List<int> nombres = [1, 2, 3, 4, 5];
  print(nombres.sum); // 15
  print(nombres.average); // 3.0
  print(nombres.max); // 5
}
```

## 🏷️ Typedefs et alias de types

Les typedefs permettent de créer des alias pour des types complexes, améliorant la lisibilité du code.

```dart
// Typedef pour les fonctions
typedef Calculateur = double Function(double a, double b);
typedef Validateur<T> = bool Function(T value);
typedef Callback = void Function();

// Typedef pour les maps complexes
typedef UserData = Map<String, dynamic>;
typedef ApiResponse<T> = Map<String, T>;

// Utilisation des typedefs
class CalculatriceAvancee {
  final Map<String, Calculateur> operations = {
    'addition': (a, b) => a + b,
    'soustraction': (a, b) => a - b,
    'multiplication': (a, b) => a * b,
    'division': (a, b) => b != 0 ? a / b : double.nan,
  };
  
  double calculer(String operation, double a, double b) {
    Calculateur? calc = operations[operation];
    if (calc == null) {
      throw ArgumentError('Opération inconnue: $operation');
    }
    return calc(a, b);
  }
}

// Validateurs avec typedef
class FormValidator {
  static final Validateur<String> emailValidator = (email) {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email);
  };
  
  static final Validateur<String> passwordValidator = (password) {
    return password.length >= 8 && 
           RegExp(r'[A-Z]').hasMatch(password) &&
           RegExp(r'[0-9]').hasMatch(password);
  };
  
  static bool validerChamp(String valeur, Validateur<String> validateur) {
    return validateur(valeur);
  }
}

// Utilisation
void main() {
  var calc = CalculatriceAvancee();
  print(calc.calculer('addition', 5, 3)); // 8.0
  
  bool emailValide = FormValidator.validerChamp(
    'test@example.com', 
    FormValidator.emailValidator
  );
  print(emailValide); // true
}
```

## 📦 Records et Patterns (Dart 3.0+)

Les records permettent de regrouper plusieurs valeurs de types différents sans créer de classe.

### Records basiques

```dart
// Record simple
(String, int) obtenirNomEtAge() {
  return ('Alice', 25);
}

// Record nommé
({String nom, int age, bool actif}) obtenirUtilisateur() {
  return (nom: 'Bob', age: 30, actif: true);
}

// Destructuration
void main() {
  // Record positionnel
  var (nom, age) = obtenirNomEtAge();
  print('$nom a $age ans');
  
  // Record nommé
  var utilisateur = obtenirUtilisateur();
  print('${utilisateur.nom} est ${utilisateur.actif ? 'actif' : 'inactif'}');
  
  // Destructuration partielle
  var (nomUser, :actif) = obtenirUtilisateur();
  print('$nomUser est ${actif ? 'connecté' : 'déconnecté'}');
}
```

### Patterns avancés

```dart
// Fonction utilisant les patterns
String analyserReponseAPI(Object reponse) {
  return switch (reponse) {
    {'status': 'success', 'data': var data} => 'Succès: $data',
    {'status': 'error', 'message': String message} => 'Erreur: $message',
    {'status': 'loading'} => 'Chargement en cours...',
    List<String> liste when liste.isNotEmpty => 'Liste: ${liste.first}...',
    int code when code >= 200 && code < 300 => 'Code HTTP OK: $code',
    _ => 'Réponse inconnue'
  };
}

// Pattern matching avec les classes
sealed class Resultat<T> {}
class Succes<T> extends Resultat<T> {
  final T valeur;
  Succes(this.valeur);
}
class Erreur<T> extends Resultat<T> {
  final String message;
  Erreur(this.message);
}

String traiterResultat<T>(Resultat<T> resultat) {
  return switch (resultat) {
    Succes(valeur: var v) => 'Succès: $v',
    Erreur(message: var msg) => 'Erreur: $msg',
  };
}

// Utilisation
void main() {
  // Test des patterns d'API
  var reponses = [
    {'status': 'success', 'data': 'Données récupérées'},
    {'status': 'error', 'message': 'Serveur indisponible'},
    {'status': 'loading'},
    ['item1', 'item2', 'item3'],
    200,
    'format inconnu'
  ];
  
  for (var reponse in reponses) {
    print(analyserReponseAPI(reponse));
  }
  
  // Test des classes sealed
  var resultats = [
    Succes('Opération réussie'),
    Erreur('Connexion échouée')
  ];
  
  for (var resultat in resultats) {
    print(traiterResultat(resultat));
  }
}
```

## 🔄 Manipulation avancée des collections

### Méthodes de transformation

```dart
class Produit {
  final String nom;
  final double prix;
  final String categorie;
  final bool enStock;
  
  Produit(this.nom, this.prix, this.categorie, {this.enStock = true});
  
  @override
  String toString() => '$nom (${prix}€) - $categorie';
}

void demonstrationCollections() {
  List<Produit> produits = [
    Produit('iPhone', 999.99, 'Électronique'),
    Produit('T-shirt', 29.99, 'Vêtement'),
    Produit('Livre Dart', 39.99, 'Livre'),
    Produit('MacBook', 1999.99, 'Électronique'),
    Produit('Pantalon', 59.99, 'Vêtement', enStock: false),
  ];
  
  // Filtrage et transformation
  var electroniquesEnStock = produits
      .where((p) => p.categorie == 'Électronique' && p.enStock)
      .map((p) => p.nom)
      .toList();
  print('Électroniques en stock: $electroniquesEnStock');
  
  // Groupement par catégorie
  Map<String, List<Produit>> parCategorie = {};
  for (var produit in produits) {
    parCategorie.putIfAbsent(produit.categorie, () => []).add(produit);
  }
  
  // Calculs agrégés
  double prixTotal = produits
      .where((p) => p.enStock)
      .map((p) => p.prix)
      .reduce((a, b) => a + b);
  print('Prix total des produits en stock: ${prixTotal.toStringAsFixed(2)}€');
  
  // Tri
  var produitsTries = [...produits]
    ..sort((a, b) => a.prix.compareTo(b.prix));
  print('Produits triés par prix:');
  produitsTries.forEach(print);
  
  // Recherche
  Produit? produitCher = produits
      .where((p) => p.prix > 100)
      .reduce((a, b) => a.prix > b.prix ? a : b);
  print('Produit le plus cher > 100€: $produitCher');
}
```

### Opérations sur les Streams

```dart
import 'dart:async';
import 'dart:math';

class StreamUtils {
  // Créer un stream de nombres aléatoires
  static Stream<int> nombresAleatoires({int max = 100, Duration interval = const Duration(seconds: 1)}) async* {
    Random random = Random();
    while (true) {
      await Future.delayed(interval);
      yield random.nextInt(max);
    }
  }
  
  // Stream de données simulées
  static Stream<Map<String, dynamic>> donneesMeteo() async* {
    Random random = Random();
    List<String> villes = ['Bruxelles', 'Paris', 'Londres', 'Berlin'];
    
    for (String ville in villes) {
      await Future.delayed(Duration(milliseconds: 500));
      yield {
        'ville': ville,
        'temperature': random.nextInt(30) + 5,
        'humidite': random.nextInt(40) + 40,
        'timestamp': DateTime.now().toIso8601String(),
      };
    }
  }
}

// Traitement avancé des streams
Future<void> demonstrationStreams() async {
  print('=== Streams de nombres ===');
  
  // Stream avec transformation et filtrage
  await StreamUtils.nombresAleatoires(max: 50)
      .take(5)  // Prendre seulement 5 valeurs
      .where((n) => n % 2 == 0)  // Nombres pairs seulement
      .map((n) => 'Nombre pair: $n')  // Transformation
      .listen(print)
      .asFuture();
  
  print('\n=== Données météo ===');
  
  // Stream avec agrégation
  List<Map<String, dynamic>> donnees = [];
  await StreamUtils.donneesMeteo()
      .listen((meteo) {
        donnees.add(meteo);
        print('${meteo['ville']}: ${meteo['temperature']}°C');
      })
      .asFuture();
  
  // Calcul de température moyenne
  double tempMoyenne = donnees
      .map((d) => d['temperature'] as int)
      .reduce((a, b) => a + b) / donnees.length;
  print('Température moyenne: ${tempMoyenne.toStringAsFixed(1)}°C');
}
```

## ⚠️ Gestion avancée des exceptions

### Exceptions personnalisées

```dart
// Exceptions métier
class ValidationException implements Exception {
  final String message;
  final String champ;
  
  ValidationException(this.message, this.champ);
  
  @override
  String toString() => 'ValidationException($champ): $message';
}

class NetworkException implements Exception {
  final String message;
  final int? statusCode;
  
  NetworkException(this.message, [this.statusCode]);
  
  @override
  String toString() {
    String base = 'NetworkException: $message';
    if (statusCode != null) {
      base += ' (Code: $statusCode)';
    }
    return base;
  }
}

// Service avec gestion d'erreurs robuste
class UserService {
  static final Map<String, Map<String, dynamic>> _fakeDatabase = {
    'alice@example.com': {
      'nom': 'Alice',
      'age': 25,
      'actif': true,
    }
  };
  
  Future<Map<String, dynamic>> obtenirUtilisateur(String email) async {
    // Validation d'entrée
    if (email.isEmpty) {
      throw ValidationException('Email ne peut pas être vide', 'email');
    }
    
    if (!email.contains('@')) {
      throw ValidationException('Format email invalide', 'email');
    }
    
    // Simulation d'appel réseau
    await Future.delayed(Duration(milliseconds: 500));
    
    // Simulation d'erreurs réseau aléatoires
    if (Random().nextBool()) {
      throw NetworkException('Timeout de connexion', 408);
    }
    
    // Recherche utilisateur
    var utilisateur = _fakeDatabase[email];
    if (utilisateur == null) {
      throw NetworkException('Utilisateur non trouvé', 404);
    }
    
    return Map<String, dynamic>.from(utilisateur);
  }
  
  // Méthode avec retry automatique
  Future<Map<String, dynamic>> obtenirUtilisateurAvecRetry(
    String email, {
    int maxRetries = 3,
  }) async {
    int tentatives = 0;
    
    while (tentatives < maxRetries) {
      try {
        return await obtenirUtilisateur(email);
      } on NetworkException catch (e) {
        tentatives++;
        if (tentatives >= maxRetries) {
          rethrow;
        }
        print('Tentative $tentatives échouée: ${e.message}. Retry...');
        await Future.delayed(Duration(seconds: tentatives));
      } on ValidationException {
        // Ne pas retry les erreurs de validation
        rethrow;
      }
    }
    
    throw NetworkException('Échec après $maxRetries tentatives');
  }
}

// Gestionnaire d'erreurs centralisé
class ErrorHandler {
  static String getMessageUtilisateur(Exception e) {
    switch (e) {
      case ValidationException ve:
        return 'Erreur de saisie: ${ve.message}';
      case NetworkException ne when ne.statusCode == 404:
        return 'Utilisateur non trouvé';
      case NetworkException ne when ne.statusCode != null && ne.statusCode! >= 500:
        return 'Erreur serveur. Veuillez réessayer plus tard.';
      case NetworkException():
        return 'Problème de connexion. Vérifiez votre réseau.';
      default:
        return 'Une erreur inattendue s\'est produite';
    }
  }
  
  static void logError(Exception e, StackTrace stackTrace) {
    print('ERREUR: $e');
    print('STACK TRACE: $stackTrace');
    // Ici, on pourrait envoyer vers un service de logging
  }
}

// Utilisation complète
Future<void> demonstrationGestionErreurs() async {
  UserService service = UserService();
  List<String> emails = [
    'alice@example.com',
    'bob@example.com',
    '',
    'email-invalide'
  ];
  
  for (String email in emails) {
    print('\n--- Test avec: $email ---');
    try {
      var utilisateur = await service.obtenirUtilisateurAvecRetry(email);
      print('Succès: ${utilisateur['nom']}');
    } catch (e, stackTrace) {
      if (e is Exception) {
        ErrorHandler.logError(e, stackTrace);
        print('Message utilisateur: ${ErrorHandler.getMessageUtilisateur(e)}');
      } else {
        print('Erreur inattendue: $e');
      }
    }
  }
}
```

## 🎯 Exemple complet : API Client avec modèles JSON

Voici un exemple complet qui combine toutes les notions avancées vues :

```dart
import 'dart:convert';
import 'dart:math';

// Modèles de données avec sérialisation JSON
class Adresse {
  final String rue;
  final String ville;
  final String codePostal;
  final String pays;
  
  Adresse({
    required this.rue,
    required this.ville,
    required this.codePostal,
    required this.pays,
  });
  
  factory Adresse.fromJson(Map<String, dynamic> json) {
    return Adresse(
      rue: json['rue'] as String,
      ville: json['ville'] as String,
      codePostal: json['codePostal'] as String,
      pays: json['pays'] as String,
    );
  }
  
  Map<String, dynamic> toJson() => {
    'rue': rue,
    'ville': ville,
    'codePostal': codePostal,
    'pays': pays,
  };
  
  @override
  String toString() => '$rue, $ville $codePostal, $pays';
}

class Utilisateur {
  final int id;
  final String nom;
  final String prenom;
  final String email;
  final int age;
  final Adresse adresse;
  final List<String> competences;
  final bool actif;
  final DateTime dateCreation;
  
  Utilisateur({
    required this.id,
    required this.nom,
    required this.prenom,
    required this.email,
    required this.age,
    required this.adresse,
    required this.competences,
    this.actif = true,
    DateTime? dateCreation,
  }) : dateCreation = dateCreation ?? DateTime.now();
  
  factory Utilisateur.fromJson(Map<String, dynamic> json) {
    return Utilisateur(
      id: json['id'] as int,
      nom: json['nom'] as String,
      prenom: json['prenom'] as String,
      email: json['email'] as String,
      age: json['age'] as int,
      adresse: Adresse.fromJson(json['adresse'] as Map<String, dynamic>),
      competences: (json['competences'] as List<dynamic>).cast<String>(),
      actif: json['actif'] as bool? ?? true,
      dateCreation: DateTime.parse(json['dateCreation'] as String),
    );
  }
  
  Map<String, dynamic> toJson() => {
    'id': id,
    'nom': nom,
    'prenom': prenom,
    'email': email,
    'age': age,
    'adresse': adresse.toJson(),
    'competences': competences,
    'actif': actif,
    'dateCreation': dateCreation.toIso8601String(),
  };
  
  // Extension avec getter calculé
  String get nomComplet => '$prenom $nom';
  bool get estMajeur => age >= 18;
  
  @override
  String toString() => '$nomComplet ($email) - ${competences.join(', ')}';
}

// Client API avec gestion d'erreurs
class ApiClient {
  // Simulation de base de données
  static final List<Map<String, dynamic>> _fakeData = [
    {
      'id': 1,
      'nom': 'Dupont',
      'prenom': 'Alice',
      'email': 'alice.dupont@example.com',
      'age': 28,
      'adresse': {
        'rue': '123 Rue de la Paix',
        'ville': 'Bruxelles',
        'codePostal': '1000',
        'pays': 'Belgique'
      },
      'competences': ['Dart', 'Flutter', 'Firebase'],
      'actif': true,
      'dateCreation': '2024-01-15T10:30:00.000Z'
    },
    {
      'id': 2,
      'nom': 'Martin',
      'prenom': 'Bob',
      'email': 'bob.martin@example.com',
      'age': 32,
      'adresse': {
        'rue': '456 Avenue Louise',
        'ville': 'Bruxelles',
        'codePostal': '1050',
        'pays': 'Belgique'
      },
      'competences': ['React', 'Node.js', 'JavaScript'],
      'actif': true,
      'dateCreation': '2024-02-20T14:45:00.000Z'
    }
  ];
  
  Future<List<Utilisateur>> obtenirTousLesUtilisateurs() async {
    await _simulerLatenceReseau();
    
    return _fakeData.map((json) => Utilisateur.fromJson(json)).toList();
  }
  
  Future<Utilisateur?> obtenirUtilisateurParId(int id) async {
    await _simulerLatenceReseau();
    
    var jsonUser = _fakeData.where((u) => u['id'] == id).firstOrNull;
    return jsonUser != null ? Utilisateur.fromJson(jsonUser) : null;
  }
  
  Future<List<Utilisateur>> rechercherUtilisateurs({
    String? competence,
    int? ageMin,
    String? ville,
  }) async {
    await _simulerLatenceReseau();
    
    return _fakeData
        .map((json) => Utilisateur.fromJson(json))
        .where((user) {
          if (competence != null && !user.competences.contains(competence)) {
            return false;
          }
          if (ageMin != null && user.age < ageMin) {
            return false;
          }
          if (ville != null && user.adresse.ville != ville) {
            return false;
          }
          return true;
        }).toList();
  }
  
  Future<void> _simulerLatenceReseau() async {
    await Future.delayed(Duration(milliseconds: Random().nextInt(500) + 200));
    
    // Simulation d'erreurs réseau occasionnelles
    if (Random().nextInt(10) == 0) {
      throw NetworkException('Timeout de connexion');
    }
  }
}

// Extensions utiles pour l'analyse
extension UtilisateurListExtensions on List<Utilisateur> {
  List<Utilisateur> get actifs => where((u) => u.actif).toList();
  List<Utilisateur> get majeurs => where((u) => u.estMajeur).toList();
  
  double get ageMoyen {
    if (isEmpty) return 0;
    return map((u) => u.age).reduce((a, b) => a + b) / length;
  }
  
  Map<String, int> get competencesCount {
    Map<String, int> count = {};
    for (var user in this) {
      for (var competence in user.competences) {
        count[competence] = (count[competence] ?? 0) + 1;
      }
    }
    return count;
  }
  
  List<Utilisateur> trierParAge({bool croissant = true}) {
    var copie = List<Utilisateur>.from(this);
    copie.sort((a, b) => croissant ? a.age.compareTo(b.age) : b.age.compareTo(a.age));
    return copie;
  }
}

// Démonstration complète
Future<void> main() async {
  print('=== Démonstration API Client Avancé ===\n');
  
  ApiClient client = ApiClient();
  
  try {
    // Récupération de tous les utilisateurs
    print('📋 Tous les utilisateurs:');
    List<Utilisateur> utilisateurs = await client.obtenirTousLesUtilisateurs();
    utilisateurs.forEach(print);
    
    // Utilisation des extensions
    print('\n📊 Statistiques:');
    print('Nombre d\'utilisateurs actifs: ${utilisateurs.actifs.length}');
    print('Âge moyen: ${utilisateurs.ageMoyen.toStringAsFixed(1)} ans');
    print('Compétences les plus courantes: ${utilisateurs.competencesCount}');
    
    // Recherche par critères
    print('\n🔍 Recherche d\'utilisateurs avec Flutter:');
    var developpeursFlutter = await client.rechercherUtilisateurs(competence: 'Flutter');
    developpeursFlutter.forEach(print);
    
    // Recherche par ID
    print('\n👤 Utilisateur ID 1:');
    var utilisateur1 = await client.obtenirUtilisateurParId(1);
    if (utilisateur1 != null) {
      print('Trouvé: ${utilisateur1.nomComplet}');
      print('Adresse: ${utilisateur1.adresse}');
      print('Majeur: ${utilisateur1.estMajeur ? 'Oui' : 'Non'}');
    }
    
    // Tri
    print('\n📈 Utilisateurs triés par âge:');
    var triesParAge = utilisateurs.trierParAge();
    triesParAge.forEach((u) => print('${u.nomComplet} - ${u.age} ans'));
    
  } catch (e) {
    print('❌ Erreur: ${ErrorHandler.getMessageUtilisateur(e as Exception)}');
  }
}
```

Cette section sur la syntaxe avancée de Dart vous prépare parfaitement pour aborder Flutter avec une maîtrise complète du langage. Vous pouvez maintenant passer à l'étude du [framework Flutter](../flutter/) pour commencer à créer des interfaces utilisateur mobiles.