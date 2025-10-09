# Flutter – Widgets et mise en page
 
## 🎨 Widgets de mise en page

Flutter propose une large gamme de widgets pour organiser l'interface utilisateur. Maîtriser ces widgets est essentiel pour créer des interfaces élégantes et responsives.

### Row et Column - Organisation linéaire

Les widgets `Row` et `Column` sont les fondations de la mise en page Flutter. Ils organisent leurs enfants respectivement horizontalement et verticalement.

```dart
class ExempleRowColumn extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Row et Column')),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Exemple de Row:', style: Theme.of(context).textTheme.titleLarge),
            SizedBox(height: 8),
            
            // Row avec alignement
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Container(
                  width: 60,
                  height: 60,
                  color: Colors.red,
                  child: Icon(Icons.home, color: Colors.white),
                ),
                Container(
                  width: 60,
                  height: 60,
                  color: Colors.green,
                  child: Icon(Icons.star, color: Colors.white),
                ),
                Container(
                  width: 60,
                  height: 60,
                  color: Colors.blue,
                  child: Icon(Icons.favorite, color: Colors.white),
                ),
              ],
            ),
            
            SizedBox(height: 32),
            
            Text('Exemple de Column:', style: Theme.of(context).textTheme.titleLarge),
            SizedBox(height: 8),
            
            // Column avec différents alignements
            Container(
              width: double.infinity,
              height: 200,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container(
                    width: 100,
                    height: 30,
                    color: Colors.orange,
                    child: Center(child: Text('Item 1')),
                  ),
                  Container(
                    width: 150,
                    height: 30,
                    color: Colors.purple,
                    child: Center(child: Text('Item 2')),
                  ),
                  Container(
                    width: 80,
                    height: 30,
                    color: Colors.teal,
                    child: Center(child: Text('Item 3')),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

### Alignement et propriétés importantes

```dart
// MainAxisAlignment - axe principal
Row(
  mainAxisAlignment: MainAxisAlignment.start,        // début
  mainAxisAlignment: MainAxisAlignment.end,          // fin
  mainAxisAlignment: MainAxisAlignment.center,       // centre
  mainAxisAlignment: MainAxisAlignment.spaceBetween, // espacement entre
  mainAxisAlignment: MainAxisAlignment.spaceAround,  // espacement autour
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,  // espacement uniforme
  children: [...],
)

// CrossAxisAlignment - axe secondaire
Column(
  crossAxisAlignment: CrossAxisAlignment.start,    // début
  crossAxisAlignment: CrossAxisAlignment.end,      // fin
  crossAxisAlignment: CrossAxisAlignment.center,   // centre
  crossAxisAlignment: CrossAxisAlignment.stretch,  // étirement
  children: [...],
)
```

### Expanded et Flexible - Gestion de l'espace

```dart
class ExempleExpandedFlexible extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Expanded et Flexible')),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Exemple avec Expanded
            Text('Avec Expanded:', style: Theme.of(context).textTheme.titleMedium),
            Container(
              height: 60,
              child: Row(
                children: [
                  Container(
                    width: 100,
                    color: Colors.red,
                    child: Center(child: Text('Fixe', style: TextStyle(color: Colors.white))),
                  ),
                  Expanded(
                    flex: 2, // Prend 2/3 de l'espace restant
                    child: Container(
                      color: Colors.green,
                      child: Center(child: Text('Expanded x2', style: TextStyle(color: Colors.white))),
                    ),
                  ),
                  Expanded(
                    flex: 1, // Prend 1/3 de l'espace restant
                    child: Container(
                      color: Colors.blue,
                      child: Center(child: Text('Expanded x1', style: TextStyle(color: Colors.white))),
                    ),
                  ),
                ],
              ),
            ),
            
            SizedBox(height: 32),
            
            // Exemple avec Flexible
            Text('Avec Flexible:', style: Theme.of(context).textTheme.titleMedium),
            Container(
              height: 60,
              child: Row(
                children: [
                  Container(
                    width: 100,
                    color: Colors.red,
                    child: Center(child: Text('Fixe', style: TextStyle(color: Colors.white))),
                  ),
                  Flexible(
                    flex: 2,
                    child: Container(
                      color: Colors.orange,
                      child: Center(child: Text('Flexible x2', style: TextStyle(color: Colors.white))),
                    ),
                  ),
                  Flexible(
                    flex: 1,
                    child: Container(
                      color: Colors.purple,
                      child: Center(child: Text('Flexible x1', style: TextStyle(color: Colors.white))),
                    ),
                  ),
                ],
              ),
            ),
            
            SizedBox(height: 16),
            
            // Comparaison pratique
            Container(
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'Différence: Expanded force l\'utilisation de tout l\'espace disponible, '
                'Flexible permet au widget de choisir sa taille.',
                style: TextStyle(fontStyle: FontStyle.italic),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

::: info Expanded vs Flexible
- **Expanded** : Force le widget à occuper tout l'espace disponible
- **Flexible** : Permet au widget de choisir sa taille dans la limite de l'espace disponible
:::

### Stack - Superposition de widgets

Le widget `Stack` permet de superposer des widgets les uns sur les autres :

```dart
class ExempleStack extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Stack et Positioned')),
      body: Center(
        child: Container(
          width: 300,
          height: 300,
          child: Stack(
            children: [
              // Arrière-plan
              Container(
                width: 300,
                height: 300,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.blue.shade300, Colors.blue.shade600],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
              ),
              
              // Widget positionné en haut à droite
              Positioned(
                top: 10,
                right: 10,
                child: Container(
                  padding: EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Icon(Icons.favorite, color: Colors.red),
                ),
              ),
              
              // Widget positionné en bas à gauche
              Positioned(
                bottom: 20,
                left: 20,
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.black54,
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: Text(
                    'Superposition',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              
              // Widget centré
              Center(
                child: Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black26,
                        blurRadius: 10,
                        offset: Offset(0, 5),
                      ),
                    ],
                  ),
                  child: Icon(Icons.play_arrow, size: 50, color: Colors.blue),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

## 📋 Listes et builders

### ListView - Listes défilables

```dart
class ExempleListes extends StatelessWidget {
  final List<String> items = List.generate(50, (index) => 'Item ${index + 1}');
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Listes défilables')),
      body: Column(
        children: [
          // Liste simple avec ListView.builder (recommandé pour de grandes listes)
          Expanded(
            child: ListView.builder(
              itemCount: items.length,
              itemBuilder: (context, index) {
                return Card(
                  margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: Colors.blue,
                      child: Text('${index + 1}'),
                    ),
                    title: Text(items[index]),
                    subtitle: Text('Description de l\'item ${index + 1}'),
                    trailing: Icon(Icons.arrow_forward_ios),
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Cliqué sur ${items[index]}')),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
```

### ListView avec différents types de contenu

```dart
class ExempleListeAvancee extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Liste avancée')),
      body: ListView(
        padding: EdgeInsets.all(16),
        children: [
          // En-tête
          Container(
            padding: EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.purple, Colors.blue],
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              'Bienvenue !',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          
          SizedBox(height: 20),
          
          // Section avec titre
          Text(
            'Actions rapides',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          SizedBox(height: 12),
          
          // Grille d'actions
          GridView.count(
            shrinkWrap: true, // Important pour inclusion dans ListView
            physics: NeverScrollableScrollPhysics(), // Désactive le scroll de la grille
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.5,
            children: [
              _buildActionCard('Profil', Icons.person, Colors.blue),
              _buildActionCard('Paramètres', Icons.settings, Colors.green),
              _buildActionCard('Messages', Icons.message, Colors.orange),
              _buildActionCard('Aide', Icons.help, Colors.purple),
            ],
          ),
          
          SizedBox(height: 32),
          
          // Liste de notifications
          Text(
            'Notifications récentes',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          SizedBox(height: 12),
          
          ...List.generate(5, (index) => _buildNotificationItem(index)),
        ],
      ),
    );
  }
  
  Widget _buildActionCard(String title, IconData icon, Color color) {
    return Card(
      elevation: 3,
      child: InkWell(
        onTap: () => print('Action: $title'),
        borderRadius: BorderRadius.circular(12),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 32, color: color),
              SizedBox(height: 8),
              Text(
                title,
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
            ],
          ),
        ),
      ),
    );
  }
  
  Widget _buildNotificationItem(int index) {
    return Card(
      margin: EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: Colors.blue.shade100,
            shape: BoxShape.circle,
          ),
          child: Icon(Icons.notifications, color: Colors.blue),
        ),
        title: Text('Notification ${index + 1}'),
        subtitle: Text('Description de la notification ${index + 1}'),
        trailing: Text(
          '${index + 1}h',
          style: TextStyle(color: Colors.grey, fontSize: 12),
        ),
      ),
    );
  }
}
```

### GridView - Grilles

```dart
class ExempleGridView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('GridView')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Galerie photos',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            SizedBox(height: 16),
            
            Expanded(
              child: GridView.builder(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,           // Nombre de colonnes
                  crossAxisSpacing: 12,        // Espacement horizontal
                  mainAxisSpacing: 12,         // Espacement vertical
                  childAspectRatio: 1,         // Ratio largeur/hauteur
                ),
                itemCount: 20,
                itemBuilder: (context, index) {
                  return _buildPhotoCard(index);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildPhotoCard(int index) {
    return Card(
      elevation: 3,
      clipBehavior: Clip.antiAlias,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Image de placeholder
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Colors.primaries[index % Colors.primaries.length].shade300,
                  Colors.primaries[index % Colors.primaries.length].shade600,
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Icon(
              Icons.image,
              size: 40,
              color: Colors.white70,
            ),
          ),
          
          // Overlay avec informations
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: EdgeInsets.all(8),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.transparent, Colors.black54],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
              child: Text(
                'Photo ${index + 1}',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
          ),
          
          // Bouton d'action
          Positioned(
            top: 4,
            right: 4,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              child: IconButton(
                icon: Icon(Icons.favorite_border, size: 16),
                onPressed: () => print('Favoris photo ${index + 1}'),
                padding: EdgeInsets.all(4),
                constraints: BoxConstraints(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
```

## 🧭 Navigation

La navigation est un aspect crucial des applications mobiles. Flutter offre plusieurs méthodes pour naviguer entre les écrans.

### Navigation de base

```dart
// Navigation vers un nouvel écran
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => DetailScreen()),
);

// Retour à l'écran précédent
Navigator.pop(context);

// Remplacer l'écran actuel
Navigator.pushReplacement(
  context,
  MaterialPageRoute(builder: (context) => HomeScreen()),
);

// Navigation avec suppression de l'historique
Navigator.pushAndRemoveUntil(
  context,
  MaterialPageRoute(builder: (context) => LoginScreen()),
  (route) => false, // Supprime tous les écrans précédents
);
```

### Exemple complet de navigation

```dart
class NavigationApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Navigation Demo',
      home: EcranAccueil(),
    );
  }
}

class EcranAccueil extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Accueil'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.home, size: 80, color: Colors.blue),
            SizedBox(height: 32),
            
            Text(
              'Écran d\'accueil',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            SizedBox(height: 32),
            
            ElevatedButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => EcranDetail(
                      titre: 'Détail depuis Accueil',
                      message: 'Vous venez de l\'écran d\'accueil',
                    ),
                  ),
                );
              },
              icon: Icon(Icons.arrow_forward),
              label: Text('Aller aux détails'),
            ),
            
            SizedBox(height: 16),
            
            OutlinedButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => EcranListe()),
                );
              },
              icon: Icon(Icons.list),
              label: Text('Voir la liste'),
            ),
          ],
        ),
      ),
    );
  }
}

class EcranDetail extends StatelessWidget {
  final String titre;
  final String message;
  
  const EcranDetail({
    Key? key,
    required this.titre,
    required this.message,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(titre),
      ),
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.info, size: 48, color: Colors.blue),
                    SizedBox(height: 16),
                    Text(
                      'Informations',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    SizedBox(height: 8),
                    Text(message),
                  ],
                ),
              ),
            ),
            
            SizedBox(height: 32),
            
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => Navigator.pop(context),
                    icon: Icon(Icons.arrow_back),
                    label: Text('Retour'),
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (context) => EcranAccueil()),
                      );
                    },
                    icon: Icon(Icons.home),
                    label: Text('Accueil'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class EcranListe extends StatelessWidget {
  final List<String> items = List.generate(20, (index) => 'Élément ${index + 1}');
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Liste'),
        actions: [
          IconButton(
            icon: Icon(Icons.home),
            onPressed: () {
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (context) => EcranAccueil()),
                (route) => false,
              );
            },
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: items.length,
        itemBuilder: (context, index) {
          return ListTile(
            leading: CircleAvatar(
              child: Text('${index + 1}'),
            ),
            title: Text(items[index]),
            subtitle: Text('Appuyez pour voir les détails'),
            trailing: Icon(Icons.arrow_forward_ios),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => EcranDetail(
                    titre: items[index],
                    message: 'Détails de ${items[index]} sélectionné depuis la liste.',
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
```

### Passage de données entre écrans

```dart
// Passage de données à l'écran suivant
class DonneesProfil {
  final String nom;
  final String email;
  final int age;
  
  DonneesProfil({required this.nom, required this.email, required this.age});
}

// Écran source
ElevatedButton(
  onPressed: () async {
    final resultat = await Navigator.push<String>(
      context,
      MaterialPageRoute(
        builder: (context) => EcranProfil(
          profil: DonneesProfil(
            nom: 'Alice Dupont',
            email: 'alice@example.com',
            age: 28,
          ),
        ),
      ),
    );
    
    if (resultat != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Retour: $resultat')),
      );
    }
  },
  child: Text('Voir le profil'),
)

// Écran destination
class EcranProfil extends StatelessWidget {
  final DonneesProfil profil;
  
  const EcranProfil({Key? key, required this.profil}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Profil')),
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            Text('Nom: ${profil.nom}'),
            Text('Email: ${profil.email}'),
            Text('Âge: ${profil.age}'),
            
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context, 'Profil consulté avec succès');
              },
              child: Text('Retour avec message'),
            ),
          ],
        ),
      ),
    );
  }
}
```

## 🎯 Exercice pratique : Mini-formulaire

Créons un exercice complet qui combine tous les concepts vus :

```dart
class FormulaireApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Formulaire Demo',
      theme: ThemeData(
        primarySwatch: Colors.teal,
        useMaterial3: true,
      ),
      home: EcranFormulaire(),
    );
  }
}

class EcranFormulaire extends StatefulWidget {
  @override
  _EcranFormulaireState createState() => _EcranFormulaireState();
}

class _EcranFormulaireState extends State<EcranFormulaire> {
  final _formKey = GlobalKey<FormState>();
  final _nomController = TextEditingController();
  final _emailController = TextEditingController();
  
  String _selectedCategory = 'Personnel';
  bool _accepteConditions = false;
  double _satisfaction = 5.0;
  
  final List<String> categories = ['Personnel', 'Professionnel', 'Autre'];
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Formulaire de contact'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: EdgeInsets.all(20),
          children: [
            // En-tête
            Container(
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.teal.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.teal.shade200),
              ),
              child: Column(
                children: [
                  Icon(Icons.contact_mail, size: 48, color: Colors.teal),
                  SizedBox(height: 16),
                  Text(
                    'Contactez-nous',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  Text(
                    'Remplissez le formulaire ci-dessous',
                    style: TextStyle(color: Colors.teal.shade700),
                  ),
                ],
              ),
            ),
            
            SizedBox(height: 32),
            
            // Champ nom
            TextFormField(
              controller: _nomController,
              decoration: InputDecoration(
                labelText: 'Nom complet *',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.person),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Veuillez saisir votre nom';
                }
                if (value.length < 2) {
                  return 'Le nom doit contenir au moins 2 caractères';
                }
                return null;
              },
            ),
            
            SizedBox(height: 20),
            
            // Champ email
            TextFormField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: InputDecoration(
                labelText: 'Email *',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.email),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Veuillez saisir votre email';
                }
                if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
                  return 'Format d\'email invalide';
                }
                return null;
              },
            ),
            
            SizedBox(height: 20),
            
            // Dropdown catégorie
            DropdownButtonFormField<String>(
              value: _selectedCategory,
              decoration: InputDecoration(
                labelText: 'Catégorie',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.category),
              ),
              items: categories.map((String category) {
                return DropdownMenuItem(
                  value: category,
                  child: Text(category),
                );
              }).toList(),
              onChanged: (String? newValue) {
                setState(() {
                  _selectedCategory = newValue!;
                });
              },
            ),
            
            SizedBox(height: 20),
            
            // Slider satisfaction
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Niveau de satisfaction: ${_satisfaction.round()}/10',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    Slider(
                      value: _satisfaction,
                      min: 0,
                      max: 10,
                      divisions: 10,
                      label: _satisfaction.round().toString(),
                      onChanged: (value) {
                        setState(() {
                          _satisfaction = value;
                        });
                      },
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Pas satisfait', style: TextStyle(fontSize: 12)),
                        Text('Très satisfait', style: TextStyle(fontSize: 12)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            
            SizedBox(height: 20),
            
            // Checkbox conditions
            CheckboxListTile(
              title: Text('J\'accepte les conditions d\'utilisation'),
              value: _accepteConditions,
              onChanged: (value) {
                setState(() {
                  _accepteConditions = value!;
                });
              },
              controlAffinity: ListTileControlAffinity.leading,
            ),
            
            SizedBox(height: 32),
            
            // Boutons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _resetForm,
                    icon: Icon(Icons.refresh),
                    label: Text('Réinitialiser'),
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _accepteConditions ? _submitForm : null,
                    icon: Icon(Icons.send),
                    label: Text('Envoyer'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
  
  void _resetForm() {
    setState(() {
      _nomController.clear();
      _emailController.clear();
      _selectedCategory = 'Personnel';
      _accepteConditions = false;
      _satisfaction = 5.0;
    });
    _formKey.currentState?.reset();
  }
  
  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      // Créer l'objet de données
      final donnees = {
        'nom': _nomController.text,
        'email': _emailController.text,
        'categorie': _selectedCategory,
        'satisfaction': _satisfaction.round(),
        'conditions': _accepteConditions,
      };
      
      // Navigation vers l'écran de confirmation
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => EcranConfirmation(donnees: donnees),
        ),
      );
    }
  }
  
  @override
  void dispose() {
    _nomController.dispose();
    _emailController.dispose();
    super.dispose();
  }
}

class EcranConfirmation extends StatelessWidget {
  final Map<String, dynamic> donnees;
  
  const EcranConfirmation({Key? key, required this.donnees}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Confirmation'),
        backgroundColor: Colors.green.shade100,
      ),
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            Container(
              width: double.infinity,
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.green.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.green.shade200),
              ),
              child: Column(
                children: [
                  Icon(Icons.check_circle, size: 64, color: Colors.green),
                  SizedBox(height: 16),
                  Text(
                    'Formulaire envoyé !',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: Colors.green.shade800,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Merci pour votre message',
                    style: TextStyle(color: Colors.green.shade700),
                  ),
                ],
              ),
            ),
            
            SizedBox(height: 32),
            
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Récapitulatif',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    Divider(),
                    _buildInfoRow('Nom', donnees['nom']),
                    _buildInfoRow('Email', donnees['email']),
                    _buildInfoRow('Catégorie', donnees['categorie']),
                    _buildInfoRow('Satisfaction', '${donnees['satisfaction']}/10'),
                    _buildInfoRow('Conditions', donnees['conditions'] ? 'Acceptées' : 'Non acceptées'),
                  ],
                ),
              ),
            ),
            
            Spacer(),
            
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.of(context).popUntil((route) => route.isFirst);
                },
                icon: Icon(Icons.home),
                label: Text('Retour à l\'accueil'),
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: TextStyle(fontWeight: FontWeight.w600),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
```

::: tip Bonnes pratiques
- Utilisez `ListView` pour éviter les débordements sur petits écrans
- Validez toujours les formulaires côté client ET serveur
- Libérez les `TextEditingController` dans `dispose()`
- Organisez votre code en widgets réutilisables
:::

Dans la section suivante, nous explorerons la [gestion de l'état](./state-management.md), un concept fondamental pour créer des applications Flutter réactives et maintenir les données de votre application.