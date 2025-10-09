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

### Service HTTP avec modèles

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

### Fichiers JSON pour données complexes

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

## 🎯 Integration Flutter

### FutureBuilder avec API

```dart
class UserListScreen extends StatefulWidget {
  @override
  _UserListScreenState createState() => _UserListScreenState();
}

class _UserListScreenState extends State<UserListScreen> {
  final UserRepository _repository = UserRepositoryImpl();
  late Future<List<User>> _usersFuture;
  
  @override
  void initState() {
    super.initState();
    _usersFuture = _repository.getUsers();
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Utilisateurs')),
      body: FutureBuilder<List<User>>(
        future: _usersFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }
          
          if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error, size: 64, color: Colors.red),
                  SizedBox(height: 16),
                  Text('Erreur: ${snapshot.error}'),
                  SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _refresh,
                    child: Text('Réessayer'),
                  ),
                ],
              ),
            );
          }
          
          final users = snapshot.data!;
          
          if (users.isEmpty) {
            return Center(
              child: Text('Aucun utilisateur trouvé'),
            );
          }
          
          return RefreshIndicator(
            onRefresh: _refresh,
            child: ListView.builder(
              itemCount: users.length,
              itemBuilder: (context, index) {
                final user = users[index];
                return UserTile(
                  user: user,
                  onTap: () => _showUserDetail(user),
                );
              },
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _createUser,
        child: Icon(Icons.add),
      ),
    );
  }
  
  Future<void> _refresh() async {
    setState(() {
      _usersFuture = _repository.getUsers();
    });
  }
  
  void _showUserDetail(User user) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => UserDetailScreen(user: user),
      ),
    );
  }
  
  void _createUser() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => CreateUserScreen(),
      ),
    ).then((_) => _refresh());
  }
}

class UserTile extends StatelessWidget {
  final User user;
  final VoidCallback onTap;
  
  const UserTile({
    required this.user,
    required this.onTap,
    super.key,
  });
  
  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: CircleAvatar(
        backgroundImage: user.profile?.avatar != null
          ? NetworkImage(user.profile!.avatar!)
          : null,
        child: user.profile?.avatar == null
          ? Text(user.name[0].toUpperCase())
          : null,
      ),
      title: Text(user.name),
      subtitle: Text(user.email ?? 'Pas d\'email'),
      trailing: user.isActive
        ? Icon(Icons.check_circle, color: Colors.green)
        : Icon(Icons.circle, color: Colors.grey),
      onTap: onTap,
    );
  }
}
```

## 🔄 Prochaines étapes

JSON maîtrisé, explorez :

1. **[Syntaxe avancée](./syntaxe-avancee.md)** - Pattern matching pour JSON
2. **[Flutter HTTP](../flutter/networking.md)** - Dio, interceptors, cache
3. **[Flutter State Management](../flutter/state-management.md)** - BLoC avec JSON
4. **[Flutter Local Storage](../flutter/storage.md)** - SQLite, Hive

::: tip 🎯 JSON = Communication
En Flutter, JSON est partout : APIs REST, GraphQL, Firebase, stockage local. Maîtriser la sérialisation/désérialisation est **crucial** pour toute app moderne !
:::

---

*Direction les concepts avancés de Dart pour finaliser votre apprentissage !*