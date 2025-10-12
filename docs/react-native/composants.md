# React Native – Composants et mise en page
 
## 🎯 Les composants essentiels expliqués

React Native propose des composants spécialisés pour chaque besoin. Contrairement au web où on peut utiliser n'importe quelle balise HTML, React Native impose des composants spécifiques pour chaque fonction.

### Pourquoi des composants spécialisés ?

**Sur le web :** On peut mettre du texte n'importe où
```html
<div>Du texte directement dans une div</div>
```

**En React Native :** Chaque élément a sa place
```jsx
<View>
  <Text>Le texte DOIT être dans un Text</Text>
</View>
```

Cette contrainte garantit que votre app fonctionne parfaitement sur iOS et Android.

### Vue d'ensemble des composants principaux

| Composant | Usage | Équivalent Web | Pourquoi l'utiliser ? |
|-----------|-------|----------------|----------------------|
| **View** | Container de base | `<div>` | Structure et mise en page |
| **Text** | Affichage de texte | `<p>`, `<span>` | Gestion native du texte |
| **ScrollView** | Zone défilable | `<div>` + overflow | Défilement optimisé |
| **FlatList** | Liste performante | `<ul>` + virtualisation | Performance sur grandes listes |
| **TouchableOpacity** | Bouton tactile | `<button>` | Feedback tactile natif |
| **TextInput** | Saisie de texte | `<input>` | Clavier mobile adapté |

## 📦 View : La boîte magique

### Qu'est-ce qu'un View ?

Le `View` est comme une boîte invisible qui peut contenir d'autres éléments. C'est l'équivalent de `<div>` en HTML, mais optimisé pour mobile.

**Utilisations principales :**
- Regrouper des éléments ensemble
- Créer des sections dans votre interface  
- Appliquer des styles (couleurs, bordures, etc.)
- Gérer la mise en page avec Flexbox

### Exemple simple

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function MaBoite() {
  return (
    <View style={styles.boite}>
      <Text>Je suis dans une boîte !</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  boite: {
    backgroundColor: '#e3f2fd',    // Couleur de fond bleue
    padding: 20,                   // Espace intérieur
    margin: 10,                    // Espace extérieur
    borderRadius: 10,              // Coins arrondis
  },
});
```

### Views imbriquées (boîtes dans des boîtes)

```jsx
<View style={{ backgroundColor: 'lightblue', padding: 20 }}>
  <Text>Boîte parent</Text>
  
  <View style={{ backgroundColor: 'lightgreen', padding: 10, marginTop: 10 }}>
    <Text>Boîte enfant 1</Text>
  </View>
  
  <View style={{ backgroundColor: 'lightyellow', padding: 10, marginTop: 10 }}>
    <Text>Boîte enfant 2</Text>
  </View>
</View>
```

::: tip Concept clé : L'emboîtement
Comme les poupées russes, vous pouvez mettre des Views dans d'autres Views. C'est très utile pour organiser votre interface en sections.
:::

## 📜 ScrollView : Quand le contenu dépasse

### Pourquoi ScrollView ?

Imaginez que vous avez plus de contenu que ce qui peut tenir sur l'écran. Sur mobile, l'utilisateur fait défiler avec son doigt. `ScrollView` rend cela possible automatiquement.

**Quand l'utiliser :**
- Liste d'articles de blog
- Formulaire long
- Galerie d'images
- Menu de navigation

### Exemple de base

```jsx
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

function ListeArticles() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titre}>Articles de blog</Text>
      
      <View style={styles.article}>
        <Text style={styles.articleTitre}>Article 1</Text>
        <Text>Contenu du premier article...</Text>
      </View>
      
      <View style={styles.article}>
        <Text style={styles.articleTitre}>Article 2</Text>
        <Text>Contenu du deuxième article...</Text>
      </View>
      
      {/* ... plus d'articles ... */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  article: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  articleTitre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
```

### ScrollView horizontal (carrousel)

```jsx
<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
  <View style={{ width: 100, height: 100, backgroundColor: 'red', margin: 5 }} />
  <View style={{ width: 100, height: 100, backgroundColor: 'green', margin: 5 }} />
  <View style={{ width: 100, height: 100, backgroundColor: 'blue', margin: 5 }} />
</ScrollView>
```

**Propriétés utiles :**
- `horizontal={true}` : Défilement horizontal au lieu de vertical
- `showsVerticalScrollIndicator={false}` : Masquer la barre de défilement
- `bounces={false}` : Désactiver l'effet de rebond (iOS)

::: warning ScrollView vs FlatList
**ScrollView** = Bon pour peu d'éléments (< 50)  
**FlatList** = Obligatoire pour beaucoup d'éléments (performance)
:::

## 📋 FlatList : Les listes performantes

### Pourquoi FlatList au lieu de ScrollView ?

**Problème avec ScrollView :** Si vous avez 1000 éléments, React Native va créer 1000 composants en mémoire = app qui rame !

**Solution FlatList :** Ne crée que les éléments visibles à l'écran = app fluide !

**Utilisez FlatList quand :**
- Vous avez plus de 50 éléments
- Vous ne connaissez pas le nombre d'éléments à l'avance
- Vous voulez du pull-to-refresh

### Exemple simple : Liste de courses

```jsx
import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';

function ListeCourses() {
  const courses = [
    { id: '1', nom: 'Pommes', quantite: '2 kg' },
    { id: '2', nom: 'Lait', quantite: '1 litre' },
    { id: '3', nom: 'Pain', quantite: '1 baguette' },
    // ... potentiellement des milliers d'items
  ];

  // Comment afficher chaque élément
  const afficherItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.nom}>{item.nom}</Text>
      <Text style={styles.quantite}>{item.quantite}</Text>
    </View>
  );

  return (
    <FlatList
      data={courses}                  // Les données à afficher
      keyExtractor={(item) => item.id} // Clé unique pour chaque élément
      renderItem={afficherItem}        // Comment afficher chaque élément
      style={styles.liste}
    />
  );
}

const styles = StyleSheet.create({
  liste: {
    flex: 1,
    padding: 10,
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nom: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantite: {
    fontSize: 14,
    color: '#666',
  },
});
```

### Les 3 propriétés obligatoires de FlatList

1. **`data`** : Votre tableau de données
2. **`keyExtractor`** : Fonction qui retourne une clé unique pour chaque élément
3. **`renderItem`** : Fonction qui dit comment afficher chaque élément

::: tip Concept clé : La virtualisation
FlatList est "intelligente" : elle ne crée que les éléments visibles. Quand vous faites défiler, elle détruit les éléments qui sortent de l'écran et crée ceux qui entrent.
:::

## 🎯 TouchableOpacity : Les boutons tactiles

### Pourquoi TouchableOpacity ?

En React Native, il n'y a pas de balise `<button>` comme en HTML. Pour créer des éléments cliquables, on utilise `TouchableOpacity`.

**Qu'est-ce qui se passe :**
- L'utilisateur appuie → L'élément devient légèrement transparent
- L'utilisateur relâche → L'élément redevient normal + fonction `onPress` s'exécute

### Exemple simple

```jsx
import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';

function MesBoutons() {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.bouton}
        onPress={() => Alert.alert('Salut !', 'Bouton cliqué')}
      >
        <Text style={styles.texteBouton}>Cliquez-moi !</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.bouton, styles.boutonRouge]}
        onPress={() => console.log('Bouton rouge pressé')}
      >
        <Text style={styles.texteBouton}>Bouton Rouge</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bouton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  boutonRouge: {
    backgroundColor: '#FF3B30',
  },
  texteBouton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

## 📝 TextInput : Saisie de texte

### Pourquoi TextInput ?

`TextInput` est l'équivalent de `<input>` en HTML. Il gère automatiquement le clavier mobile avec toutes ses spécificités.

### Exemple complet

```jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

function FormulaireSimple() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const envoyer = () => {
    console.log('Données:', { nom, email, message });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Formulaire de contact</Text>
      
      <TextInput
        style={styles.input}
        value={nom}
        onChangeText={setNom}
        placeholder="Votre nom"
        autoCapitalize="words"              // Première lettre en majuscule
      />
      
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Votre email"
        keyboardType="email-address"        // Clavier email
        autoCapitalize="none"               // Pas de majuscules
      />
      
      <TextInput
        style={[styles.input, styles.inputMultiligne]}
        value={message}
        onChangeText={setMessage}
        placeholder="Votre message"
        multiline={true}                    // Plusieurs lignes
        numberOfLines={4}
      />
      
      <TouchableOpacity style={styles.bouton} onPress={envoyer}>
        <Text style={styles.texteBouton}>Envoyer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  inputMultiligne: {
    height: 100,
    textAlignVertical: 'top',  // Android uniquement
  },
  bouton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  texteBouton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

## 🖼️ Image : Afficher des images

### Types d'images

React Native peut afficher 2 types d'images :
1. **Images locales** : Dans votre projet (logo, icônes)
2. **Images réseau** : Depuis internet (photos utilisateur, etc.)

### Exemple simple

```jsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

function MesImages() {
  return (
    <View style={styles.container}>
      {/* Image locale */}
      <Image 
        source={require('../assets/logo.png')} 
        style={styles.logo}
      />
      
      {/* Image depuis internet */}
      <Image 
        source={{ uri: 'https://picsum.photos/200/150' }}
        style={styles.photoReseau}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  photoReseau: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
});
```

::: warning Taille obligatoire
Contrairement au web, les images en React Native DOIVENT avoir une largeur et hauteur définies dans les styles !
:::

## 🎉 Résumé des composants essentiels

### Ce que vous devez retenir

| Composant | Usage principal | Règle importante |
|-----------|----------------|------------------|
| **View** | Container, mise en page | Comme `<div>` mais pour mobile |
| **Text** | Afficher du texte | TOUT texte doit être dedans |
| **ScrollView** | Contenu défilable | Max 50 éléments |
| **FlatList** | Listes performantes | Pour > 50 éléments |
| **TouchableOpacity** | Boutons, éléments cliquables | Feedback visuel automatique |
| **TextInput** | Saisie utilisateur | Clavier mobile adapté |
| **Image** | Photos, icônes | Taille obligatoire |
