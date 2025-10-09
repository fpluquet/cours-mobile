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
```yaml
dependencies:
  flutter_bluetooth_serial: ^0.4.0
```

### flutter_blue_plus
```yaml
dependencies:
  flutter_blue_plus: ^1.14.6
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

## Exemples d'implémentation

### Configuration complète d'un service Bluetooth

```dart
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:permission_handler/permission_handler.dart';

class BluetoothManager {
  static BluetoothManager? _instance;
  static BluetoothManager get instance => _instance ??= BluetoothManager._();
  BluetoothManager._();
  
  List<BluetoothDevice> _connectedDevices = [];
  List<ScanResult> _scanResults = [];
  
  // Vérifier et demander les permissions
  Future<bool> checkPermissions() async {
    Map<Permission, PermissionStatus> statuses = await [
      Permission.bluetooth,
      Permission.bluetoothScan,
      Permission.bluetoothConnect,
      Permission.location,
    ].request();
    
    return statuses.values.every((status) => status.isGranted);
  }
  
  // Vérifier la disponibilité du Bluetooth
  Future<bool> isBluetoothAvailable() async {
    return await FlutterBluePlus.isAvailable;
  }
  
  // Scanner les appareils avec filtres
  Future<void> startScan({
    Duration timeout = const Duration(seconds: 10),
    List<String>? serviceUuids,
  }) async {
    if (!await checkPermissions()) {
      throw Exception("Permissions Bluetooth requises");
    }
    
    _scanResults.clear();
    
    // Écouter les résultats du scan
    FlutterBluePlus.scanResults.listen((results) {
      _scanResults = results;
    });
    
    // Démarrer le scan
    await FlutterBluePlus.startScan(
      timeout: timeout,
      withServices: serviceUuids?.map((s) => Guid(s)).toList(),
    );
  }
  
  // Arrêter le scan
  Future<void> stopScan() async {
    await FlutterBluePlus.stopScan();
  }
  
  List<ScanResult> get scanResults => _scanResults;
  List<BluetoothDevice> get connectedDevices => _connectedDevices;
}
```

### Scanner les appareils disponibles
```dart
class BluetoothDeviceScanner extends StatefulWidget {
  @override
  _BluetoothDeviceScannerState createState() => _BluetoothDeviceScannerState();
}

class _BluetoothDeviceScannerState extends State<BluetoothDeviceScanner> {
  List<ScanResult> _devices = [];
  bool _isScanning = false;
  
  @override
  void initState() {
    super.initState();
    _startScan();
  }
  
  void _startScan() async {
    setState(() => _isScanning = true);
    
    try {
      await BluetoothManager.instance.startScan();
      
      // Écouter les mises à jour
      Timer.periodic(Duration(milliseconds: 500), (timer) {
        if (!_isScanning) {
          timer.cancel();
          return;
        }
        
        setState(() {
          _devices = BluetoothManager.instance.scanResults;
        });
      });
      
      // Arrêter automatiquement après 10 secondes
      Timer(Duration(seconds: 10), () {
        _stopScan();
      });
      
    } catch (e) {
      print('Erreur lors du scan: $e');
      setState(() => _isScanning = false);
    }
  }
  
  void _stopScan() async {
    await BluetoothManager.instance.stopScan();
    setState(() => _isScanning = false);
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Appareils Bluetooth'),
        actions: [
          IconButton(
            icon: Icon(_isScanning ? Icons.stop : Icons.refresh),
            onPressed: _isScanning ? _stopScan : _startScan,
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: _devices.length,
        itemBuilder: (context, index) {
          final device = _devices[index];
          return ListTile(
            title: Text(device.device.name.isEmpty 
                ? 'Appareil inconnu' 
                : device.device.name),
            subtitle: Text(device.device.id.toString()),
            trailing: Text('${device.rssi} dBm'),
            onTap: () => _connectToDevice(device.device),
          );
        },
      ),
    );
  }
  
  void _connectToDevice(BluetoothDevice device) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => BluetoothDeviceScreen(device: device),
      ),
    );
  }
}
```

### Se connecter à un appareil et gérer la communication

```dart
class BluetoothDeviceScreen extends StatefulWidget {
  final BluetoothDevice device;
  
  BluetoothDeviceScreen({required this.device});
  
  @override
  _BluetoothDeviceScreenState createState() => _BluetoothDeviceScreenState();
}

class _BluetoothDeviceScreenState extends State<BluetoothDeviceScreen> {
  bool _isConnected = false;
  List<BluetoothService> _services = [];
  BluetoothCharacteristic? _writeCharacteristic;
  BluetoothCharacteristic? _readCharacteristic;
  String _receivedData = '';
  TextEditingController _messageController = TextEditingController();
  
  @override
  void initState() {
    super.initState();
    _connectToDevice();
  }
  
  Future<void> _connectToDevice() async {
    try {
      await widget.device.connect();
      setState(() => _isConnected = true);
      
      // Découvrir les services
      _services = await widget.device.discoverServices();
      
      // Trouver les caractéristiques de lecture et d'écriture
      for (BluetoothService service in _services) {
        for (BluetoothCharacteristic characteristic in service.characteristics) {
          if (characteristic.properties.write) {
            _writeCharacteristic = characteristic;
          }
          if (characteristic.properties.read || characteristic.properties.notify) {
            _readCharacteristic = characteristic;
            // S'abonner aux notifications
            if (characteristic.properties.notify) {
              await characteristic.setNotifyValue(true);
              characteristic.value.listen((value) {
                setState(() {
                  _receivedData += String.fromCharCodes(value) + '\n';
                });
              });
            }
          }
        }
      }
      
      // Écouter les déconnexions
      widget.device.state.listen((state) {
        if (state == BluetoothDeviceState.disconnected) {
          setState(() => _isConnected = false);
        }
      });
      
    } catch (e) {
      print('Erreur de connexion: $e');
      setState(() => _isConnected = false);
    }
  }
  
  Future<void> _sendMessage() async {
    if (_writeCharacteristic != null && _messageController.text.isNotEmpty) {
      try {
        await _writeCharacteristic!.write(
          _messageController.text.codeUnits,
          withoutResponse: false,
        );
        _messageController.clear();
      } catch (e) {
        print('Erreur envoi: $e');
      }
    }
  }
  
  Future<void> _readData() async {
    if (_readCharacteristic != null) {
      try {
        List<int> value = await _readCharacteristic!.read();
        setState(() {
          _receivedData += String.fromCharCodes(value) + '\n';
        });
      } catch (e) {
        print('Erreur lecture: $e');
      }
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.device.name.isEmpty 
            ? 'Appareil inconnu' 
            : widget.device.name),
        backgroundColor: _isConnected ? Colors.green : Colors.red,
      ),
      body: Column(
        children: [
          // État de la connexion
          Container(
            padding: EdgeInsets.all(16),
            color: _isConnected ? Colors.green[100] : Colors.red[100],
            child: Row(
              children: [
                Icon(
                  _isConnected ? Icons.bluetooth_connected : Icons.bluetooth_disabled,
                  color: _isConnected ? Colors.green : Colors.red,
                ),
                SizedBox(width: 8),
                Text(
                  _isConnected ? 'Connecté' : 'Déconnecté',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          
          // Services découverts
          Expanded(
            flex: 1,
            child: ListView.builder(
              itemCount: _services.length,
              itemBuilder: (context, index) {
                final service = _services[index];
                return ExpansionTile(
                  title: Text('Service: ${service.uuid.toString().substring(0, 8)}...'),
                  children: service.characteristics.map((characteristic) {
                    return ListTile(
                      title: Text('Caractéristique'),
                      subtitle: Text(
                        'UUID: ${characteristic.uuid.toString().substring(0, 8)}...\n'
                        'Propriétés: ${_getPropertiesString(characteristic.properties)}'
                      ),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (characteristic.properties.read)
                            IconButton(
                              icon: Icon(Icons.download),
                              onPressed: () => _readFromCharacteristic(characteristic),
                            ),
                          if (characteristic.properties.write)
                            IconButton(
                              icon: Icon(Icons.upload),
                              onPressed: () => _writeToCharacteristic(characteristic),
                            ),
                        ],
                      ),
                    );
                  }).toList(),
                );
              },
            ),
          ),
          
          // Zone de données reçues
          Expanded(
            flex: 1,
            child: Container(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Données reçues:', style: TextStyle(fontWeight: FontWeight.bold)),
                  Expanded(
                    child: Container(
                      width: double.infinity,
                      padding: EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: SingleChildScrollView(
                        child: Text(_receivedData.isEmpty ? 'Aucune donnée reçue' : _receivedData),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          // Interface d'envoi
          Container(
            padding: EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: InputDecoration(
                      hintText: 'Message à envoyer...',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                SizedBox(width: 8),
                ElevatedButton(
                  onPressed: _isConnected ? _sendMessage : null,
                  child: Text('Envoyer'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  String _getPropertiesString(CharacteristicProperties properties) {
    List<String> props = [];
    if (properties.read) props.add('Read');
    if (properties.write) props.add('Write');
    if (properties.notify) props.add('Notify');
    if (properties.indicate) props.add('Indicate');
    return props.join(', ');
  }
  
  Future<void> _readFromCharacteristic(BluetoothCharacteristic characteristic) async {
    try {
      List<int> value = await characteristic.read();
      setState(() {
        _receivedData += 'Read: ${String.fromCharCodes(value)}\n';
      });
    } catch (e) {
      print('Erreur lecture: $e');
    }
  }
  
  Future<void> _writeToCharacteristic(BluetoothCharacteristic characteristic) async {
    String? text = await showDialog<String>(
      context: context,
      builder: (context) {
        TextEditingController controller = TextEditingController();
        return AlertDialog(
          title: Text('Envoyer données'),
          content: TextField(
            controller: controller,
            decoration: InputDecoration(hintText: 'Données à envoyer'),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('Annuler'),
            ),
            TextButton(
              onPressed: () => Navigator.pop(context, controller.text),
              child: Text('Envoyer'),
            ),
          ],
        );
      },
    );
    
    if (text != null && text.isNotEmpty) {
      try {
        await characteristic.write(text.codeUnits);
      } catch (e) {
        print('Erreur écriture: $e');
      }
    }
  }
  
  @override
  void dispose() {
    widget.device.disconnect();
    _messageController.dispose();
    super.dispose();
  }
}
```

### Communication bidirectionnelle complète

```dart
class BluetoothChatService {
  BluetoothDevice? device;
  BluetoothCharacteristic? writeCharacteristic;
  BluetoothCharacteristic? readCharacteristic;
  StreamController<String> messageController = StreamController<String>.broadcast();
  
  Stream<String> get messageStream => messageController.stream;
  
  Future<bool> connectAndSetupChat(BluetoothDevice device) async {
    try {
      await device.connect();
      this.device = device;
      
      List<BluetoothService> services = await device.discoverServices();
      
      // Rechercher le service de chat (UUID personnalisé)
      const String CHAT_SERVICE_UUID = "12345678-1234-1234-1234-123456789abc";
      const String WRITE_CHARACTERISTIC_UUID = "12345678-1234-1234-1234-123456789abd";
      const String READ_CHARACTERISTIC_UUID = "12345678-1234-1234-1234-123456789abe";
      
      for (BluetoothService service in services) {
        if (service.uuid.toString().toLowerCase() == CHAT_SERVICE_UUID.toLowerCase()) {
          for (BluetoothCharacteristic characteristic in service.characteristics) {
            if (characteristic.uuid.toString().toLowerCase() == WRITE_CHARACTERISTIC_UUID.toLowerCase()) {
              writeCharacteristic = characteristic;
            } else if (characteristic.uuid.toString().toLowerCase() == READ_CHARACTERISTIC_UUID.toLowerCase()) {
              readCharacteristic = characteristic;
              
              // S'abonner aux notifications pour recevoir les messages
              await characteristic.setNotifyValue(true);
              characteristic.value.listen((value) {
                String message = String.fromCharCodes(value);
                messageController.add("Reçu: $message");
              });
            }
          }
        }
      }
      
      return writeCharacteristic != null && readCharacteristic != null;
    } catch (e) {
      print('Erreur de configuration chat: $e');
      return false;
    }
  }
  
  Future<void> sendMessage(String message) async {
    if (writeCharacteristic != null) {
      try {
        await writeCharacteristic!.write(message.codeUnits);
        messageController.add("Envoyé: $message");
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

## Communication entre deux appareils : Exemple pratique

### Scénario : Chat Bluetooth entre deux smartphones

Voici un exemple complet montrant comment deux appareils peuvent communiquer via Bluetooth :

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

## Cas d'usage avancés et exemples pratiques

### 1. IoT et capteurs environnementaux
```dart
class EnvironmentalSensorReader {
  BluetoothDevice? sensorDevice;
  
  Future<Map<String, double>> readSensorData() async {
    if (sensorDevice == null) return {};
    
    List<BluetoothService> services = await sensorDevice!.discoverServices();
    Map<String, double> sensorData = {};
    
    for (BluetoothService service in services) {
      for (BluetoothCharacteristic characteristic in service.characteristics) {
        if (characteristic.properties.read) {
          try {
            List<int> value = await characteristic.read();
            
            // Interpréter les données selon le type de capteur
            switch (characteristic.uuid.toString()) {
              case "2A6E": // Température
                sensorData['temperature'] = _parseTemperature(value);
                break;
              case "2A6F": // Humidité
                sensorData['humidity'] = _parseHumidity(value);
                break;
              case "2A6D": // Pression
                sensorData['pressure'] = _parsePressure(value);
                break;
            }
          } catch (e) {
            print('Erreur lecture capteur: $e');
          }
        }
      }
    }
    
    return sensorData;
  }
  
  double _parseTemperature(List<int> data) {
    // Conversion des bytes en température (exemple)
    if (data.length >= 2) {
      int rawValue = (data[1] << 8) | data[0];
      return rawValue / 100.0; // Diviser par 100 pour obtenir la valeur réelle
    }
    return 0.0;
  }
  
  double _parseHumidity(List<int> data) {
    if (data.length >= 2) {
      int rawValue = (data[1] << 8) | data[0];
      return rawValue / 100.0;
    }
    return 0.0;
  }
  
  double _parsePressure(List<int> data) {
    if (data.length >= 4) {
      int rawValue = (data[3] << 24) | (data[2] << 16) | (data[1] << 8) | data[0];
      return rawValue / 1000.0; // Conversion en kPa
    }
    return 0.0;
  }
}
```

### 2. Contrôle d'appareils domestiques
```dart
class SmartHomeController {
  Map<String, BluetoothDevice> devices = {};
  
  Future<void> controlLight(String deviceId, bool isOn, int brightness) async {
    BluetoothDevice? device = devices[deviceId];
    if (device == null) return;
    
    // Protocole de commande personnalisé
    String command = jsonEncode({
      'action': 'light_control',
      'state': isOn ? 'on' : 'off',
      'brightness': brightness,
      'timestamp': DateTime.now().millisecondsSinceEpoch,
    });
    
    await _sendCommand(device, command);
  }
  
  Future<void> controlTemperature(String deviceId, double targetTemp) async {
    BluetoothDevice? device = devices[deviceId];
    if (device == null) return;
    
    String command = jsonEncode({
      'action': 'temperature_control',
      'target_temperature': targetTemp,
      'unit': 'celsius',
      'timestamp': DateTime.now().millisecondsSinceEpoch,
    });
    
    await _sendCommand(device, command);
  }
  
  Future<void> _sendCommand(BluetoothDevice device, String command) async {
    try {
      List<BluetoothService> services = await device.discoverServices();
      
      for (BluetoothService service in services) {
        for (BluetoothCharacteristic characteristic in service.characteristics) {
          if (characteristic.properties.write) {
            await characteristic.write(command.codeUnits);
            break;
          }
        }
      }
    } catch (e) {
      print('Erreur envoi commande: $e');
    }
  }
}
```

### 3. Fitness et monitoring de santé
```dart
class FitnessTracker {
  BluetoothDevice? heartRateDevice;
  StreamController<int> heartRateController = StreamController<int>.broadcast();
  
  Stream<int> get heartRateStream => heartRateController.stream;
  
  Future<void> startHeartRateMonitoring() async {
    if (heartRateDevice == null) return;
    
    List<BluetoothService> services = await heartRateDevice!.discoverServices();
    
    // Chercher le service de fréquence cardiaque (UUID standard)
    for (BluetoothService service in services) {
      if (service.uuid.toString() == "180D") { // Heart Rate Service
        for (BluetoothCharacteristic characteristic in service.characteristics) {
          if (characteristic.uuid.toString() == "2A37") { // Heart Rate Measurement
            await characteristic.setNotifyValue(true);
            
            characteristic.value.listen((value) {
              int heartRate = _parseHeartRate(value);
              heartRateController.add(heartRate);
            });
            break;
          }
        }
      }
    }
  }
  
  int _parseHeartRate(List<int> data) {
    if (data.isEmpty) return 0;
    
    // Format Heart Rate Measurement selon le standard Bluetooth
    bool is16Bit = (data[0] & 0x01) != 0;
    
    if (is16Bit && data.length >= 3) {
      return (data[2] << 8) | data[1];
    } else if (!is16Bit && data.length >= 2) {
      return data[1];
    }
    
    return 0;
  }
  
  void stopHeartRateMonitoring() {
    heartRateController.close();
  }
}
```

### 4. Imprimante thermique via Bluetooth
```dart
class BluetoothPrinter {
  BluetoothDevice? printerDevice;
  BluetoothCharacteristic? writeCharacteristic;
  
  Future<bool> connectToPrinter(BluetoothDevice device) async {
    try {
      await device.connect();
      printerDevice = device;
      
      List<BluetoothService> services = await device.discoverServices();
      
      for (BluetoothService service in services) {
        for (BluetoothCharacteristic characteristic in service.characteristics) {
          if (characteristic.properties.write) {
            writeCharacteristic = characteristic;
            return true;
          }
        }
      }
      
      return false;
    } catch (e) {
      print('Erreur connexion imprimante: $e');
      return false;
    }
  }
  
  Future<void> printText(String text) async {
    if (writeCharacteristic == null) return;
    
    // Commandes ESC/POS pour imprimante thermique
    List<int> bytes = [];
    
    // Initialiser l'imprimante
    bytes.addAll([0x1B, 0x40]); // ESC @
    
    // Ajouter le texte
    bytes.addAll(utf8.encode(text));
    
    // Saut de ligne
    bytes.addAll([0x0A]);
    
    // Couper le papier (si supporté)
    bytes.addAll([0x1D, 0x56, 0x42, 0x00]);
    
    await writeCharacteristic!.write(bytes);
  }
  
  Future<void> printQRCode(String data) async {
    if (writeCharacteristic == null) return;
    
    List<int> bytes = [];
    
    // Configuration du QR Code
    bytes.addAll([0x1D, 0x28, 0x6B, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00]); // Set QR model
    bytes.addAll([0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x43, 0x08]); // Set size
    bytes.addAll([0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x45, 0x30]); // Set error correction
    
    // Données du QR Code
    int length = data.length + 3;
    bytes.addAll([0x1D, 0x28, 0x6B, length & 0xFF, (length >> 8) & 0xFF, 0x31, 0x50, 0x30]);
    bytes.addAll(utf8.encode(data));
    
    // Imprimer le QR Code
    bytes.addAll([0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x51, 0x30]);
    
    await writeCharacteristic!.write(bytes);
  }
}
```

### 5. Scanner de codes-barres Bluetooth
```dart
class BluetoothBarcodeScanner {
  BluetoothDevice? scannerDevice;
  StreamController<String> barcodeController = StreamController<String>.broadcast();
  
  Stream<String> get barcodeStream => barcodeController.stream;
  
  Future<bool> connectToScanner(BluetoothDevice device) async {
    try {
      await device.connect();
      scannerDevice = device;
      
      List<BluetoothService> services = await device.discoverServices();
      
      for (BluetoothService service in services) {
        for (BluetoothCharacteristic characteristic in service.characteristics) {
          if (characteristic.properties.notify) {
            await characteristic.setNotifyValue(true);
            
            characteristic.value.listen((value) {
              String barcode = String.fromCharCodes(value).trim();
              if (barcode.isNotEmpty) {
                barcodeController.add(barcode);
              }
            });
            
            return true;
          }
        }
      }
      
      return false;
    } catch (e) {
      print('Erreur connexion scanner: $e');
      return false;
    }
  }
  
  Future<void> triggerScan() async {
    if (scannerDevice == null) return;
    
    // Envoyer une commande de déclenchement si le scanner le supporte
    List<BluetoothService> services = await scannerDevice!.discoverServices();
    
    for (BluetoothService service in services) {
      for (BluetoothCharacteristic characteristic in service.characteristics) {
        if (characteristic.properties.write) {
          // Commande pour déclencher le scan (dépend du modèle)
          await characteristic.write([0x7E]); // Exemple de commande
          break;
        }
      }
    }
  }
}
```

## Bonnes pratiques avancées

### Gestion des performances
- **Limitation du débit** : Respecter les limites MTU (Maximum Transmission Unit)
- **Pagination des données** : Diviser les gros transferts en petits paquets
- **Cache local** : Stocker les données fréquemment utilisées localement
- **Compression** : Compresser les données avant transmission pour économiser la bande passante

### Gestion des erreurs robuste
- **Retry automatique** : Réessayer automatiquement en cas d'échec temporaire
- **Circuit breaker** : Arrêter les tentatives après plusieurs échecs consécutifs
- **Fallback** : Prévoir des mécanismes de secours (cache, mode offline)
- **Monitoring** : Enregistrer les erreurs pour analyse ultérieure

### Sécurité renforcée
- **Authentification** : Vérifier l'identité des appareils avant connexion
- **Chiffrement** : Chiffrer toutes les données sensibles
- **Audit** : Enregistrer toutes les communications pour audit
- **Timeout** : Définir des timeouts appropriés pour éviter les blocages

### Expérience utilisateur optimisée
- **Feedback visuel** : Indiquer clairement l'état des connexions
- **Messages d'erreur** : Fournir des messages d'erreur compréhensibles
- **Mode offline** : Permettre un fonctionnement limité sans Bluetooth
- **Configuration simple** : Simplifier au maximum le processus de pairing