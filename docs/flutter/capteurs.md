# Capteurs et matériel

## Introduction

Les appareils mobiles modernes intègrent de nombreux capteurs : accéléromètre, gyroscope, magnétomètre, capteur de luminosité, de proximité, etc. Flutter permet d'accéder à ces capteurs pour créer des expériences interactives innovantes.

## Packages Flutter

### sensors_plus

Package officiel Flutter Community pour accéder aux capteurs de mouvement : accéléromètre, gyroscope et magnétomètre. Idéal pour les applications de réalité augmentée et de détection de mouvements.

```bash
flutter pub add sensors_plus
```

### light

Package spécialisé pour mesurer l'intensité lumineuse ambiante. Permet d'adapter automatiquement la luminosité de l'interface ou de créer des applications dépendantes de la lumière.

```bash
flutter pub add light
```

### proximity_sensor

Accès au capteur de proximité pour détecter la présence d'objets près de l'appareil. Utile pour désactiver l'écran pendant les appels ou créer des interactions gestuelles.

```bash
flutter pub add proximity_sensor
```

### flutter_compass

Package pour accéder à la boussole et obtenir l'orientation magnétique de l'appareil. Essentiel pour les applications de navigation et de réalité augmentée basées sur la direction.

```bash
flutter pub add flutter_compass
```

## Configuration

### Android (android/app/src/main/AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-feature android:name="android.hardware.sensor.accelerometer" android:required="true" />
<uses-feature android:name="android.hardware.sensor.gyroscope" android:required="true" />
<uses-feature android:name="android.hardware.sensor.compass" android:required="true" />
```

## Exemples d'implémentation

### Service de gestion des capteurs
```dart
import 'package:sensors_plus/sensors_plus.dart';
import 'dart:async';
import 'dart:math';

class SensorService {
  // Accéléromètre - détecte les mouvements et l'orientation
  static Stream<AccelerometerEvent> getAccelerometerStream() {
    return accelerometerEvents;
  }
  
  // Gyroscope - détecte la rotation
  static Stream<GyroscopeEvent> getGyroscopeStream() {
    return gyroscopeEvents;
  }
  
  // Magnétomètre - détecte les champs magnétiques
  static Stream<MagnetometerEvent> getMagnetometerStream() {
    return magnetometerEvents;
  }
  
  // Détection de secousses (shake)
  static Stream<bool> getShakeDetectionStream({double threshold = 12.0}) {
    return accelerometerEvents.map((event) {
      double magnitude = sqrt(
        event.x * event.x + event.y * event.y + event.z * event.z
      );
      return magnitude > threshold;
    });
  }
  
  // Détection d'inclinaison
  static Stream<DeviceOrientation> getOrientationStream() {
    return accelerometerEvents.map((event) {
      if (event.x.abs() > event.y.abs()) {
        return event.x > 0 ? DeviceOrientation.right : DeviceOrientation.left;
      } else {
        return event.y > 0 ? DeviceOrientation.down : DeviceOrientation.up;
      }
    });
  }
}

enum DeviceOrientation { up, down, left, right }
```

### Widget de monitoring des capteurs
```dart
class SensorMonitorWidget extends StatefulWidget {
  @override
  _SensorMonitorWidgetState createState() => _SensorMonitorWidgetState();
}

class _SensorMonitorWidgetState extends State<SensorMonitorWidget> {
  AccelerometerEvent? _accelerometerData;
  GyroscopeEvent? _gyroscopeData;
  MagnetometerEvent? _magnetometerData;
  bool _isShaking = false;
  DeviceOrientation _orientation = DeviceOrientation.up;
  
  late StreamSubscription<AccelerometerEvent> _accelerometerSubscription;
  late StreamSubscription<GyroscopeEvent> _gyroscopeSubscription;
  late StreamSubscription<MagnetometerEvent> _magnetometerSubscription;
  late StreamSubscription<bool> _shakeSubscription;
  late StreamSubscription<DeviceOrientation> _orientationSubscription;

  @override
  void initState() {
    super.initState();
    _initSensors();
  }

  void _initSensors() {
    // Accéléromètre
    _accelerometerSubscription = SensorService.getAccelerometerStream()
        .listen((event) {
      setState(() {
        _accelerometerData = event;
      });
    });

    // Gyroscope
    _gyroscopeSubscription = SensorService.getGyroscopeStream()
        .listen((event) {
      setState(() {
        _gyroscopeData = event;
      });
    });

    // Magnétomètre
    _magnetometerSubscription = SensorService.getMagnetometerStream()
        .listen((event) {
      setState(() {
        _magnetometerData = event;
      });
    });

    // Détection de secousses
    _shakeSubscription = SensorService.getShakeDetectionStream()
        .listen((isShaking) {
      setState(() {
        _isShaking = isShaking;
      });
      
      if (isShaking) {
        _onShakeDetected();
      }
    });

    // Orientation
    _orientationSubscription = SensorService.getOrientationStream()
        .listen((orientation) {
      setState(() {
        _orientation = orientation;
      });
    });
  }

  void _onShakeDetected() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Secousse détectée!'),
        duration: Duration(milliseconds: 500),
        backgroundColor: Colors.orange,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Capteurs')),
      body: ListView(
        padding: EdgeInsets.all(16),
        children: [
          // Accéléromètre
          _buildSensorCard(
            'Accéléromètre',
            Icons.smartphone,
            _accelerometerData != null
                ? [
                    'X: ${_accelerometerData!.x.toStringAsFixed(2)}',
                    'Y: ${_accelerometerData!.y.toStringAsFixed(2)}',
                    'Z: ${_accelerometerData!.z.toStringAsFixed(2)}',
                  ]
                : ['Aucune donnée'],
          ),
          
          // Gyroscope
          _buildSensorCard(
            'Gyroscope',
            Icons.rotate_right,
            _gyroscopeData != null
                ? [
                    'X: ${_gyroscopeData!.x.toStringAsFixed(2)}',
                    'Y: ${_gyroscopeData!.y.toStringAsFixed(2)}',
                    'Z: ${_gyroscopeData!.z.toStringAsFixed(2)}',
                  ]
                : ['Aucune donnée'],
          ),
          
          // Magnétomètre
          _buildSensorCard(
            'Magnétomètre',
            Icons.explore,
            _magnetometerData != null
                ? [
                    'X: ${_magnetometerData!.x.toStringAsFixed(2)}',
                    'Y: ${_magnetometerData!.y.toStringAsFixed(2)}',
                    'Z: ${_magnetometerData!.z.toStringAsFixed(2)}',
                  ]
                : ['Aucune donnée'],
          ),
          
          // État de secousse
          Card(
            color: _isShaking ? Colors.red[100] : Colors.grey[100],
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Row(
                children: [
                  Icon(
                    Icons.vibration,
                    color: _isShaking ? Colors.red : Colors.grey,
                  ),
                  SizedBox(width: 16),
                  Text(
                    _isShaking ? 'Secousse détectée!' : 'Aucune secousse',
                    style: TextStyle(
                      color: _isShaking ? Colors.red : Colors.grey[600],
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          // Orientation
          Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Row(
                children: [
                  Icon(Icons.screen_rotation),
                  SizedBox(width: 16),
                  Text('Orientation: ${_getOrientationText(_orientation)}'),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSensorCard(String title, IconData icon, List<String> data) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon),
                SizedBox(width: 8),
                Text(title, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ],
            ),
            SizedBox(height: 8),
            ...data.map((d) => Text(d)).toList(),
          ],
        ),
      ),
    );
  }

  String _getOrientationText(DeviceOrientation orientation) {
    switch (orientation) {
      case DeviceOrientation.up:
        return 'Vers le haut';
      case DeviceOrientation.down:
        return 'Vers le bas';
      case DeviceOrientation.left:
        return 'Vers la gauche';
      case DeviceOrientation.right:
        return 'Vers la droite';
    }
  }

  @override
  void dispose() {
    _accelerometerSubscription.cancel();
    _gyroscopeSubscription.cancel();
    _magnetometerSubscription.cancel();
    _shakeSubscription.cancel();
    _orientationSubscription.cancel();
    super.dispose();
  }
}
```

### Boussole digitale
```dart
import 'package:flutter_compass/flutter_compass.dart';

class CompassWidget extends StatefulWidget {
  @override
  _CompassWidgetState createState() => _CompassWidgetState();
}

class _CompassWidgetState extends State<CompassWidget> {
  double _direction = 0;
  StreamSubscription<CompassEvent>? _compassSubscription;

  @override
  void initState() {
    super.initState();
    _initCompass();
  }

  void _initCompass() {
    _compassSubscription = FlutterCompass.events?.listen((CompassEvent event) {
      setState(() {
        _direction = event.heading ?? 0;
      });
    });
  }

  String _getCardinalDirection(double heading) {
    if (heading >= 337.5 || heading < 22.5) return 'N';
    if (heading >= 22.5 && heading < 67.5) return 'NE';
    if (heading >= 67.5 && heading < 112.5) return 'E';
    if (heading >= 112.5 && heading < 157.5) return 'SE';
    if (heading >= 157.5 && heading < 202.5) return 'S';
    if (heading >= 202.5 && heading < 247.5) return 'SW';
    if (heading >= 247.5 && heading < 292.5) return 'W';
    if (heading >= 292.5 && heading < 337.5) return 'NW';
    return 'N';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(20),
      child: Column(
        children: [
          // Boussole visuelle
          Container(
            width: 200,
            height: 200,
            child: CustomPaint(
              painter: CompassPainter(_direction),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      '${_direction.toInt()}°',
                      style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      _getCardinalDirection(_direction),
                      style: TextStyle(fontSize: 18),
                    ),
                  ],
                ),
              ),
            ),
          ),
          
          SizedBox(height: 20),
          
          // Informations détaillées
          Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                children: [
                  Text('Direction: ${_getCardinalDirection(_direction)}'),
                  Text('Azimut: ${_direction.toStringAsFixed(1)}°'),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _compassSubscription?.cancel();
    super.dispose();
  }
}

class CompassPainter extends CustomPainter {
  final double direction;
  
  CompassPainter(this.direction);

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 20;
    
    // Cercle extérieur
    canvas.drawCircle(
      center,
      radius,
      Paint()
        ..color = Colors.grey[300]!
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2,
    );
    
    // Aiguille nord
    canvas.save();
    canvas.translate(center.dx, center.dy);
    canvas.rotate(-direction * pi / 180);
    
    final needlePaint = Paint()
      ..color = Colors.red
      ..style = PaintingStyle.fill;
    
    final needlePath = Path()
      ..moveTo(0, -radius + 20)
      ..lineTo(-8, 0)
      ..lineTo(8, 0)
      ..close();
    
    canvas.drawPath(needlePath, needlePaint);
    canvas.restore();
    
    // Marqueurs cardinaux
    final textPainter = TextPainter(
      textDirection: TextDirection.ltr,
    );
    
    final cardinals = ['N', 'E', 'S', 'W'];
    for (int i = 0; i < 4; i++) {
      final angle = i * pi / 2;
      final x = center.dx + sin(angle) * (radius - 15);
      final y = center.dy - cos(angle) * (radius - 15);
      
      textPainter.text = TextSpan(
        text: cardinals[i],
        style: TextStyle(color: Colors.black, fontSize: 16, fontWeight: FontWeight.bold),
      );
      textPainter.layout();
      textPainter.paint(canvas, Offset(x - textPainter.width / 2, y - textPainter.height / 2));
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}
```

### Détecteur de proximité
```dart
import 'package:proximity_sensor/proximity_sensor.dart';

class ProximityService {
  static Stream<bool> getProximityStream() {
    return ProximitySensor.events;
  }
  
  static Future<bool> isNear() async {
    return await ProximitySensor.getProximityState();
  }
}

class ProximityWidget extends StatefulWidget {
  @override
  _ProximityWidgetState createState() => _ProximityWidgetState();
}

class _ProximityWidgetState extends State<ProximityWidget> {
  bool _isNear = false;
  StreamSubscription<bool>? _proximitySubscription;

  @override
  void initState() {
    super.initState();
    _initProximity();
  }

  void _initProximity() {
    _proximitySubscription = ProximityService.getProximityStream()
        .listen((bool isNear) {
      setState(() {
        _isNear = isNear;
      });
      
      if (isNear) {
        _onProximityDetected();
      }
    });
  }

  void _onProximityDetected() {
    // Action quand un objet est proche
    // Par exemple : éteindre l'écran, mettre en pause, etc.
    print('Objet détecté à proximité');
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      color: _isNear ? Colors.orange[100] : Colors.grey[100],
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          children: [
            Icon(
              Icons.sensors,
              color: _isNear ? Colors.orange : Colors.grey,
            ),
            SizedBox(width: 16),
            Text(
              _isNear ? 'Objet proche détecté' : 'Aucun objet proche',
              style: TextStyle(
                color: _isNear ? Colors.orange[800] : Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _proximitySubscription?.cancel();
    super.dispose();
  }
}
```

### Détecteur de pas (podomètre)
```dart
class StepCounterService {
  static int _stepCount = 0;
  static double _lastMagnitude = 0;
  static DateTime _lastStepTime = DateTime.now();
  static const double STEP_THRESHOLD = 11.0;
  static const int MIN_TIME_BETWEEN_STEPS = 300; // ms

  static Stream<int> getStepCountStream() {
    return SensorService.getAccelerometerStream().map((event) {
      double magnitude = sqrt(event.x * event.x + event.y * event.y + event.z * event.z);
      
      if (magnitude > STEP_THRESHOLD && 
          _lastMagnitude <= STEP_THRESHOLD &&
          DateTime.now().difference(_lastStepTime).inMilliseconds > MIN_TIME_BETWEEN_STEPS) {
        _stepCount++;
        _lastStepTime = DateTime.now();
      }
      
      _lastMagnitude = magnitude;
      return _stepCount;
    });
  }
  
  static void resetStepCount() {
    _stepCount = 0;
  }
}
```

## Bonnes pratiques

### Performance
- **Fréquence d'échantillonnage** : Adapter selon les besoins
- **Filtrage des données** : Éliminer le bruit des capteurs
- **Suspension intelligente** : Arrêter les capteurs quand l'app est en arrière-plan

### Précision
- **Calibration** : Permettre à l'utilisateur de calibrer
- **Combinaison de capteurs** : Utiliser plusieurs capteurs pour plus de précision
- **Seuils adaptatifs** : Ajuster selon le dispositif

### UX
- **Feedback visuel** : Indiquer l'activité des capteurs
- **Permissions** : Expliquer l'utilisation des capteurs
- **Mode dégradé** : Fonctionner même si certains capteurs ne sont pas disponibles

## Cas d'usage typiques

1. **Fitness et santé** : Compteur de pas, détection d'activité
2. **Jeux** : Contrôles par mouvement, réalité augmentée
3. **Navigation** : Boussole, détection d'orientation
4. **Sécurité** : Détection de chute, alarme anti-vol
5. **Accessibilité** : Navigation pour malvoyants
6. **IoT** : Interaction avec des objets connectés basée sur les mouvements