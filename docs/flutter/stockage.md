# Stockage local et persistance

## Introduction

Le stockage local est essentiel pour les applications mobiles. Flutter offre plusieurs solutions pour persister les données : preferences partagées, base de données SQLite, stockage de fichiers, et stockage sécurisé.

## Packages Flutter

### shared_preferences
```yaml
dependencies:
  shared_preferences: ^2.2.2
```

### sqflite
```yaml
dependencies:
  sqflite: ^2.3.0
```

### path_provider
```yaml
dependencies:
  path_provider: ^2.1.1
```

### flutter_secure_storage
```yaml
dependencies:
  flutter_secure_storage: ^9.0.0
```

### hive
```yaml
dependencies:
  hive: ^2.2.3
  hive_flutter: ^1.1.0
```

## Exemples d'implémentation

### Shared Preferences - Stockage simple
```dart
import 'package:shared_preferences/shared_preferences.dart';

class PreferencesService {
  static SharedPreferences? _prefs;
  
  // Initialisation
  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }
  
  // Sauvegarder une string
  static Future<bool> setString(String key, String value) async {
    return await _prefs?.setString(key, value) ?? false;
  }
  
  // Récupérer une string
  static String? getString(String key) {
    return _prefs?.getString(key);
  }
  
  // Sauvegarder un int
  static Future<bool> setInt(String key, int value) async {
    return await _prefs?.setInt(key, value) ?? false;
  }
  
  // Récupérer un int
  static int? getInt(String key) {
    return _prefs?.getInt(key);
  }
  
  // Sauvegarder un bool
  static Future<bool> setBool(String key, bool value) async {
    return await _prefs?.setBool(key, value) ?? false;
  }
  
  // Récupérer un bool
  static bool? getBool(String key) {
    return _prefs?.getBool(key);
  }
  
  // Sauvegarder une liste de strings
  static Future<bool> setStringList(String key, List<String> value) async {
    return await _prefs?.setStringList(key, value) ?? false;
  }
  
  // Récupérer une liste de strings
  static List<String>? getStringList(String key) {
    return _prefs?.getStringList(key);
  }
  
  // Supprimer une clé
  static Future<bool> remove(String key) async {
    return await _prefs?.remove(key) ?? false;
  }
  
  // Vider toutes les préférences
  static Future<bool> clear() async {
    return await _prefs?.clear() ?? false;
  }
  
  // Vérifier si une clé existe
  static bool containsKey(String key) {
    return _prefs?.containsKey(key) ?? false;
  }
}

// Service de préférences utilisateur
class UserPreferences {
  static const String _userNameKey = 'user_name';
  static const String _isDarkModeKey = 'is_dark_mode';
  static const String _languageKey = 'language';
  static const String _notificationsEnabledKey = 'notifications_enabled';
  
  static Future<void> setUserName(String name) async {
    await PreferencesService.setString(_userNameKey, name);
  }
  
  static String? getUserName() {
    return PreferencesService.getString(_userNameKey);
  }
  
  static Future<void> setDarkMode(bool isDark) async {
    await PreferencesService.setBool(_isDarkModeKey, isDark);
  }
  
  static bool isDarkMode() {
    return PreferencesService.getBool(_isDarkModeKey) ?? false;
  }
  
  static Future<void> setLanguage(String language) async {
    await PreferencesService.setString(_languageKey, language);
  }
  
  static String getLanguage() {
    return PreferencesService.getString(_languageKey) ?? 'fr';
  }
  
  static Future<void> setNotificationsEnabled(bool enabled) async {
    await PreferencesService.setBool(_notificationsEnabledKey, enabled);
  }
  
  static bool areNotificationsEnabled() {
    return PreferencesService.getBool(_notificationsEnabledKey) ?? true;
  }
}
```

### SQLite avec Sqflite
```dart
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseService {
  static Database? _database;
  static const String _databaseName = 'app_database.db';
  static const int _databaseVersion = 1;
  
  // Tables
  static const String usersTable = 'users';
  static const String tasksTable = 'tasks';
  
  // Singleton
  static Future<Database> get database async {
    _database ??= await _initDatabase();
    return _database!;
  }
  
  static Future<Database> _initDatabase() async {
    String path = join(await getDatabasesPath(), _databaseName);
    
    return await openDatabase(
      path,
      version: _databaseVersion,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }
  
  static Future<void> _onCreate(Database db, int version) async {
    // Créer la table users
    await db.execute('''
      CREATE TABLE $usersTable (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TEXT NOT NULL
      )
    ''');
    
    // Créer la table tasks
    await db.execute('''
      CREATE TABLE $tasksTable (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        is_completed INTEGER NOT NULL DEFAULT 0,
        user_id INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES $usersTable (id)
      )
    ''');
  }
  
  static Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Gérer les migrations de base de données
    if (oldVersion < 2) {
      // Exemple de migration
      await db.execute('ALTER TABLE $usersTable ADD COLUMN phone TEXT');
    }
  }
}

// Modèle User
class User {
  final int? id;
  final String name;
  final String email;
  final DateTime createdAt;
  
  User({
    this.id,
    required this.name,
    required this.email,
    required this.createdAt,
  });
  
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'created_at': createdAt.toIso8601String(),
    };
  }
  
  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      id: map['id'],
      name: map['name'],
      email: map['email'],
      createdAt: DateTime.parse(map['created_at']),
    );
  }
}

// Service de gestion des utilisateurs
class UserService {
  static Future<int> insertUser(User user) async {
    final db = await DatabaseService.database;
    return await db.insert(DatabaseService.usersTable, user.toMap());
  }
  
  static Future<List<User>> getUsers() async {
    final db = await DatabaseService.database;
    final List<Map<String, dynamic>> maps = await db.query(DatabaseService.usersTable);
    
    return List.generate(maps.length, (i) {
      return User.fromMap(maps[i]);
    });
  }
  
  static Future<User?> getUserById(int id) async {
    final db = await DatabaseService.database;
    final List<Map<String, dynamic>> maps = await db.query(
      DatabaseService.usersTable,
      where: 'id = ?',
      whereArgs: [id],
    );
    
    if (maps.isNotEmpty) {
      return User.fromMap(maps.first);
    }
    return null;
  }
  
  static Future<int> updateUser(User user) async {
    final db = await DatabaseService.database;
    return await db.update(
      DatabaseService.usersTable,
      user.toMap(),
      where: 'id = ?',
      whereArgs: [user.id],
    );
  }
  
  static Future<int> deleteUser(int id) async {
    final db = await DatabaseService.database;
    return await db.delete(
      DatabaseService.usersTable,
      where: 'id = ?',
      whereArgs: [id],
    );
  }
  
  static Future<List<User>> searchUsers(String query) async {
    final db = await DatabaseService.database;
    final List<Map<String, dynamic>> maps = await db.query(
      DatabaseService.usersTable,
      where: 'name LIKE ? OR email LIKE ?',
      whereArgs: ['%$query%', '%$query%'],
    );
    
    return List.generate(maps.length, (i) {
      return User.fromMap(maps[i]);
    });
  }
}
```

### Stockage de fichiers
```dart
import 'package:path_provider/path_provider.dart';
import 'dart:io';
import 'dart:convert';

class FileStorageService {
  // Obtenir le répertoire de documents
  static Future<String> get _localPath async {
    final directory = await getApplicationDocumentsDirectory();
    return directory.path;
  }
  
  // Obtenir le répertoire temporaire
  static Future<String> get _tempPath async {
    final directory = await getTemporaryDirectory();
    return directory.path;
  }
  
  // Obtenir le répertoire de cache
  static Future<String> get _cachePath async {
    final directory = await getApplicationCacheDirectory();
    return directory.path;
  }
  
  // Sauvegarder un fichier texte
  static Future<File> writeTextFile(String filename, String content) async {
    final path = await _localPath;
    final file = File('$path/$filename');
    return file.writeAsString(content);
  }
  
  // Lire un fichier texte
  static Future<String?> readTextFile(String filename) async {
    try {
      final path = await _localPath;
      final file = File('$path/$filename');
      return await file.readAsString();
    } catch (e) {
      return null;
    }
  }
  
  // Sauvegarder un objet JSON
  static Future<File> writeJsonFile(String filename, Map<String, dynamic> data) async {
    final jsonString = jsonEncode(data);
    return writeTextFile(filename, jsonString);
  }
  
  // Lire un objet JSON
  static Future<Map<String, dynamic>?> readJsonFile(String filename) async {
    try {
      final content = await readTextFile(filename);
      if (content != null) {
        return jsonDecode(content);
      }
    } catch (e) {
      print('Erreur lors de la lecture du JSON: $e');
    }
    return null;
  }
  
  // Sauvegarder des données binaires
  static Future<File> writeBinaryFile(String filename, List<int> bytes) async {
    final path = await _localPath;
    final file = File('$path/$filename');
    return file.writeAsBytes(bytes);
  }
  
  // Lire des données binaires
  static Future<List<int>?> readBinaryFile(String filename) async {
    try {
      final path = await _localPath;
      final file = File('$path/$filename');
      return await file.readAsBytes();
    } catch (e) {
      return null;
    }
  }
  
  // Vérifier si un fichier existe
  static Future<bool> fileExists(String filename) async {
    final path = await _localPath;
    final file = File('$path/$filename');
    return await file.exists();
  }
  
  // Supprimer un fichier
  static Future<void> deleteFile(String filename) async {
    final path = await _localPath;
    final file = File('$path/$filename');
    if (await file.exists()) {
      await file.delete();
    }
  }
  
  // Lister tous les fichiers
  static Future<List<String>> listFiles() async {
    final path = await _localPath;
    final directory = Directory(path);
    final files = await directory.list().toList();
    
    return files
        .where((entity) => entity is File)
        .map((file) => file.path.split('/').last)
        .toList();
  }
  
  // Obtenir la taille d'un fichier
  static Future<int?> getFileSize(String filename) async {
    try {
      final path = await _localPath;
      final file = File('$path/$filename');
      if (await file.exists()) {
        return await file.length();
      }
    } catch (e) {
      print('Erreur lors de l\'obtention de la taille: $e');
    }
    return null;
  }
}

// Service de cache d'images
class ImageCacheService {
  static Future<File> cacheImage(String url, List<int> imageBytes) async {
    final filename = url.split('/').last;
    final path = await FileStorageService._cachePath;
    final file = File('$path/images/$filename');
    
    // Créer le répertoire s'il n'existe pas
    await file.parent.create(recursive: true);
    
    return file.writeAsBytes(imageBytes);
  }
  
  static Future<File?> getCachedImage(String url) async {
    final filename = url.split('/').last;
    final path = await FileStorageService._cachePath;
    final file = File('$path/images/$filename');
    
    if (await file.exists()) {
      return file;
    }
    return null;
  }
  
  static Future<void> clearImageCache() async {
    final path = await FileStorageService._cachePath;
    final directory = Directory('$path/images');
    
    if (await directory.exists()) {
      await directory.delete(recursive: true);
    }
  }
}
```

### Stockage sécurisé
```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
    iOptions: IOSOptions(
      accessibility: IOSAccessibility.first_unlock_this_device,
    ),
  );
  
  // Sauvegarder une valeur
  static Future<void> write(String key, String value) async {
    await _storage.write(key: key, value: value);
  }
  
  // Lire une valeur
  static Future<String?> read(String key) async {
    return await _storage.read(key: key);
  }
  
  // Supprimer une valeur
  static Future<void> delete(String key) async {
    await _storage.delete(key: key);
  }
  
  // Supprimer toutes les valeurs
  static Future<void> deleteAll() async {
    await _storage.deleteAll();
  }
  
  // Lister toutes les clés
  static Future<Map<String, String>> readAll() async {
    return await _storage.readAll();
  }
  
  // Vérifier si une clé existe
  static Future<bool> containsKey(String key) async {
    return await _storage.containsKey(key: key);
  }
}

// Service de gestion des tokens et credentials
class AuthSecureStorage {
  static const String _accessTokenKey = 'access_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _userIdKey = 'user_id';
  static const String _biometricKey = 'biometric_enabled';
  
  static Future<void> saveAccessToken(String token) async {
    await SecureStorageService.write(_accessTokenKey, token);
  }
  
  static Future<String?> getAccessToken() async {
    return await SecureStorageService.read(_accessTokenKey);
  }
  
  static Future<void> saveRefreshToken(String token) async {
    await SecureStorageService.write(_refreshTokenKey, token);
  }
  
  static Future<String?> getRefreshToken() async {
    return await SecureStorageService.read(_refreshTokenKey);
  }
  
  static Future<void> saveUserId(String userId) async {
    await SecureStorageService.write(_userIdKey, userId);
  }
  
  static Future<String?> getUserId() async {
    return await SecureStorageService.read(_userIdKey);
  }
  
  static Future<void> setBiometricEnabled(bool enabled) async {
    await SecureStorageService.write(_biometricKey, enabled.toString());
  }
  
  static Future<bool> isBiometricEnabled() async {
    final value = await SecureStorageService.read(_biometricKey);
    return value == 'true';
  }
  
  static Future<void> clearAuthData() async {
    await SecureStorageService.delete(_accessTokenKey);
    await SecureStorageService.delete(_refreshTokenKey);
    await SecureStorageService.delete(_userIdKey);
  }
}
```

### Hive - Base de données NoSQL
```dart
import 'package:hive_flutter/hive_flutter.dart';

// Modèle avec Hive
@HiveType(typeId: 0)
class Task extends HiveObject {
  @HiveField(0)
  late String title;
  
  @HiveField(1)
  late String description;
  
  @HiveField(2)
  late bool isCompleted;
  
  @HiveField(3)
  late DateTime createdAt;
  
  Task({
    required this.title,
    required this.description,
    this.isCompleted = false,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();
}

class HiveService {
  static late Box<Task> _taskBox;
  
  static Future<void> init() async {
    await Hive.initFlutter();
    
    // Enregistrer l'adaptateur
    Hive.registerAdapter(TaskAdapter());
    
    // Ouvrir les boîtes
    _taskBox = await Hive.openBox<Task>('tasks');
  }
  
  // Ajouter une tâche
  static Future<void> addTask(Task task) async {
    await _taskBox.add(task);
  }
  
  // Obtenir toutes les tâches
  static List<Task> getTasks() {
    return _taskBox.values.toList();
  }
  
  // Obtenir une tâche par index
  static Task? getTask(int index) {
    return _taskBox.getAt(index);
  }
  
  // Mettre à jour une tâche
  static Future<void> updateTask(int index, Task task) async {
    await _taskBox.putAt(index, task);
  }
  
  // Supprimer une tâche
  static Future<void> deleteTask(int index) async {
    await _taskBox.deleteAt(index);
  }
  
  // Écouter les changements
  static Stream<BoxEvent> watchTasks() {
    return _taskBox.watch();
  }
  
  // Filtrer les tâches
  static List<Task> getCompletedTasks() {
    return _taskBox.values.where((task) => task.isCompleted).toList();
  }
  
  static List<Task> getPendingTasks() {
    return _taskBox.values.where((task) => !task.isCompleted).toList();
  }
  
  // Vider toutes les tâches
  static Future<void> clearTasks() async {
    await _taskBox.clear();
  }
}
```

## Bonnes pratiques

### Performance
- **Lazy loading** : Charger les données seulement quand nécessaire
- **Pagination** : Limiter les requêtes pour de gros datasets
- **Index de base de données** : Optimiser les requêtes fréquentes
- **Cache intelligent** : Mettre en cache les données fréquemment utilisées

### Sécurité
- **Données sensibles** : Utiliser le stockage sécurisé pour les tokens
- **Chiffrement** : Chiffrer les données importantes
- **Validation** : Valider les données avant stockage
- **Nettoyage** : Supprimer les données obsolètes

### Architecture
- **Séparation des responsabilités** : Services dédiés par type de stockage
- **Repository pattern** : Abstraire les sources de données
- **Migration** : Gérer les changements de schéma de base de données
- **Backup** : Stratégie de sauvegarde et restauration

## Cas d'usage typiques

1. **Settings utilisateur** : Préférences, thème, langue (SharedPreferences)
2. **Cache applicatif** : Images, données API (Files + Hive)
3. **Données relationnelles** : Contacts, commandes (SQLite)
4. **Authentification** : Tokens, credentials (Secure Storage)
5. **Données hors-ligne** : Synchronisation différée (SQLite + Files)
6. **Analytics locales** : Métriques avant envoi au serveur (Hive)