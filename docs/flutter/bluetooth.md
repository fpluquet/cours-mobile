# Bluetooth

## Introduction

Le Bluetooth est une technologie de communication sans fil de courte portée qui permet à des appareils de communiquer entre eux sans nécessiter de connexion Internet. Cette technologie est omniprésente dans le développement mobile moderne pour connecter smartphones, tablettes et autres appareils IoT.

## Fonctionnement général du Bluetooth

### Architecture et principes de base

Le Bluetooth utilise la bande de fréquence ISM (Industrial, Scientific and Medical) de 2,4 GHz, divisée en 79 canaux différents. Les appareils "sautent" rapidement entre ces canaux (frequency hopping) pour éviter les interférences.

#### Les rôles dans une communication Bluetooth

1. **Master (Maître)** : L'appareil qui initie la connexion
2. **Slave (Esclave)** : L'appareil qui accepte la connexion
3. **Piconet** : Réseau formé par un master et jusqu'à 7 slaves actifs

### Comment les appareils se découvrent et se connectent

```mermaid
sequenceDiagram
    participant A as Appareil A (Master)
    participant B as Appareil B (Slave)
    
    A->>A: Mode "Discoverable"
    B->>B: Mode "Inquiry/Scan"
    A->>B: Diffusion d'annonce
    B->>A: Réponse d'inquiry
    A->>B: Demande de connexion
    B->>A: Acceptation
    A->>B: Authentification/Pairing
    B->>A: Confirmation
    A<->B: Communication établie
```

### Les profils Bluetooth

Les profils définissent comment les appareils utilisent Bluetooth pour des applications spécifiques :

- **SPP (Serial Port Profile)** : Communication série simple
- **HID (Human Interface Device)** : Claviers, souris
- **A2DP (Advanced Audio Distribution Profile)** : Audio haute qualité
- **HFP (Hands-Free Profile)** : Kits mains libres
- **GATT (Generic Attribute Profile)** : Bluetooth Low Energy

## Bluetooth Classic vs Bluetooth Low Energy (BLE)

### Bluetooth Classic
- **Portée** : 10-100 mètres
- **Consommation** : Élevée
- **Débit** : Jusqu'à 2-3 Mbps
- **Usage** : Audio, transfert de fichiers

### Bluetooth Low Energy (BLE)
- **Portée** : 10-50 mètres
- **Consommation** : Très faible
- **Débit** : 125 Kbps - 2 Mbps
- **Usage** : Capteurs, IoT, wearables

## Architecture GATT/ATT (pour BLE)

```
Profil
├── Service 1 (UUID)
│   ├── Caractéristique A (Read)
│   ├── Caractéristique B (Write)
│   └── Caractéristique C (Notify)
└── Service 2 (UUID)
    ├── Caractéristique D (Read/Write)
    └── Descripteurs
```

### Rôles GATT
- **GATT Server** : Appareil qui fournit des données
- **GATT Client** : Appareil qui consomme des données

## Packages Flutter

### flutter_bluetooth_serial

Ce package permet de gérer les connexions Bluetooth classiques sur Flutter. Il offre des fonctionnalités pour la découverte d'appareils, la connexion, l'envoi et la réception de données.

```bash
flutter pub add flutter_bluetooth_serial
```

### flutter_blue_plus

Ce package est une version améliorée de flutter_blue, offrant une meilleure prise en charge de Bluetooth Low Energy (BLE) avec des fonctionnalités supplémentaires et des corrections de bugs.

```bash
flutter pub add flutter_blue_plus
```

## Configuration

### Android (android/app/src/main/AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
```

### iOS (ios/Runner/Info.plist)
```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>Cette app utilise Bluetooth pour connecter des appareils externes</string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string>Cette app utilise Bluetooth pour connecter des appareils externes</string>
```

## Exemples d'implémentation - Étape par étape

### Étape 1 : Configuration initiale et permissions

D'abord, nous devons vérifier et demander les permissions nécessaires :

```dart
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:permission_handler/permission_handler.dart';

class BluetoothSetup {
  // Vérifier et demander les permissions
  static Future<bool> requestPermissions() async {
    // Android 12+ nécessite des permissions spécifiques
    Map<Permission, PermissionStatus> statuses = await [
      Permission.bluetooth,        // Permission Bluetooth de base
      Permission.bluetoothScan,    // Scanner les appareils
      Permission.bluetoothConnect, // Se connecter aux appareils
      Permission.location,         // Requis pour le scan sur Android
    ].request();
    
    // Vérifier que toutes les permissions sont accordées
    return statuses.values.every((status) => status.isGranted);
  }
  
  // Vérifier si Bluetooth est disponible et activé
  static Future<bool> isBluetoothReady() async {
    // Vérifier la disponibilité hardware
    bool isAvailable = await FlutterBluePlus.isAvailable;
    if (!isAvailable) {
      print("Bluetooth non disponible sur cet appareil");
      return false;
    }
    
    // Vérifier si Bluetooth est activé
    bool isOn = await FlutterBluePlus.isOn;
    if (!isOn) {
      print("Bluetooth est désactivé - demander à l'utilisateur de l'activer");
      return false;
    }
    
    return true;
  }
}
```

**Explication :**
- Les permissions sont essentielles sur Android 12+
- `Permission.location` est nécessaire car le scan peut révéler la position
- On vérifie d'abord le hardware, puis l'état d'activation

### Étape 2 : Scanner les appareils disponibles

```dart
class BluetoothScanner {
  List<ScanResult> _discoveredDevices = [];
  
  // Démarrer un scan simple
  Future<void> startBasicScan() async {
    // Nettoyer les résultats précédents
    _discoveredDevices.clear();
    
    print("Démarrage du scan...");
    
    // Écouter les appareils découverts
    FlutterBluePlus.scanResults.listen((results) {
      _discoveredDevices = results;
      print("Trouvé ${results.length} appareils");
    });
    
    // Lancer le scan avec un timeout de 5 secondes
    await FlutterBluePlus.startScan(
      timeout: Duration(seconds: 5)
    );
    
    print("Scan terminé");
  }
  
  // Scanner avec des filtres spécifiques
  Future<void> startFilteredScan() async {
    _discoveredDevices.clear();
    
    // Scanner uniquement les appareils avec certains services
    List<String> serviceUuids = [
      "180F", // Service Batterie
      "180A", // Service Informations Appareil
    ];
    
    FlutterBluePlus.scanResults.listen((results) {
      _discoveredDevices = results;
    });
    
    await FlutterBluePlus.startScan(
      timeout: Duration(seconds: 10),
      withServices: serviceUuids.map((uuid) => Guid(uuid)).toList(),
    );
  }
  
  // Arrêter le scan
  Future<void> stopScan() async {
    await FlutterBluePlus.stopScan();
    print("Scan arrêté");
  }
  
  // Obtenir la liste des appareils trouvés
  List<ScanResult> getDiscoveredDevices() {
    return _discoveredDevices;
  }
}
```

**Explication :**
- `scanResults.listen()` écoute en temps réel les appareils trouvés
- Le timeout évite un scan infini qui consomme la batterie
- Les filtres permettent de chercher des types d'appareils spécifiques

### Étape 3 : Interface utilisateur pour afficher les appareils

```dart
class DeviceListWidget extends StatefulWidget {
  @override
  _DeviceListWidgetState createState() => _DeviceListWidgetState();
}

class _DeviceListWidgetState extends State<DeviceListWidget> {
  BluetoothScanner scanner = BluetoothScanner();
  bool isScanning = false;
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Bouton pour démarrer/arrêter le scan
        ElevatedButton(
          onPressed: isScanning ? _stopScan : _startScan,
          child: Text(isScanning ? 'Arrêter' : 'Scanner'),
        ),
        
        // Liste des appareils trouvés
        Expanded(
          child: ListView.builder(
            itemCount: scanner.getDiscoveredDevices().length,
            itemBuilder: (context, index) {
              ScanResult result = scanner.getDiscoveredDevices()[index];
              return _buildDeviceItem(result);
            },
          ),
        ),
      ],
    );
  }
  
  // Widget pour afficher un appareil
  Widget _buildDeviceItem(ScanResult result) {
    return ListTile(
      title: Text(
        result.device.name.isEmpty 
            ? 'Appareil inconnu' 
            : result.device.name
      ),
      subtitle: Text('ID: ${result.device.id}'),
      trailing: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text('${result.rssi} dBm'), // Force du signal
          Icon(
            result.rssi > -60 ? Icons.signal_wifi_4_bar :
            result.rssi > -80 ? Icons.signal_wifi_3_bar :
            Icons.signal_wifi_1_bar,
            color: result.rssi > -60 ? Colors.green : 
                   result.rssi > -80 ? Colors.orange : Colors.red,
          ),
        ],
      ),
      onTap: () => _connectToDevice(result.device),
    );
  }
  
  void _startScan() async {
    setState(() => isScanning = true);
    await scanner.startBasicScan();
    setState(() => isScanning = false);
  }
  
  void _stopScan() async {
    await scanner.stopScan();
    setState(() => isScanning = false);
  }
  
  void _connectToDevice(BluetoothDevice device) {
    // Navigation vers l'écran de connexion
    print('Connexion à ${device.name}');
  }
}
```

**Explication :**
- L'interface montre la liste des appareils en temps réel
- Le RSSI (force du signal) aide à choisir le meilleur appareil
- Les icônes donnent un feedback visuel sur la qualité du signal

### Étape 4 : Se connecter à un appareil

```dart
class BluetoothConnection {
  BluetoothDevice? connectedDevice;
  bool isConnected = false;
  
  // Étape 1 : Établir la connexion
  Future<bool> connectToDevice(BluetoothDevice device) async {
    try {
      print("Tentative de connexion à ${device.name}...");
      
      // Se connecter à l'appareil
      await device.connect();
      
      // Sauvegarder la référence
      connectedDevice = device;
      isConnected = true;
      
      print("Connexion réussie !");
      return true;
      
    } catch (e) {
      print("Erreur de connexion : $e");
      isConnected = false;
      return false;
    }
  }
  
  // Étape 2 : Écouter les changements d'état
  void monitorConnection() {
    if (connectedDevice == null) return;
    
    connectedDevice!.state.listen((state) {
      switch (state) {
        case BluetoothDeviceState.connected:
          print("Appareil connecté");
          isConnected = true;
          break;
        case BluetoothDeviceState.disconnected:
          print("Appareil déconnecté");
          isConnected = false;
          break;
        case BluetoothDeviceState.connecting:
          print("Connexion en cours...");
          break;
        case BluetoothDeviceState.disconnecting:
          print("Déconnexion en cours...");
          break;
      }
    });
  }
  
  // Étape 3 : Se déconnecter proprement
  Future<void> disconnect() async {
    if (connectedDevice != null) {
      await connectedDevice!.disconnect();
      connectedDevice = null;
      isConnected = false;
      print("Déconnexion terminée");
    }
  }
}
```

**Explication :**
- `device.connect()` établit la connexion physique
- L'écoute de `device.state` permet de réagir aux changements
- La déconnexion libère les ressources

### Étape 5 : Découvrir les services et caractéristiques

Une fois connecté, nous devons explorer ce que l'appareil peut faire :

```dart
class ServiceDiscovery {
  List<BluetoothService> discoveredServices = [];
  
  // Découvrir tous les services disponibles
  Future<void> discoverServices(BluetoothDevice device) async {
    print("Découverte des services...");
    
    try {
      // Lancer la découverte
      discoveredServices = await device.discoverServices();
      
      print("Trouvé ${discoveredServices.length} services");
      
      // Afficher les détails de chaque service
      for (BluetoothService service in discoveredServices) {
        _analyzeService(service);
      }
      
    } catch (e) {
      print("Erreur découverte services : $e");
    }
  }
  
  // Analyser un service et ses caractéristiques
  void _analyzeService(BluetoothService service) {
    print("\n--- Service ---");
    print("UUID : ${service.uuid}");
    print("Nombre de caractéristiques : ${service.characteristics.length}");
    
    // Examiner chaque caractéristique
    for (BluetoothCharacteristic characteristic in service.characteristics) {
      _analyzeCharacteristic(characteristic);
    }
  }
  
  // Analyser une caractéristique
  void _analyzeCharacteristic(BluetoothCharacteristic characteristic) {
    print("\n  --- Caractéristique ---");
    print("  UUID : ${characteristic.uuid}");
    print("  Propriétés :");
    
    // Vérifier les propriétés disponibles
    if (characteristic.properties.read) {
      print("    ✓ Lecture possible");
    }
    if (characteristic.properties.write) {
      print("    ✓ Écriture possible");
    }
    if (characteristic.properties.notify) {
      print("    ✓ Notifications possibles");
    }
    if (characteristic.properties.indicate) {
      print("    ✓ Indications possibles");
    }
  }
  
  // Trouver une caractéristique spécifique
  BluetoothCharacteristic? findCharacteristic(String serviceUuid, String characteristicUuid) {
    for (BluetoothService service in discoveredServices) {
      if (service.uuid.toString().toLowerCase() == serviceUuid.toLowerCase()) {
        for (BluetoothCharacteristic characteristic in service.characteristics) {
          if (characteristic.uuid.toString().toLowerCase() == characteristicUuid.toLowerCase()) {
            return characteristic;
          }
        }
      }
    }
    return null;
  }
}
```

**Explication :**
- Chaque appareil Bluetooth expose des "services" (fonctionnalités)
- Chaque service contient des "caractéristiques" (données ou actions)
- Les propriétés indiquent ce qu'on peut faire (lire, écrire, être notifié)

### Étape 6 : Lire des données

```dart
class DataReader {
  
  // Lire une valeur simple
  Future<String?> readCharacteristic(BluetoothCharacteristic characteristic) async {
    try {
      // Vérifier qu'on peut lire
      if (!characteristic.properties.read) {
        print("Cette caractéristique ne peut pas être lue");
        return null;
      }
      
      print("Lecture en cours...");
      
      // Lire la valeur
      List<int> value = await characteristic.read();
      
      // Convertir en chaîne de caractères
      String result = String.fromCharCodes(value);
      
      print("Valeur lue : $result");
      return result;
      
    } catch (e) {
      print("Erreur lecture : $e");
      return null;
    }
  }
  
  // Lire un nombre entier
  Future<int?> readIntegerValue(BluetoothCharacteristic characteristic) async {
    try {
      List<int> value = await characteristic.read();
      
      if (value.length >= 2) {
        // Conversion little-endian (le plus courant)
        int result = (value[1] << 8) | value[0];
        print("Valeur entière : $result");
        return result;
      }
      
      return null;
    } catch (e) {
      print("Erreur lecture entier : $e");
      return null;
    }
  }
  
  // Lire un pourcentage de batterie (exemple concret)
  Future<int?> readBatteryLevel(BluetoothDevice device) async {
    // Service batterie standard
    const String BATTERY_SERVICE = "180F";
    const String BATTERY_LEVEL = "2A19";
    
    ServiceDiscovery discovery = ServiceDiscovery();
    await discovery.discoverServices(device);
    
    BluetoothCharacteristic? batteryChar = discovery.findCharacteristic(
      BATTERY_SERVICE, 
      BATTERY_LEVEL
    );
    
    if (batteryChar != null) {
      List<int> value = await batteryChar.read();
      if (value.isNotEmpty) {
        int batteryPercent = value[0]; // Premier byte = pourcentage
        print("Niveau batterie : $batteryPercent%");
        return batteryPercent;
      }
    }
    
    return null;
  }
}
```

**Explication :**
- `characteristic.read()` retourne une liste d'entiers (bytes)
- Il faut convertir ces bytes selon le format attendu
- Certains services suivent des standards (comme le service batterie)

### Étape 7 : Écrire des données

```dart
class DataWriter {
  
  // Envoyer un message texte simple
  Future<bool> writeText(BluetoothCharacteristic characteristic, String message) async {
    try {
      // Vérifier qu'on peut écrire
      if (!characteristic.properties.write) {
        print("Cette caractéristique ne peut pas être écrite");
        return false;
      }
      
      print("Envoi du message : $message");
      
      // Convertir le texte en bytes
      List<int> bytes = message.codeUnits;
      
      // Envoyer les données
      await characteristic.write(bytes);
      
      print("Message envoyé avec succès");
      return true;
      
    } catch (e) {
      print("Erreur envoi : $e");
      return false;
    }
  }
  
  // Envoyer un nombre entier
  Future<bool> writeInteger(BluetoothCharacteristic characteristic, int value) async {
    try {
      // Convertir l'entier en bytes (little-endian)
      List<int> bytes = [
        value & 0xFF,        // Byte de poids faible
        (value >> 8) & 0xFF, // Byte de poids fort
      ];
      
      await characteristic.write(bytes);
      print("Entier $value envoyé");
      return true;
      
    } catch (e) {
      print("Erreur envoi entier : $e");
      return false;
    }
  }
  
  // Envoyer une commande avec paramètres
  Future<bool> sendCommand(BluetoothCharacteristic characteristic, String command, Map<String, dynamic> params) async {
    try {
      // Créer un message structuré
      Map<String, dynamic> message = {
        'command': command,
        'parameters': params,
        'timestamp': DateTime.now().millisecondsSinceEpoch,
      };
      
      // Convertir en JSON puis en bytes
      String jsonString = jsonEncode(message);
      List<int> bytes = utf8.encode(jsonString);
      
      await characteristic.write(bytes);
      print("Commande '$command' envoyée");
      return true;
      
    } catch (e) {
      print("Erreur envoi commande : $e");
      return false;
    }
  }
}
```

**Explication :**
- Les données sont toujours envoyées sous forme de bytes
- Il faut convertir texte, nombres ou JSON en bytes
- Vérifier toujours les propriétés avant d'écrire

### Étape 8 : Recevoir des notifications

```dart
class NotificationListener {
  StreamSubscription<List<int>>? _subscription;
  
  // S'abonner aux notifications d'une caractéristique
  Future<bool> subscribeToNotifications(BluetoothCharacteristic characteristic) async {
    try {
      // Vérifier que les notifications sont supportées
      if (!characteristic.properties.notify) {
        print("Cette caractéristique ne supporte pas les notifications");
        return false;
      }
      
      print("Activation des notifications...");
      
      // Activer les notifications
      await characteristic.setNotifyValue(true);
      
      // Écouter les données entrantes
      _subscription = characteristic.value.listen(
        (data) => _handleNotification(data),
        onError: (error) => print("Erreur notification : $error"),
      );
      
      print("Notifications activées");
      return true;
      
    } catch (e) {
      print("Erreur activation notifications : $e");
      return false;
    }
  }
  
  // Traiter une notification reçue
  void _handleNotification(List<int> data) {
    print("Notification reçue : ${data.length} bytes");
    
    // Essayer de décoder comme texte
    try {
      String text = String.fromCharCodes(data);
      print("Contenu texte : $text");
    } catch (e) {
      // Si ce n'est pas du texte, afficher les bytes
      print("Données brutes : $data");
    }
  }
  
  // Se désabonner des notifications
  Future<void> unsubscribeFromNotifications(BluetoothCharacteristic characteristic) async {
    try {
      // Désactiver les notifications
      await characteristic.setNotifyValue(false);
      
      // Annuler l'abonnement
      await _subscription?.cancel();
      _subscription = null;
      
      print("Notifications désactivées");
    } catch (e) {
      print("Erreur désactivation notifications : $e");
    }
  }
}
```

**Explication :**
- Les notifications permettent de recevoir des données automatiquement
- `setNotifyValue(true)` active les notifications
- `characteristic.value.listen()` écoute les données entrantes

### Étape 9 : Exemple complet - Communication simple

```dart
class SimpleCommunicationExample extends StatefulWidget {
  final BluetoothDevice device;
  
  SimpleCommunicationExample({required this.device});
  
  @override
  _SimpleCommunicationExampleState createState() => _SimpleCommunicationExampleState();
}

class _SimpleCommunicationExampleState extends State<SimpleCommunicationExample> {
  BluetoothConnection connection = BluetoothConnection();
  ServiceDiscovery discovery = ServiceDiscovery();
  DataReader reader = DataReader();
  DataWriter writer = DataWriter();
  NotificationListener notificationListener = NotificationListener();
  
  BluetoothCharacteristic? writeCharacteristic;
  BluetoothCharacteristic? readCharacteristic;
  
  String receivedMessages = "";
  TextEditingController messageController = TextEditingController();
  
  @override
  void initState() {
    super.initState();
    _setupCommunication();
  }
  
  // Configuration complète de la communication
  Future<void> _setupCommunication() async {
    // Étape 1 : Se connecter
    bool connected = await connection.connectToDevice(widget.device);
    if (!connected) {
      print("Échec de la connexion");
      return;
    }
    
    // Étape 2 : Découvrir les services
    await discovery.discoverServices(widget.device);
    
    // Étape 3 : Trouver les caractéristiques utiles
    _findUsefulCharacteristics();
    
    // Étape 4 : Activer les notifications si possible
    if (readCharacteristic != null) {
      await notificationListener.subscribeToNotifications(readCharacteristic!);
    }
    
    setState(() {}); // Rafraîchir l'interface
  }
  
  void _findUsefulCharacteristics() {
    for (BluetoothService service in discovery.discoveredServices) {
      for (BluetoothCharacteristic characteristic in service.characteristics) {
        // Chercher une caractéristique pour écrire
        if (characteristic.properties.write && writeCharacteristic == null) {
          writeCharacteristic = characteristic;
          print("Caractéristique d'écriture trouvée");
        }
        
        // Chercher une caractéristique pour lire/notifications
        if ((characteristic.properties.read || characteristic.properties.notify) && readCharacteristic == null) {
          readCharacteristic = characteristic;
          print("Caractéristique de lecture trouvée");
        }
      }
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Communication Simple'),
        backgroundColor: connection.isConnected ? Colors.green : Colors.red,
      ),
      body: Column(
        children: [
          // État de la connexion
          _buildConnectionStatus(),
          
          // Zone de messages reçus
          _buildMessagesArea(),
          
          // Interface d'envoi
          _buildSendInterface(),
        ],
      ),
    );
  }
  
  Widget _buildConnectionStatus() {
    return Container(
      padding: EdgeInsets.all(16),
      color: connection.isConnected ? Colors.green[100] : Colors.red[100],
      child: Row(
        children: [
          Icon(
            connection.isConnected ? Icons.bluetooth_connected : Icons.bluetooth_disabled,
            color: connection.isConnected ? Colors.green : Colors.red,
          ),
          SizedBox(width: 8),
          Text(
            connection.isConnected ? 'Connecté' : 'Déconnecté',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          Spacer(),
          Text('Écriture: ${writeCharacteristic != null ? "✓" : "✗"}'),
          SizedBox(width: 16),
          Text('Lecture: ${readCharacteristic != null ? "✓" : "✗"}'),
        ],
      ),
    );
  }
  
  Widget _buildMessagesArea() {
    return Expanded(
      child: Container(
        margin: EdgeInsets.all(16),
        padding: EdgeInsets.all(8),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Messages reçus:', style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Expanded(
              child: SingleChildScrollView(
                child: Text(
                  receivedMessages.isEmpty ? 'Aucun message reçu' : receivedMessages,
                  style: TextStyle(fontFamily: 'monospace'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildSendInterface() {
    return Container(
      padding: EdgeInsets.all(16),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: messageController,
              decoration: InputDecoration(
                hintText: 'Tapez votre message...',
                border: OutlineInputBorder(),
              ),
              enabled: writeCharacteristic != null,
            ),
          ),
          SizedBox(width: 8),
          ElevatedButton(
            onPressed: writeCharacteristic != null ? _sendMessage : null,
            child: Text('Envoyer'),
          ),
        ],
      ),
    );
  }
  
  Future<void> _sendMessage() async {
    if (writeCharacteristic != null && messageController.text.isNotEmpty) {
      bool success = await writer.writeText(writeCharacteristic!, messageController.text);
      if (success) {
        messageController.clear();
      }
    }
  }
  
  @override
  void dispose() {
    connection.disconnect();
    messageController.dispose();
    super.dispose();
  }
}
```

**Explication complète :**
1. **Configuration** : On connecte, découvre et configure tout automatiquement
2. **Interface** : Simple et claire pour voir l'état et communiquer
3. **Gestion d'erreurs** : Chaque étape vérifie les erreurs
4. **Nettoyage** : On se déconnecte proprement à la fin

## Exemple pratique : Communication entre deux appareils

### Scénario simplifié : Envoi de messages entre smartphones

Voici un exemple étape par étape pour faire communiquer deux appareils :

#### Étape 1 : Préparation des deux appareils

```dart
// Configuration identique sur les deux appareils
class BluetoothMessenger {
  static const String SERVICE_UUID = "12345678-1234-1234-1234-123456789abc";
  static const String MESSAGE_CHARACTERISTIC_UUID = "87654321-4321-4321-4321-cba987654321";
  
  BluetoothDevice? connectedDevice;
  BluetoothCharacteristic? messageCharacteristic;
  StreamController<String> messageStream = StreamController<String>.broadcast();
  
  Stream<String> get messages => messageStream.stream;
}
```

#### Étape 2 : Premier appareil - Mode "Serveur" (en attente)

```dart
class BluetoothServer extends BluetoothMessenger {
  
  // Démarrer en mode serveur (rendre visible)
  Future<void> startServer() async {
    print("Démarrage du mode serveur...");
    print("L'appareil est maintenant visible pour connexion");
    
    // Note: En BLE, il faut configurer l'appareil comme périphérique
    // Pour cet exemple, on simule l'attente d'une connexion
    
    // Surveiller les connexions entrantes
    _listenForConnections();
  }
  
  void _listenForConnections() {
    print("En attente de connexion...");
    // Dans un vrai cas, on configurerait des services GATT personnalisés
    // et on attendrait qu'un client se connecte
  }
  
  // Accepter une connexion
  Future<void> acceptConnection(BluetoothDevice device) async {
    try {
      connectedDevice = device;
      await _setupCommunication(device);
      print("Client connecté : ${device.name}");
    } catch (e) {
      print("Erreur acceptation connexion : $e");
    }
  }
  
  Future<void> _setupCommunication(BluetoothDevice device) async {
    // Découvrir les services du client
    List<BluetoothService> services = await device.discoverServices();
    
    // Trouver notre service de messagerie
    for (BluetoothService service in services) {
      if (service.uuid.toString() == SERVICE_UUID) {
        for (BluetoothCharacteristic characteristic in service.characteristics) {
          if (characteristic.uuid.toString() == MESSAGE_CHARACTERISTIC_UUID) {
            messageCharacteristic = characteristic;
            
            // Activer les notifications pour recevoir des messages
            if (characteristic.properties.notify) {
              await characteristic.setNotifyValue(true);
              characteristic.value.listen((data) {
                String message = String.fromCharCodes(data);
                messageStream.add("Client: $message");
              });
            }
            break;
          }
        }
      }
    }
  }
}
```

#### Étape 3 : Deuxième appareil - Mode "Client" (se connecter)

```dart
class BluetoothClient extends BluetoothMessenger {
  
  // Scanner et se connecter au serveur
  Future<bool> connectToServer() async {
    print("Recherche d'un serveur...");
    
    // Scanner les appareils
    List<BluetoothDevice> devices = await _scanForServers();
    
    if (devices.isEmpty) {
      print("Aucun serveur trouvé");
      return false;
    }
    
    // Se connecter au premier serveur trouvé
    BluetoothDevice server = devices.first;
    return await _connectToDevice(server);
  }
  
  Future<List<BluetoothDevice>> _scanForServers() async {
    List<BluetoothDevice> servers = [];
    
    // Démarrer le scan
    FlutterBluePlus.scanResults.listen((results) {
      for (ScanResult result in results) {
        // Vérifier si l'appareil a notre service
        if (result.advertisementData.serviceUuids.contains(Guid(SERVICE_UUID))) {
          servers.add(result.device);
        }
      }
    });
    
    await FlutterBluePlus.startScan(timeout: Duration(seconds: 10));
    await FlutterBluePlus.stopScan();
    
    return servers;
  }
  
  Future<bool> _connectToDevice(BluetoothDevice device) async {
    try {
      print("Connexion au serveur ${device.name}...");
      
      // Se connecter
      await device.connect();
      connectedDevice = device;
      
      // Configurer la communication
      await _setupCommunication(device);
      
      print("Connecté avec succès !");
      return true;
      
    } catch (e) {
      print("Erreur connexion : $e");
      return false;
    }
  }
  
  Future<void> _setupCommunication(BluetoothDevice device) async {
    // Même logique que le serveur pour trouver les caractéristiques
    List<BluetoothService> services = await device.discoverServices();
    
    for (BluetoothService service in services) {
      if (service.uuid.toString() == SERVICE_UUID) {
        for (BluetoothCharacteristic characteristic in service.characteristics) {
          if (characteristic.uuid.toString() == MESSAGE_CHARACTERISTIC_UUID) {
            messageCharacteristic = characteristic;
            
            // Écouter les messages du serveur
            if (characteristic.properties.notify) {
              await characteristic.setNotifyValue(true);
              characteristic.value.listen((data) {
                String message = String.fromCharCodes(data);
                messageStream.add("Serveur: $message");
              });
            }
            break;
          }
        }
      }
    }
  }
}
```

#### Étape 4 : Envoi de messages (commun aux deux)

```dart
// Méthode commune pour envoyer des messages
extension BluetoothMessengerSend on BluetoothMessenger {
  
  Future<bool> sendMessage(String message) async {
    if (messageCharacteristic == null) {
      print("Pas de connexion établie");
      return false;
    }
    
    try {
      // Convertir le message en bytes
      List<int> data = utf8.encode(message);
      
      // Envoyer le message
      await messageCharacteristic!.write(data);
      
      // Ajouter à notre flux local
      messageStream.add("Moi: $message");
      
      print("Message envoyé: $message");
      return true;
      
    } catch (e) {
      print("Erreur envoi message: $e");
      return false;
    }
  }
  
  void disconnect() {
    connectedDevice?.disconnect();
    messageStream.close();
  }
}
```

#### Étape 5 : Interface utilisateur complète

```dart
class MessagingApp extends StatefulWidget {
  @override
  _MessagingAppState createState() => _MessagingAppState();
}

class _MessagingAppState extends State<MessagingApp> {
  BluetoothMessenger? messenger;
  List<String> messages = [];
  TextEditingController messageController = TextEditingController();
  bool isConnected = false;
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Bluetooth Messenger'),
        backgroundColor: isConnected ? Colors.green : Colors.grey,
      ),
      body: Column(
        children: [
          // Boutons de connexion
          if (!isConnected) _buildConnectionButtons(),
          
          // Liste des messages
          Expanded(child: _buildMessagesList()),
          
          // Interface d'envoi
          if (isConnected) _buildSendInterface(),
        ],
      ),
    );
  }
  
  Widget _buildConnectionButtons() {
    return Padding(
      padding: EdgeInsets.all(16),
      child: Row(
        children: [
          Expanded(
            child: ElevatedButton(
              onPressed: _startAsServer,
              child: Text('Être Serveur'),
            ),
          ),
          SizedBox(width: 16),
          Expanded(
            child: ElevatedButton(
              onPressed: _connectAsClient,
              child: Text('Se Connecter'),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildMessagesList() {
    return ListView.builder(
      itemCount: messages.length,
      itemBuilder: (context, index) {
        return Padding(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          child: Text(messages[index]),
        );
      },
    );
  }
  
  Widget _buildSendInterface() {
    return Padding(
      padding: EdgeInsets.all(16),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: messageController,
              decoration: InputDecoration(
                hintText: 'Tapez votre message...',
                border: OutlineInputBorder(),
              ),
              onSubmitted: (_) => _sendMessage(),
            ),
          ),
          SizedBox(width: 8),
          ElevatedButton(
            onPressed: _sendMessage,
            child: Text('Envoyer'),
          ),
        ],
      ),
    );
  }
  
  void _startAsServer() async {
    messenger = BluetoothServer();
    await (messenger as BluetoothServer).startServer();
    _listenToMessages();
    setState(() => isConnected = true);
  }
  
  void _connectAsClient() async {
    messenger = BluetoothClient();
    bool success = await (messenger as BluetoothClient).connectToServer();
    if (success) {
      _listenToMessages();
      setState(() => isConnected = true);
    }
  }
  
  void _listenToMessages() {
    messenger!.messages.listen((message) {
      setState(() {
        messages.add(message);
      });
    });
  }
  
  void _sendMessage() {
    if (messageController.text.isNotEmpty) {
      messenger!.sendMessage(messageController.text);
      messageController.clear();
    }
  }
  
  @override
  void dispose() {
    messenger?.disconnect();
    messageController.dispose();
    super.dispose();
  }
}
```

### Résumé du processus de communication

1. **Appareil A** démarre en mode serveur et attend
2. **Appareil B** scanne et trouve l'appareil A
3. **Appareil B** se connecte à l'appareil A
4. Les deux appareils configurent leurs caractéristiques
5. Ils peuvent maintenant s'échanger des messages
6. Chaque message est converti en bytes puis envoyé
7. L'autre appareil reçoit les bytes et les reconvertit en texte

**Points clés :**
- Un appareil doit être "serveur" (visible)
- L'autre doit être "client" (cherche et se connecte)
- Les deux utilisent les mêmes UUIDs pour se reconnaître
- La communication est bidirectionnelle une fois établie

```dart
class BluetoothChatApp extends StatefulWidget {
  @override
  _BluetoothChatAppState createState() => _BluetoothChatAppState();
}

class _BluetoothChatAppState extends State<BluetoothChatApp> {
  BluetoothChatService chatService = BluetoothChatService();
  List<String> messages = [];
  TextEditingController messageController = TextEditingController();
  bool isServer = false;
  bool isConnected = false;
  
  @override
  void initState() {
    super.initState();
    
    // Écouter les messages entrants
    chatService.messageStream.listen((message) {
      setState(() {
        messages.add(message);
      });
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Bluetooth Chat'),
        actions: [
          IconButton(
            icon: Icon(isConnected ? Icons.bluetooth_connected : Icons.bluetooth),
            onPressed: isConnected ? _disconnect : _showConnectionDialog,
          ),
        ],
      ),
      body: Column(
        children: [
          // État de la connexion
          Container(
            padding: EdgeInsets.all(16),
            color: isConnected ? Colors.green[100] : Colors.grey[100],
            child: Row(
              children: [
                Icon(
                  isConnected ? Icons.circle : Icons.circle_outlined,
                  color: isConnected ? Colors.green : Colors.grey,
                ),
                SizedBox(width: 8),
                Text(isConnected ? 'Connecté' : 'Non connecté'),
                Spacer(),
                Text(isServer ? 'Mode Serveur' : 'Mode Client'),
              ],
            ),
          ),
          
          // Liste des messages
          Expanded(
            child: ListView.builder(
              itemCount: messages.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text(messages[index]),
                );
              },
            ),
          ),
          
          // Interface d'envoi
          if (isConnected)
            Container(
              padding: EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: messageController,
                      decoration: InputDecoration(
                        hintText: 'Tapez votre message...',
                        border: OutlineInputBorder(),
                      ),
                      onSubmitted: (_) => _sendMessage(),
                    ),
                  ),
                  SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: _sendMessage,
                    child: Text('Envoyer'),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
  
  void _showConnectionDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Mode de connexion'),
        content: Text('Choisissez votre mode de connexion'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _startAsServer();
            },
            child: Text('Être serveur'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _startAsClient();
            },
            child: Text('Se connecter comme client'),
          ),
        ],
      ),
    );
  }
  
  void _startAsServer() async {
    setState(() => isServer = true);
    bool success = await chatService.startServer();
    if (success) {
      setState(() => isConnected = true);
      messages.add("Serveur démarré, en attente de connexion...");
    }
  }
  
  void _startAsClient() async {
    setState(() => isServer = false);
    
    // Scanner et montrer les appareils disponibles
    List<BluetoothDevice> devices = await _scanForDevices();
    if (devices.isNotEmpty) {
      BluetoothDevice? selectedDevice = await _showDeviceSelectionDialog(devices);
      if (selectedDevice != null) {
        bool success = await chatService.connectAsClient(selectedDevice);
        if (success) {
          setState(() => isConnected = true);
          messages.add("Connecté à ${selectedDevice.name}");
        }
      }
    }
  }
  
  Future<List<BluetoothDevice>> _scanForDevices() async {
    List<BluetoothDevice> devices = [];
    await FlutterBluePlus.startScan(timeout: Duration(seconds: 5));
    
    FlutterBluePlus.scanResults.listen((results) {
      for (ScanResult result in results) {
        if (result.device.name.isNotEmpty && !devices.contains(result.device)) {
          devices.add(result.device);
        }
      }
    });
    
    await Future.delayed(Duration(seconds: 5));
    await FlutterBluePlus.stopScan();
    
    return devices;
  }
  
  Future<BluetoothDevice?> _showDeviceSelectionDialog(List<BluetoothDevice> devices) async {
    return showDialog<BluetoothDevice>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Choisir un appareil'),
        content: Container(
          height: 300,
          width: 300,
          child: ListView.builder(
            itemCount: devices.length,
            itemBuilder: (context, index) {
              return ListTile(
                title: Text(devices[index].name),
                subtitle: Text(devices[index].id.toString()),
                onTap: () => Navigator.pop(context, devices[index]),
              );
            },
          ),
        ),
      ),
    );
  }
  
  void _sendMessage() {
    if (messageController.text.isNotEmpty) {
      chatService.sendMessage(messageController.text);
      messageController.clear();
    }
  }
  
  void _disconnect() {
    chatService.disconnect();
    setState(() {
      isConnected = false;
      messages.add("Déconnecté");
    });
  }
  
  @override
  void dispose() {
    chatService.disconnect();
    messageController.dispose();
    super.dispose();
  }
}

// Service de chat étendu avec mode serveur/client
class BluetoothChatService {
  BluetoothDevice? device;
  BluetoothCharacteristic? writeCharacteristic;
  BluetoothCharacteristic? readCharacteristic;
  StreamController<String> messageController = StreamController<String>.broadcast();
  
  Stream<String> get messageStream => messageController.stream;
  
  // Mode serveur : rendre l'appareil découvrable et attendre une connexion
  Future<bool> startServer() async {
    try {
      // Note : Le mode serveur complet nécessite une implémentation plus complexe
      // avec la création de services GATT personnalisés
      
      // Pour cet exemple, nous simulons le démarrage d'un serveur
      // En réalité, il faudrait :
      // 1. Configurer l'appareil comme périphérique BLE
      // 2. Créer des services et caractéristiques personnalisés
      // 3. Attendre les connexions entrantes
      
      messageController.add("Mode serveur activé");
      return true;
    } catch (e) {
      print('Erreur démarrage serveur: $e');
      return false;
    }
  }
  
  // Mode client : se connecter à un serveur
  Future<bool> connectAsClient(BluetoothDevice device) async {
    try {
      await device.connect();
      this.device = device;
      
      // Configurer les caractéristiques pour la communication
      List<BluetoothService> services = await device.discoverServices();
      
      // Rechercher les caractéristiques de communication
      for (BluetoothService service in services) {
        for (BluetoothCharacteristic characteristic in service.characteristics) {
          if (characteristic.properties.write) {
            writeCharacteristic = characteristic;
          }
          if (characteristic.properties.notify || characteristic.properties.read) {
            readCharacteristic = characteristic;
            
            if (characteristic.properties.notify) {
              await characteristic.setNotifyValue(true);
              characteristic.value.listen((value) {
                String message = String.fromCharCodes(value);
                messageController.add("Partenaire: $message");
              });
            }
          }
        }
      }
      
      return writeCharacteristic != null;
    } catch (e) {
      print('Erreur connexion client: $e');
      return false;
    }
  }
  
  Future<void> sendMessage(String message) async {
    if (writeCharacteristic != null) {
      try {
        await writeCharacteristic!.write(message.codeUnits);
        messageController.add("Moi: $message");
      } catch (e) {
        print('Erreur envoi message: $e');
      }
    }
  }
  
  void disconnect() {
    device?.disconnect();
    messageController.close();
  }
}
```

### Diagramme de communication entre appareils

```
Appareil A (Serveur)                    Appareil B (Client)
       |                                        |
       |<-- Scan et découverte                  |
       |                                        |
       |    Demande de connexion          <-----|
       |                                        |
       |---> Acceptation connexion              |
       |                                        |
       |<-- Découverte des services             |
       |                                        |
       |---> Services disponibles               |
       |                                        |
       |<======= Échange de messages ========>|
       |                                        |
       |    Message 1: "Bonjour"         <-----|
       |                                        |
       |---> Message 2: "Salut !"              |
       |                                        |
       |<======= Communication continue ======>|
```

## Protocoles de communication personnalisés

### Définir un protocole de message structuré

```dart
class BluetoothMessage {
  final String type;
  final String content;
  final DateTime timestamp;
  final String senderId;
  
  BluetoothMessage({
    required this.type,
    required this.content,
    required this.timestamp,
    required this.senderId,
  });
  
  // Sérialisation en JSON pour l'envoi
  String toJson() {
    return jsonEncode({
      'type': type,
      'content': content,
      'timestamp': timestamp.toIso8601String(),
      'senderId': senderId,
    });
  }
  
  // Désérialisation depuis JSON
  factory BluetoothMessage.fromJson(String jsonString) {
    Map<String, dynamic> json = jsonDecode(jsonString);
    return BluetoothMessage(
      type: json['type'],
      content: json['content'],
      timestamp: DateTime.parse(json['timestamp']),
      senderId: json['senderId'],
    );
  }
}

class AdvancedBluetoothCommunication {
  static const int MAX_MESSAGE_SIZE = 512; // Taille max d'un message BLE
  
  // Fragmenter les gros messages
  static List<String> fragmentMessage(String message) {
    List<String> fragments = [];
    for (int i = 0; i < message.length; i += MAX_MESSAGE_SIZE) {
      int end = (i + MAX_MESSAGE_SIZE < message.length) 
          ? i + MAX_MESSAGE_SIZE 
          : message.length;
      fragments.add(message.substring(i, end));
    }
    return fragments;
  }
  
  // Reconstituer les messages fragmentés
  static String reconstructMessage(List<String> fragments) {
    return fragments.join('');
  }
  
  // Envoyer un message avec accusé de réception
  static Future<bool> sendMessageWithAck(
    BluetoothCharacteristic writeChar,
    BluetoothCharacteristic readChar,
    String message,
  ) async {
    try {
      // Envoyer le message
      await writeChar.write(message.codeUnits);
      
      // Attendre l'accusé de réception (timeout de 5 secondes)
      Completer<bool> completer = Completer<bool>();
      
      StreamSubscription subscription = readChar.value.listen((value) {
        String response = String.fromCharCodes(value);
        if (response == "ACK") {
          completer.complete(true);
        } else if (response == "NACK") {
          completer.complete(false);
        }
      });
      
      // Timeout
      Timer(Duration(seconds: 5), () {
        if (!completer.isCompleted) {
          completer.complete(false);
        }
      });
      
      bool ackReceived = await completer.future;
      await subscription.cancel();
      
      return ackReceived;
    } catch (e) {
      print('Erreur envoi avec ACK: $e');
      return false;
    }
  }
}
```

## Gestion des erreurs et reconnexion automatique

```dart
class RobustBluetoothConnection {
  BluetoothDevice device;
  bool _shouldReconnect = true;
  int _reconnectAttempts = 0;
  static const int MAX_RECONNECT_ATTEMPTS = 5;
  
  RobustBluetoothConnection(this.device);
  
  Future<void> maintainConnection() async {
    device.state.listen((state) async {
      if (state == BluetoothDeviceState.disconnected && _shouldReconnect) {
        await _attemptReconnection();
      }
    });
  }
  
  Future<void> _attemptReconnection() async {
    if (_reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      print('Nombre maximum de tentatives de reconnexion atteint');
      return;
    }
    
    _reconnectAttempts++;
    print('Tentative de reconnexion #$_reconnectAttempts');
    
    try {
      await Future.delayed(Duration(seconds: 2)); // Délai avant reconnexion
      await device.connect();
      _reconnectAttempts = 0; // Reset le compteur en cas de succès
      print('Reconnexion réussie');
    } catch (e) {
      print('Échec de la reconnexion: $e');
      
      // Délai exponentiel entre les tentatives
      int delay = math.pow(2, _reconnectAttempts).toInt();
      await Future.delayed(Duration(seconds: delay));
      
      await _attemptReconnection();
    }
  }
  
  void stopReconnection() {
    _shouldReconnect = false;
  }
}
```

## Bonnes pratiques et optimisations

### Gestion de l'énergie
```dart
class PowerEfficientBluetoothManager {
  Timer? _scanTimer;
  Timer? _connectionTimer;
  
  // Scanner par intervalles pour économiser la batterie
  void startPeriodicScan({
    Duration scanDuration = const Duration(seconds: 5),
    Duration pauseDuration = const Duration(seconds: 30),
  }) {
    _scanTimer = Timer.periodic(
      scanDuration + pauseDuration,
      (timer) async {
        await FlutterBluePlus.startScan(timeout: scanDuration);
        // Le scan s'arrête automatiquement après scanDuration
      },
    );
  }
  
  void stopPeriodicScan() {
    _scanTimer?.cancel();
  }
  
  // Surveiller la qualité de la connexion
  void monitorConnectionQuality(BluetoothDevice device) {
    _connectionTimer = Timer.periodic(Duration(seconds: 10), (timer) async {
      try {
        // Lire le RSSI pour évaluer la qualité du signal
        int rssi = await device.readRssi();
        
        if (rssi < -80) {
          print('Signal faible (${rssi}dBm) - risque de déconnexion');
        }
      } catch (e) {
        print('Impossible de lire le RSSI: $e');
      }
    });
  }
}
```

## Sécurité et chiffrement

```dart
import 'dart:convert';
import 'dart:typed_data';
import 'package:crypto/crypto.dart';

class SecureBluetoothCommunication {
  String? _sharedSecret;
  
  // Établir une clé partagée (exemple simplifié)
  Future<void> establishSharedKey(BluetoothCharacteristic characteristic) async {
    // En production, utilisez un protocole d'échange de clés sécurisé
    // comme Diffie-Hellman
    _sharedSecret = "ma_cle_secrete_partagee";
  }
  
  // Chiffrer un message
  String encryptMessage(String message) {
    if (_sharedSecret == null) throw Exception("Clé non établie");
    
    // Exemple simple avec XOR (en production, utilisez AES)
    List<int> messageBytes = utf8.encode(message);
    List<int> keyBytes = utf8.encode(_sharedSecret!);
    List<int> encrypted = [];
    
    for (int i = 0; i < messageBytes.length; i++) {
      encrypted.add(messageBytes[i] ^ keyBytes[i % keyBytes.length]);
    }
    
    return base64.encode(encrypted);
  }
  
  // Déchiffrer un message
  String decryptMessage(String encryptedMessage) {
    if (_sharedSecret == null) throw Exception("Clé non établie");
    
    List<int> encrypted = base64.decode(encryptedMessage);
    List<int> keyBytes = utf8.encode(_sharedSecret!);
    List<int> decrypted = [];
    
    for (int i = 0; i < encrypted.length; i++) {
      decrypted.add(encrypted[i] ^ keyBytes[i % keyBytes.length]);
    }
    
    return utf8.decode(decrypted);
  }
  
  // Calculer un hash pour l'intégrité
  String calculateHash(String message) {
    var bytes = utf8.encode(message + (_sharedSecret ?? ''));
    var digest = sha256.convert(bytes);
    return digest.toString();
  }
  
  // Vérifier l'intégrité d'un message
  bool verifyIntegrity(String message, String hash) {
    return calculateHash(message) == hash;
  }
}
```

## Cas d'usage simplifiés avec explications

### 1. Lire la batterie d'un appareil

```dart
class BatteryReader {
  
  // Étape 1: Se connecter à l'appareil
  Future<int?> readDeviceBattery(BluetoothDevice device) async {
    try {
      // Se connecter
      await device.connect();
      print("Connecté à ${device.name}");
      
      // Trouver le service batterie
      int? batteryLevel = await _findAndReadBattery(device);
      
      // Se déconnecter
      await device.disconnect();
      
      return batteryLevel;
    } catch (e) {
      print("Erreur: $e");
      return null;
    }
  }
  
  // Étape 2: Chercher le service batterie standard
  Future<int?> _findAndReadBattery(BluetoothDevice device) async {
    const String BATTERY_SERVICE = "180F";  // Service standard
    const String BATTERY_LEVEL = "2A19";    // Caractéristique standard
    
    // Découvrir tous les services
    List<BluetoothService> services = await device.discoverServices();
    
    // Chercher le service batterie
    for (BluetoothService service in services) {
      if (service.uuid.toString().toUpperCase().contains("180F")) {
        print("Service batterie trouvé !");
        
        // Chercher la caractéristique niveau de batterie
        for (BluetoothCharacteristic characteristic in service.characteristics) {
          if (characteristic.uuid.toString().toUpperCase().contains("2A19")) {
            print("Caractéristique batterie trouvée !");
            
            // Lire la valeur
            List<int> value = await characteristic.read();
            if (value.isNotEmpty) {
              int batteryPercent = value[0]; // Premier byte = pourcentage
              print("Niveau batterie: $batteryPercent%");
              return batteryPercent;
            }
          }
        }
      }
    }
    
    print("Service batterie non trouvé");
    return null;
  }
}

// Utilisation simple
void exempleUtilisation() async {
  BatteryReader reader = BatteryReader();
  BluetoothDevice monAppareil = // ... appareil trouvé via scan
  
  int? niveau = await reader.readDeviceBattery(monAppareil);
  if (niveau != null) {
    print("La batterie est à $niveau%");
  } else {
    print("Impossible de lire la batterie");
  }
}
```

### 2. Envoyer une commande simple à un appareil

```dart
class DeviceController {
  
  // Allumer/éteindre un appareil
  Future<bool> toggleDevice(BluetoothDevice device, bool turnOn) async {
    try {
      // Se connecter
      await device.connect();
      
      // Créer la commande
      String command = turnOn ? "ON" : "OFF";
      
      // Envoyer la commande
      bool success = await _sendCommand(device, command);
      
      // Se déconnecter
      await device.disconnect();
      
      return success;
    } catch (e) {
      print("Erreur contrôle appareil: $e");
      return false;
    }
  }
  
  Future<bool> _sendCommand(BluetoothDevice device, String command) async {
    // Découvrir les services
    List<BluetoothService> services = await device.discoverServices();
    
    // Chercher une caractéristique qui accepte l'écriture
    for (BluetoothService service in services) {
      for (BluetoothCharacteristic characteristic in service.characteristics) {
        if (characteristic.properties.write) {
          print("Envoi de la commande: $command");
          
          // Convertir la commande en bytes et envoyer
          await characteristic.write(command.codeUnits);
          
          print("Commande envoyée avec succès");
          return true;
        }
      }
    }
    
    print("Aucune caractéristique d'écriture trouvée");
    return false;
  }
}
```

### 3. Écouter des données en continu

```dart
class DataMonitor {
  StreamSubscription<List<int>>? _subscription;
  
  // Commencer à écouter les données d'un capteur
  Future<void> startMonitoring(BluetoothDevice device, Function(double) onDataReceived) async {
    try {
      // Se connecter
      await device.connect();
      
      // Trouver et configurer les notifications
      await _setupNotifications(device, onDataReceived);
      
      print("Monitoring démarré");
    } catch (e) {
      print("Erreur démarrage monitoring: $e");
    }
  }
  
  Future<void> _setupNotifications(BluetoothDevice device, Function(double) onDataReceived) async {
    List<BluetoothService> services = await device.discoverServices();
    
    // Chercher une caractéristique avec notifications
    for (BluetoothService service in services) {
      for (BluetoothCharacteristic characteristic in service.characteristics) {
        if (characteristic.properties.notify) {
          print("Activation des notifications...");
          
          // Activer les notifications
          await characteristic.setNotifyValue(true);
          
          // Écouter les données
          _subscription = characteristic.value.listen((data) {
            // Convertir les bytes en valeur utile
            double value = _parseData(data);
            onDataReceived(value);
          });
          
          break;
        }
      }
    }
  }
  
  // Convertir les bytes reçus en valeur numérique
  double _parseData(List<int> data) {
    if (data.length >= 2) {
      // Exemple: convertir 2 bytes en température
      int rawValue = (data[1] << 8) | data[0];
      double temperature = rawValue / 100.0; // Diviser par 100
      print("Température reçue: $temperature°C");
      return temperature;
    }
    return 0.0;
  }
  
  // Arrêter l'écoute
  Future<void> stopMonitoring() async {
    await _subscription?.cancel();
    _subscription = null;
    print("Monitoring arrêté");
  }
}

// Utilisation
void exempleMonitoring() async {
  DataMonitor monitor = DataMonitor();
  BluetoothDevice capteur = // ... votre capteur
  
  // Démarrer l'écoute
  await monitor.startMonitoring(capteur, (temperature) {
    print("Nouvelle température: $temperature°C");
    
    // Réagir selon la valeur
    if (temperature > 25.0) {
      print("Il fait chaud !");
    }
  });
  
  // Arrêter après 30 secondes
  await Future.delayed(Duration(seconds: 30));
  await monitor.stopMonitoring();
}
```

### 4. Interface utilisateur simple et efficace

```dart
class SimpleBluetoothScreen extends StatefulWidget {
  @override
  _SimpleBluetoothScreenState createState() => _SimpleBluetoothScreenState();
}

class _SimpleBluetoothScreenState extends State<SimpleBluetoothScreen> {
  List<BluetoothDevice> devices = [];
  BluetoothDevice? connectedDevice;
  String statusMessage = "Appuyez pour scanner";
  bool isScanning = false;
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Bluetooth Simple')),
      body: Column(
        children: [
          // Bouton de scan
          Padding(
            padding: EdgeInsets.all(16),
            child: ElevatedButton(
              onPressed: isScanning ? null : _scanDevices,
              child: Text(isScanning ? 'Scan en cours...' : 'Scanner les appareils'),
            ),
          ),
          
          // Message de statut
          Padding(
            padding: EdgeInsets.all(16),
            child: Text(statusMessage, style: TextStyle(fontSize: 16)),
          ),
          
          // Liste des appareils
          Expanded(
            child: ListView.builder(
              itemCount: devices.length,
              itemBuilder: (context, index) {
                BluetoothDevice device = devices[index];
                return ListTile(
                  title: Text(device.name.isEmpty ? 'Appareil sans nom' : device.name),
                  subtitle: Text(device.id.toString()),
                  onTap: () => _connectToDevice(device),
                  trailing: connectedDevice == device 
                      ? Icon(Icons.check_circle, color: Colors.green)
                      : Icon(Icons.radio_button_unchecked),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
  
  void _scanDevices() async {
    setState(() {
      isScanning = true;
      statusMessage = "Recherche d'appareils...";
      devices.clear();
    });
    
    // Démarrer le scan
    FlutterBluePlus.scanResults.listen((results) {
      setState(() {
        devices = results.map((r) => r.device).toList();
        statusMessage = "Trouvé ${devices.length} appareil(s)";
      });
    });
    
    await FlutterBluePlus.startScan(timeout: Duration(seconds: 5));
    
    setState(() {
      isScanning = false;
      if (devices.isEmpty) {
        statusMessage = "Aucun appareil trouvé";
      }
    });
  }
  
  void _connectToDevice(BluetoothDevice device) async {
    setState(() => statusMessage = "Connexion à ${device.name}...");
    
    try {
      await device.connect();
      setState(() {
        connectedDevice = device;
        statusMessage = "Connecté à ${device.name}";
      });
      
      // Exemple: lire la batterie automatiquement
      BatteryReader reader = BatteryReader();
      int? battery = await reader.readDeviceBattery(device);
      if (battery != null) {
        setState(() => statusMessage = "Connecté - Batterie: $battery%");
      }
      
    } catch (e) {
      setState(() => statusMessage = "Erreur de connexion: $e");
    }
  }
}
```

**Explications des exemples :**

1. **Lecteur de batterie** : Montre comment lire une valeur simple en utilisant les UUIDs standards
2. **Contrôleur d'appareil** : Démontre l'envoi de commandes texte simples
3. **Moniteur de données** : Illustre l'écoute continue avec conversion des données
4. **Interface simple** : Combine tout dans une interface utilisateur claire

Chaque exemple est autonome et peut être adapté selon vos besoins spécifiques.

## Gestion des erreurs et bonnes pratiques

### Gestion des erreurs communes

```dart
class BluetoothErrorHandler {
  
  // Gérer les erreurs de connexion
  static Future<bool> safeConnect(BluetoothDevice device) async {
    try {
      // Vérifier l'état avant de se connecter
      BluetoothDeviceState state = await device.state.first;
      if (state == BluetoothDeviceState.connected) {
        print("Déjà connecté");
        return true;
      }
      
      // Tentative de connexion avec timeout
      await device.connect().timeout(Duration(seconds: 10));
      print("Connexion réussie");
      return true;
      
    } on TimeoutException {
      print("Erreur: Timeout de connexion");
      return false;
    } catch (e) {
      print("Erreur de connexion: $e");
      return false;
    }
  }
  
  // Gérer les erreurs de lecture
  static Future<List<int>?> safeRead(BluetoothCharacteristic characteristic) async {
    try {
      // Vérifier les propriétés
      if (!characteristic.properties.read) {
        print("Erreur: Caractéristique non lisible");
        return null;
      }
      
      List<int> data = await characteristic.read();
      return data;
      
    } catch (e) {
      print("Erreur de lecture: $e");
      return null;
    }
  }
  
  // Gérer les erreurs d'écriture
  static Future<bool> safeWrite(BluetoothCharacteristic characteristic, List<int> data) async {
    try {
      // Vérifier les propriétés
      if (!characteristic.properties.write && !characteristic.properties.writeWithoutResponse) {
        print("Erreur: Caractéristique non écrivable");
        return false;
      }
      
      // Vérifier la taille des données
      if (data.length > 512) { // Limite MTU typique
        print("Erreur: Données trop volumineuses");
        return false;
      }
      
      await characteristic.write(data);
      return true;
      
    } catch (e) {
      print("Erreur d'écriture: $e");
      return false;
    }
  }
}
```

### Reconnexion automatique

```dart
class AutoReconnectManager {
  BluetoothDevice device;
  bool shouldReconnect = true;
  int maxRetries = 3;
  int currentRetries = 0;
  
  AutoReconnectManager(this.device);
  
  void startMonitoring() {
    device.state.listen((state) {
      if (state == BluetoothDeviceState.disconnected && shouldReconnect) {
        _attemptReconnect();
      }
    });
  }
  
  Future<void> _attemptReconnect() async {
    if (currentRetries >= maxRetries) {
      print("Nombre maximum de tentatives atteint");
      return;
    }
    
    currentRetries++;
    print("Tentative de reconnexion $currentRetries/$maxRetries");
    
    // Attendre avant de réessayer
    await Future.delayed(Duration(seconds: 2 * currentRetries));
    
    try {
      await device.connect();
      currentRetries = 0; // Réinitialiser en cas de succès
      print("Reconnexion réussie");
    } catch (e) {
      print("Échec de la reconnexion: $e");
      _attemptReconnect(); // Réessayer
    }
  }
  
  void stopReconnection() {
    shouldReconnect = false;
  }
}
```

### Optimisation des performances

```dart
class BluetoothOptimizer {
  
  // Scanner avec filtres pour économiser la batterie
  static Future<List<BluetoothDevice>> smartScan({
    List<String>? serviceUuids,
    Duration timeout = const Duration(seconds: 5),
    int? rssiThreshold = -80,
  }) async {
    List<BluetoothDevice> filteredDevices = [];
    
    FlutterBluePlus.scanResults.listen((results) {
      for (ScanResult result in results) {
        // Filtrer par force du signal
        if (rssiThreshold != null && result.rssi < rssiThreshold) {
          continue;
        }
        
        // Filtrer par nom (éviter les appareils sans nom)
        if (result.device.name.isEmpty) {
          continue;
        }
        
        filteredDevices.add(result.device);
      }
    });
    
    // Scanner avec filtres de services
    await FlutterBluePlus.startScan(
      timeout: timeout,
      withServices: serviceUuids?.map((uuid) => Guid(uuid)).toList(),
    );
    
    return filteredDevices;
  }
  
  // Limiter les notifications pour économiser la batterie
  static Future<void> optimizeNotifications(BluetoothCharacteristic characteristic, {
    Duration interval = const Duration(seconds: 1),
  }) async {
    DateTime lastNotification = DateTime.now();
    
    characteristic.value.listen((data) {
      DateTime now = DateTime.now();
      if (now.difference(lastNotification) >= interval) {
        // Traiter seulement si assez de temps s'est écoulé
        lastNotification = now;
        _handleOptimizedData(data);
      }
    });
  }
  
  static void _handleOptimizedData(List<int> data) {
    // Traitement optimisé des données
    print("Données reçues (optimisé): ${data.length} bytes");
  }
}
```

### Points clés à retenir

#### ✅ **À faire :**
- Toujours vérifier les permissions avant de scanner
- Déconnecter proprement lors de la fermeture de l'app
- Gérer les timeouts pour éviter les blocages
- Filtrer les scans pour économiser la batterie
- Vérifier les propriétés des caractéristiques avant utilisation

#### ❌ **À éviter :**
- Scanner en continu sans arrêt
- Se connecter plusieurs fois au même appareil
- Ignorer les erreurs de connexion
- Envoyer des données trop volumineuses d'un coup
- Oublier de désactiver les notifications

### Exemple complet avec toutes les bonnes pratiques

```dart
class BestPracticeBluetoothManager {
  BluetoothDevice? device;
  AutoReconnectManager? reconnectManager;
  List<StreamSubscription> subscriptions = [];
  
  // Initialisation complète avec gestion d'erreurs
  Future<bool> initializeConnection(BluetoothDevice targetDevice) async {
    // 1. Vérifier les permissions
    if (!await BluetoothSetup.requestPermissions()) {
      print("Permissions refusées");
      return false;
    }
    
    // 2. Vérifier Bluetooth
    if (!await BluetoothSetup.isBluetoothReady()) {
      print("Bluetooth non prêt");
      return false;
    }
    
    // 3. Se connecter avec gestion d'erreurs
    if (!await BluetoothErrorHandler.safeConnect(targetDevice)) {
      print("Connexion échouée");
      return false;
    }
    
    device = targetDevice;
    
    // 4. Configurer la reconnexion automatique
    reconnectManager = AutoReconnectManager(device!);
    reconnectManager!.startMonitoring();
    
    // 5. Découvrir et configurer les services
    await _setupServices();
    
    print("Initialisation terminée avec succès");
    return true;
  }
  
  Future<void> _setupServices() async {
    if (device == null) return;
    
    try {
      List<BluetoothService> services = await device!.discoverServices();
      
      for (BluetoothService service in services) {
        print("Service trouvé: ${service.uuid}");
        
        for (BluetoothCharacteristic characteristic in service.characteristics) {
          // Configurer les notifications si disponibles
          if (characteristic.properties.notify) {
            await characteristic.setNotifyValue(true);
            
            StreamSubscription subscription = characteristic.value.listen((data) {
              _handleNotification(characteristic.uuid.toString(), data);
            });
            
            subscriptions.add(subscription);
          }
        }
      }
    } catch (e) {
      print("Erreur configuration services: $e");
    }
  }
  
  void _handleNotification(String characteristicUuid, List<int> data) {
    print("Notification de $characteristicUuid: ${data.length} bytes");
    // Traitement spécifique selon la caractéristique
  }
  
  // Nettoyage complet
  Future<void> cleanup() async {
    // Arrêter la reconnexion automatique
    reconnectManager?.stopReconnection();
    
    // Annuler tous les abonnements
    for (StreamSubscription subscription in subscriptions) {
      await subscription.cancel();
    }
    subscriptions.clear();
    
    // Se déconnecter
    if (device != null) {
      await device!.disconnect();
      device = null;
    }
    
    print("Nettoyage terminé");
  }
}
```

Cette approche garantit une utilisation robuste et professionnelle du Bluetooth dans vos applications Flutter.