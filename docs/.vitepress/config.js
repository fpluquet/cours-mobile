export default {
  title: 'Développement mobile',
  description: 'Syllabus complet pour le développement mobile avec Flutter et React Native',
  
  // Configuration du thème
  themeConfig: {
    // Navigation principale
    nav: [
      { text: 'Accueil', link: '/' },
      { text: 'Introduction', link: '/introduction' },
      { 
        text: 'Dart', 
        items: [
          { text: 'Fondamentaux', link: '/dart/' },
          { text: 'Classes et POO', link: '/dart/classes' },
          { text: 'Programmation asynchrone', link: '/dart/async' },
          { text: 'Manipulation des données', link: '/dart/json' }
        ]
      },
      { 
        text: 'Flutter', 
        items: [
          { text: 'Introduction', link: '/flutter/' },
          { text: 'Widgets', link: '/flutter/widgets' },
          { text: 'Gestion d\'état', link: '/flutter/state-management' },
          { text: 'Architecture BLoC', link: '/flutter/bloc-architecture' },
          { text: 'Firebase', link: '/flutter/firebase-firestore' },
          { text: 'Bluetooth', link: '/flutter/bluetooth' },
          { text: 'Géolocalisation', link: '/flutter/geolocalisation' },
          { text: 'Batterie', link: '/flutter/batterie' },
          { text: 'Caméra', link: '/flutter/camera' },
          { text: 'Capteurs', link: '/flutter/capteurs' },
          { text: 'Stockage', link: '/flutter/stockage' },
          { text: 'Performance', link: '/flutter/performance' }
        ]
      },
      { 
        text: 'React Native', 
        items: [
          { text: 'Introduction', link: '/react-native/' },
          { text: 'Composants', link: '/react-native/composants' },
          { text: 'Navigation', link: '/react-native/navigation' }
        ]
      }
    ],

    // Sidebar - Configuration complète
    sidebar: {
      // Sidebar pour la section Dart
      '/dart/': [
        {
          text: '🎯 Langage Dart',
          items: [
            { text: 'Fondamentaux', link: '/dart/' },
            { text: 'Classes et POO', link: '/dart/classes' },
            { text: 'Programmation asynchrone', link: '/dart/async' },
            { text: 'Manipulation de données', link: '/dart/json' },
          ]
        }
      ],
      
      // Sidebar pour la section Flutter
      '/flutter/': [
        {
          text: '📱 Framework Flutter',
          items: [
            { text: 'Introduction', link: '/flutter/' },
            { text: 'Widgets avancés', link: '/flutter/widgets' },
            { text: 'Gestion d\'état', link: '/flutter/state-management' },
            { text: 'Architecture BLoC', link: '/flutter/bloc-architecture' },
            { text: 'Firebase & Firestore', link: '/flutter/firebase-firestore' }
          ]
        },
        {
          text: '🔧 Fonctionnalités mobiles',
          items: [
            { text: '📶 Bluetooth', link: '/flutter/bluetooth' },
            { text: '📍 Géolocalisation', link: '/flutter/geolocalisation' },
            { text: '🔋 Batterie', link: '/flutter/batterie' },
            { text: '📷 Caméra', link: '/flutter/camera' },
            { text: '📱 Capteurs', link: '/flutter/capteurs' },
            { text: '💾 Stockage', link: '/flutter/stockage' },
            { text: '⚡ Performance', link: '/flutter/performance' }
          ]
        }
      ],
      
      // Sidebar pour la section React Native
      '/react-native/': [
        {
          text: '⚛️ React Native',
          items: [
            { text: 'Introduction et bases', link: '/react-native/' },
            { text: 'Composants et layout', link: '/react-native/composants' },
            { text: 'Navigation', link: '/react-native/navigation' }
          ]
        }
      ],
      
      // Sidebar par défaut pour la racine
      '/': [
        {
          text: '📚 Guide de cours',
          items: [
            { text: 'Accueil', link: '/' },
            { text: 'Introduction', link: '/introduction' }
          ]
        },
        {
          text: '🎯 Langage Dart',
          items: [
            { text: 'Fondamentaux', link: '/dart/' },
            { text: 'Classes et POO', link: '/dart/classes' },
            { text: 'Programmation asynchrone', link: '/dart/async' },
            { text: 'Manipulation de données', link: '/dart/json' }
          ]
        },
        {
          text: '📱 Framework Flutter',
          items: [
            { text: 'Introduction', link: '/flutter/' },
            { text: 'Widgets avancés', link: '/flutter/widgets' },
            { text: 'Gestion d\'état', link: '/flutter/state-management' },
            { text: 'Architecture BLoC', link: '/flutter/bloc-architecture' },
            { text: 'Firebase & Firestore', link: '/flutter/firebase-firestore' }
          ]
        },
        {
          text: '⚛️ React Native',
          items: [
            { text: 'Introduction et bases', link: '/react-native/' },
            { text: 'Composants et layout', link: '/react-native/composants' },
            { text: 'Navigation', link: '/react-native/navigation' }
          ]
        }
      ]
    },

    // Configuration du footer
    footer: {
      message: 'Syllabus de développement mobile',
      copyright: 'Copyright © 2024-2025 Haute École Louvain en Hainaut (HELHa)'
    },

    // Recherche locale
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Rechercher',
            buttonAriaLabel: 'Rechercher'
          },
          modal: {
            displayDetails: 'Afficher les détails',
            resetButtonTitle: 'Effacer la recherche',
            backButtonTitle: 'Fermer la recherche',
            noResultsText: 'Aucun résultat pour',
            footer: {
              selectText: 'pour sélectionner',
              selectKeyAriaLabel: 'Entrer',
              navigateText: 'pour naviguer',
              navigateUpKeyAriaLabel: 'Flèche vers le haut',
              navigateDownKeyAriaLabel: 'Flèche vers le bas',
              closeText: 'pour fermer',
              closeKeyAriaLabel: 'Échap'
            }
          }
        }
      }
    },

    // Liens sociaux (optionnel)
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    // Configuration de l'édition
    editLink: {
      pattern: 'https://github.com/your-repo/edit/main/docs/:path',
      text: 'Modifier cette page'
    },

    // Configuration du "dernière mise à jour"
    lastUpdated: {
      text: 'Dernière mise à jour',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    // Outline dans la sidebar droite
    outline: {
      level: [2, 3],
      label: 'Sur cette page'
    }
  },

  // Configuration Markdown
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true,
    config: (md) => {
      // Configuration personnalisée de markdown-it si nécessaire
    }
  },

  // Configuration du head HTML
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  // Configuration du serveur de développement
  server: {
    port: 5173,
    host: true
  }
}