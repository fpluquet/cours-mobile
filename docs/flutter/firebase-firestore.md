# Flutter – Firebase et Cloud Firestore
 
## 🔥 Introduction à Firebase

Firebase est une plateforme de développement d'applications mobiles et web développée par Google. Elle offre une suite complète de services backend : base de données, authentification, hébergement, analytics, et bien plus.

### Pourquoi Firebase avec Flutter ?

- **Intégration native** : Conçu pour fonctionner parfaitement avec Flutter
- **Temps réel** : Synchronisation automatique des données
- **Scalabilité** : Gère automatiquement la montée en charge
- **Sécurité** : Règles de sécurité robustes
- **Gratuit** : Plan généreux pour débuter

### Services Firebase essentiels

| Service | Description | Cas d'usage |
|---------|-------------|-------------|
| **Authentication** | Gestion des utilisateurs | Connexion, inscription |
| **Cloud Firestore** | Base de données NoSQL | Stockage de données structurées |
| **Cloud Storage** | Stockage de fichiers | Images, documents |
| **Cloud Functions** | Code backend | Logique métier côté serveur |
| **Analytics** | Statistiques d'usage | Analyse comportementale |

::: info Cloud Firestore vs Realtime Database
Cloud Firestore est la nouvelle génération de base de données Firebase. Plus performante et flexible que Realtime Database, elle est recommandée pour les nouveaux projets.
:::

## 🛠️ Configuration du projet Firebase

### 1. Création du projet Firebase

1. Aller sur [console.firebase.google.com](https://console.firebase.google.com)
2. Cliquer sur "Créer un projet"
3. Nommer votre projet (ex: "mon-app-flutter")
4. Activer Google Analytics (optionnel)
5. Créer le projet

### 2. Configuration Flutter

#### Installation de FlutterFire CLI

```bash
# Installer FlutterFire CLI
npm install -g firebase-tools
dart pub global activate flutterfire_cli

# Se connecter à Firebase
firebase login

# Configurer le projet Flutter
flutterfire configure
```

#### Configuration manuelle

Si vous préférez configurer manuellement, ajoutez les dépendances :

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # Firebase Core (obligatoire)
  firebase_core: ^2.24.2
  
  # Services Firebase
  cloud_firestore: ^4.13.6
  firebase_auth: ^4.15.3
  firebase_storage: ^11.5.6
  
  # Utilitaires
  provider: ^6.1.1
  equatable: ^2.0.5
```

#### Initialisation dans main.dart

```dart
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart'; // Généré par flutterfire configure

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialiser Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Firebase Demo',
      home: HomePage(),
    );
  }
}
```

## 🔐 Firebase Authentication

L'authentification Firebase permet de gérer facilement les utilisateurs.

### Service d'authentification

```dart
import 'package:firebase_auth/firebase_auth.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  
  // Stream de l'utilisateur actuel
  Stream<User?> get authStateChanges => _auth.authStateChanges();
  
  // Utilisateur actuel
  User? get currentUser => _auth.currentUser;
  
  // Inscription avec email/mot de passe
  Future<UserCredential?> registerWithEmailPassword(
    String email, 
    String password
  ) async {
    try {
      UserCredential result = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      return result;
    } on FirebaseAuthException catch (e) {
      print('Erreur inscription: ${e.message}');
      throw e;
    }
  }
  
  // Connexion avec email/mot de passe
  Future<UserCredential?> signInWithEmailPassword(
    String email, 
    String password
  ) async {
    try {
      UserCredential result = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      return result;
    } on FirebaseAuthException catch (e) {
      print('Erreur connexion: ${e.message}');
      throw e;
    }
  }
  
  // Déconnexion
  Future<void> signOut() async {
    try {
      return await _auth.signOut();
    } catch (e) {
      print('Erreur déconnexion: $e');
      throw e;
    }
  }
  
  // Réinitialisation mot de passe
  Future<void> resetPassword(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email);
    } on FirebaseAuthException catch (e) {
      print('Erreur reset: ${e.message}');
      throw e;
    }
  }
  
  // Mettre à jour le profil
  Future<void> updateProfile({String? displayName, String? photoURL}) async {
    try {
      await currentUser?.updateDisplayName(displayName);
      await currentUser?.updatePhotoURL(photoURL);
    } catch (e) {
      print('Erreur mise à jour profil: $e');
      throw e;
    }
  }
}
```

### Interface d'authentification

```dart
class AuthPage extends StatefulWidget {
  @override
  _AuthPageState createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  final AuthService _authService = AuthService();
  final _formKey = GlobalKey<FormState>();
  
  bool _isLogin = true;
  bool _isLoading = false;
  
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.all(20),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo/Titre
                Icon(
                  Icons.firebase,
                  size: 80,
                  color: Colors.orange,
                ),
                SizedBox(height: 32),
                
                Text(
                  _isLogin ? 'Connexion' : 'Inscription',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                SizedBox(height: 32),
                
                // Champ email
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: InputDecoration(
                    labelText: 'Email',
                    prefixIcon: Icon(Icons.email),
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Veuillez saisir votre email';
                    }
                    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
                      return 'Email invalide';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16),
                
                // Champ mot de passe
                TextFormField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: InputDecoration(
                    labelText: 'Mot de passe',
                    prefixIcon: Icon(Icons.lock),
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Veuillez saisir votre mot de passe';
                    }
                    if (value.length < 6) {
                      return 'Mot de passe trop court (min 6 caractères)';
                    }
                    return null;
                  },
                ),
                
                // Confirmation mot de passe (inscription seulement)
                if (!_isLogin) ...[
                  SizedBox(height: 16),
                  TextFormField(
                    controller: _confirmPasswordController,
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: 'Confirmer le mot de passe',
                      prefixIcon: Icon(Icons.lock_outline),
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) {
                      if (!_isLogin && value != _passwordController.text) {
                        return 'Les mots de passe ne correspondent pas';
                      }
                      return null;
                    },
                  ),
                ],
                
                SizedBox(height: 32),
                
                // Bouton principal
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _handleSubmit,
                    child: _isLoading
                        ? CircularProgressIndicator(color: Colors.white)
                        : Text(_isLogin ? 'Se connecter' : 'S\'inscrire'),
                  ),
                ),
                
                SizedBox(height: 16),
                
                // Lien mot de passe oublié
                if (_isLogin)
                  TextButton(
                    onPressed: _resetPassword,
                    child: Text('Mot de passe oublié ?'),
                  ),
                
                SizedBox(height: 16),
                
                // Basculer entre connexion/inscription
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(_isLogin 
                        ? 'Pas encore de compte ? ' 
                        : 'Déjà un compte ? '),
                    TextButton(
                      onPressed: () {
                        setState(() {
                          _isLogin = !_isLogin;
                          _clearForm();
                        });
                      },
                      child: Text(_isLogin ? 'S\'inscrire' : 'Se connecter'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  void _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() => _isLoading = true);
    
    try {
      if (_isLogin) {
        await _authService.signInWithEmailPassword(
          _emailController.text.trim(),
          _passwordController.text,
        );
      } else {
        await _authService.registerWithEmailPassword(
          _emailController.text.trim(),
          _passwordController.text,
        );
      }
      
      // Navigation vers la page principale gérée par StreamBuilder
    } on FirebaseAuthException catch (e) {
      _showErrorDialog(_getErrorMessage(e.code));
    } catch (e) {
      _showErrorDialog('Une erreur inattendue s\'est produite');
    }
    
    setState(() => _isLoading = false);
  }
  
  void _resetPassword() async {
    if (_emailController.text.isEmpty) {
      _showErrorDialog('Veuillez saisir votre email');
      return;
    }
    
    try {
      await _authService.resetPassword(_emailController.text.trim());
      _showSuccessDialog('Email de réinitialisation envoyé');
    } catch (e) {
      _showErrorDialog('Erreur lors de l\'envoi de l\'email');
    }
  }
  
  String _getErrorMessage(String errorCode) {
    switch (errorCode) {
      case 'user-not-found':
        return 'Aucun utilisateur trouvé avec cet email';
      case 'wrong-password':
        return 'Mot de passe incorrect';
      case 'email-already-in-use':
        return 'Un compte existe déjà avec cet email';
      case 'weak-password':
        return 'Mot de passe trop faible';
      case 'invalid-email':
        return 'Email invalide';
      default:
        return 'Erreur d\'authentification';
    }
  }
  
  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Erreur'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }
  
  void _showSuccessDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Succès'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }
  
  void _clearForm() {
    _emailController.clear();
    _passwordController.clear();
    _confirmPasswordController.clear();
  }
  
  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }
}
```

## 🗄️ Cloud Firestore

Cloud Firestore est une base de données NoSQL flexible et scalable.

### Structure des données

Firestore organise les données en :
- **Collections** : Groupes de documents (comme des tables)
- **Documents** : Objets contenant des champs (comme des lignes)
- **Sous-collections** : Collections imbriquées dans des documents

```
users/                          <- Collection
  ├── alice123/                 <- Document
  │   ├── name: "Alice"         <- Champ
  │   ├── email: "alice@..."    <- Champ
  │   └── tasks/                <- Sous-collection
  │       ├── task1/            <- Document
  │       └── task2/            <- Document
  └── bob456/                   <- Document
      ├── name: "Bob"
      └── email: "bob@..."
```

### Service Firestore

```dart
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;
  
  // Référence vers la collection des tâches de l'utilisateur actuel
  CollectionReference get _userTasks {
    final userId = _auth.currentUser?.uid;
    if (userId == null) throw Exception('Utilisateur non connecté');
    return _db.collection('users').doc(userId).collection('tasks');
  }
  
  // Créer une tâche
  Future<DocumentReference> createTask(Map<String, dynamic> taskData) async {
    taskData['createdAt'] = FieldValue.serverTimestamp();
    taskData['updatedAt'] = FieldValue.serverTimestamp();
    return await _userTasks.add(taskData);
  }
  
  // Lire toutes les tâches (Stream temps réel)
  Stream<QuerySnapshot> getTasks() {
    return _userTasks
        .orderBy('createdAt', descending: true)
        .snapshots();
  }
  
  // Lire une tâche spécifique
  Future<DocumentSnapshot> getTask(String taskId) async {
    return await _userTasks.doc(taskId).get();
  }
  
  // Mettre à jour une tâche
  Future<void> updateTask(String taskId, Map<String, dynamic> updates) async {
    updates['updatedAt'] = FieldValue.serverTimestamp();
    await _userTasks.doc(taskId).update(updates);
  }
  
  // Supprimer une tâche
  Future<void> deleteTask(String taskId) async {
    await _userTasks.doc(taskId).delete();
  }
  
  // Requêtes avancées
  Stream<QuerySnapshot> getTasksByStatus(bool completed) {
    return _userTasks
        .where('completed', isEqualTo: completed)
        .orderBy('createdAt', descending: true)
        .snapshots();
  }
  
  // Recherche par texte
  Stream<QuerySnapshot> searchTasks(String searchTerm) {
    return _userTasks
        .where('title', isGreaterThanOrEqualTo: searchTerm)
        .where('title', isLessThanOrEqualTo: searchTerm + '\uf8ff')
        .snapshots();
  }
  
  // Compter les tâches
  Future<int> getTaskCount() async {
    final snapshot = await _userTasks.get();
    return snapshot.docs.length;
  }
  
  // Transaction pour opérations atomiques
  Future<void> toggleTaskAndUpdateStats(String taskId, bool newStatus) async {
    return await _db.runTransaction((transaction) async {
      // Lire la tâche
      final taskRef = _userTasks.doc(taskId);
      final taskDoc = await transaction.get(taskRef);
      
      if (!taskDoc.exists) {
        throw Exception('Tâche non trouvée');
      }
      
      // Mettre à jour la tâche
      transaction.update(taskRef, {
        'completed': newStatus,
        'updatedAt': FieldValue.serverTimestamp(),
      });
      
      // Mettre à jour les statistiques utilisateur
      final userRef = _db.collection('users').doc(_auth.currentUser!.uid);
      transaction.update(userRef, {
        'lastTaskUpdate': FieldValue.serverTimestamp(),
      });
    });
  }
  
  // Batch pour opérations multiples
  Future<void> deleteMultipleTasks(List<String> taskIds) async {
    final batch = _db.batch();
    
    for (String taskId in taskIds) {
      batch.delete(_userTasks.doc(taskId));
    }
    
    await batch.commit();
  }
}
```

### Modèles de données avec Firestore

```dart
class Task {
  final String? id;
  final String title;
  final String description;
  final bool completed;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final String userId;
  
  Task({
    this.id,
    required this.title,
    required this.description,
    this.completed = false,
    this.createdAt,
    this.updatedAt,
    required this.userId,
  });
  
  // Créer depuis Firestore
  factory Task.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return Task(
      id: doc.id,
      title: data['title'] ?? '',
      description: data['description'] ?? '',
      completed: data['completed'] ?? false,
      createdAt: (data['createdAt'] as Timestamp?)?.toDate(),
      updatedAt: (data['updatedAt'] as Timestamp?)?.toDate(),
      userId: data['userId'] ?? '',
    );
  }
  
  // Convertir vers Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'title': title,
      'description': description,
      'completed': completed,
      'userId': userId,
      // createdAt et updatedAt gérés par le service
    };
  }
  
  // Copie avec modifications
  Task copyWith({
    String? id,
    String? title,
    String? description,
    bool? completed,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? userId,
  }) {
    return Task(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      completed: completed ?? this.completed,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      userId: userId ?? this.userId,
    );
  }
  
  @override
  String toString() {
    return 'Task(id: $id, title: $title, completed: $completed)';
  }
}
```

## 🔄 Streams temps réel avec StreamBuilder

L'un des grands avantages de Firestore est la synchronisation temps réel :

```dart
class TaskListPage extends StatelessWidget {
  final FirestoreService _firestoreService = FirestoreService();
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Mes tâches'),
        actions: [
          IconButton(
            icon: Icon(Icons.add),
            onPressed: () => _showAddTaskDialog(context),
          ),
        ],
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: _firestoreService.getTasks(),
        builder: (context, snapshot) {
          // Gestion des états
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
                  ElevatedButton(
                    onPressed: () {
                      // Forcer le rebuild du stream
                      (context as Element).markNeedsBuild();
                    },
                    child: Text('Réessayer'),
                  ),
                ],
              ),
            );
          }
          
          if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.task_alt, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('Aucune tâche'),
                  SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => _showAddTaskDialog(context),
                    child: Text('Ajouter une tâche'),
                  ),
                ],
              ),
            );
          }
          
          // Conversion des documents en objets Task
          final tasks = snapshot.data!.docs
              .map((doc) => Task.fromFirestore(doc))
              .toList();
          
          return ListView.builder(
            itemCount: tasks.length,
            itemBuilder: (context, index) {
              final task = tasks[index];
              return _buildTaskItem(context, task);
            },
          );
        },
      ),
    );
  }
  
  Widget _buildTaskItem(BuildContext context, Task task) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: ListTile(
        leading: Checkbox(
          value: task.completed,
          onChanged: (value) async {
            try {
              await _firestoreService.updateTask(
                task.id!,
                {'completed': value},
              );
            } catch (e) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Erreur: $e')),
              );
            }
          },
        ),
        title: Text(
          task.title,
          style: TextStyle(
            decoration: task.completed 
                ? TextDecoration.lineThrough 
                : TextDecoration.none,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (task.description.isNotEmpty)
              Text(task.description),
            if (task.createdAt != null)
              Text(
                'Créée le ${_formatDate(task.createdAt!)}',
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
          ],
        ),
        trailing: PopupMenuButton(
          itemBuilder: (context) => [
            PopupMenuItem(
              value: 'edit',
              child: Row(
                children: [
                  Icon(Icons.edit, size: 20),
                  SizedBox(width: 8),
                  Text('Modifier'),
                ],
              ),
            ),
            PopupMenuItem(
              value: 'delete',
              child: Row(
                children: [
                  Icon(Icons.delete, size: 20, color: Colors.red),
                  SizedBox(width: 8),
                  Text('Supprimer', style: TextStyle(color: Colors.red)),
                ],
              ),
            ),
          ],
          onSelected: (value) {
            if (value == 'edit') {
              _showEditTaskDialog(context, task);
            } else if (value == 'delete') {
              _deleteTask(context, task);
            }
          },
        ),
      ),
    );
  }
  
  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
  
  void _showAddTaskDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => TaskDialog(
        onSave: (title, description) async {
          try {
            await _firestoreService.createTask({
              'title': title,
              'description': description,
              'completed': false,
              'userId': FirebaseAuth.instance.currentUser!.uid,
            });
            Navigator.pop(context);
          } catch (e) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Erreur: $e')),
            );
          }
        },
      ),
    );
  }
  
  void _showEditTaskDialog(BuildContext context, Task task) {
    showDialog(
      context: context,
      builder: (context) => TaskDialog(
        initialTitle: task.title,
        initialDescription: task.description,
        onSave: (title, description) async {
          try {
            await _firestoreService.updateTask(
              task.id!,
              {
                'title': title,
                'description': description,
              },
            );
            Navigator.pop(context);
          } catch (e) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Erreur: $e')),
            );
          }
        },
      ),
    );
  }
  
  void _deleteTask(BuildContext context, Task task) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Confirmer la suppression'),
        content: Text('Voulez-vous vraiment supprimer "${task.title}" ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () async {
              try {
                await _firestoreService.deleteTask(task.id!);
                Navigator.pop(context);
              } catch (e) {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Erreur: $e')),
                );
              }
            },
            child: Text('Supprimer'),
          ),
        ],
      ),
    );
  }
}

// Dialog pour ajouter/modifier une tâche
class TaskDialog extends StatefulWidget {
  final String? initialTitle;
  final String? initialDescription;
  final Function(String title, String description) onSave;
  
  const TaskDialog({
    Key? key,
    this.initialTitle,
    this.initialDescription,
    required this.onSave,
  }) : super(key: key);
  
  @override
  _TaskDialogState createState() => _TaskDialogState();
}

class _TaskDialogState extends State<TaskDialog> {
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  final _formKey = GlobalKey<FormState>();
  
  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.initialTitle ?? '');
    _descriptionController = TextEditingController(text: widget.initialDescription ?? '');
  }
  
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.initialTitle != null ? 'Modifier la tâche' : 'Nouvelle tâche'),
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              controller: _titleController,
              decoration: InputDecoration(
                labelText: 'Titre',
                border: OutlineInputBorder(),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Le titre est requis';
                }
                return null;
              },
            ),
            SizedBox(height: 16),
            TextFormField(
              controller: _descriptionController,
              decoration: InputDecoration(
                labelText: 'Description (optionnel)',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
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
          onPressed: () {
            if (_formKey.currentState!.validate()) {
              widget.onSave(
                _titleController.text.trim(),
                _descriptionController.text.trim(),
              );
            }
          },
          child: Text('Sauvegarder'),
        ),
      ],
    );
  }
  
  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }
}
```

## 🔒 Sécurité et règles Firestore

Les règles de sécurité Firestore contrôlent l'accès aux données :

```javascript
// Rules dans la console Firebase
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Les utilisateurs peuvent seulement accéder à leurs propres données
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Sous-collection des tâches
      match /tasks/{taskId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Collection publique (ex: catégories)
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🎯 Exemple complet : Application connectée

```dart
class MyFirebaseApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Firebase Flutter App',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: AuthWrapper(),
    );
  }
}

// Wrapper qui gère l'état d'authentification
class AuthWrapper extends StatelessWidget {
  final AuthService _authService = AuthService();
  
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: _authService.authStateChanges,
      builder: (context, snapshot) {
        // En cours de chargement
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }
        
        // Utilisateur connecté
        if (snapshot.hasData && snapshot.data != null) {
          return MainApp();
        }
        
        // Utilisateur non connecté
        return AuthPage();
      },
    );
  }
}

// Application principale une fois connecté
class MainApp extends StatefulWidget {
  @override
  _MainAppState createState() => _MainAppState();
}

class _MainAppState extends State<MainApp> {
  int _currentIndex = 0;
  
  final List<Widget> _pages = [
    TaskListPage(),
    ProfilePage(),
  ];
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.task_alt),
            label: 'Tâches',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profil',
          ),
        ],
      ),
    );
  }
}

class ProfilePage extends StatelessWidget {
  final AuthService _authService = AuthService();
  
  @override
  Widget build(BuildContext context) {
    final user = _authService.currentUser;
    
    return Scaffold(
      appBar: AppBar(title: Text('Profil')),
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            CircleAvatar(
              radius: 50,
              backgroundImage: user?.photoURL != null 
                  ? NetworkImage(user!.photoURL!) 
                  : null,
              child: user?.photoURL == null 
                  ? Icon(Icons.person, size: 50) 
                  : null,
            ),
            SizedBox(height: 20),
            
            Text(
              user?.displayName ?? 'Utilisateur',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            Text(user?.email ?? ''),
            
            SizedBox(height: 40),
            
            ElevatedButton.icon(
              onPressed: () async {
                await _authService.signOut();
              },
              icon: Icon(Icons.logout),
              label: Text('Se déconnecter'),
            ),
          ],
        ),
      ),
    );
  }
}
```

::: tip Bonnes pratiques Firebase
- **Sécurité** : Toujours définir des règles strictes
- **Performance** : Utiliser des index pour les requêtes complexes
- **Coûts** : Optimiser les lectures/écritures pour limiter les frais
- **Offline** : Firestore fonctionne hors ligne automatiquement
- **Pagination** : Utiliser `limit()` et `startAfter()` pour de grandes collections
:::

Cette intégration Firebase/Firestore complète votre arsenal Flutter pour créer des applications modernes et connectées. Dans la section suivante, nous explorerons [React Native](../react-native/) pour le développement cross-platform avec JavaScript.