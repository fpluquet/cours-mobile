# React Native – Introduction et bases
 
## 🎯 Qu'est-ce que React Native ?

React Native est un framework développé par Meta (Facebook) qui permet de créer des applications mobiles natives pour iOS et Android en utilisant React et JavaScript. Contrairement aux solutions hybrides, React Native compile vers des composants natifs réels.

### React vs React Native

Si vous connaissez déjà React pour le web, React Native vous sera familier :

| Concept | React Web | React Native |
|---------|-----------|--------------|
| **Composants** | `<div>`, `<span>`, `<button>` | `<View>`, `<Text>`, `<TouchableOpacity>` |
| **Styles** | CSS | StyleSheet (objet JavaScript) |
| **Navigation** | React Router | React Navigation |
| **État** | useState, useEffect | Identique + hooks mobiles |
| **API** | DOM, fetch | APIs natives + fetch |

### Avantages de React Native

- **Réutilisation de code** : 70-90% du code partagé entre plateformes
- **Performance native** : Composants natifs réels
- **Écosystème JavaScript** : npm, développeurs web
- **Hot Reload** : Voir les changements instantanément
- **Communauté active** : Nombreuses librairies et outils

::: info React Native vs Autres solutions
React Native traduit vos composants JavaScript en widgets natifs iOS/Android, contrairement à Flutter qui dessine tout pixel par pixel, ou Cordova qui utilise une WebView.
:::

## 🛠️ Installation et configuration

### Prérequis

- **Node.js** (version 16 ou supérieure)
- **npm** ou **yarn**
- **Android Studio** (pour Android)
- **Xcode** (pour iOS, macOS uniquement)

### Option 1 : Expo CLI (Recommandé pour débuter)

```bash
# Installation d'Expo CLI
npm install -g @expo/cli

# Créer un nouveau projet
npx create-expo-app MonAppRN
cd MonAppRN

# Lancer le projet
npx expo start
```

### Option 2 : React Native CLI (Plus de contrôle)

```bash
# Installation de React Native CLI
npm install -g react-native-cli

# Créer un nouveau projet
npx react-native init MonAppRN
cd MonAppRN

# Lancer sur Android
npx react-native run-android

# Lancer sur iOS (macOS uniquement)
npx react-native run-ios
```

### Expo vs React Native CLI

| Caractéristique | Expo | React Native CLI |
|-----------------|------|------------------|
| **Setup** | Très simple | Plus complexe |
| **APIs natives** | Limitées (mais riches) | Accès complet |
| **Taille app** | Plus lourde | Plus légère |
| **Débogage** | Simplifié | Plus d'options |
| **Publication** | Expo Build Service | Build manuel |

::: tip Conseil pour débuter
Commencez avec Expo pour apprendre les concepts. Passez à React Native CLI quand vous avez besoin d'APIs natives spécifiques.
:::

## 📱 Structure d'un projet React Native

### Arborescence Expo

```
MonAppRN/
├── App.js                 # Composant racine
├── app.json              # Configuration Expo
├── package.json          # Dépendances
├── babel.config.js       # Configuration Babel
├── assets/               # Images, fonts, etc.
│   ├── images/
│   └── fonts/
├── components/           # Composants réutilisables
├── screens/             # Écrans de l'app
├── navigation/          # Configuration navigation
├── services/           # APIs, storage, etc.
└── utils/              # Utilitaires
```

### Fichier App.js de base

```jsx
import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Bienvenue dans React Native !</Text>
      <Text style={styles.subtitle}>
        Votre première application mobile
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
```

## 🧩 Composants fondamentaux

React Native fournit des composants de base qui remplacent les éléments HTML :

### Composants de structure

```jsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function ComposantsStructure() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          {/* SafeAreaView : Évite les zones système (notch, etc.) */}
          {/* View : Équivalent de <div> */}
          {/* ScrollView : Contenu défilable */}
          {/* Text : Équivalent de <p>, <span>, etc. */}
          
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
            Titre principal
          </Text>
          
          <Text style={{ fontSize: 16, marginTop: 10 }}>
            Ceci est un paragraphe de texte normal dans React Native.
            Tout le texte doit être dans un composant Text.
          </Text>
          
          <View style={{
            backgroundColor: '#f0f0f0',
            padding: 15,
            marginTop: 20,
            borderRadius: 8,
          }}>
            <Text>Contenu dans un container stylé</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
```

### Composants d'affichage

```jsx
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

export default function ComposantsAffichage() {
  return (
    <View style={styles.container}>
      {/* Texte simple */}
      <Text style={styles.title}>Composants d'affichage</Text>
      
      {/* Texte avec styles multiples */}
      <Text style={styles.paragraph}>
        Texte avec <Text style={styles.bold}>partie en gras</Text> et{' '}
        <Text style={styles.italic}>partie en italique</Text>.
      </Text>
      
      {/* Image locale */}
      <Image
        source={require('../assets/logo.png')}
        style={styles.localImage}
      />
      
      {/* Image réseau */}
      <Image
        source={{
          uri: 'https://picsum.photos/200/150',
        }}
        style={styles.networkImage}
      />
      
      {/* Image avec gestion d'erreur */}
      <Image
        source={{ uri: 'https://picsum.photos/200/100' }}
        style={styles.networkImage}
        onError={(error) => console.log('Erreur image:', error)}
        onLoad={() => console.log('Image chargée')}
      />
      
      {/* Container avec bordure et ombre */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Carte stylée</Text>
        <Text style={styles.cardContent}>
          Contenu de la carte avec bordure et ombre
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  localImage: {
    width: 150,
    height: 100,
    alignSelf: 'center',
    marginVertical: 10,
  },
  networkImage: {
    width: 200,
    height: 150,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 8,
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    elevation: 3, // Ombre Android
    shadowColor: '#000', // Ombre iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
    color: '#666',
  },
});
```

### Composants d'interaction

```jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  TextInput,
  Switch,
  Alert,
  StyleSheet,
} from 'react-native';

export default function ComposantsInteraction() {
  const [inputText, setInputText] = useState('');
  const [switchValue, setSwitchValue] = useState(false);
  const [counter, setCounter] = useState(0);

  const showAlert = () => {
    Alert.alert(
      'Titre de l\'alerte',
      'Message de l\'alerte',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'OK', onPress: () => console.log('OK pressé') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Composants d'interaction</Text>
      
      {/* TouchableOpacity - Bouton avec opacité */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setCounter(counter + 1)}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>
          TouchableOpacity (cliqué {counter} fois)
        </Text>
      </TouchableOpacity>
      
      {/* TouchableHighlight - Bouton avec surbrillance */}
      <TouchableHighlight
        style={styles.button}
        onPress={showAlert}
        underlayColor="#ddd"
      >
        <Text style={styles.buttonText}>TouchableHighlight</Text>
      </TouchableHighlight>
      
      {/* Pressable - API moderne recommandée */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { opacity: pressed ? 0.8 : 1 }
        ]}
        onPress={() => setCounter(0)}
      >
        <Text style={styles.buttonText}>Pressable (Reset)</Text>
      </Pressable>
      
      {/* TextInput - Champ de saisie */}
      <TextInput
        style={styles.textInput}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Tapez quelque chose..."
        placeholderTextColor="#999"
      />
      <Text style={styles.inputDisplay}>
        Vous avez tapé: {inputText}
      </Text>
      
      {/* Switch - Interrupteur */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Mode sombre:</Text>
        <Switch
          value={switchValue}
          onValueChange={setSwitchValue}
          thumbColor={switchValue ? '#f5dd4b' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>
      
      {/* Affichage conditionnel basé sur le switch */}
      {switchValue && (
        <View style={styles.darkModeIndicator}>
          <Text style={styles.darkModeText}>
            Mode sombre activé !
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginTop: 20,
    backgroundColor: '#f9f9f9',
  },
  inputDisplay: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
  },
  darkModeIndicator: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  darkModeText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});
```

## 🎨 Système de styles avec StyleSheet

React Native utilise un système de styles basé sur JavaScript, similaire à CSS mais avec quelques différences :

### StyleSheet basique

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExempleStyles() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Système de styles</Text>
      <Text style={styles.subtitle}>React Native StyleSheet</Text>
      
      {/* Styles multiples */}
      <Text style={[styles.text, styles.boldText]}>
        Texte avec styles combinés
      </Text>
      
      {/* Styles conditionnels */}
      <Text style={[
        styles.text,
        { color: true ? 'green' : 'red' }
      ]}>
        Style conditionnel
      </Text>
      
      {/* Styles en ligne (à éviter pour les performances) */}
      <Text style={{ fontSize: 14, color: 'gray' }}>
        Style en ligne
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 5,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
});
```

### Flexbox en React Native

React Native utilise Flexbox par défaut pour la mise en page :

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExempleFlexbox() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flexbox Layout</Text>
      
      {/* Direction row */}
      <View style={styles.rowContainer}>
        <View style={[styles.box, { backgroundColor: '#FF6B6B' }]}>
          <Text style={styles.boxText}>1</Text>
        </View>
        <View style={[styles.box, { backgroundColor: '#4ECDC4' }]}>
          <Text style={styles.boxText}>2</Text>
        </View>
        <View style={[styles.box, { backgroundColor: '#45B7D1' }]}>
          <Text style={styles.boxText}>3</Text>
        </View>
      </View>
      
      {/* Direction column avec flex */}
      <View style={styles.columnContainer}>
        <View style={[styles.flexBox, styles.flex1, { backgroundColor: '#96CEB4' }]}>
          <Text style={styles.boxText}>Flex: 1</Text>
        </View>
        <View style={[styles.flexBox, styles.flex2, { backgroundColor: '#FECA57' }]}>
          <Text style={styles.boxText}>Flex: 2</Text>
        </View>
        <View style={[styles.flexBox, styles.flex1, { backgroundColor: '#FF9FF3' }]}>
          <Text style={styles.boxText}>Flex: 1</Text>
        </View>
      </View>
      
      {/* Alignement */}
      <View style={styles.alignmentContainer}>
        <View style={[styles.smallBox, { backgroundColor: '#54A0FF' }]}>
          <Text style={styles.boxText}>Center</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  // Row layout
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  box: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  
  // Column layout avec flex
  columnContainer: {
    height: 200,
    marginBottom: 20,
  },
  flexBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 8,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  
  // Alignement
  alignmentContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  smallBox: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  
  boxText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
```

## 📱 Exemple complet : Application "Hello World" mobile

```jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  StatusBar,
} from 'react-native';

export default function HelloWorldApp() {
  const [name, setName] = useState('');
  const [greetings, setGreetings] = useState([]);
  const [counter, setCounter] = useState(0);

  const addGreeting = () => {
    if (name.trim() === '') {
      Alert.alert('Erreur', 'Veuillez saisir un nom');
      return;
    }

    const newGreeting = {
      id: Date.now(),
      name: name.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    setGreetings([newGreeting, ...greetings]);
    setName('');
    setCounter(counter + 1);
  };

  const clearGreetings = () => {
    Alert.alert(
      'Confirmer',
      'Voulez-vous effacer toutes les salutations ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: () => {
            setGreetings([]);
            setCounter(0);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hello React Native !</Text>
        <Text style={styles.headerSubtitle}>
          Votre première application mobile
        </Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder="Saisissez votre nom..."
          placeholderTextColor="#999"
          returnKeyType="done"
          onSubmitEditing={addGreeting}
        />
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={addGreeting}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Dire bonjour</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <Text style={styles.statsText}>
          {counter} salutation{counter !== 1 ? 's' : ''} créée{counter !== 1 ? 's' : ''}
        </Text>
        {greetings.length > 0 && (
          <TouchableOpacity onPress={clearGreetings}>
            <Text style={styles.clearText}>Effacer tout</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Greetings List */}
      <ScrollView style={styles.greetingsList} showsVerticalScrollIndicator={false}>
        {greetings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Aucune salutation pour le moment
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Saisissez un nom ci-dessus pour commencer
            </Text>
          </View>
        ) : (
          greetings.map((greeting) => (
            <View key={greeting.id} style={styles.greetingCard}>
              <Text style={styles.greetingText}>
                Bonjour {greeting.name} ! 👋
              </Text>
              <Text style={styles.greetingTime}>
                {greeting.timestamp}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // Header
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E3F2FD',
    textAlign: 'center',
  },
  
  // Input section
  inputSection: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Stats
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
  clearText: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: '500',
  },
  
  // Greetings
  greetingsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  greetingCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  greetingTime: {
    fontSize: 12,
    color: '#999',
  },
  
  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
```

::: tip Bonnes pratiques React Native
- **StyleSheet.create()** : Toujours utiliser pour optimiser les performances
- **SafeAreaView** : Éviter les zones système sur les appareils modernes
- **Flexbox** : Maîtriser pour des layouts responsives
- **TouchableOpacity vs Pressable** : Préférer Pressable pour les nouveaux projets
- **ScrollView vs FlatList** : FlatList pour de grandes listes pour les performances
:::

Cette introduction vous donne les bases solides de React Native. Dans la section suivante, nous explorerons les [composants et la mise en page](./composants.md) plus en détail pour créer des interfaces complexes et attrayantes.