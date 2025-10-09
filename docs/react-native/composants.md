# React Native – Composants et mise en page
 
## 🎯 Composants React Native essentiels

React Native offre une riche collection de composants pour créer des interfaces natives. Contrairement au web, tous les éléments doivent utiliser les composants React Native spécifiques.

### Vue d'ensemble des composants principaux

| Composant | Usage | Équivalent Web |
|-----------|-------|----------------|
| **View** | Container de base | `<div>` |
| **Text** | Affichage de texte | `<p>`, `<span>`, `<h1>` |
| **ScrollView** | Zone défilable | `<div>` avec overflow |
| **FlatList** | Liste performante | `<ul>` avec virtualisation |
| **Image** | Affichage d'images | `<img>` |
| **TouchableOpacity** | Bouton tactile | `<button>` |
| **TextInput** | Saisie de texte | `<input>`, `<textarea>` |

## 📱 Composants de conteneur et de layout

### View - Le composant universel

`View` est le composant de base pour tous les containers :

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExempleViews() {
  return (
    <View style={styles.container}>
      {/* View simple */}
      <View style={styles.basicView}>
        <Text>Vue simple</Text>
      </View>
      
      {/* View avec bordure */}
      <View style={styles.borderedView}>
        <Text>Vue avec bordure</Text>
      </View>
      
      {/* View avec ombre */}
      <View style={styles.shadowView}>
        <Text>Vue avec ombre</Text>
      </View>
      
      {/* Views imbriquées */}
      <View style={styles.parentView}>
        <Text style={styles.parentText}>Parent</Text>
        <View style={styles.childView}>
          <Text style={styles.childText}>Enfant 1</Text>
        </View>
        <View style={styles.childView}>
          <Text style={styles.childText}>Enfant 2</Text>
        </View>
      </View>
      
      {/* View avec positionnement absolu */}
      <View style={styles.relativeContainer}>
        <Text>Container relatif</Text>
        <View style={styles.absoluteView}>
          <Text style={styles.absoluteText}>Position absolue</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  basicView: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  borderedView: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  shadowView: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 5, // Android
    shadowColor: '#000', // iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  parentView: {
    backgroundColor: '#ffebee',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  parentText: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  childView: {
    backgroundColor: '#c8e6c9',
    padding: 10,
    marginVertical: 3,
    borderRadius: 5,
    marginLeft: 20,
  },
  childText: {
    fontSize: 14,
  },
  relativeContainer: {
    backgroundColor: '#fff3e0',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    height: 80,
    position: 'relative',
  },
  absoluteView: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff5722',
    padding: 5,
    borderRadius: 4,
  },
  absoluteText: {
    color: '#fff',
    fontSize: 12,
  },
});
```

### ScrollView - Contenu défilable

Pour du contenu qui dépasse l'écran :

```jsx
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ExempleScrollView() {
  // Génération de contenu factice
  const generateItems = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      title: `Élément ${i + 1}`,
      description: `Description détaillée de l'élément numéro ${i + 1}`,
    }));
  };

  const items = generateItems(50);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ScrollView Exemples</Text>
      
      {/* ScrollView vertical (par défaut) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Défilement vertical</Text>
        <ScrollView
          style={styles.verticalScroll}
          showsVerticalScrollIndicator={true}
          bounces={true} // iOS uniquement
          overScrollMode="always" // Android uniquement
        >
          {items.map((item) => (
            <View key={item.id} style={styles.verticalItem}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      
      {/* ScrollView horizontal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Défilement horizontal</Text>
        <ScrollView
          horizontal={true}
          style={styles.horizontalScroll}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={false}
          decelerationRate="fast"
        >
          {items.slice(0, 10).map((item) => (
            <View key={item.id} style={styles.horizontalItem}>
              <Text style={styles.horizontalItemText}>{item.title}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      
      {/* ScrollView avec sticky header */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Avec header sticky</Text>
        <ScrollView
          style={styles.stickyScroll}
          stickyHeaderIndices={[0]} // Index des headers à rendre sticky
        >
          <View style={styles.stickyHeader}>
            <Text style={styles.stickyHeaderText}>Header Sticky</Text>
          </View>
          {items.slice(0, 20).map((item) => (
            <View key={item.id} style={styles.stickyItem}>
              <Text>{item.title}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  section: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  
  // Vertical ScrollView
  verticalScroll: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    maxHeight: 150,
  },
  verticalItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 2,
    marginHorizontal: 5,
    borderRadius: 6,
    elevation: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
  
  // Horizontal ScrollView
  horizontalScroll: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  horizontalItem: {
    width: 120,
    height: 80,
    backgroundColor: '#007AFF',
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalItemText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Sticky ScrollView
  stickyScroll: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    maxHeight: 150,
  },
  stickyHeader: {
    backgroundColor: '#28a745',
    padding: 15,
    alignItems: 'center',
  },
  stickyHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stickyItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 1,
    marginHorizontal: 5,
  },
});
```

## 📋 Listes performantes avec FlatList

Pour de grandes listes, `FlatList` est plus performant que `ScrollView` car il utilise la virtualisation :

```jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';

export default function ExempleFlatList() {
  const [contacts, setContacts] = useState([
    { id: '1', name: 'Alice Martin', phone: '+33 6 12 34 56 78', email: 'alice@example.com' },
    { id: '2', name: 'Bob Dupont', phone: '+33 6 23 45 67 89', email: 'bob@example.com' },
    { id: '3', name: 'Claire Moreau', phone: '+33 6 34 56 78 90', email: 'claire@example.com' },
    { id: '4', name: 'David Leroy', phone: '+33 6 45 67 89 01', email: 'david@example.com' },
    { id: '5', name: 'Emma Durand', phone: '+33 6 56 78 90 12', email: 'emma@example.com' },
  ]);

  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Génération de plus de contacts pour test
  const generateMoreContacts = () => {
    const names = ['Sophie', 'Pierre', 'Marie', 'Paul', 'Julie', 'Marc', 'Laura', 'Tom'];
    const surnames = ['Bernard', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois'];
    
    return Array.from({ length: 50 }, (_, i) => {
      const name = names[Math.floor(Math.random() * names.length)];
      const surname = surnames[Math.floor(Math.random() * surnames.length)];
      return {
        id: `gen-${i}`,
        name: `${name} ${surname}`,
        phone: `+33 6 ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)}`,
        email: `${name.toLowerCase()}.${surname.toLowerCase()}@example.com`,
      };
    });
  };

  // Filtrage des contacts
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
    contact.phone.includes(searchText) ||
    contact.email.toLowerCase().includes(searchText.toLowerCase())
  );

  // Refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    // Simulation d'un appel API
    setTimeout(() => {
      const moreContacts = generateMoreContacts();
      setContacts(prev => [...prev, ...moreContacts.slice(0, 5)]);
      setRefreshing(false);
    }, 2000);
  };

  // Chargement de plus de données
  const loadMore = () => {
    const moreContacts = generateMoreContacts();
    setContacts(prev => [...prev, ...moreContacts.slice(0, 10)]);
  };

  // Suppression d'un contact
  const deleteContact = (id) => {
    Alert.alert(
      'Supprimer le contact',
      'Êtes-vous sûr de vouloir supprimer ce contact ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => setContacts(prev => prev.filter(c => c.id !== id)),
        },
      ]
    );
  };

  // Rendu d'un contact
  const renderContact = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        index % 2 === 0 ? styles.evenItem : styles.oddItem
      ]}
      onPress={() => Alert.alert('Contact', `Appeler ${item.name} ?`)}
      onLongPress={() => deleteContact(item.id)}
    >
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
        <Text style={styles.contactEmail}>{item.email}</Text>
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => Alert.alert('Appel', `Appel vers ${item.name}`)}
        >
          <Text style={styles.callButtonText}>📞</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Header de la liste
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>
        {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}
      </Text>
      {searchText !== '' && (
        <Text style={styles.searchInfo}>
          Recherche : "{searchText}"
        </Text>
      )}
    </View>
  );

  // Footer de la liste
  const renderFooter = () => (
    <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
      <Text style={styles.loadMoreText}>Charger plus de contacts</Text>
    </TouchableOpacity>
  );

  // État vide
  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {searchText ? 'Aucun contact trouvé' : 'Aucun contact'}
      </Text>
      <Text style={styles.emptyStateSubtext}>
        {searchText ? 'Essayez un autre terme de recherche' : 'Ajoutez votre premier contact'}
      </Text>
    </View>
  );

  // Séparateur d'items
  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Rechercher un contact..."
          placeholderTextColor="#999"
          clearButtonMode="while-editing" // iOS uniquement
        />
      </View>

      {/* Liste des contacts */}
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={renderSeparator}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 120,
          offset: 120 * index,
          index,
        })}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // Recherche
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    fontSize: 16,
  },
  
  // Header
  header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  searchInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  
  // Liste
  list: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    minHeight: 120,
  },
  evenItem: {
    backgroundColor: '#fff',
  },
  oddItem: {
    backgroundColor: '#f9f9f9',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 2,
  },
  contactEmail: {
    fontSize: 14,
    color: '#666',
  },
  contactActions: {
    marginLeft: 15,
  },
  callButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 20,
  },
  
  // Séparateur
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginLeft: 15,
  },
  
  // Footer
  loadMoreButton: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    margin: 15,
    borderRadius: 8,
  },
  loadMoreText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  
  // État vide
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
});
```

## 🎨 Mise en page avancée avec Flexbox

React Native utilise Flexbox par défaut, mais avec quelques spécificités mobiles :

```jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ExempleFlexboxAvance() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>Flexbox avancé</Text>
      
      {/* Direction et wrap */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Direction et wrap</Text>
        
        <Text style={styles.subsectionTitle}>flexDirection: 'row', flexWrap: 'wrap'</Text>
        <View style={styles.flexRowWrap}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <View key={i} style={styles.flexItem}>
              <Text style={styles.itemText}>{i}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Alignements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alignements</Text>
        
        <Text style={styles.subsectionTitle}>justifyContent variations</Text>
        <View style={styles.alignmentDemo}>
          <View style={[styles.alignmentContainer, { justifyContent: 'flex-start' }]}>
            <Text style={styles.alignmentLabel}>flex-start</Text>
            {[1, 2, 3].map(i => (
              <View key={i} style={styles.smallItem}>
                <Text>{i}</Text>
              </View>
            ))}
          </View>
          
          <View style={[styles.alignmentContainer, { justifyContent: 'center' }]}>
            <Text style={styles.alignmentLabel}>center</Text>
            {[1, 2, 3].map(i => (
              <View key={i} style={styles.smallItem}>
                <Text>{i}</Text>
              </View>
            ))}
          </View>
          
          <View style={[styles.alignmentContainer, { justifyContent: 'space-between' }]}>
            <Text style={styles.alignmentLabel}>space-between</Text>
            {[1, 2, 3].map(i => (
              <View key={i} style={styles.smallItem}>
                <Text>{i}</Text>
              </View>
            ))}
          </View>
          
          <View style={[styles.alignmentContainer, { justifyContent: 'space-around' }]}>
            <Text style={styles.alignmentLabel}>space-around</Text>
            {[1, 2, 3].map(i => (
              <View key={i} style={styles.smallItem}>
                <Text>{i}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      
      {/* Flex grow/shrink */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Flex properties</Text>
        
        <View style={styles.flexPropsContainer}>
          <View style={[styles.flexPropItem, { flex: 1, backgroundColor: '#FF6B6B' }]}>
            <Text style={styles.flexPropText}>flex: 1</Text>
          </View>
          <View style={[styles.flexPropItem, { flex: 2, backgroundColor: '#4ECDC4' }]}>
            <Text style={styles.flexPropText}>flex: 2</Text>
          </View>
          <View style={[styles.flexPropItem, { flex: 1, backgroundColor: '#45B7D1' }]}>
            <Text style={styles.flexPropText}>flex: 1</Text>
          </View>
        </View>
        
        <View style={styles.flexPropsContainer}>
          <View style={[styles.flexPropItem, { flexGrow: 1, backgroundColor: '#96CEB4' }]}>
            <Text style={styles.flexPropText}>flexGrow: 1</Text>
          </View>
          <View style={[styles.flexPropItem, { width: 100, backgroundColor: '#FECA57' }]}>
            <Text style={styles.flexPropText}>width: 100</Text>
          </View>
          <View style={[styles.flexPropItem, { flexShrink: 1, backgroundColor: '#FF9FF3' }]}>
            <Text style={styles.flexPropText}>flexShrink: 1</Text>
          </View>
        </View>
      </View>
      
      {/* Position absolute/relative */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Positionnement</Text>
        
        <View style={styles.positionContainer}>
          <View style={styles.relativeBox}>
            <Text>Position relative</Text>
            <View style={styles.absoluteTopRight}>
              <Text style={styles.absoluteText}>TR</Text>
            </View>
            <View style={styles.absoluteBottomLeft}>
              <Text style={styles.absoluteText}>BL</Text>
            </View>
            <View style={styles.absoluteCenter}>
              <Text style={styles.absoluteText}>Center</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Layout complexe */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Layout complexe</Text>
        
        <View style={styles.complexLayout}>
          {/* Header */}
          <View style={styles.complexHeader}>
            <Text style={styles.complexHeaderText}>Header</Text>
          </View>
          
          {/* Content area */}
          <View style={styles.complexContent}>
            {/* Sidebar */}
            <View style={styles.complexSidebar}>
              <Text style={styles.complexSidebarText}>Side</Text>
            </View>
            
            {/* Main content */}
            <View style={styles.complexMain}>
              <View style={styles.complexCard}>
                <Text style={styles.complexCardTitle}>Card 1</Text>
                <Text>Contenu de la carte</Text>
              </View>
              <View style={styles.complexCard}>
                <Text style={styles.complexCardTitle}>Card 2</Text>
                <Text>Contenu de la carte</Text>
              </View>
            </View>
          </View>
          
          {/* Footer */}
          <View style={styles.complexFooter}>
            <Text style={styles.complexFooterText}>Footer</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  
  // Sections
  section: {
    margin: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 8,
    color: '#666',
  },
  
  // Flex row wrap
  flexRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 8,
  },
  flexItem: {
    width: 60,
    height: 60,
    backgroundColor: '#2196f3',
    margin: 5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  
  // Alignments
  alignmentDemo: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  alignmentContainer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    borderRadius: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  alignmentLabel: {
    position: 'absolute',
    top: 2,
    left: 5,
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
  },
  smallItem: {
    width: 30,
    height: 30,
    backgroundColor: '#4caf50',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Flex properties
  flexPropsContainer: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  flexPropItem: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  flexPropText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  
  // Positioning
  positionContainer: {
    alignItems: 'center',
  },
  relativeBox: {
    width: 200,
    height: 150,
    backgroundColor: '#e1bee7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  absoluteTopRight: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 25,
    height: 25,
    backgroundColor: '#f44336',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  absoluteBottomLeft: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    width: 25,
    height: 25,
    backgroundColor: '#4caf50',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  absoluteCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 40,
    height: 40,
    backgroundColor: '#ff9800',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    marginLeft: -20,
  },
  absoluteText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Complex layout
  complexLayout: {
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  complexHeader: {
    height: 50,
    backgroundColor: '#3f51b5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  complexHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  complexContent: {
    flex: 1,
    flexDirection: 'row',
  },
  complexSidebar: {
    width: 80,
    backgroundColor: '#9c27b0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  complexSidebarText: {
    color: '#fff',
    fontWeight: 'bold',
    transform: [{ rotate: '-90deg' }],
  },
  complexMain: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  complexCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  complexCardTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  complexFooter: {
    height: 40,
    backgroundColor: '#607d8b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  complexFooterText: {
    color: '#fff',
    fontSize: 14,
  },
});
```

::: tip Bonnes pratiques pour les layouts
- **FlatList vs ScrollView** : Utilisez FlatList pour de grandes listes (>50 éléments)
- **getItemLayout** : Définissez-le pour FlatList si tous les éléments ont la même taille
- **removeClippedSubviews** : Activez pour de meilleures performances sur Android
- **flexGrow vs flex** : Préférez `flexGrow: 1` à `flex: 1` pour plus de contrôle
- **Position absolute** : Utilisez avec parcimonie, préférez Flexbox quand possible
:::

Dans la section suivante, nous verrons comment implémenter la [navigation](./navigation.md) pour créer des applications multi-écrans fluides et intuitives.