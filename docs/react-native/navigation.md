# React Native – Navigation
 
## 🧭 Introduction à la navigation

La navigation est un aspect crucial des applications mobiles. React Native ne fournit pas de système de navigation intégré, mais **React Navigation** est la solution de référence pour créer des expériences de navigation fluides et natives.

### Pourquoi React Navigation ?

- **Performance native** : Utilise les animations et gestes natifs
- **Flexibilité** : Nombreux types de navigateurs
- **Écosystème** : Intégration avec Redux, hooks, etc.
- **Communauté** : Solution la plus populaire et maintenue

### Types de navigation

| Type | Usage | Exemple |
|------|-------|---------|
| **Stack** | Navigation hiérarchique | Accueil → Détail → Sous-détail |
| **Tab** | Navigation horizontale | Accueil, Recherche, Profil |
| **Drawer** | Menu latéral | Navigation principale |
| **Modal** | Écrans temporaires | Paramètres, Formulaires |

## 🛠️ Installation et configuration

### Installation

```bash
# Avec npm
npm install @react-navigation/native

# Dépendances pour Expo
expo install react-native-screens react-native-safe-area-context

# Ou pour React Native CLI
npm install react-native-screens react-native-safe-area-context
# Puis suivre les instructions de linking
```

### Configuration de base

```jsx
// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Import des écrans
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Accueil' }}
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen}
          options={{ title: 'Détails' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## 📚 Stack Navigator - Navigation hiérarchique

Le Stack Navigator gère la navigation entre écrans de manière hiérarchique avec un historique.

### Exemple complet avec Stack Navigator

```jsx
// screens/HomeScreen.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

const articles = [
  { id: '1', title: 'Introduction à React Native', author: 'Marie Dupont', date: '2024-01-15' },
  { id: '2', title: 'Navigation avancée', author: 'Pierre Martin', date: '2024-01-14' },
  { id: '3', title: 'Gestion d\'état avec Redux', author: 'Sophie Leroy', date: '2024-01-13' },
  { id: '4', title: 'Optimisation des performances', author: 'Paul Moreau', date: '2024-01-12' },
];

export default function HomeScreen({ navigation }) {
  const renderArticle = ({ item }) => (
    <TouchableOpacity
      style={styles.articleItem}
      onPress={() => navigation.navigate('Details', { article: item })}
    >
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.articleMeta}>
          Par {item.author} • {item.date}
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Articles récents</Text>
        <Text style={styles.headerSubtitle}>
          Découvrez nos derniers tutoriels
        </Text>
      </View>

      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={renderArticle}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Details', {
            article: {
              id: 'new',
              title: 'Nouvel article',
              author: 'Vous',
              date: new Date().toLocaleDateString(),
              isNew: true,
            }
          })}
        >
          <Text style={styles.addButtonText}>+ Ajouter un article</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 15,
  },
  articleItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  articleContent: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  articleMeta: {
    fontSize: 14,
    color: '#666',
  },
  chevron: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  footer: {
    padding: 15,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

```jsx
// screens/DetailsScreen.js
import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';

export default function DetailsScreen({ route, navigation }) {
  const { article } = route.params;

  // Configuration dynamique du header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: article.isNew ? 'Nouvel article' : article.title,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Partager',
              `Partager l'article "${article.title}" ?`,
              [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Partager', onPress: () => console.log('Partage') },
              ]
            );
          }}
        >
          <Text style={styles.headerButton}>Partager</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, article]);

  const navigateToComments = () => {
    navigation.navigate('Comments', { 
      articleId: article.id,
      articleTitle: article.title 
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{article.title}</Text>
        <View style={styles.metaContainer}>
          <Text style={styles.author}>Par {article.author}</Text>
          <Text style={styles.date}>{article.date}</Text>
        </View>
        {article.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NOUVEAU</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>

        <Text style={styles.paragraph}>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
          eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
          sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Text>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>💡 Point important</Text>
          <Text style={styles.highlightText}>
            Cette fonctionnalité est particulièrement utile pour améliorer 
            l'expérience utilisateur dans vos applications mobiles.
          </Text>
        </View>

        <Text style={styles.paragraph}>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
          doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
          veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={navigateToComments}
        >
          <Text style={styles.actionButtonText}>💬 Voir les commentaires</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => {
            Alert.alert(
              'Article ajouté',
              'Article ajouté à vos favoris !',
              [{ text: 'OK' }]
            );
          }}
        >
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
            ⭐ Ajouter aux favoris
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={() => {
            Alert.alert(
              'Retour',
              'Voulez-vous revenir à l\'accueil ?',
              [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Retour', onPress: () => navigation.goBack() },
              ]
            );
          }}
        >
          <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
            ← Retour à l'accueil
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    lineHeight: 32,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  newBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 10,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
    textAlign: 'justify',
  },
  highlightBox: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    padding: 16,
    marginVertical: 20,
    borderRadius: 8,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  actions: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  secondaryButtonText: {
    color: '#fff',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
  },
  dangerButtonText: {
    color: '#fff',
  },
});
```

## 📱 Tab Navigator - Navigation par onglets

Perfect pour la navigation principale de l'application.

### Installation

```bash
npm install @react-navigation/bottom-tabs
```

### Exemple complet avec Tab Navigator

```jsx
// navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

// Import des écrans
import HomeStack from './HomeStack'; // Le Stack Navigator précédent
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Tab = createBottomTabNavigator();

// Icônes personnalisées (vous pouvez utiliser react-native-vector-icons)
const TabIcon = ({ name, focused, color }) => {
  const icons = {
    Home: focused ? '🏠' : '🏡',
    Search: focused ? '🔍' : '🔎',
    Notifications: focused ? '🔔' : '🔕',
    Profile: focused ? '👤' : '👥',
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>{icons[name] || '❓'}</Text>
    </View>
  );
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <TabIcon name={route.name} focused={focused} color={color} />
        ),
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#F2F2F7',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 90,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false, // On gère les headers dans chaque stack
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{
          title: 'Accueil',
          tabBarBadge: 3, // Badge de notification
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          title: 'Recherche',
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          tabBarBadge: 12,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
}
```

### Écrans des onglets

```jsx
// screens/SearchScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const searchData = [
  { id: '1', title: 'React Native', category: 'Développement', popularity: 95 },
  { id: '2', title: 'Flutter', category: 'Développement', popularity: 88 },
  { id: '3', title: 'Swift', category: 'iOS', popularity: 82 },
  { id: '4', title: 'Kotlin', category: 'Android', popularity: 79 },
  { id: '5', title: 'JavaScript', category: 'Web', popularity: 97 },
];

export default function SearchScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(searchData);

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = searchData.filter(item =>
      item.title.toLowerCase().includes(text.toLowerCase()) ||
      item.category.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        // Navigation vers les détails
        console.log('Naviguer vers:', item.title);
      }}
    >
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultCategory}>{item.category}</Text>
      </View>
      <View style={styles.popularityContainer}>
        <Text style={styles.popularityText}>{item.popularity}%</Text>
        <View style={[styles.popularityBar, { width: item.popularity }]}>
          <View style={styles.popularityFill} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recherche</Text>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearch}
          placeholder="Rechercher des technologies..."
          placeholderTextColor="#8E8E93"
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderSearchResult}
        contentContainerStyle={styles.resultsContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchText ? 'Aucun résultat trouvé' : 'Commencez votre recherche'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  resultsContainer: {
    padding: 16,
  },
  resultItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  resultCategory: {
    fontSize: 14,
    color: '#8E8E93',
  },
  popularityContainer: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  popularityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  popularityBar: {
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  popularityFill: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});
```

## 🎛️ Navigation combinée et avancée

Combinons Stack et Tab navigators pour une navigation complète :

```jsx
// App.js - Navigation principale
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './navigation/TabNavigator';
import DetailsScreen from './screens/DetailsScreen';
import CommentsScreen from './screens/CommentsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Navigation principale par onglets */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        
        {/* Écrans modaux ou spéciaux */}
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen}
          options={{
            headerShown: true,
            presentation: 'modal', // Présentation modale sur iOS
          }}
        />
        <Stack.Screen 
          name="Comments" 
          component={CommentsScreen}
          options={{
            headerShown: true,
            title: 'Commentaires',
          }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            headerShown: true,
            title: 'Paramètres',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Hooks de navigation

React Navigation fournit des hooks utiles :

```jsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { 
  useNavigation, 
  useRoute, 
  useFocusEffect,
  useIsFocused
} from '@react-navigation/native';

export default function NavigationHooksExample() {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  // Exécuter du code quand l'écran devient actif/inactif
  useFocusEffect(
    React.useCallback(() => {
      console.log('Écran devient actif');
      
      return () => {
        console.log('Écran devient inactif');
      };
    }, [])
  );

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      Alert.alert('Info', 'Aucun écran précédent');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Navigation Hooks</Text>
      
      <View style={styles.info}>
        <Text style={styles.infoText}>
          Route actuelle: {route.name}
        </Text>
        <Text style={styles.infoText}>
          Écran actif: {isFocused ? 'Oui' : 'Non'}
        </Text>
        <Text style={styles.infoText}>
          Peut retourner: {navigation.canGoBack() ? 'Oui' : 'Non'}
        </Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Aller à l'accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.push('Details', { id: Math.random() })}
        >
          <Text style={styles.buttonText}>Push nouveau détail</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleGoBack}
        >
          <Text style={styles.buttonText}>Retour</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })}
        >
          <Text style={[styles.buttonText, styles.dangerText]}>
            Reset vers accueil
          </Text>
        </TouchableOpacity>
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
    marginBottom: 30,
  },
  info: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 4,
    color: '#333',
  },
  buttons: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
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
  dangerButton: {
    backgroundColor: '#dc3545',
  },
  dangerText: {
    color: '#fff',
  },
});
```

::: tip Bonnes pratiques de navigation
- **Typage TypeScript** : Définissez les types de vos routes et paramètres
- **Deep linking** : Configurez les liens profonds pour l'ouverture d'URLs
- **Persistence** : Sauvegardez l'état de navigation si nécessaire
- **Performance** : Utilisez `lazy` pour charger les écrans à la demande
- **Accessibilité** : Configurez les labels pour les lecteurs d'écran
:::

Cette couverture complète de la navigation vous permet de créer des applications React Native avec des expériences de navigation fluides et intuitives. La navigation est la colonne vertébrale de toute application mobile réussie !