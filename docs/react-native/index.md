# React Native – Introduction et bases
 
## 🎯 Qu'est-ce que React Native ?

React Native est un framework développé par Meta (Facebook) qui permet de créer des applications mobiles **natives** pour iOS et Android en utilisant React et JavaScript.

### Le principe fondamental

Contrairement aux solutions hybrides qui utilisent une WebView, React Native **traduit** vos composants JavaScript en composants natifs réels. C'est comme avoir un traducteur entre votre code JavaScript et le langage natif de chaque plateforme.

**Exemple concret :** 
- Vous écrivez `<Text>Hello</Text>` en JavaScript
- Sur iOS → devient un `UILabel` natif
- Sur Android → devient un `TextView` natif

### React vs React Native : Les différences clés

| Concept | React Web | React Native | Explication |
|---------|-----------|--------------|-------------|
| **Conteneurs** | `<div>` | `<View>` | Les boîtes qui contiennent d'autres éléments |
| **Texte** | `<p>`, `<span>` | `<Text>` | Tout texte DOIT être dans `<Text>` |
| **Boutons** | `<button>` | `<TouchableOpacity>` | Éléments cliquables |
| **Styles** | CSS fichier .css | StyleSheet JavaScript | Styles définis dans le même fichier |
| **Images** | `<img>` | `<Image>` | Affichage d'images |

### Pourquoi choisir React Native ?

1. **Un code, deux plateformes** : Écrivez une fois, déployez partout
2. **Performance native** : Pas de WebView lente, vrais composants mobiles
3. **Développement rapide** : Hot Reload pour voir les changements instantanément
4. **Écosystème JavaScript** : Réutilisez vos connaissances web
5. **Communauté active** : Nombreuses librairies disponibles

::: info Concept clé : Le "Bridge"
React Native utilise un "pont" (bridge) pour faire communiquer votre code JavaScript avec le code natif de la plateforme. C'est ce qui permet la performance native.
:::

## 🛠️ Installation et premier projet

### Les deux approches : Expo vs React Native CLI

**Expo** est comme un "WordPress" pour React Native : simple mais avec des limitations.
**React Native CLI** est comme coder "from scratch" : plus complexe mais plus de liberté.

| Critère | Expo | React Native CLI |
|---------|------|------------------|
| **Facilité** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Setup** | Très rapide | Nécessite Android Studio/Xcode |
| **APIs natives** | Limitées aux APIs Expo | Accès complet |
| **Taille app** | Plus lourde | Plus légère |
| **Pour débuter** | ✅ Parfait | ❌ Complexe |

### Installation Expo (recommandée pour apprendre)

```bash
# 1. Installer Expo CLI
npm install -g @expo/cli

# 2. Créer un projet
npx create-expo-app MonPremierProjet

# 3. Lancer le projet
cd MonPremierProjet
npx expo start
```

**Qu'est-ce qui se passe ?**
1. Expo CLI installe les outils nécessaires
2. Un projet avec l'architecture de base est créé
3. Un serveur de développement se lance avec un QR code
4. Scannez le QR code avec l'app Expo Go sur votre téléphone

::: tip Conseil pédagogique
Commencez TOUJOURS avec Expo pour apprendre les concepts. Vous pourrez "éjecter" vers React Native CLI plus tard si nécessaire.
:::

## 📱 Votre première application React Native

### Structure d'un projet simple

```
MonPremierProjet/
├── App.js              # ← Point d'entrée principal
├── package.json        # Dépendances et scripts
├── app.json           # Configuration Expo
└── assets/            # Images, icônes, etc.
```

### Le fichier App.js expliqué

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bonjour React Native !</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                    // Prend tout l'espace disponible
    justifyContent: 'center',   // Centre verticalement
    alignItems: 'center',       // Centre horizontalement
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
```

**Explication ligne par ligne :**

1. **Import** : On importe les composants React Native nécessaires
2. **View** : C'est comme une `<div>` en HTML, un conteneur
3. **Text** : OBLIGATOIRE pour afficher du texte (pas comme en HTML)
4. **StyleSheet** : Système de styles de React Native
5. **flex: 1** : "Prends tout l'espace disponible"
6. **justifyContent/alignItems** : Pour centrer le contenu

::: warning Important à retenir
En React Native, TOUT le texte doit être dans un composant `<Text>`. Vous ne pouvez pas écrire du texte directement dans un `<View>`.
:::

## 🧩 Les composants essentiels à connaître

### 1. View : Le conteneur universel

Le composant `View` est l'équivalent de la balise `<div>` en HTML. C'est votre boîte de base.

```jsx
import { View } from 'react-native';

// Une simple boîte
<View style={{ padding: 20, backgroundColor: 'lightblue' }}>
  {/* Contenu ici */}
</View>
```

**À quoi ça sert ?**
- Créer des sections dans votre interface
- Grouper d'autres composants
- Appliquer des styles (couleurs, marges, etc.)

### 2. Text : Afficher du texte

**RÈGLE D'OR :** En React Native, tout texte DOIT être dans un `<Text>`.

```jsx
import { Text } from 'react-native';

<Text>Bonjour !</Text>
<Text style={{ fontSize: 20, color: 'blue' }}>Texte stylé</Text>
```

**Propriétés utiles :**
- `numberOfLines={2}` : Limite le nombre de lignes
- `onPress={() => alert('Clic !')}` : Rendre le texte cliquable

### 3. TouchableOpacity : Boutons simples

C'est votre bouton de base. Quand on appuie, il devient légèrement transparent.

```jsx
import { TouchableOpacity, Text } from 'react-native';

<TouchableOpacity 
  onPress={() => alert('Bouton pressé !')}
  style={{ padding: 15, backgroundColor: 'blue' }}
>
  <Text style={{ color: 'white' }}>Cliquez-moi</Text>
</TouchableOpacity>
```

### 4. TextInput : Champs de saisie

Pour que l'utilisateur puisse taper du texte.

```jsx
import React, { useState } from 'react';
import { TextInput } from 'react-native';

function MonComposant() {
  const [texte, setTexte] = useState('');
  
  return (
    <TextInput
      value={texte}
      onChangeText={setTexte}
      placeholder="Tapez ici..."
      style={{ borderWidth: 1, padding: 10 }}
    />
  );
}
```

### 5. Image : Afficher des images

```jsx
import { Image } from 'react-native';

// Image locale
<Image source={require('./assets/logo.png')} style={{ width: 100, height: 100 }} />

// Image depuis internet
<Image source={{ uri: 'https://example.com/image.jpg' }} style={{ width: 100, height: 100 }} />
```

::: tip Concept important : Les styles obligatoires
Contrairement au web, les images en React Native DOIVENT avoir une largeur et hauteur définies dans les styles.
:::

## 🎨 Les styles en React Native : StyleSheet

### Pourquoi StyleSheet au lieu de CSS ?

En React Native, on n'utilise pas de fichiers CSS séparés. Les styles sont des **objets JavaScript** créés avec `StyleSheet.create()`.

**Avantages :**
- **Performance** : Les styles sont optimisés et mis en cache
- **Validation** : Erreurs détectées pendant le développement
- **Autocomplétion** : Votre éditeur vous aide
- **Pas de conflits** : Chaque composant a ses styles

### Syntaxe de base

```jsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  nomDuStyle: {
    propriete: 'valeur',
    autrePropriete: 'autreValeur',
  },
});
```

### Exemple concret : Créer une carte

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function MaCarte() {
  return (
    <View style={styles.carte}>
      <Text style={styles.titre}>Titre de ma carte</Text>
      <Text style={styles.description}>
        Description qui explique le contenu de la carte.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  carte: {
    backgroundColor: '#ffffff',    // Couleur de fond
    padding: 20,                   // Espace intérieur
    margin: 10,                    // Espace extérieur
    borderRadius: 10,              // Coins arrondis
    shadowColor: '#000',           // Couleur de l'ombre
    shadowOpacity: 0.1,            // Transparence de l'ombre
    shadowRadius: 5,               // Flou de l'ombre
    elevation: 3,                  // Ombre sur Android
  },
  titre: {
    fontSize: 18,                  // Taille du texte
    fontWeight: 'bold',            // Texte en gras
    color: '#333',                 // Couleur du texte
    marginBottom: 10,              // Marge en bas
  },
  description: {
    fontSize: 14,
    color: '#666',                 // Gris plus clair
    lineHeight: 20,                // Espacement entre les lignes
  },
});
```

### Flexbox : Le système de mise en page

React Native utilise **Flexbox par défaut** pour organiser les éléments.

**Les 3 propriétés essentielles :**

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,                       // Prend tout l'espace disponible
    flexDirection: 'column',       // 'row' ou 'column' (défaut)
    justifyContent: 'center',      // Alignement principal
    alignItems: 'center',          // Alignement secondaire
  },
});
```

**Exemples visuels :**

```jsx
// Centrer un élément au milieu de l'écran
centrer: {
  flex: 1,
  justifyContent: 'center',        // Centre verticalement
  alignItems: 'center',            // Centre horizontalement
}

// Placer des éléments en ligne
ligne: {
  flexDirection: 'row',            // Arrange horizontalement
  justifyContent: 'space-between', // Espace égal entre les éléments
}

// Élément qui prend 70% de l'espace
flexible: {
  flex: 0.7,                       // 70% de l'espace parent
}
```

::: tip Concept clé : flex vs width/height
- `flex: 1` = "Prends tout l'espace disponible"
- `width: 100` = "Fais exactement 100 pixels de large"
- `flex: 0.5` = "Prends 50% de l'espace disponible"
:::
  
  
## 🚀 Exercice pratique : Votre première app

Maintenant que vous connaissez les bases, créons ensemble une petite application "Hello World" interactive :

### Objectif
Créer une app qui :
1. Affiche un message de bienvenue
2. Permet de saisir son nom
3. Change le message en fonction du nom saisi
4. A un bouton pour effacer

### Code de départ

```jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function App() {
  const [nom, setNom] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>
        Bonjour {nom || 'Anonyme'} !
      </Text>
      
      <TextInput
        style={styles.input}
        value={nom}
        onChangeText={setNom}
        placeholder="Votre nom"
      />
      
      <TouchableOpacity 
        style={styles.bouton}
        onPress={() => setNom('')}
      >
        <Text style={styles.texteBouton}>Effacer</Text>
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
    backgroundColor: '#f5f5f5',
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  bouton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  texteBouton: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
```

## 📚 Résumé des concepts clés

### Ce que vous devez retenir

1. **React Native** = JavaScript → Composants natifs iOS/Android
2. **Expo** = Solution simple pour débuter
3. **View** = Conteneur (comme `<div>`)
4. **Text** = OBLIGATOIRE pour tout texte
5. **StyleSheet** = Styles en JavaScript, pas CSS
6. **Flexbox** = Système de mise en page par défaut

### Différences importantes avec le web

| Web | React Native | Pourquoi ? |
|-----|--------------|------------|
| `<div>` | `<View>` | Optimisé pour mobile |
| CSS dans fichiers | StyleSheet dans JS | Performance et validation |
| `<p>`, `<span>` | `<Text>` | Gestion du texte native |
| `<button>` | `<TouchableOpacity>` | Gestion tactile avancée |

### Prochaines étapes

Maintenant que vous maîtrisez les bases, vous pouvez explorer :
- **[Navigation](./navigation.md)** : Passer d'un écran à l'autre
- **[Composants avancés](./composants.md)** : Listes, modales, etc.
- **[APIs et données](../dart/json.md)** : Récupérer des données d'internet

::: tip Pour continuer votre apprentissage
1. **Pratiquez** : Modifiez l'exemple ci-dessus, ajoutez des fonctionnalités
2. **Explorez** : Testez d'autres composants dans la documentation officielle
3. **Construisez** : Commencez un petit projet personnel
:::

---

**Félicitations !** Vous avez maintenant les bases solides pour créer vos premières applications React Native. Le voyage ne fait que commencer ! 🎉