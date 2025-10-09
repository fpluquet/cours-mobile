# Manipulation JSON et Données
 
## 🎯 JSON en Dart vs C#/Java

La manipulation JSON en Dart est plus simple qu'en Java mais plus manuelle qu'en C# avec Newtonsoft.Json. Découvrez les patterns modernes pour APIs et persistence.

**Concepts clés :**  
- `dart:convert` : Une bibliothèque Dart utilisée pour encoder et décoder des données JSON, essentielle pour la communication avec des API ou le stockage local.  
- Modèles immutables : Des classes dont les instances ne peuvent pas être modifiées après leur création, ce qui aide à garantir la cohérence des données et à éviter les effets de bord.  
- Factory constructors : Des constructeurs spéciaux en Dart qui permettent de contrôler la création des instances, souvent utilisés pour la désérialisation JSON ou pour retourner des instances existantes.  
- Null safety : Un mécanisme de Dart qui aide à éviter les erreurs liées aux valeurs nulles, en forçant le développeur à gérer explicitement les cas où une variable peut être nulle.

## 📋 JSON de base

### Parsing JSON simple

Pour parser du JSON en Dart, on utilise `dart:convert` avec `json.decode()`. Contrairement à C# où on peut directement désérialiser en objet, en Dart on obtient une `Map<String, dynamic>` qu'il faut ensuite convertir.

```dart
import 'dart:convert';

// JSON vers Map<String, dynamic>
String jsonString = '''
{
  "id": 123,
  "name": "Alice Dupont",
  "email": "alice@example.com",
  "isActive": true,
  "age": 25,
  "profile": {
    "bio": "Développeuse Flutter",
    "avatar": "https://example.com/avatar.jpg"
  },
  "skills": ["Dart", "Flutter", "Firebase"]
}
''';

// Parsing (peut lancer une exception)
Map<String, dynamic> userJson = json.decode(jsonString);

// Accès aux données (attention aux types !)
int id = userJson['id'] as int;
String name = userJson['name'] as String;
bool isActive = userJson['isActive'] as bool;
List<String> skills = (userJson['skills'] as List<dynamic>)
    .map((skill) => skill as String)
    .toList();

// Accès sécurisé aux données nullable
String? email = userJson['email'] as String?;
Map<String, dynamic>? profile = userJson['profile'] as Map<String, dynamic>?;
String? bio = profile?['bio'] as String?;

print('Utilisateur: $name ($id)');
print('Email: ${email ?? "Non fourni"}');
print('Compétences: ${skills.join(", ")}');
```

### Sérialisation JSON

Pour sérialiser des données en JSON, on utilise `dart:convert` avec `json.encode()`.

```dart
// Map vers JSON
Map<String, dynamic> userData = {
  'id': 456,
  'name': 'Bob Martin',
  'email': 'bob@example.com',
  'isActive': false,
  'profile': {
    'bio': 'Designer UI/UX',
    'avatar': null,
  },
  'skills': ['Figma', 'Adobe XD', 'Flutter'],
};

// Sérialisation
String jsonOutput = json.encode(userData);
print(jsonOutput);

// JSON prettified (pour debug)
String prettyJson = JsonEncoder.withIndent('  ').convert(userData);
print(prettyJson);
```

## 🏗️ Modèles de données

### Classe modèle basique

En Dart, on crée des classes pour représenter les données. Contrairement à C# où on utilise souvent des POCOs avec des attributs, en Dart on privilégie les classes immutables avec des `final` et des `const` constructors. On va y ajouter des factory constructors pour le parsing JSON et des méthodes `toJson()` pour la sérialisation. La méthode `copyWith()` permet de créer des copies modifiées de l'objet : très utile pour créer des objets immuables avec quelques changements à partir d'une instance existante.

```dart
class User {
  final int id;
  final String name;
  final String? email;
  final bool isActive;
  final UserProfile? profile;
  final List<String> skills;
  
  const User({
    required this.id,
    required this.name,
    this.email,
    required this.isActive,
    this.profile,
    this.skills = const [],
  });
  
  // Factory constructor pour JSON
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as int,
      name: json['name'] as String,
      email: json['email'] as String?,
      isActive: json['isActive'] as bool,
      profile: json['profile'] != null 
        ? UserProfile.fromJson(json['profile'] as Map<String, dynamic>)
        : null,
      skills: (json['skills'] as List<dynamic>?)
        ?.map((skill) => skill as String)
        .toList() ?? [],
    );
  }
  
  // Conversion vers JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'isActive': isActive,
      'profile': profile?.toJson(),
      'skills': skills,
    };
  }
  
  // CopyWith pour modifications immutables
  User copyWith({
    int? id,
    String? name,
    String? email,
    bool? isActive,
    UserProfile? profile,
    List<String>? skills,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      isActive: isActive ?? this.isActive,
      profile: profile ?? this.profile,
      skills: skills ?? this.skills,
    );
  }
  
  @override
  String toString() => 'User(id: $id, name: $name)';
  
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is User && runtimeType == other.runtimeType && id == other.id;
      
  @override
  int get hashCode => id.hashCode;
}

class UserProfile {
  final String bio;
  final String? avatar;
  
  const UserProfile({
    required this.bio,
    this.avatar,
  });
  
  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      bio: json['bio'] as String,
      avatar: json['avatar'] as String?,
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'bio': bio,
      'avatar': avatar,
    };
  }
}
```

Voici comment utiliser ce modèle :

```dart
void main() {
  String jsonString = '''
  {
    "id": 123,
    "name": "Alice Dupont",
    "email": "alice.dupont@example.com",
    "isActive": true,
    "profile": {
      "bio": "Développeuse Flutter",
      "avatar": "https://example.com/avatar.jpg"
    },
    "skills": ["Dart", "Flutter", "Firebase"]
  }
  ''';
  Map<String, dynamic> userMap = json.decode(jsonString);
  User user = User.fromJson(userMap);
  print(user);
  print(user.toJson());

  User updatedUser = user.copyWith(email: 'alice.new@example.com');
  print(updatedUser);
}
```

### Gestion d'erreurs de parsing

Il est crucial de gérer les erreurs lors du parsing JSON, surtout avec des données externes. Voici quelques techniques pour rendre le parsing plus robuste.

On peut créer des extensions pour faciliter l'accès sécurisé aux données dans une `Map<String, dynamic>`, avec des valeurs par défaut et des conversions de type sûres. On peut aussi ajouter des validations dans les factory constructors pour s'assurer que les données sont correctes.

```dart
// Extension pour parsing sécurisé
extension SafeJsonParsing on Map<String, dynamic> {
  T? getAs<T>(String key) {
    try {
      return this[key] as T?;
    } catch (e) {
      return null;
    }
  }
  
  T getAsOrDefault<T>(String key, T defaultValue) {
    return getAs<T>(key) ?? defaultValue;
  }
  
  List<T> getListAs<T>(String key) {
    try {
      return (this[key] as List<dynamic>?)
        ?.cast<T>() ?? [];
    } catch (e) {
      return [];
    }
  }
}

// Modèle avec parsing robuste
class RobustUser {
  final int id;
  final String name;
  final String email;
  final bool isActive;
  final DateTime? createdAt;
  
  RobustUser({
    required this.id,
    required this.name,
    required this.email,
    required this.isActive,
    this.createdAt,
  });
  
  factory RobustUser.fromJson(Map<String, dynamic> json) {
    try {
      return RobustUser(
        id: json.getAsOrDefault<int>('id', -1),
        name: json.getAsOrDefault<String>('name', 'Unknown'),
        email: json.getAsOrDefault<String>('email', ''),
        isActive: json.getAsOrDefault<bool>('isActive', false),
        createdAt: json['createdAt'] != null 
          ? DateTime.tryParse(json['createdAt'] as String)
          : null,
      );
    } catch (e) {
      throw FormatException('Invalid user JSON: $e');
    }
  }
  
  // Validation après parsing
  bool get isValid {
    return id > 0 && 
           name.isNotEmpty && 
           email.contains('@');
  }
}
```

## 🌐 API Integration

Dart n'a pas de solution intégrée pour les appels HTTP, mais le package `http` est largement utilisé. Voici un exemple complet d'intégration avec gestion des erreurs, pagination, et un pattern repository avec cache simple.

### Service HTTP avec modèles

Voici un service API avec des méthodes pour les opérations CRUD, la gestion des erreurs, et la pagination.

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'https://api.example.com';
  static const Map<String, String> headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // GET - Récupérer un utilisateur
  static Future<User> getUser(int id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/users/$id'),
        headers: headers,
      ).timeout(Duration(seconds: 10));
      
      if (response.statusCode == 200) {
        Map<String, dynamic> json = jsonDecode(response.body);
        return User.fromJson(json);
      } else if (response.statusCode == 404) {
        throw UserNotFoundException('User $id not found');
      } else {
        throw ApiException('Failed to load user: ${response.statusCode}');
      }
    } on TimeoutException {
      throw ApiException('Request timeout');
    } catch (e) {
      throw ApiException('Network error: $e');
    }
  }
  
  // GET - Liste d'utilisateurs avec pagination
  static Future<UsersResponse> getUsers({
    int page = 1,
    int limit = 20,
  }) async {
    final response = await http.get(
      Uri.parse('$baseUrl/users?page=$page&limit=$limit'),
      headers: headers,
    );
    
    if (response.statusCode == 200) {
      Map<String, dynamic> json = jsonDecode(response.body);
      return UsersResponse.fromJson(json);
    } else {
      throw ApiException('Failed to load users');
    }
  }
  
  // POST - Créer un utilisateur
  static Future<User> createUser(CreateUserRequest request) async {
    final response = await http.post(
      Uri.parse('$baseUrl/users'),
      headers: headers,
      body: jsonEncode(request.toJson()),
    );
    
    if (response.statusCode == 201) {
      Map<String, dynamic> json = jsonDecode(response.body);
      return User.fromJson(json);
    } else {
      throw ApiException('Failed to create user');
    }
  }
  
  // PUT - Mettre à jour un utilisateur
  static Future<User> updateUser(int id, UpdateUserRequest request) async {
    final response = await http.put(
      Uri.parse('$baseUrl/users/$id'),
      headers: headers,
      body: jsonEncode(request.toJson()),
    );
    
    if (response.statusCode == 200) {
      Map<String, dynamic> json = jsonDecode(response.body);
      return User.fromJson(json);
    } else {
      throw ApiException('Failed to update user');
    }
  }
  
  // DELETE - Supprimer un utilisateur
  static Future<void> deleteUser(int id) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/users/$id'),
      headers: headers,
    );
    
    if (response.statusCode != 204) {
      throw ApiException('Failed to delete user');
    }
  }
}

// Modèles pour requêtes/réponses
class UsersResponse {
  final List<User> users;
  final int total;
  final int page;
  final int totalPages;
  
  UsersResponse({
    required this.users,
    required this.total,
    required this.page,
    required this.totalPages,
  });
  
  factory UsersResponse.fromJson(Map<String, dynamic> json) {
    return UsersResponse(
      users: (json['data'] as List<dynamic>)
        .map((userJson) => User.fromJson(userJson as Map<String, dynamic>))
        .toList(),
      total: json['total'] as int,
      page: json['page'] as int,
      totalPages: json['totalPages'] as int,
    );
  }
}

class CreateUserRequest {
  final String name;
  final String email;
  final String? bio;
  
  CreateUserRequest({
    required this.name,
    required this.email,
    this.bio,
  });
  
  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'email': email,
      if (bio != null) 'bio': bio,
    };
  }
}

class UpdateUserRequest {
  final String? name;
  final String? email;
  final bool? isActive;
  
  UpdateUserRequest({
    this.name,
    this.email,
    this.isActive,
  });
  
  Map<String, dynamic> toJson() {
    return {
      if (name != null) 'name': name,
      if (email != null) 'email': email,
      if (isActive != null) 'isActive': isActive,
    };
  }
}

// Exceptions custom
class ApiException implements Exception {
  final String message;
  ApiException(this.message);
  
  @override
  String toString() => 'ApiException: $message';
}

class UserNotFoundException extends ApiException {
  UserNotFoundException(String message) : super(message);
}
```

### Repository pattern

Voici un pattern repository avec un cache simple pour minimiser les appels réseau.

```dart
// Interface repository
abstract class UserRepository {
  Future<User> getUser(int id);
  Future<List<User>> getUsers({int page = 1, int limit = 20});
  Future<User> createUser(CreateUserRequest request);
  Future<User> updateUser(int id, UpdateUserRequest request);
  Future<void> deleteUser(int id);
}

// Implémentation avec cache
class UserRepositoryImpl implements UserRepository {
  final Map<int, User> _cache = {};
  final Duration _cacheExpiry = Duration(minutes: 5);
  final Map<int, DateTime> _cacheTimestamps = {};
  
  @override
  Future<User> getUser(int id) async {
    // Vérifier le cache
    if (_cache.containsKey(id)) {
      final timestamp = _cacheTimestamps[id];
      if (timestamp != null && 
          DateTime.now().difference(timestamp) < _cacheExpiry) {
        return _cache[id]!;
      }
    }
    
    // Appel API
    final user = await ApiService.getUser(id);
    
    // Mettre en cache
    _cache[id] = user;
    _cacheTimestamps[id] = DateTime.now();
    
    return user;
  }
  
  @override
  Future<List<User>> getUsers({int page = 1, int limit = 20}) async {
    final response = await ApiService.getUsers(page: page, limit: limit);
    
    // Mettre en cache chaque utilisateur
    for (final user in response.users) {
      _cache[user.id] = user;
      _cacheTimestamps[user.id] = DateTime.now();
    }
    
    return response.users;
  }
  
  @override
  Future<User> createUser(CreateUserRequest request) async {
    final user = await ApiService.createUser(request);
    
    // Ajouter au cache
    _cache[user.id] = user;
    _cacheTimestamps[user.id] = DateTime.now();
    
    return user;
  }
  
  @override
  Future<User> updateUser(int id, UpdateUserRequest request) async {
    final user = await ApiService.updateUser(id, request);
    
    // Mettre à jour le cache
    _cache[id] = user;
    _cacheTimestamps[id] = DateTime.now();
    
    return user;
  }
  
  @override
  Future<void> deleteUser(int id) async {
    await ApiService.deleteUser(id);
    
    // Supprimer du cache
    _cache.remove(id);
    _cacheTimestamps.remove(id);
  }
  
  void clearCache() {
    _cache.clear();
    _cacheTimestamps.clear();
  }
}
```

## 💾 Stockage local JSON

### SharedPreferences pour petites données

On peut utiliser `shared_preferences` pour stocker des données simples en JSON, comme les préférences utilisateur.

```dart
import 'package:shared_preferences/shared_preferences.dart';

class UserPreferences {
  static const String _userKey = 'current_user';
  static const String _settingsKey = 'app_settings';
  
  // Sauvegarder un utilisateur
  static Future<void> saveUser(User user) async {
    final prefs = await SharedPreferences.getInstance();
    final userJson = jsonEncode(user.toJson());
    await prefs.setString(_userKey, userJson);
  }
  
  // Charger un utilisateur
  static Future<User?> loadUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userJson = prefs.getString(_userKey);
    
    if (userJson != null) {
      try {
        final json = jsonDecode(userJson) as Map<String, dynamic>;
        return User.fromJson(json);
      } catch (e) {
        print('Erreur parsing user: $e');
        return null;
      }
    }
    
    return null;
  }
  
  // Supprimer l'utilisateur
  static Future<void> clearUser() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_userKey);
  }
  
  // Settings de l'app
  static Future<void> saveSettings(AppSettings settings) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_settingsKey, jsonEncode(settings.toJson()));
  }
  
  static Future<AppSettings> loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    final settingsJson = prefs.getString(_settingsKey);
    
    if (settingsJson != null) {
      try {
        final json = jsonDecode(settingsJson) as Map<String, dynamic>;
        return AppSettings.fromJson(json);
      } catch (e) {
        return AppSettings.defaultSettings();
      }
    }
    
    return AppSettings.defaultSettings();
  }
}

class AppSettings {
  final bool darkMode;
  final String language;
  final bool notifications;
  
  AppSettings({
    required this.darkMode,
    required this.language,
    required this.notifications,
  });
  
  factory AppSettings.defaultSettings() {
    return AppSettings(
      darkMode: false,
      language: 'fr',
      notifications: true,
    );
  }
  
  factory AppSettings.fromJson(Map<String, dynamic> json) {
    return AppSettings(
      darkMode: json['darkMode'] as bool? ?? false,
      language: json['language'] as String? ?? 'fr',
      notifications: json['notifications'] as bool? ?? true,
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'darkMode': darkMode,
      'language': language,
      'notifications': notifications,
    };
  }
}
```

Cela permet de stocker et récupérer facilement des données utilisateur et des paramètres d'application.

### Fichiers JSON pour données complexes

On peut utiliser le package `path_provider` pour obtenir un répertoire de stockage et `dart:io` pour lire/écrire des fichiers JSON plus volumineux.

```dart
import 'dart:io';
import 'package:path_provider/path_provider.dart';

class JsonFileStorage {
  // Sauvegarder une liste d'utilisateurs
  static Future<void> saveUsers(List<User> users) async {
    try {
      final directory = await getApplicationDocumentsDirectory();
      final file = File('${directory.path}/users.json');
      
      final usersJson = users.map((user) => user.toJson()).toList();
      final jsonString = jsonEncode(usersJson);
      
      await file.writeAsString(jsonString);
    } catch (e) {
      throw StorageException('Failed to save users: $e');
    }
  }
  
  // Charger la liste d'utilisateurs
  static Future<List<User>> loadUsers() async {
    try {
      final directory = await getApplicationDocumentsDirectory();
      final file = File('${directory.path}/users.json');
      
      if (!await file.exists()) {
        return [];
      }
      
      final jsonString = await file.readAsString();
      final jsonList = jsonDecode(jsonString) as List<dynamic>;
      
      return jsonList
        .map((json) => User.fromJson(json as Map<String, dynamic>))
        .toList();
    } catch (e) {
      throw StorageException('Failed to load users: $e');
    }
  }
  
  // Ajouter un utilisateur
  static Future<void> addUser(User user) async {
    final users = await loadUsers();
    users.add(user);
    await saveUsers(users);
  }
  
  // Mettre à jour un utilisateur
  static Future<void> updateUser(User updatedUser) async {
    final users = await loadUsers();
    final index = users.indexWhere((user) => user.id == updatedUser.id);
    
    if (index != -1) {
      users[index] = updatedUser;
      await saveUsers(users);
    } else {
      throw StorageException('User not found');
    }
  }
  
  // Supprimer un utilisateur
  static Future<void> deleteUser(int userId) async {
    final users = await loadUsers();
    users.removeWhere((user) => user.id == userId);
    await saveUsers(users);
  }
}

class StorageException implements Exception {
  final String message;
  StorageException(this.message);
  
  @override
  String toString() => 'StorageException: $message';
}
```

## 🗄️ SQLite en Dart

SQLite est une base de données relationnelle légère et performante, parfaite pour le stockage local d'applications mobiles. En Dart/Flutter, on utilise le package `sqflite` qui fournit une interface moderne avec support des `Future` et null safety.

### Installation et configuration

Ajoutez `sqflite` et `path` à votre `pubspec.yaml` via la commande :

```bash
flutter pub add sqflite path
```


### Modèle de données pour SQLite

Adaptons notre classe `User` pour SQLite en ajoutant les méthodes nécessaires :

```dart
class User {
  final int? id;  // Nullable pour auto-increment
  final String name;
  final String? email;
  final bool isActive;
  final String? bio;
  final List<String> skills;
  final DateTime createdAt;
  final DateTime? updatedAt;
  
  const User({
    this.id,
    required this.name,
    this.email,
    this.isActive = true,
    this.bio,
    this.skills = const [],
    required this.createdAt,
    this.updatedAt,
  });
  
  // Factory constructor depuis Map (résultat SQLite)
  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      id: map['id'] as int?,
      name: map['name'] as String,
      email: map['email'] as String?,
      isActive: (map['isActive'] as int) == 1,
      bio: map['bio'] as String?,
      skills: map['skills'] != null 
        ? (jsonDecode(map['skills'] as String) as List<dynamic>)
            .map((skill) => skill as String)
            .toList()
        : [],
      createdAt: DateTime.parse(map['createdAt'] as String),
      updatedAt: map['updatedAt'] != null 
        ? DateTime.parse(map['updatedAt'] as String)
        : null,
    );
  }
  
  // Conversion vers Map (pour insertion SQLite)
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'isActive': isActive ? 1 : 0,  // SQLite utilise INTEGER pour boolean
      'bio': bio,
      'skills': skills.isNotEmpty ? jsonEncode(skills) : null,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }
  
  // CopyWith pour les mises à jour
  User copyWith({
    int? id,
    String? name,
    String? email,
    bool? isActive,
    String? bio,
    List<String>? skills,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      isActive: isActive ?? this.isActive,
      bio: bio ?? this.bio,
      skills: skills ?? this.skills,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
  
  @override
  String toString() {
    return 'User{id: $id, name: $name, email: $email, isActive: $isActive}';
  }
}
```

### Service de base de données

Créons un service pour gérer la base de données SQLite :

```dart
import 'dart:async';
import 'dart:convert';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseService {
  static final DatabaseService _instance = DatabaseService._internal();
  static Database? _database;
  
  factory DatabaseService() => _instance;
  DatabaseService._internal();
  
  // Getter pour la base de données
  Future<Database> get database async {
    _database ??= await _initDatabase();
    return _database!;
  }
  
  // Initialisation de la base de données
  Future<Database> _initDatabase() async {
    final databasePath = await getDatabasesPath();
    final path = join(databasePath, 'app_database.db');
    
    return await openDatabase(
      path,
      version: 1,
      onCreate: _createTables,
      onUpgrade: _upgradeTables,
    );
  }
  
  // Création des tables
  Future<void> _createTables(Database db, int version) async {
    await db.execute('''
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        isActive INTEGER NOT NULL DEFAULT 1,
        bio TEXT,
        skills TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT
      )
    ''');
    
    // Index pour améliorer les performances
    await db.execute('CREATE INDEX idx_users_email ON users(email)');
    await db.execute('CREATE INDEX idx_users_active ON users(isActive)');
  }
  
  // Migration de la base de données
  Future<void> _upgradeTables(Database db, int oldVersion, int newVersion) async {
    // Exemple de migration
    if (oldVersion < 2) {
      await db.execute('ALTER TABLE users ADD COLUMN lastLoginAt TEXT');
    }
  }
  
  // Fermer la base de données
  Future<void> closeDatabase() async {
    if (_database != null) {
      await _database!.close();
      _database = null;
    }
  }
}
```

### Repository pattern pour les opérations CRUD

```dart
class UserRepository {
  final DatabaseService _databaseService = DatabaseService();
  
  // Créer un utilisateur
  Future<User> createUser(User user) async {
    final db = await _databaseService.database;
    
    final userMap = user.toMap();
    userMap.remove('id'); // Laisser SQLite générer l'ID
    
    final id = await db.insert('users', userMap);
    
    return user.copyWith(id: id);
  }
  
  // Obtenir un utilisateur par ID
  Future<User?> getUserById(int id) async {
    final db = await _databaseService.database;
    
    final results = await db.query(
      'users',
      where: 'id = ?',
      whereArgs: [id],
      limit: 1,
    );
    
    if (results.isEmpty) return null;
    
    return User.fromMap(results.first);
  }
  
  // Obtenir tous les utilisateurs actifs
  Future<List<User>> getActiveUsers() async {
    final db = await _databaseService.database;
    
    final results = await db.query(
      'users',
      where: 'isActive = ?',
      whereArgs: [1],
      orderBy: 'name ASC',
    );
    
    return results.map((map) => User.fromMap(map)).toList();
  }
  
  // Rechercher des utilisateurs par nom ou email
  Future<List<User>> searchUsers(String query) async {
    final db = await _databaseService.database;
    
    final results = await db.query(
      'users',
      where: 'name LIKE ? OR email LIKE ?',
      whereArgs: ['%$query%', '%$query%'],
      orderBy: 'name ASC',
    );
    
    return results.map((map) => User.fromMap(map)).toList();
  }
  
  // Mettre à jour un utilisateur
  Future<bool> updateUser(User user) async {
    if (user.id == null) return false;
    
    final db = await _databaseService.database;
    
    final userMap = user.copyWith(
      updatedAt: DateTime.now(),
    ).toMap();
    
    final rowsAffected = await db.update(
      'users',
      userMap,
      where: 'id = ?',
      whereArgs: [user.id],
    );
    
    return rowsAffected > 0;
  }
  
  // Supprimer un utilisateur (soft delete)
  Future<bool> deactivateUser(int id) async {
    final db = await _databaseService.database;
    
    final rowsAffected = await db.update(
      'users',
      {
        'isActive': 0,
        'updatedAt': DateTime.now().toIso8601String(),
      },
      where: 'id = ?',
      whereArgs: [id],
    );
    
    return rowsAffected > 0;
  }
  
  // Supprimer définitivement un utilisateur
  Future<bool> deleteUser(int id) async {
    final db = await _databaseService.database;
    
    final rowsAffected = await db.delete(
      'users',
      where: 'id = ?',
      whereArgs: [id],
    );
    
    return rowsAffected > 0;
  }
  
  // Obtenir le nombre d'utilisateurs
  Future<int> getUserCount() async {
    final db = await _databaseService.database;
    
    final result = await db.rawQuery('SELECT COUNT(*) as count FROM users WHERE isActive = 1');
    
    return result.first['count'] as int;
  }
  
  // Transaction pour créer plusieurs utilisateurs
  Future<List<User>> createUsers(List<User> users) async {
    final db = await _databaseService.database;
    List<User> createdUsers = [];
    
    await db.transaction((txn) async {
      for (final user in users) {
        final userMap = user.toMap();
        userMap.remove('id');
        
        final id = await txn.insert('users', userMap);
        createdUsers.add(user.copyWith(id: id));
      }
    });
    
    return createdUsers;
  }
}
```

### Utilisation pratique

```dart
class UserService {
  final UserRepository _userRepository = UserRepository();
  
  // Exemple d'utilisation complète
  Future<void> demonstrateSQLiteUsage() async {
    try {
      // Créer des utilisateurs
      final alice = User(
        name: 'Alice Dupont',
        email: 'alice@example.com',
        bio: 'Développeuse Flutter passionnée',
        skills: ['Dart', 'Flutter', 'Firebase'],
        createdAt: DateTime.now(),
      );
      
      final bob = User(
        name: 'Bob Martin',
        email: 'bob@example.com',
        bio: 'Designer UI/UX',
        skills: ['Figma', 'Adobe XD'],
        createdAt: DateTime.now(),
      );
      
      // Insertion en base
      final createdAlice = await _userRepository.createUser(alice);
      final createdBob = await _userRepository.createUser(bob);
      
      print('Utilisateurs créés: ${createdAlice.id}, ${createdBob.id}');
      
      // Recherche
      final users = await _userRepository.getActiveUsers();
      print('Utilisateurs actifs: ${users.length}');
      
      // Recherche par nom
      final searchResults = await _userRepository.searchUsers('Alice');
      print('Résultats de recherche: ${searchResults.length}');
      
      // Mise à jour
      final updatedAlice = createdAlice.copyWith(
        bio: 'Développeuse Flutter Senior',
        skills: [...createdAlice.skills, 'GraphQL'],
      );
      
      final updated = await _userRepository.updateUser(updatedAlice);
      print('Mise à jour réussie: $updated');
      
      // Obtenir un utilisateur spécifique
      final foundUser = await _userRepository.getUserById(createdAlice.id!);
      print('Utilisateur trouvé: ${foundUser?.name}');
      
    } catch (e) {
      print('Erreur SQLite: $e');
    }
  }
}
```

### Bonnes pratiques SQLite

```dart
// Gestion des erreurs spécifiques à SQLite
class DatabaseException implements Exception {
  final String message;
  final String? code;
  
  DatabaseException(this.message, [this.code]);
  
  @override
  String toString() => 'DatabaseException: $message ${code != null ? '($code)' : ''}';
}

// Helper pour les requêtes complexes avec gestion d'erreurs
class DatabaseHelper {
  static Future<T> executeWithErrorHandling<T>(
    Future<T> Function() operation,
  ) async {
    try {
      return await operation();
    } on DatabaseException {
      rethrow;
    } catch (e) {
      if (e.toString().contains('UNIQUE constraint failed')) {
        throw DatabaseException('Cette ressource existe déjà', 'UNIQUE_CONSTRAINT');
      } else if (e.toString().contains('no such table')) {
        throw DatabaseException('Table introuvable - migration nécessaire', 'TABLE_NOT_FOUND');
      }
      throw DatabaseException('Erreur de base de données: $e');
    }
  }
  
  // Pagination pour de gros datasets
  static Future<List<Map<String, dynamic>>> getPaginatedResults(
    Database db,
    String table, {
    int page = 1,
    int pageSize = 20,
    String? where,
    List<dynamic>? whereArgs,
    String? orderBy,
  }) async {
    final offset = (page - 1) * pageSize;
    
    return await db.query(
      table,
      where: where,
      whereArgs: whereArgs,
      orderBy: orderBy,
      limit: pageSize,
      offset: offset,
    );
  }
}
```

SQLite offre une solution robuste pour la persistence locale avec des performances excellentes et une API moderne en Dart. Le pattern Repository permet de bien séparer la logique métier de l'accès aux données, facilitant les tests et la maintenance.

## 🏛️ ORM pour Flutter

Contrairement aux écosystèmes .NET (Entity Framework) ou Java (Hibernate), Flutter n'a pas d'ORM officiel intégré. Cependant, plusieurs solutions tierces existent pour simplifier l'accès aux données et réduire le code boilerplate.

### Drift (ex-Moor) - L'ORM le plus populaire

**Drift** est l'ORM le plus mature et populaire pour Flutter. Il génère du code type-safe à partir de définitions de tables et offre une API moderne avec support complet de la null safety.

#### Installation

```yaml
dependencies:
  drift: ^2.14.0
  sqlite3_flutter_libs: ^0.5.0
  path_provider: ^2.1.0
  path: ^1.8.3

dev_dependencies:
  drift_dev: ^2.14.0
  build_runner: ^2.4.0
```

#### Définition des tables

```dart
// database.dart
import 'dart:io';
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;

// Définition des tables
class Users extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get name => text().withLength(min: 1, max: 100)();
  TextColumn get email => text().nullable().unique()();
  BoolColumn get isActive => boolean().withDefault(const Constant(true))();
  TextColumn get bio => text().nullable()();
  TextColumn get skills => text().nullable()(); // JSON array
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime().nullable()();
}

class Posts extends Table {
  IntColumn get id => integer().autoIncrement()();
  IntColumn get userId => integer().references(Users, #id)();
  TextColumn get title => text().withLength(min: 1, max: 200)();
  TextColumn get content => text()();
  DateTimeColumn get createdAt => dateTime()();
  BoolColumn get isPublished => boolean().withDefault(const Constant(false))();
}

// Partie générée automatiquement
part 'database.g.dart';

@DriftDatabase(tables: [Users, Posts])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  // Méthodes personnalisées
  Future<List<User>> getAllActiveUsers() => select(users)
      .where((user) => user.isActive.equals(true))
      .orderBy([(user) => OrderingTerm.asc(user.name)])
      .get();

  Future<User?> getUserByEmail(String email) => (select(users)
        ..where((user) => user.email.equals(email))
        ..limit(1))
      .getSingleOrNull();

  Future<List<Post>> getPostsByUser(int userId) => (select(posts)
        ..where((post) => post.userId.equals(userId))
        ..orderBy([(post) => OrderingTerm.desc(post.createdAt)]))
      .get();

  // Jointures
  Future<List<PostWithUser>> getPostsWithUsers() {
    return (select(posts).join([
      leftOuterJoin(users, users.id.equalsExp(posts.userId)),
    ]).map((row) {
      return PostWithUser(
        post: row.readTable(posts),
        user: row.readTableOrNull(users),
      );
    })).get();
  }

  // Transactions
  Future<User> createUserWithPosts(
    String name,
    String email,
    List<String> postTitles,
  ) {
    return transaction(() async {
      final user = await into(users).insertReturning(UsersCompanion(
        name: Value(name),
        email: Value(email),
        createdAt: Value(DateTime.now()),
      ));

      for (final title in postTitles) {
        await into(posts).insert(PostsCompanion(
          userId: Value(user.id),
          title: Value(title),
          content: Value('Contenu du post'),
          createdAt: Value(DateTime.now()),
        ));
      }

      return user;
    });
  }
}

// Classes helper
class PostWithUser {
  final Post post;
  final User? user;

  PostWithUser({required this.post, this.user});
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'db.sqlite'));
    return NativeDatabase.createInBackground(file);
  });
}
```

#### Utilisation de Drift

```dart
class UserService {
  final AppDatabase _database = AppDatabase();

  // Opérations CRUD simplifiées
  Future<List<User>> getActiveUsers() async {
    return await _database.getAllActiveUsers();
  }

  Future<User> createUser({
    required String name,
    required String email,
    String? bio,
    List<String> skills = const [],
  }) async {
    return await _database.into(_database.users).insertReturning(
      UsersCompanion(
        name: Value(name),
        email: Value(email),
        bio: Value(bio),
        skills: Value(skills.isNotEmpty ? jsonEncode(skills) : null),
        createdAt: Value(DateTime.now()),
      ),
    );
  }

  Future<bool> updateUser(int id, {
    String? name,
    String? email,
    bool? isActive,
    String? bio,
  }) async {
    final rowsAffected = await (_database.update(_database.users)
          ..where((user) => user.id.equals(id)))
        .write(UsersCompanion(
      name: name != null ? Value(name) : const Value.absent(),
      email: email != null ? Value(email) : const Value.absent(),
      isActive: isActive != null ? Value(isActive) : const Value.absent(),
      bio: bio != null ? Value(bio) : const Value.absent(),
      updatedAt: Value(DateTime.now()),
    ));

    return rowsAffected > 0;
  }

  Future<void> deleteUser(int id) async {
    await (_database.delete(_database.users)
          ..where((user) => user.id.equals(id)))
        .go();
  }

  // Recherche avancée
  Future<List<User>> searchUsers(String query) async {
    return await (_database.select(_database.users)
          ..where((user) => user.name.like('%$query%') |
              user.email.like('%$query%'))
          ..orderBy([(user) => OrderingTerm.asc(user.name)]))
        .get();
  }

  // Relations et jointures
  Future<List<PostWithUser>> getUserPostsWithDetails(int userId) async {
    return await (_database.select(_database.posts).join([
      innerJoin(_database.users, _database.users.id.equalsExp(_database.posts.userId)),
    ])
          ..where(_database.posts.userId.equals(userId)))
        .map((row) => PostWithUser(
              post: row.readTable(_database.posts),
              user: row.readTable(_database.users),
            ))
        .get();
  }

  void dispose() {
    _database.close();
  }
}
```

### Floor - Inspiré de Room (Android)

**Floor** est inspiré de l'ORM Room d'Android et utilise des annotations pour générer le code d'accès aux données.

#### Installation

```yaml
dependencies:
  floor: ^1.4.2

dev_dependencies:
  floor_generator: ^1.4.2
  build_runner: ^2.4.0
```

#### Définition avec Floor

```dart
// entities/user.dart
import 'package:floor/floor.dart';

@entity
class User {
  @PrimaryKey(autoGenerate: true)
  final int? id;

  final String name;
  final String? email;
  final bool isActive;
  final String? bio;
  final DateTime createdAt;
  final DateTime? updatedAt;

  User({
    this.id,
    required this.name,
    this.email,
    this.isActive = true,
    this.bio,
    required this.createdAt,
    this.updatedAt,
  });
}

// dao/user_dao.dart
import 'package:floor/floor.dart';
import '../entities/user.dart';

@dao
abstract class UserDao {
  @Query('SELECT * FROM User WHERE isActive = 1 ORDER BY name ASC')
  Future<List<User>> findAllActiveUsers();

  @Query('SELECT * FROM User WHERE id = :id')
  Future<User?> findUserById(int id);

  @Query('SELECT * FROM User WHERE email = :email')
  Future<User?> findUserByEmail(String email);

  @Query('SELECT * FROM User WHERE name LIKE :query OR email LIKE :query')
  Future<List<User>> searchUsers(String query);

  @insert
  Future<int> insertUser(User user);

  @update
  Future<int> updateUser(User user);

  @delete
  Future<int> deleteUser(User user);

  @Query('DELETE FROM User WHERE id = :id')
  Future<int> deleteUserById(int id);
}

// database.dart
import 'dart:async';
import 'package:floor/floor.dart';
import 'package:sqflite/sqflite.dart' as sqflite;
import 'entities/user.dart';
import 'dao/user_dao.dart';

part 'database.g.dart';

@Database(version: 1, entities: [User])
abstract class AppDatabase extends FloorDatabase {
  UserDao get userDao;
}
```

#### Utilisation de Floor

```dart
class UserRepository {
  AppDatabase? _database;

  Future<void> _initDatabase() async {
    _database ??= await $FloorAppDatabase
        .databaseBuilder('app_database.db')
        .build();
  }

  Future<List<User>> getActiveUsers() async {
    await _initDatabase();
    return await _database!.userDao.findAllActiveUsers();
  }

  Future<User> createUser({
    required String name,
    required String email,
    String? bio,
  }) async {
    await _initDatabase();
    
    final user = User(
      name: name,
      email: email,
      bio: bio,
      createdAt: DateTime.now(),
    );

    final id = await _database!.userDao.insertUser(user);
    return user.copyWith(id: id);
  }

  Future<bool> updateUser(User user) async {
    await _initDatabase();
    final rowsAffected = await _database!.userDao.updateUser(
      user.copyWith(updatedAt: DateTime.now()),
    );
    return rowsAffected > 0;
  }

  Future<List<User>> searchUsers(String query) async {
    await _initDatabase();
    return await _database!.userDao.searchUsers('%$query%');
  }
}

// Extension pour copyWith (à ajouter à la classe User)
extension UserCopyWith on User {
  User copyWith({
    int? id,
    String? name,
    String? email,
    bool? isActive,
    String? bio,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      isActive: isActive ?? this.isActive,
      bio: bio ?? this.bio,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
```

### ObjectBox - Base de données NoSQL

**ObjectBox** est une base de données NoSQL ultra-rapide spécialement conçue pour le mobile, avec un ORM intégré.

#### Installation

```yaml
dependencies:
  objectbox: ^2.2.0
  objectbox_flutter_libs: any

dev_dependencies:
  objectbox_generator: any
  build_runner: ^2.4.0
```

#### Définition avec ObjectBox

```dart
// entities/user.dart
import 'package:objectbox/objectbox.dart';

@Entity()
class User {
  @Id()
  int id = 0;

  String name;
  String? email;
  bool isActive;
  String? bio;
  List<String> skills;
  DateTime createdAt;
  DateTime? updatedAt;

  User({
    this.id = 0,
    required this.name,
    this.email,
    this.isActive = true,
    this.bio,
    this.skills = const [],
    required this.createdAt,
    this.updatedAt,
  });
}

@Entity()
class Post {
  @Id()
  int id = 0;

  String title;
  String content;
  DateTime createdAt;
  bool isPublished;

  // Relation avec User
  final user = ToOne<User>();

  Post({
    this.id = 0,
    required this.title,
    required this.content,
    required this.createdAt,
    this.isPublished = false,
  });
}

// database_service.dart
import 'package:objectbox/objectbox.dart';
import 'entities/user.dart';
import 'entities/post.dart';
import 'objectbox.g.dart'; // Généré automatiquement

class DatabaseService {
  late final Store _store;
  late final Box<User> _userBox;
  late final Box<Post> _postBox;

  static final DatabaseService _instance = DatabaseService._internal();
  factory DatabaseService() => _instance;
  DatabaseService._internal();

  Future<void> init() async {
    _store = await openStore();
    _userBox = _store.box<User>();
    _postBox = _store.box<Post>();
  }

  // Operations User
  Future<int> createUser(User user) async {
    return _userBox.put(user);
  }

  Future<User?> getUserById(int id) async {
    return _userBox.get(id);
  }

  Future<List<User>> getAllActiveUsers() async {
    final query = _userBox.query(User_.isActive.equals(true))
        .order(User_.name)
        .build();
    
    final users = query.find();
    query.close();
    return users;
  }

  Future<List<User>> searchUsers(String searchTerm) async {
    final query = _userBox.query(
      User_.name.contains(searchTerm, caseSensitive: false) |
      User_.email.contains(searchTerm, caseSensitive: false)
    ).build();
    
    final users = query.find();
    query.close();
    return users;
  }

  Future<bool> updateUser(User user) async {
    user.updatedAt = DateTime.now();
    return _userBox.put(user) != 0;
  }

  Future<bool> deleteUser(int id) async {
    return _userBox.remove(id);
  }

  // Relations
  Future<List<Post>> getPostsByUser(int userId) async {
    final query = _postBox.query(Post_.user.equals(userId)).build();
    final posts = query.find();
    query.close();
    return posts;
  }

  void dispose() {
    _store.close();
  }
}
```

#### Utilisation d'ObjectBox

```dart
class UserService {
  final DatabaseService _db = DatabaseService();

  Future<User> createUser({
    required String name,
    required String email,
    String? bio,
    List<String> skills = const [],
  }) async {
    final user = User(
      name: name,
      email: email,
      bio: bio,
      skills: skills,
      createdAt: DateTime.now(),
    );

    final id = await _db.createUser(user);
    user.id = id;
    return user;
  }

  Future<List<User>> getActiveUsers() async {
    return await _db.getAllActiveUsers();
  }

  Future<List<User>> searchUsers(String query) async {
    return await _db.searchUsers(query);
  }

  Future<User> createUserWithPost({
    required String userName,
    required String email,
    required String postTitle,
    required String postContent,
  }) async {
    // ObjectBox gère automatiquement les transactions
    final user = await createUser(name: userName, email: email);
    
    final post = Post(
      title: postTitle,
      content: postContent,
      createdAt: DateTime.now(),
    );
    post.user.target = user;
    
    await _db._postBox.put(post);
    
    return user;
  }
}
```

### Comparaison des solutions

| Feature | SQLite pur | Drift | Floor | ObjectBox |
|---------|------------|-------|-------|-----------|
| **Facilité d'usage** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Type Safety** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Relations** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Migrations** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Taille bundle** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Écosystème** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

**Recommandations :**
- **SQLite pur** : Pour un contrôle total et des performances maximales
- **Drift** : Pour la plupart des projets Flutter nécessitant un ORM robuste
- **Floor** : Pour les développeurs venant d'Android (Room)
- **ObjectBox** : Pour des applications nécessitant des performances extrêmes et des relations complexes

Les ORM simplifient considérablement le développement en réduisant le code boilerplate, en offrant la type safety, et en gérant automatiquement les migrations. Le choix dépend des besoins spécifiques du projet et de l'expérience de l'équipe.

