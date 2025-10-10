# Géolocalisation (GPS)

## Introduction

La géolocalisation permet aux applications mobiles de déterminer la position géographique de l'utilisateur en utilisant le GPS, les réseaux WiFi, et les tours cellulaires.

## Packages Flutter

### geolocator

Package populaire et robuste pour la géolocalisation avec support complet des permissions, détection des services de localisation, et calcul de distances entre coordonnées.

```bash
flutter pub add geolocator
```

### location

Alternative plus simple à geolocator, offrant une API épurée pour obtenir la position de l'utilisateur avec moins de configuration requise.

```bash
flutter pub add location
```

## Configuration

### Android (android/app/src/main/AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```

### iOS (ios/Runner/Info.plist)
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Cette app utilise votre localisation pour vous fournir des services personnalisés</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Cette app utilise votre localisation en arrière-plan pour le suivi</string>
```

## Exemples d'implémentation

### Service de géolocalisation
```dart
import 'package:geolocator/geolocator.dart';

class LocationService {
  static Future<Position?> getCurrentPosition() async {
    bool serviceEnabled;
    LocationPermission permission;

    // Vérifier si les services de localisation sont activés
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw Exception('Les services de localisation sont désactivés');
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('Permissions de localisation refusées');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw Exception('Permissions de localisation refusées définitivement');
    }

    return await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );
  }

  static Stream<Position> getPositionStream() {
    return Geolocator.getPositionStream(
      locationSettings: LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 10, // Mise à jour tous les 10 mètres
      ),
    );
  }

  static Future<double> getDistanceBetween(
    double startLatitude,
    double startLongitude,
    double endLatitude,
    double endLongitude,
  ) async {
    return Geolocator.distanceBetween(
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
    );
  }
}
```

### Widget de localisation
```dart
class LocationWidget extends StatefulWidget {
  @override
  _LocationWidgetState createState() => _LocationWidgetState();
}

class _LocationWidgetState extends State<LocationWidget> {
  Position? _currentPosition;
  StreamSubscription<Position>? _positionStreamSubscription;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
  }

  Future<void> _getCurrentLocation() async {
    setState(() => _isLoading = true);
    
    try {
      final position = await LocationService.getCurrentPosition();
      setState(() {
        _currentPosition = position;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur: $e')),
      );
    }
  }

  void _startLocationTracking() {
    _positionStreamSubscription = LocationService.getPositionStream()
        .listen((Position position) {
      setState(() {
        _currentPosition = position;
      });
    });
  }

  void _stopLocationTracking() {
    _positionStreamSubscription?.cancel();
    _positionStreamSubscription = null;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (_isLoading)
          CircularProgressIndicator()
        else if (_currentPosition != null)
          Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                children: [
                  Text('Latitude: ${_currentPosition!.latitude}'),
                  Text('Longitude: ${_currentPosition!.longitude}'),
                  Text('Précision: ${_currentPosition!.accuracy}m'),
                  Text('Altitude: ${_currentPosition!.altitude}m'),
                ],
              ),
            ),
          ),
        
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            ElevatedButton(
              onPressed: _getCurrentLocation,
              child: Text('Position actuelle'),
            ),
            ElevatedButton(
              onPressed: _positionStreamSubscription == null
                  ? _startLocationTracking
                  : _stopLocationTracking,
              child: Text(_positionStreamSubscription == null
                  ? 'Démarrer suivi'
                  : 'Arrêter suivi'),
            ),
          ],
        ),
      ],
    );
  }

  @override
  void dispose() {
    _positionStreamSubscription?.cancel();
    super.dispose();
  }
}
```

## Géofencing

### Implémentation du géofencing
```dart
class GeofencingService {
  static bool isInsideRadius(
    Position userPosition,
    double centerLat,
    double centerLng,
    double radiusInMeters,
  ) {
    double distance = Geolocator.distanceBetween(
      userPosition.latitude,
      userPosition.longitude,
      centerLat,
      centerLng,
    );
    
    return distance <= radiusInMeters;
  }

  static Stream<bool> monitorGeofence(
    double centerLat,
    double centerLng,
    double radiusInMeters,
  ) {
    return LocationService.getPositionStream().map((position) {
      return isInsideRadius(position, centerLat, centerLng, radiusInMeters);
    });
  }
}
```

## Bonnes pratiques

### Performance et batterie
- **Précision adaptative** : Utiliser la précision appropriée selon le besoin
- **Intervalle de mise à jour** : Optimiser la fréquence des mises à jour
- **Arrêt automatique** : Stopper le suivi quand il n'est plus nécessaire

### Confidentialité
- **Permissions explicites** : Expliquer pourquoi la localisation est nécessaire
- **Données minimales** : Ne collecter que les données nécessaires
- **Stockage sécurisé** : Chiffrer les données de localisation sensibles

### UX
- **Feedback visuel** : Indiquer quand la localisation est en cours d'acquisition
- **Mode dégradé** : Fonctionner sans GPS si possible
- **Gestion d'erreurs** : Messages d'erreur clairs et solutions proposées

## Cas d'usage typiques

1. **Navigation** : Applications de cartographie et guidage
2. **Livraison** : Suivi en temps réel des coursiers
3. **Fitness** : Tracking des courses et activités sportives
4. **Sécurité** : Localisation d'urgence et géofencing
5. **Marketing** : Offres géolocalisées et analytics
6. **Météo** : Prévisions locales basées sur la position