# Flutter – Firebase et Cloud Firestore

## 🔥 Introduction à Firebase

Firebase est une **plateforme Backend-as-a-Service (BaaS)** développée par Google qui élimine le besoin de créer et maintenir votre propre serveur. Imaginez Firebase comme un backend prêt à l'emploi que vous pouvez connecter directement à votre application Flutter.

### Pourquoi Firebase est-il révolutionnaire ?

**Sans Firebase** (approche traditionnelle) :
- ✋ Vous devez créer un serveur (Node.js, Python, etc.)
- ✋ Configurer une base de données (MySQL, PostgreSQL)
- ✋ Gérer l'authentification utilisateur
- ✋ Implémenter les API REST
- ✋ Gérer la sécurité et la scalabilité

**Avec Firebase** :
- ✅ Tout est prêt instantanément
- ✅ Synchronisation temps réel automatique
- ✅ Authentification intégrée (email, Google, Facebook...)
- ✅ Sécurité gérée par Google
- ✅ Mise à l'échelle automatique

### Écosystème Firebase : les services essentiels

| Service | Rôle | Exemple concret |
|---------|------|-----------------|
| **Authentication** | Gère les comptes utilisateur | Login avec email/mot de passe |
| **Cloud Firestore** | Base de données NoSQL | Stocker les messages d'un chat |
| **Cloud Storage** | Stockage de fichiers | Sauvegarder les photos de profil |
| **Cloud Functions** | Code serveur | Envoyer une notification push |

::: tip Analogie simple
Pensez à Firebase comme à un "couteau suisse" pour développeurs : au lieu d'acheter chaque outil séparément, vous avez tout en un seul package !
:::


## 🛠️ Configuration : de zéro à opérationnel

### Étape 1 : Créer votre projet Firebase

1. **Rendez-vous sur** [console.firebase.google.com](https://console.firebase.google.com)
2. **Créez un nouveau projet** : choisissez un nom unique
3. **Activez Google Analytics** (recommandé pour les statistiques)

### Étape 2 : Connecter Flutter à Firebase

#### Option A : FlutterFire CLI (recommandée)

```bash
# 1. Installer les outils
npm install -g firebase-tools
dart pub global activate flutterfire_cli

# 2. Se connecter à votre compte Google
firebase login

# 3. Configuration automatique (magique !)
flutterfire configure
```

#### Option B : Configuration manuelle

```bash
# Ajouter les dépendances essentielles
flutter pub add firebase_core
flutter pub add cloud_firestore
flutter pub add firebase_auth
```

### Étape 3 : Initialiser Firebase dans votre app

```dart
// main.dart - Point d'entrée de votre application
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart'; // Généré automatiquement

void main() async {
  // IMPORTANT : Toujours faire ceci avant Firebase
  WidgetsFlutterBinding.ensureInitialized();
  
  // Connexion à Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  
  runApp(MonApp());
}

class MonApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mon App Firebase',
      home: PageAccueil(),
    );
  }
}
```

::: warning Point d'attention
L'initialisation Firebase **doit** se faire avant le `runApp()`, sinon votre application plantera au premier appel Firebase !
:::
## 🔐 Firebase Authentication : Gérer les utilisateurs

L'authentication Firebase vous évite de créer tout le système de gestion d'utilisateurs. C'est comme avoir un **service de sécurité professionnel** pour votre application.

### Concept clé : AuthStateChanges

Firebase vous informe automatiquement quand l'utilisateur se connecte ou se déconnecte via un **Stream**. Imaginez cela comme un "détecteur de présence" :

```dart
// Exemple simple d'écoute des changements d'état
Stream<User?> authChanges = FirebaseAuth.instance.authStateChanges();

// L'utilisateur connecté (null si déconnecté)
User? currentUser = FirebaseAuth.instance.currentUser;
```



### Service d'authentification simple

Créons un service qui encapsule les opérations d'authentification :

```dart
import 'package:firebase_auth/firebase_auth.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  
  // L'utilisateur actuel
  User? get currentUser => _auth.currentUser;
  
  // Stream qui émet quand l'utilisateur change
  Stream<User?> get authStateChanges => _auth.authStateChanges();
  
  // Inscription avec email/mot de passe
  Future<User?> inscription(String email, String password) async {
    try {
      UserCredential result = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      return result.user;
    } catch (e) {
      print('Erreur inscription: $e');
      return null;
    }
  }
  
  // Connexion avec email/mot de passe
  Future<User?> connexion(String email, String password) async {
    try {
      UserCredential result = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      return result.user;
    } catch (e) {
      print('Erreur connexion: $e');
      return null;
    }
  }
  
  // Déconnexion
  Future<void> deconnexion() async {
    await _auth.signOut();
  }
}
```

### Interface d'authentification minimaliste

```dart
class PageAuth extends StatefulWidget {
  @override
  _PageAuthState createState() => _PageAuthState();
}

class _PageAuthState extends State<PageAuth> {
  final AuthService _authService = AuthService();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isConnexion = true; // true = connexion, false = inscription

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Titre
            Text(
              _isConnexion ? 'Connexion' : 'Inscription',
              style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 40),
            
            // Champ email
            TextField(
              controller: _emailController,
              decoration: InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 20),
            
            // Champ mot de passe
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: InputDecoration(
                labelText: 'Mot de passe',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 30),
            
            // Bouton principal
            ElevatedButton(
              onPressed: _handleAuth,
              child: Text(_isConnexion ? 'Se connecter' : 'S\'inscrire'),
            ),
            
            // Basculer entre connexion/inscription
            TextButton(
              onPressed: () {
                setState(() {
                  _isConnexion = !_isConnexion;
                });
              },
              child: Text(_isConnexion 
                  ? 'Pas de compte ? S\'inscrire' 
                  : 'Déjà un compte ? Se connecter'),
            ),
          ],
        ),
      ),
    );
  }
  
  void _handleAuth() async {
    String email = _emailController.text.trim();
    String password = _passwordController.text;
    
    User? user;
    if (_isConnexion) {
      user = await _authService.connexion(email, password);
    } else {
      user = await _authService.inscription(email, password);
    }
    
    if (user != null) {
      print('Succès ! Utilisateur: ${user.email}');
      // La navigation sera gérée automatiquement par AuthWrapper
    } else {
      print('Échec de l\'authentification');
    }
  }
}
```

### Wrapper d'authentification : le chef d'orchestre

Le **AuthWrapper** décide quelle page afficher selon l'état de connexion :

```dart
class AuthWrapper extends StatelessWidget {
  final AuthService _authService = AuthService();
  
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: _authService.authStateChanges,
      builder: (context, snapshot) {
        // Chargement initial
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }
        
        // Utilisateur connecté → Page principale
        if (snapshot.hasData) {
          return PagePrincipale();
        }
        
        // Pas d'utilisateur → Page d'authentification
        return PageAuth();
      },
    );
  }
}
```

::: tip Concept important : Stream vs Future
- **Future** : "Donne-moi le résultat une seule fois" (comme une requête HTTP)
- **Stream** : "Tiens-moi au courant de tous les changements" (comme un abonnement)

L'authentication utilise un Stream parce que l'état de connexion peut changer à tout moment !
:::
## 🗄️ Cloud Firestore : Votre base de données magique

Cloud Firestore est une **base de données NoSQL** qui fonctionne comme un grand classeur numérique où vous organisez vos données différemment d'une base de données traditionnelle.


### Structure Firestore : Collections et Documents

Imaginez Firestore comme un **système de fichiers** :

```
📁 users/                          ← Collection (dossier)
  📄 alice123/                     ← Document (fichier)
     • name: "Alice"               ← Champ
     • email: "alice@email.com"    ← Champ
     📁 tasks/                     ← Sous-collection
       📄 task1/                   ← Document
          • title: "Faire les courses"
          • completed: false
```

### Analogie simple
- **Collection** = Un dossier qui contient des documents
- **Document** = Un fichier JSON avec des données
- **Champ** = Une ligne dans ce fichier JSON

### Service Firestore essentiel

```dart
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  
  // Référence vers la collection des tâches de l'utilisateur actuel
  CollectionReference get _userTasks {
    final userId = FirebaseAuth.instance.currentUser?.uid;
    return _db.collection('users').doc(userId).collection('tasks');
  }
  
  // CREATE - Créer une tâche
  Future<void> ajouterTache(String titre, String description) async {
    await _userTasks.add({
      'title': titre,
      'description': description,
      'completed': false,
      'createdAt': FieldValue.serverTimestamp(), // Horodatage serveur
    });
  }
  
  // READ - Lire toutes les tâches (Stream temps réel)
  Stream<QuerySnapshot> obtenirTaches() {
    return _userTasks
        .orderBy('createdAt', descending: true)
        .snapshots();
  }
  
  // UPDATE - Mettre à jour une tâche
  Future<void> modifierTache(String taskId, Map<String, dynamic> modifications) async {
    await _userTasks.doc(taskId).update(modifications);
  }
  
  // DELETE - Supprimer une tâche
  Future<void> supprimerTache(String taskId) async {
    await _userTasks.doc(taskId).delete();
  }
}
```

### Modèle de données simple

```dart
class Tache {
  final String? id;
  final String titre;
  final String description;
  final bool completed;
  final DateTime? createdAt;
  
  Tache({
    this.id,
    required this.titre,
    required this.description,
    this.completed = false,
    this.createdAt,
  });
  
  // Créer depuis Firestore
  factory Tache.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return Tache(
      id: doc.id,
      titre: data['title'] ?? '',
      description: data['description'] ?? '',
      completed: data['completed'] ?? false,
      createdAt: (data['createdAt'] as Timestamp?)?.toDate(),
    );
  }
  
  // Convertir pour Firestore
  Map<String, dynamic> toFirestore() {
    return {
      'title': titre,
      'description': description,
      'completed': completed,
    };
  }
}
```

### StreamBuilder : La magie du temps réel

Le **StreamBuilder** écoute en permanence les changements dans Firestore. C'est comme avoir un assistant qui vous prévient dès qu'il y a du nouveau !

```dart
class ListeTaches extends StatelessWidget {
  final FirestoreService _firestoreService = FirestoreService();
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Mes tâches')),
      body: StreamBuilder<QuerySnapshot>(
        stream: _firestoreService.obtenirTaches(),
        builder: (context, snapshot) {
          // 1. En cours de chargement
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }
          
          // 2. Erreur
          if (snapshot.hasError) {
            return Center(child: Text('Erreur: ${snapshot.error}'));
          }
          
          // 3. Pas de données
          if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
            return Center(child: Text('Aucune tâche'));
          }
          
          // 4. Afficher les données
          final taches = snapshot.data!.docs
              .map((doc) => Tache.fromFirestore(doc))
              .toList();
          
          return ListView.builder(
            itemCount: taches.length,
            itemBuilder: (context, index) {
              final tache = taches[index];
              return ListTile(
                title: Text(tache.titre),
                subtitle: Text(tache.description),
                leading: Checkbox(
                  value: tache.completed,
                  onChanged: (value) {
                    _firestoreService.modifierTache(
                      tache.id!,
                      {'completed': value},
                    );
                  },
                ),
                trailing: IconButton(
                  icon: Icon(Icons.delete),
                  onPressed: () {
                    _firestoreService.supprimerTache(tache.id!);
                  },
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _ajouterNouvelleTache(context),
        child: Icon(Icons.add),
      ),
    );
  }
  
  void _ajouterNouvelleTache(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) {
        String titre = '';
        String description = '';
        
        return AlertDialog(
          title: Text('Nouvelle tâche'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                onChanged: (value) => titre = value,
                decoration: InputDecoration(labelText: 'Titre'),
              ),
              TextField(
                onChanged: (value) => description = value,
                decoration: InputDecoration(labelText: 'Description'),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('Annuler'),
            ),
            ElevatedButton(
              onPressed: () {
                if (titre.isNotEmpty) {
                  _firestoreService.ajouterTache(titre, description);
                  Navigator.pop(context);
                }
              },
              child: Text('Ajouter'),
            ),
          ],
        );
      },
    );
  }
}
```

::: tip Pourquoi StreamBuilder est magique ?
- ⚡ **Temps réel** : Dès qu'une donnée change dans Firestore, l'interface se met à jour
- 🔄 **Automatique** : Pas besoin de rafraîchir manuellement
- 🌐 **Multi-appareils** : Si un autre utilisateur modifie les données, vous les voyez instantanément
- 📱 **Offline** : Fonctionne même sans connexion, synchronise quand la connexion revient
:::
## 🔒 Sécurité Firestore : Protéger vos données

Les **règles de sécurité Firestore** sont comme un **garde du corps numérique** pour vos données. Elles décident qui peut lire ou écrire quoi.

### Principe fondamental : Authentication-based Access

La règle d'or : **"Seuls les utilisateurs connectés peuvent accéder à leurs propres données"**

```javascript
// Règles de sécurité dans la console Firebase
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règle pour les données utilisateur
    match /users/{userId} {
      // L'utilisateur peut seulement accéder à ses propres données
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Sous-collection des tâches
      match /tasks/{taskId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Données publiques (ex: catégories)
    match /categories/{categoryId} {
      allow read: if true;  // Tout le monde peut lire
      allow write: if request.auth != null;  // Seuls les connectés peuvent écrire
    }
  }
}
```

### Explication des règles

| Règle | Signification | Exemple |
|-------|---------------|---------|
| `request.auth != null` | L'utilisateur est connecté | Vérifie qu'il y a une session |
| `request.auth.uid == userId` | L'utilisateur accède à ses données | Alice ne peut pas voir les données de Bob |
| `allow read: if true` | Lecture libre | Articles de blog publics |
| `allow write: if false` | Écriture interdite | Données en lecture seule |

## 🎯 Application complète : Assembler les pièces

Voici comment tout s'articule dans une application réelle :

### Structure de l'application

```dart
// main.dart - Point d'entrée
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(MonApp());
}

class MonApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mon App Firebase',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: AuthWrapper(), // Le chef d'orchestre
    );
  }
}
```

### AuthWrapper : Le décideur

```dart
class AuthWrapper extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return EcranChargement();
        }
        
        if (snapshot.hasData) {
          return AppPrincipale(); // Utilisateur connecté
        } else {
          return PageAuth(); // Pas connecté
        }
      },
    );
  }
}
```

### Application principale

```dart
class AppPrincipale extends StatefulWidget {
  @override
  _AppPrincipaleState createState() => _AppPrincipaleState();
}

class _AppPrincipaleState extends State<AppPrincipale> {
  int _currentIndex = 0;
  
  final List<Widget> _pages = [
    ListeTaches(),
    PageProfil(),
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
            icon: Icon(Icons.task),
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
```

### Page de profil simple

```dart
class PageProfil extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    
    return Scaffold(
      appBar: AppBar(title: Text('Mon Profil')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircleAvatar(
              radius: 50,
              child: Text(
                user?.email?.substring(0, 1).toUpperCase() ?? '?',
                style: TextStyle(fontSize: 32),
              ),
            ),
            SizedBox(height: 20),
            
            Text(
              user?.email ?? 'Utilisateur',
              style: TextStyle(fontSize: 18),
            ),
            
            SizedBox(height: 40),
            
            ElevatedButton.icon(
              onPressed: () => FirebaseAuth.instance.signOut(),
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

## 💡 Concepts clés à retenir

### 1. Firebase = Backend prêt à l'emploi
- ✅ Pas de serveur à créer
- ✅ Authentification intégrée
- ✅ Base de données temps réel
- ✅ Sécurité gérée par Google

### 2. Architecture recommandée
```
AuthWrapper → Décide quelle page afficher
    ↓
Connecté ? → Application principale
    ↓
Pas connecté ? → Page d'authentification
```

### 3. Firestore = Données structurées
- **Collections** : Dossiers contenant des documents
- **Documents** : Fichiers JSON avec vos données
- **Streams** : Écoute temps réel des changements

### 4. Sécurité = Règles strictes
- Chaque utilisateur ne voit que ses données
- Authentification obligatoire pour écrire
- Règles définies côté serveur (inviolables)

::: tip Conseil pédagogique
Commencez par comprendre les **concepts** avant de vous lancer dans le code. Firebase révolutionne la façon de créer des applications en éliminant la complexité backend. Une fois que vous maîtrisez les bases (Auth + Firestore), vous pouvez créer des applications sophistiquées très rapidement !
:::

::: warning Attention aux coûts
Firebase est gratuit jusqu'à certaines limites. Pour un projet étudiant, vous ne les atteindrez jamais. En production, surveillez vos lectures/écritures Firestore qui sont facturées à l'usage.
:::

## 🏗️ Firebase avec l'architecture BLoC

L'architecture **BLoC (Business Logic Component)** sépare clairement la logique métier de l'interface utilisateur. Avec Firebase, cette séparation devient encore plus puissante !

### Pourquoi BLoC + Firebase = ❤️ ?

**Sans BLoC** (approche basique) :
```dart
// Widget qui fait TOUT : interface + logique + Firebase
class MaPage extends StatefulWidget {
  // Mélange de UI et logique métier 😰
  FirestoreService service = FirestoreService();
  // Code difficile à tester et maintenir
}
```

**Avec BLoC** (approche professionnelle) :
```dart
// Séparation claire des responsabilités 😍
Widget → envoie Events → BLoC → utilise Repository → appelle Firebase
```

### Architecture en couches : La pyramide BLoC

```
┌─────────────────┐
│   📱 UI Layer   │  ← Widgets (affichage uniquement)
├─────────────────┤
│  🧠 BLoC Layer  │  ← Logique métier et états
├─────────────────┤
│ 📦 Repo Layer   │  ← Accès aux données (Firebase)
└─────────────────┘
```

### Étape 1 : Créer le Repository Firebase

Le **Repository** est l'intermédiaire entre votre BLoC et Firebase. C'est comme un **traducteur** qui parle Firebase d'un côté et BLoC de l'autre.

```bash
# Ajouter les dépendances BLoC
flutter pub add flutter_bloc
flutter pub add equatable
```

```dart
// repositories/task_repository.dart
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class TaskRepository {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;
  
  // Référence vers les tâches de l'utilisateur connecté
  CollectionReference get _tasksCollection {
    final userId = _auth.currentUser?.uid;
    if (userId == null) throw Exception('Utilisateur non connecté');
    return _firestore.collection('users').doc(userId).collection('tasks');
  }
  
  // Stream des tâches (temps réel)
  Stream<List<Task>> watchTasks() {
    return _tasksCollection
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => Task.fromFirestore(doc))
            .toList());
  }
  
  // Ajouter une tâche
  Future<void> addTask(Task task) async {
    await _tasksCollection.add(task.toFirestore());
  }
  
  // Modifier une tâche
  Future<void> updateTask(String taskId, Task updatedTask) async {
    await _tasksCollection.doc(taskId).update(updatedTask.toFirestore());
  }
  
  // Supprimer une tâche
  Future<void> deleteTask(String taskId) async {
    await _tasksCollection.doc(taskId).delete();
  }
}
```

### Étape 2 : Définir les Events et States

Les **Events** sont les actions que l'utilisateur peut faire. Les **States** représentent l'état de l'application.

```dart
// bloc/task_event.dart
abstract class TaskEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class LoadTasks extends TaskEvent {}

class AddTask extends TaskEvent {
  final String title;
  final String description;
  
  AddTask({required this.title, required this.description});
  
  @override
  List<Object?> get props => [title, description];
}

class UpdateTask extends TaskEvent {
  final String taskId;
  final Task updatedTask;
  
  UpdateTask({required this.taskId, required this.updatedTask});
  
  @override
  List<Object?> get props => [taskId, updatedTask];
}

class DeleteTask extends TaskEvent {
  final String taskId;
  
  DeleteTask({required this.taskId});
  
  @override
  List<Object?> get props => [taskId];
}
```

```dart
// bloc/task_state.dart
abstract class TaskState extends Equatable {
  @override
  List<Object?> get props => [];
}

class TaskInitial extends TaskState {}

class TaskLoading extends TaskState {}

class TaskLoaded extends TaskState {
  final List<Task> tasks;
  
  TaskLoaded({required this.tasks});
  
  @override
  List<Object?> get props => [tasks];
}

class TaskError extends TaskState {
  final String message;
  
  TaskError({required this.message});
  
  @override
  List<Object?> get props => [message];
}
```

### Étape 3 : Créer le BLoC

Le **BLoC** est le chef d'orchestre qui reçoit les events, utilise le repository, et émet les states.

```dart
// bloc/task_bloc.dart
import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';

class TaskBloc extends Bloc<TaskEvent, TaskState> {
  final TaskRepository _repository;
  StreamSubscription<List<Task>>? _tasksSubscription;
  
  TaskBloc({required TaskRepository repository}) 
      : _repository = repository,
        super(TaskInitial()) {
    
    // Gérer l'event LoadTasks
    on<LoadTasks>(_onLoadTasks);
    
    // Gérer l'event AddTask
    on<AddTask>(_onAddTask);
    
    // Gérer l'event UpdateTask
    on<UpdateTask>(_onUpdateTask);
    
    // Gérer l'event DeleteTask
    on<DeleteTask>(_onDeleteTask);
  }
  
  void _onLoadTasks(LoadTasks event, Emitter<TaskState> emit) async {
    emit(TaskLoading());
    
    try {
      // S'abonner au stream Firebase
      await _tasksSubscription?.cancel();
      _tasksSubscription = _repository.watchTasks().listen(
        (tasks) => add(_TasksUpdated(tasks: tasks)),
        onError: (error) => emit(TaskError(message: error.toString())),
      );
    } catch (e) {
      emit(TaskError(message: 'Erreur lors du chargement des tâches'));
    }
  }
  
  void _onAddTask(AddTask event, Emitter<TaskState> emit) async {
    try {
      final newTask = Task(
        title: event.title,
        description: event.description,
        userId: FirebaseAuth.instance.currentUser!.uid,
      );
      
      await _repository.addTask(newTask);
      // Le stream se met à jour automatiquement !
    } catch (e) {
      emit(TaskError(message: 'Erreur lors de l\'ajout de la tâche'));
    }
  }
  
  void _onUpdateTask(UpdateTask event, Emitter<TaskState> emit) async {
    try {
      await _repository.updateTask(event.taskId, event.updatedTask);
    } catch (e) {
      emit(TaskError(message: 'Erreur lors de la modification'));
    }
  }
  
  void _onDeleteTask(DeleteTask event, Emitter<TaskState> emit) async {
    try {
      await _repository.deleteTask(event.taskId);
    } catch (e) {
      emit(TaskError(message: 'Erreur lors de la suppression'));
    }
  }
  
  @override
  Future<void> close() {
    _tasksSubscription?.cancel();
    return super.close();
  }
}

// Event privé pour les mises à jour du stream
class _TasksUpdated extends TaskEvent {
  final List<Task> tasks;
  
  _TasksUpdated({required this.tasks});
  
  @override
  List<Object?> get props => [tasks];
}
```

### Étape 4 : Interface utilisateur avec BlocBuilder

```dart
// pages/task_page.dart
class TaskPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => TaskBloc(
        repository: RepositoryProvider.of<TaskRepository>(context),
      )..add(LoadTasks()), // Charger les tâches au démarrage
      child: TaskView(),
    );
  }
}

class TaskView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Mes Tâches BLoC')),
      body: BlocBuilder<TaskBloc, TaskState>(
        builder: (context, state) {
          // Gestion des différents états
          if (state is TaskLoading) {
            return Center(child: CircularProgressIndicator());
          }
          
          if (state is TaskError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error, size: 64, color: Colors.red),
                  SizedBox(height: 16),
                  Text(state.message),
                  ElevatedButton(
                    onPressed: () {
                      context.read<TaskBloc>().add(LoadTasks());
                    },
                    child: Text('Réessayer'),
                  ),
                ],
              ),
            );
          }
          
          if (state is TaskLoaded) {
            if (state.tasks.isEmpty) {
              return Center(child: Text('Aucune tâche'));
            }
            
            return ListView.builder(
              itemCount: state.tasks.length,
              itemBuilder: (context, index) {
                final task = state.tasks[index];
                return ListTile(
                  title: Text(task.title),
                  subtitle: Text(task.description),
                  leading: Checkbox(
                    value: task.completed,
                    onChanged: (value) {
                      // Envoyer un event pour modifier la tâche
                      context.read<TaskBloc>().add(
                        UpdateTask(
                          taskId: task.id!,
                          updatedTask: task.copyWith(completed: value),
                        ),
                      );
                    },
                  ),
                  trailing: IconButton(
                    icon: Icon(Icons.delete),
                    onPressed: () {
                      // Envoyer un event pour supprimer
                      context.read<TaskBloc>().add(
                        DeleteTask(taskId: task.id!),
                      );
                    },
                  ),
                );
              },
            );
          }
          
          return Center(child: Text('État non géré'));
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddTaskDialog(context),
        child: Icon(Icons.add),
      ),
    );
  }
  
  void _showAddTaskDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) {
        String title = '';
        String description = '';
        
        return AlertDialog(
          title: Text('Nouvelle tâche'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                onChanged: (value) => title = value,
                decoration: InputDecoration(labelText: 'Titre'),
              ),
              TextField(
                onChanged: (value) => description = value,
                decoration: InputDecoration(labelText: 'Description'),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: Text('Annuler'),
            ),
            ElevatedButton(
              onPressed: () {
                if (title.isNotEmpty) {
                  // Utiliser le BLoC du contexte parent
                  context.read<TaskBloc>().add(
                    AddTask(title: title, description: description),
                  );
                  Navigator.pop(dialogContext);
                }
              },
              child: Text('Ajouter'),
            ),
          ],
        );
      },
    );
  }
}
```

### Étape 5 : Configuration de l'application

```dart
// main.dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiRepositoryProvider(
      providers: [
        RepositoryProvider<TaskRepository>(
          create: (context) => TaskRepository(),
        ),
        // Ajouter d'autres repositories ici
      ],
      child: MaterialApp(
        title: 'Firebase BLoC App',
        home: AuthWrapper(),
      ),
    );
  }
}
```

## 🎯 Avantages de BLoC + Firebase

### ✅ **Séparation claire des responsabilités**
- **Widget** : Affichage uniquement
- **BLoC** : Logique métier
- **Repository** : Accès aux données Firebase

### ✅ **Testabilité parfaite**
```dart
// Test du BLoC sans Firebase
test('should add task when AddTask is called', () {
  final mockRepository = MockTaskRepository();
  final bloc = TaskBloc(repository: mockRepository);
  
  bloc.add(AddTask(title: 'Test', description: 'Test desc'));
  
  verify(mockRepository.addTask(any)).called(1);
});
```

### ✅ **État prévisible**
- Tous les changements passent par des events
- L'état est immutable
- Facile de déboguer

### ✅ **Réutilisabilité**
- Le même BLoC peut être utilisé sur plusieurs écrans
- Le Repository peut être partagé entre plusieurs BLoCs

::: tip Conseil pro
Commencez par maîtriser Firebase seul, puis ajoutez BLoC quand votre application grandit. BLoC brille vraiment dans les applications complexes avec beaucoup de logique métier !
:::


### États de l'application expliqués

| État | Description | Action utilisateur |
|------|-------------|-------------------|
| **Initializing** | Démarrage de Firebase | Splash screen |
| **Checking_Auth** | Vérification session | Indicateur de chargement |
| **Unauthenticated** | Utilisateur non connecté | Écran de connexion |
| **Authenticated** | Utilisateur connecté | Interface principale |
| **Loading_Data** | Chargement des données | Spinner de chargement |
| **Data_Ready** | Données disponibles | Interface complète |
| **Listening** | Écoute temps réel active | Mises à jour automatiques |
| **Offline** | Mode hors ligne | Badge "Hors ligne" |

Cette architecture BLoC + Firebase vous prépare au développement d'applications Flutter professionnelles, robustes et maintenables ! 🚀