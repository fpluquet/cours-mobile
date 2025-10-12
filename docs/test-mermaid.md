# Test Mermaid

Ce fichier est un test pour vérifier que les diagrammes Mermaid fonctionnent correctement.

## Diagramme de flux simple

```mermaid
flowchart TD
    A[Début] --> B{Condition ?}
    B -->|Oui| C[Action 1]
    B -->|Non| D[Action 2]
    C --> E[Fin]
    D --> E
```

## Diagramme de séquence

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant A as Application Flutter
    participant F as Firebase
    
    U->>A: Ouvrir l'application
    A->>F: Authentification
    F-->>A: Token d'accès
    A->>F: Récupérer données
    F-->>A: Données utilisateur
    A-->>U: Affichage interface
```

## Diagramme d'état

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading: Démarrer requête
    Loading --> Success: Données reçues
    Loading --> Error: Erreur réseau
    Success --> Idle: Reset
    Error --> Idle: Retry
    Error --> [*]: Quitter
```

## Architecture Flutter avec Firebase

```mermaid
graph TB
    subgraph "Application Flutter"
        UI[Interface Utilisateur]
        BL[Logique Métier]
        RP[Repository Pattern]
    end
    
    subgraph "Firebase Services"
        AUTH[Authentication]
        FS[Cloud Firestore]
        ST[Cloud Storage]
        FCM[Cloud Messaging]
    end
    
    UI --> BL
    BL --> RP
    RP --> AUTH
    RP --> FS
    RP --> ST
    RP --> FCM
```