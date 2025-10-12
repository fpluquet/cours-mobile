# React Native – Navigation

## 🧭 Comprendre la navigation mobile

La navigation est l'épine dorsale de toute application mobile. Elle détermine comment les utilisateurs se déplacent entre les différents écrans et fonctionnalités.

### Qu'est-ce que React Navigation ?

**React Navigation** est la bibliothèque standard pour gérer la navigation dans React Native. Elle offre une approche déclarative et performante pour structurer les flux de navigation.

### Concepts fondamentaux

**Navigation Stack (Pile)** : Les écrans s'empilent les uns sur les autres. Quand vous naviguez vers un nouvel écran, il se place au sommet de la pile. Le bouton "retour" retire l'écran du sommet.

**Navigation Tab (Onglets)** : Plusieurs écrans accessibles simultanément via des onglets en bas ou en haut de l'écran.

**Navigation Drawer (Tiroir)** : Menu latéral qui s'ouvre en glissant depuis le bord de l'écran.

### Quand utiliser quel type ?

- **Stack Navigator** : Pour des parcours linéaires (ex: Liste → Détail → Édition)
- **Tab Navigator** : Pour les fonctionnalités principales (ex: Accueil, Recherche, Profil)
- **Drawer Navigator** : Pour les menus de navigation secondaires

## 🛠️ Installation et setup initial

### Étape 1 : Installation des dépendances

```bash
npm install @react-navigation/native
expo install react-native-screens react-native-safe-area-context
```

### Étape 2 : Configuration de base

Chaque application React Navigation doit être enveloppée dans un `NavigationContainer` :

```jsx
// App.js
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      {/* Votre navigation ira ici */}
    </NavigationContainer>
  );
}
```

**Pourquoi NavigationContainer ?**
- Il gère l'état global de navigation
- Il permet la synchronisation avec le système (bouton retour Android)
- Il fournit le contexte nécessaire aux composants de navigation

## 📚 Stack Navigator - Navigation hiérarchique

Le Stack Navigator est comme une pile de cartes : chaque nouvel écran se place au-dessus du précédent.

### Installation et usage de base

```bash
npm install @react-navigation/native-stack
```

### Exemple minimal mais complet

```jsx
// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Écrans simples pour comprendre la navigation

<div v-pre>

```jsx
// HomeScreen.js
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Écran d'accueil</Text>
      <Button
        title="Aller aux détails"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}
```

```jsx
// DetailsScreen.js
import { View, Text, Button } from 'react-native';

export default function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Écran de détails</Text>
      <Button
        title="Retour"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}
```

</div>

### Concepts clés du Stack Navigator

**La prop `navigation`** : Chaque écran reçoit automatiquement cette prop qui contient les méthodes de navigation.

**Méthodes essentielles :**
- `navigate('ScreenName')` : Va vers un écran (ou le ramène au premier plan s'il existe)
- `push('ScreenName')` : Ajoute toujours un nouvel écran à la pile
- `goBack()` : Retourne à l'écran précédent
- `popToTop()` : Retourne au premier écran de la pile

### Passer des données entre écrans

```jsx
// Envoyer des données
navigation.navigate('Details', { 
  itemId: 42, 
  title: 'Mon titre' 
});

// Recevoir des données
export default function DetailsScreen({ route }) {
  const { itemId, title } = route.params;
  
  return (
    <Text>Item ID: {itemId}, Titre: {title}</Text>
  );
}
```

## 📱 Tab Navigator - Navigation par onglets

Le Tab Navigator permet d'avoir plusieurs sections principales accessibles d'un seul tap.

### Installation et configuration

```bash
npm install @react-navigation/bottom-tabs
```

### Exemple simple et pratique

<div v-pre>

```jsx
// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Accueil</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profil</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

</div>

### Personnalisation des onglets

<div v-pre>

```jsx
<Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName = route.name === 'Home' ? '🏠' : '👤';
      return <Text style={{ fontSize: size }}>{iconName}</Text>;
    },
    tabBarActiveTintColor: 'blue',
    tabBarInactiveTintColor: 'gray',
  })}
>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Profile" component={ProfileScreen} />
</Tab.Navigator>
```

</div>

### Concepts clés des tabs

**Persistance d'état** : Chaque onglet garde son état quand vous changez d'onglet.

**Navigation conditionnelle** : Vous pouvez masquer/afficher des onglets selon l'état de l'app.

**Badges de notification** : Ajoutez des badges sur les onglets avec l'option `tabBarBadge`.

## 🎛️ Combiner Stack et Tab Navigation

Dans la vraie vie, vous combinez souvent plusieurs types de navigation.

### Architecture typique d'une app

<div v-pre>

```jsx
// App.js - Structure complète mais simple
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack pour la section Home
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeList" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

// Navigation principale avec onglets
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: 'Accueil' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

// App principale
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ 
            headerShown: true,
            presentation: 'modal' // Affichage modal sur iOS
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

</div>
```

### Comment penser l'architecture

1. **Tabs** pour la navigation principale (3-5 sections max)
2. **Stack** à l'intérieur de chaque tab pour la navigation détaillée
3. **Écrans modaux** au niveau racine pour les actions transversales

### Navigation entre différents stacks

<div v-pre>

```jsx
// Depuis n'importe quel écran, accéder aux tabs
navigation.navigate('Main', { 
  screen: 'Profile' // Aller directement à l'onglet Profil
});

// Aller à un écran spécifique dans un stack d'un autre tab
navigation.navigate('Main', {
  screen: 'HomeStack',
  params: {
    screen: 'Details',
    params: { itemId: 42 }
  }
});
```

</div> 
## 🔧 Hooks de navigation essentiels

React Navigation propose des hooks pour accéder à la navigation depuis n'importe où.

### useNavigation - Naviguer sans prop

```jsx
import { useNavigation } from '@react-navigation/native';

function MonBouton() {
  const navigation = useNavigation();
  
  return (
    <Button
      title="Aller aux détails"
      onPress={() => navigation.navigate('Details')}
    />
  );
}
```

**Pourquoi c'est utile ?** Vous pouvez naviguer depuis des composants qui ne reçoivent pas la prop `navigation`.

### useRoute - Accéder aux paramètres

```jsx
import { useRoute } from '@react-navigation/native';

function MonComposant() {
  const route = useRoute();
  const { itemId } = route.params || {};
  
  return <Text>ID de l'item: {itemId}</Text>;
}
```

### useFocusEffect - Réagir au focus

```jsx
import { useFocusEffect } from '@react-navigation/native';

function MonEcran() {
  useFocusEffect(
    React.useCallback(() => {
      console.log('Écran devient actif');
      
      // Code de nettoyage quand l'écran devient inactif
      return () => console.log('Écran devient inactif');
    }, [])
  );
  
  return <Text>Mon contenu</Text>;
}
```

**Quand l'utiliser ?** Pour recharger des données quand l'utilisateur revient sur un écran.

## 🎨 Personnalisation des headers

### Header personnalisé simple

```jsx
<Stack.Screen 
  name="Details" 
  component={DetailsScreen}
  options={headerOptions}
/>

// Où headerOptions est défini comme :
const headerOptions = {
  title: 'Mes détails',
  headerStyle: { backgroundColor: '#f4511e' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
};
```

### Header avec boutons

```jsx
<Stack.Screen 
  name="Details" 
  component={DetailsScreen}
  options={getHeaderOptions}
/>

// Fonction qui retourne les options :
const getHeaderOptions = ({ navigation }) => ({
  headerRight: () => (
    <Button
      onPress={() => alert('Sauvegardé!')}
      title="Sauver"
      color="#fff"
    />
  ),
});
```

### Header dynamique depuis le composant

```jsx
function DetailsScreen({ navigation }) {
  React.useLayoutEffect(() => {
    const options = {
      headerRight: () => (
        <Button onPress={() => alert('Mis à jour!')} title="Update" />
      ),
    };
    navigation.setOptions(options);
  }, [navigation]);
  
  return <Text>Contenu des détails</Text>;
}
```
## 🚀 Patterns et bonnes pratiques

### Organisation des fichiers

```
navigation/
  ├── AppNavigator.js        // Navigation racine
  ├── TabNavigator.js        // Navigation par onglets  
  └── types.js              // Types TypeScript (optionnel)

screens/
  ├── home/
  │   ├── HomeScreen.js
  │   └── DetailsScreen.js
  └── profile/
      └── ProfileScreen.js
```

### Gérer l'état global avec navigation

```jsx
// Passer des données via params (simple)
navigation.navigate('Details', { user: userData });

// Utiliser un state manager pour les données complexes
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

function ProfileScreen() {
  const { user, updateUser } = useContext(UserContext);
  // ... logique du composant
}
```

### Validation des paramètres

```jsx
function DetailsScreen({ route }) {
  const { itemId } = route.params || {};
  
  if (!itemId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Erreur: ID manquant</Text>
      </View>
    );
  }
  
  // ... reste du composant
}
```

### Navigation conditionnelle

```jsx
function AppNavigator() {
  const { isLoggedIn } = useAuth();
  
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainTabNavigator />
      ) : (
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
}
```

## 💡 Conseils pédagogiques

### Débuter avec la navigation

1. **Commencez simple** : Un seul Stack Navigator avec 2-3 écrans
2. **Maîtrisez les bases** : `navigate()`, `goBack()`, passage de paramètres
3. **Ajoutez progressivement** : Tabs, puis combinaisons complexes

### Erreurs communes à éviter

- **Trop de niveaux** : Évitez les stacks dans des stacks dans des tabs
- **Paramètres trop complexes** : Utilisez un state manager pour les objets volumineux
- **Headers partout** : Désactivez les headers redondants
- **Navigation directe** : Ne naviguez pas depuis les useEffect sans vérification

### Tester votre navigation

```jsx
// Test simple: peut-on aller et revenir ?
const testNavigation = () => {
  navigation.navigate('Details', { test: true });
  setTimeout(() => navigation.goBack(), 1000);
};
```

La navigation est l'art de guider l'utilisateur intuitivement dans votre application. Gardez-la simple, prévisible et cohérente !