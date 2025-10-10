# Flutter – Widgets et mise en page
 
## 🎨 Widgets de mise en page

Flutter utilise un système de widgets pour construire l'interface utilisateur. Tout est widget ! Les widgets de mise en page permettent d'organiser et de positionner les autres widgets à l'écran.

### Row et Column - Organisation linéaire

**Concept clé** : `Row` arrange les widgets horizontalement, `Column` verticalement.

```dart
// Arrangement horizontal avec Row
Row(
  children: [
    Container(color: Colors.red, width: 50, height: 50),
    Container(color: Colors.green, width: 50, height: 50),
    Container(color: Colors.blue, width: 50, height: 50),
  ],
)

// Arrangement vertical avec Column
Column(
  children: [
    Text('Premier élément'),
    Text('Deuxième élément'), 
    Text('Troisième élément'),
  ],
)
```

**Propriétés d'alignement importantes** :

- `mainAxisAlignment` : alignement sur l'axe principal (horizontal pour Row, vertical pour Column)
- `crossAxisAlignment` : alignement sur l'axe secondaire (vertical pour Row, horizontal pour Column)

```dart
// Exemples d'alignement
Row(
  mainAxisAlignment: MainAxisAlignment.spaceEvenly, // répartit l'espace
  children: [...],
)

Column(
  crossAxisAlignment: CrossAxisAlignment.start, // aligne à gauche
  children: [...],
)
```

### Expanded et Flexible - Gestion de l'espace

**Concept clé** : Ces widgets permettent de contrôler comment les enfants occupent l'espace disponible dans un Row ou Column.

```dart
// Expanded : force l'occupation de tout l'espace disponible
Row(
  children: [
    Container(width: 100, height: 50, color: Colors.red), // taille fixe
    Expanded(
      child: Container(height: 50, color: Colors.green), // prend tout l'espace restant
    ),
  ],
)

// Flexible : permet au widget de choisir sa taille
Row(
  children: [
    Container(width: 100, height: 50, color: Colors.red),
    Flexible(
      child: Container(height: 50, color: Colors.blue), // peut être plus petit
    ),
  ],
)

// Utilisation du paramètre flex pour contrôler les proportions
Row(
  children: [
    Expanded(flex: 1, child: Container(height: 50, color: Colors.red)),   // 1/3
    Expanded(flex: 2, child: Container(height: 50, color: Colors.green)), // 2/3
  ],
)
```

::: info Différence Expanded vs Flexible
- **Expanded** : Force le widget à occuper tout l'espace disponible (comme `flex: 1` en CSS)
- **Flexible** : Permet au widget de choisir sa taille dans la limite de l'espace disponible
:::

### Stack - Superposition de widgets

**Concept clé** : `Stack` permet de placer des widgets les uns au-dessus des autres, comme des calques.

```dart
Stack(
  children: [
    // Widget de base (arrière-plan)
    Container(
      width: 200,
      height: 200,
      color: Colors.blue,
    ),
    
    // Widget positionné
    Positioned(
      top: 20,
      right: 20,
      child: Icon(Icons.favorite, color: Colors.white),
    ),
    
    // Widget centré
    Center(
      child: Text('Texte centré', style: TextStyle(color: Colors.white)),
    ),
  ],
)
```

**Le widget `Positioned`** permet de placer précisément un élément dans le Stack :
- `top`, `bottom`, `left`, `right` : distances depuis les bords
- Si non spécifié, le widget suit le comportement normal du Stack

## 📋 Listes et défilement

### ListView - Affichage de listes

**Concept clé** : `ListView` permet d'afficher une liste d'éléments qui peut défiler si elle dépasse la taille de l'écran.

```dart
// Liste simple avec des éléments fixes
ListView(
  children: [
    ListTile(title: Text('Élément 1')),
    ListTile(title: Text('Élément 2')),
    ListTile(title: Text('Élément 3')),
  ],
)

// Liste dynamique avec ListView.builder (recommandé pour les grandes listes)
ListView.builder(
  itemCount: 100, // nombre d'éléments
  itemBuilder: (context, index) {
    return ListTile(
      leading: Icon(Icons.person),
      title: Text('Élément $index'),
      onTap: () => print('Cliqué sur élément $index'),
    );
  },
)
```

**Pourquoi utiliser ListView.builder ?**
- **Performance** : ne crée que les widgets visibles à l'écran
- **Mémoire** : économise la mémoire pour les grandes listes
- **Fluidité** : défilement plus fluide

### GridView - Affichage en grille

**Concept clé** : `GridView` organise les éléments en grille (lignes et colonnes).

```dart
GridView.count(
  crossAxisCount: 2, // nombre de colonnes
  children: [
    Container(color: Colors.red, child: Center(child: Text('1'))),
    Container(color: Colors.green, child: Center(child: Text('2'))),
    Container(color: Colors.blue, child: Center(child: Text('3'))),
    Container(color: Colors.orange, child: Center(child: Text('4'))),
  ],
)

// Grille dynamique
GridView.builder(
  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 3,
    crossAxisSpacing: 4, // espacement horizontal
    mainAxisSpacing: 4,  // espacement vertical
  ),
  itemCount: 20,
  itemBuilder: (context, index) {
    return Card(
      child: Center(child: Text('Item $index')),
    );
  },
)
```

## 🧭 Navigation entre écrans

La navigation permet de passer d'un écran à un autre dans votre application. Flutter utilise un système de pile (stack) pour gérer les écrans.

### Navigation de base

**Concept clé** : Flutter utilise un `Navigator` qui gère une pile d'écrans (routes).

```dart
// Aller vers un nouvel écran
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => DetailScreen()),
);

// Revenir à l'écran précédent
Navigator.pop(context);

// Remplacer l'écran actuel
Navigator.pushReplacement(
  context,
  MaterialPageRoute(builder: (context) => HomeScreen()),
);
```

### Passage de données entre écrans

**Scénario** : Envoyer des informations d'un écran vers un autre.

```dart
// Écran source : envoie des données
class ListScreen extends StatelessWidget {
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView.builder(
        itemCount: 10,
        itemBuilder: (context, index) {
          return ListTile(
            title: Text('Item $index'),
            onTap: () {
              // Navigue vers le détail en passant des données
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => DetailScreen(
                    title: 'Item $index',
                    description: 'Détails de l\'item $index',
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

// Écran destination : reçoit des données
class DetailScreen extends StatelessWidget {
  final String title;
  final String description;
  
  DetailScreen({required this.title, required this.description});
  
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Column(
        children: [
          Text(title, style: TextStyle(fontSize: 24)),
          Text(description),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Retour'),
          ),
        ],
      ),
    );
  }
}
```

### Retour avec résultat

**Concept** : Un écran peut renvoyer des données à l'écran précédent.

```dart
// Écran qui attend un résultat
ElevatedButton(
  onPressed: () async {
    final result = await Navigator.push<String>(
      context,
      MaterialPageRoute(builder: (context) => SelectionScreen()),
    );
    
    if (result != null) {
      print('Résultat reçu: $result');
    }
  },
  child: Text('Faire une sélection'),
)

// Écran qui renvoie un résultat
class SelectionScreen extends StatelessWidget {
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          ElevatedButton(
            onPressed: () => Navigator.pop(context, 'Option A'),
            child: Text('Choisir A'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, 'Option B'),
            child: Text('Choisir B'),
          ),
        ],
      ),
    );
  }
}
```

## 📝 Exercice pratique : Application simple

Créons une petite application qui utilise tous les concepts vus précédemment.

**Objectif** : Créer une application avec une liste de tâches et un écran de détail.

### Étape 1 : Structure de données

```dart
class Task {
  final String title;
  final String description;
  final bool isCompleted;
  
  Task({
    required this.title, 
    required this.description, 
    this.isCompleted = false
  });
}
```

### Étape 2 : Écran principal (liste des tâches)

```dart
class TaskListScreen extends StatelessWidget {
  final List<Task> tasks = [
    Task(title: 'Faire les courses', description: 'Acheter du pain et du lait'),
    Task(title: 'Appeler le médecin', description: 'Prendre rendez-vous'),
    Task(title: 'Finir le projet', description: 'Terminer la présentation', isCompleted: true),
  ];

  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Mes Tâches')),
      body: ListView.builder(
        itemCount: tasks.length,
        itemBuilder: (context, index) {
          final task = tasks[index];
          return Card(
            margin: EdgeInsets.all(8),
            child: ListTile(
              leading: Icon(
                task.isCompleted ? Icons.check_circle : Icons.circle_outlined,
                color: task.isCompleted ? Colors.green : Colors.grey,
              ),
              title: Text(
                task.title,
                style: TextStyle(
                  decoration: task.isCompleted 
                    ? TextDecoration.lineThrough 
                    : null,
                ),
              ),
              subtitle: Text(task.description),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => TaskDetailScreen(task: task),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
```

### Étape 3 : Écran de détail

```dart
class TaskDetailScreen extends StatelessWidget {
  final Task task;
  
  TaskDetailScreen({required this.task});

  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Détail de la tâche')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Statut
            Row(
              children: [
                Icon(
                  task.isCompleted ? Icons.check_circle : Icons.circle_outlined,
                  color: task.isCompleted ? Colors.green : Colors.grey,
                  size: 32,
                ),
                SizedBox(width: 12),
                Text(
                  task.isCompleted ? 'Terminée' : 'En cours',
                  style: TextStyle(fontSize: 18),
                ),
              ],
            ),
            
            SizedBox(height: 24),
            
            // Titre
            Text('Titre:', style: TextStyle(fontWeight: FontWeight.bold)),
            Text(task.title, style: TextStyle(fontSize: 20)),
            
            SizedBox(height: 16),
            
            // Description
            Text('Description:', style: TextStyle(fontWeight: FontWeight.bold)),
            Text(task.description),
            
            Spacer(),
            
            // Bouton retour
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: Text('Retour'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

### Concepts utilisés dans cet exercice

1. **Widgets de mise en page** : `Column`, `Row`, `Padding`
2. **Listes** : `ListView.builder` pour afficher les tâches
3. **Navigation** : `Navigator.push` et `Navigator.pop`
4. **Passage de données** : Transmission de l'objet `Task` entre écrans
5. **Widgets d'interface** : `Card`, `ListTile`, `Icon`, `Text`

::: tip Points clés à retenir
- **Séparez la logique et l'interface** : utilisez des classes pour vos données
- **ListView.builder** : toujours préférable pour les listes dynamiques
- **Navigation** : pensez au passage de données et au retour
- **Widgets réutilisables** : organisez votre code en petits widgets
:::

## 🎯 Résumé

Dans ce chapitre, vous avez appris :

- **Mise en page** : `Row`, `Column`, `Stack` pour organiser les widgets
- **Gestion d'espace** : `Expanded` et `Flexible` pour contrôler les tailles
- **Listes** : `ListView` et `GridView` pour afficher des collections
- **Navigation** : Comment passer d'un écran à un autre et échanger des données

Ces concepts forment la base de toute interface Flutter. Maîtrisez-les bien avant de passer aux concepts plus avancés comme la [gestion de l'état](./state-management.md).