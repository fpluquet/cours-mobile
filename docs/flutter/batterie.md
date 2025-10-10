# Gestion de la batterie

## Introduction

La gestion de la batterie est cruciale pour les applications mobiles. Il faut surveiller le niveau de batterie, optimiser la consommation et adapter le comportement de l'application selon l'état énergétique du dispositif.

## Packages Flutter

### battery_plus

Package officiel Flutter Community pour surveiller l'état de la batterie : niveau de charge, état de charge/décharge, et notifications de changements d'état.

```bash
flutter pub add battery_plus
```

### device_info_plus

Package complet pour obtenir des informations détaillées sur l'appareil : modèle, version OS, mémoire disponible. Utile pour adapter l'application aux capacités du dispositif.

```bash
flutter pub add device_info_plus
```

### power_save_mode

Package spécialisé pour détecter et réagir au mode économie d'énergie. Permet d'adapter automatiquement les fonctionnalités de l'app selon les paramètres d'économie.

```bash
flutter pub add power_save_mode
```

## Configuration

### Android (android/app/src/main/AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.BATTERY_STATS" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

## Exemples d'implémentation

### Service de gestion de batterie
```dart
import 'package:battery_plus/battery_plus.dart';

class BatteryService {
  static final Battery _battery = Battery();
  
  // Obtenir le niveau de batterie actuel
  static Future<int> getBatteryLevel() async {
    return await _battery.batteryLevel;
  }
  
  // Obtenir l'état de la batterie
  static Future<BatteryState> getBatteryState() async {
    return await _battery.batteryState;
  }
  
  // Écouter les changements de niveau de batterie
  static Stream<BatteryState> getBatteryStateStream() {
    return _battery.onBatteryStateChanged;
  }
  
  // Vérifier si la batterie est faible
  static Future<bool> isLowBattery({int threshold = 20}) async {
    final level = await getBatteryLevel();
    return level <= threshold;
  }
  
  // Vérifier si le mode économie d'énergie est activé
  static Future<bool> isPowerSaveMode() async {
    // Implémentation dépendant du package utilisé
    return false; // Placeholder
  }
}
```

### Widget de monitoring de batterie
```dart
class BatteryMonitorWidget extends StatefulWidget {
  @override
  _BatteryMonitorWidgetState createState() => _BatteryMonitorWidgetState();
}

class _BatteryMonitorWidgetState extends State<BatteryMonitorWidget> {
  int _batteryLevel = 0;
  BatteryState _batteryState = BatteryState.unknown;
  StreamSubscription<BatteryState>? _batteryStateSubscription;

  @override
  void initState() {
    super.initState();
    _initBatteryState();
    _listenToBatteryState();
  }

  Future<void> _initBatteryState() async {
    final level = await BatteryService.getBatteryLevel();
    final state = await BatteryService.getBatteryState();
    
    setState(() {
      _batteryLevel = level;
      _batteryState = state;
    });
  }

  void _listenToBatteryState() {
    _batteryStateSubscription = BatteryService.getBatteryStateStream()
        .listen((BatteryState state) {
      setState(() {
        _batteryState = state;
      });
      _updateBatteryLevel();
    });
  }

  Future<void> _updateBatteryLevel() async {
    final level = await BatteryService.getBatteryLevel();
    setState(() {
      _batteryLevel = level;
    });
  }

  Color _getBatteryColor() {
    if (_batteryLevel > 50) return Colors.green;
    if (_batteryLevel > 20) return Colors.orange;
    return Colors.red;
  }

  IconData _getBatteryIcon() {
    switch (_batteryState) {
      case BatteryState.charging:
        return Icons.battery_charging_full;
      case BatteryState.discharging:
        if (_batteryLevel > 80) return Icons.battery_full;
        if (_batteryLevel > 60) return Icons.battery_6_bar;
        if (_batteryLevel > 40) return Icons.battery_4_bar;
        if (_batteryLevel > 20) return Icons.battery_2_bar;
        return Icons.battery_1_bar;
      case BatteryState.full:
        return Icons.battery_full;
      default:
        return Icons.battery_unknown;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  _getBatteryIcon(),
                  color: _getBatteryColor(),
                  size: 32,
                ),
                SizedBox(width: 8),
                Text(
                  '$_batteryLevel%',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: _getBatteryColor(),
                  ),
                ),
              ],
            ),
            SizedBox(height: 8),
            LinearProgressIndicator(
              value: _batteryLevel / 100,
              backgroundColor: Colors.grey[300],
              valueColor: AlwaysStoppedAnimation<Color>(_getBatteryColor()),
            ),
            SizedBox(height: 8),
            Text(
              'État: ${_getBatteryStateText(_batteryState)}',
              style: TextStyle(fontSize: 16),
            ),
            if (_batteryLevel <= 20)
              Container(
                margin: EdgeInsets.only(top: 8),
                padding: EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.red[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Icon(Icons.warning, color: Colors.red),
                    SizedBox(width: 8),
                    Text(
                      'Batterie faible!',
                      style: TextStyle(color: Colors.red),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  String _getBatteryStateText(BatteryState state) {
    switch (state) {
      case BatteryState.charging:
        return 'En charge';
      case BatteryState.discharging:
        return 'En décharge';
      case BatteryState.full:
        return 'Pleine';
      default:
        return 'Inconnu';
    }
  }

  @override
  void dispose() {
    _batteryStateSubscription?.cancel();
    super.dispose();
  }
}
```

### Optimisation automatique selon la batterie
```dart
class BatteryOptimizationService {
  static const int LOW_BATTERY_THRESHOLD = 20;
  static const int CRITICAL_BATTERY_THRESHOLD = 10;
  
  static Future<AppOptimizationLevel> getOptimizationLevel() async {
    final batteryLevel = await BatteryService.getBatteryLevel();
    final isCharging = await BatteryService.getBatteryState() == BatteryState.charging;
    
    if (isCharging) {
      return AppOptimizationLevel.none;
    }
    
    if (batteryLevel <= CRITICAL_BATTERY_THRESHOLD) {
      return AppOptimizationLevel.aggressive;
    } else if (batteryLevel <= LOW_BATTERY_THRESHOLD) {
      return AppOptimizationLevel.moderate;
    }
    
    return AppOptimizationLevel.none;
  }
  
  static Future<void> applyOptimizations(AppOptimizationLevel level) async {
    switch (level) {
      case AppOptimizationLevel.aggressive:
        await _applyCriticalOptimizations();
        break;
      case AppOptimizationLevel.moderate:
        await _applyModerateOptimizations();
        break;
      case AppOptimizationLevel.none:
        await _removeOptimizations();
        break;
    }
  }
  
  static Future<void> _applyCriticalOptimizations() async {
    // Réduire la fréquence des mises à jour
    // Désactiver les animations
    // Réduire la luminosité
    // Arrêter les services non essentiels
  }
  
  static Future<void> _applyModerateOptimizations() async {
    // Réduire légèrement la fréquence des mises à jour
    // Simplifier les animations
  }
  
  static Future<void> _removeOptimizations() async {
    // Restaurer les paramètres normaux
  }
}

enum AppOptimizationLevel {
  none,
  moderate,
  aggressive,
}
```

### Service de notification de batterie
```dart
class BatteryNotificationService {
  static void setupBatteryAlerts() {
    BatteryService.getBatteryStateStream().listen((state) async {
      final level = await BatteryService.getBatteryLevel();
      
      if (level <= 10 && state == BatteryState.discharging) {
        _showCriticalBatteryAlert();
      } else if (level <= 20 && state == BatteryState.discharging) {
        _showLowBatteryAlert();
      }
    });
  }
  
  static void _showCriticalBatteryAlert() {
    // Afficher une notification critique
    // Proposer d'activer le mode économie d'énergie
  }
  
  static void _showLowBatteryAlert() {
    // Afficher une notification d'avertissement
    // Suggérer des optimisations
  }
}
```

## Bonnes pratiques

### Optimisation de la consommation
- **Mises à jour adaptatives** : Réduire la fréquence selon le niveau de batterie
- **Services en arrière-plan** : Limiter les tâches non essentielles
- **Écran** : Gérer la luminosité et les animations
- **Réseau** : Optimiser les appels API et le cache

### Monitoring et feedback
- **Indicateurs visuels** : Afficher le niveau de batterie dans l'interface
- **Alertes intelligentes** : Notifier uniquement quand nécessaire
- **Mode dégradé** : Proposer un mode économie d'énergie

### Adaptation comportementale
```dart
class AdaptiveBehaviorService {
  static Future<void> adaptToPhoneState() async {
    final batteryLevel = await BatteryService.getBatteryLevel();
    final isLowPowerMode = await BatteryService.isPowerSaveMode();
    
    if (isLowPowerMode || batteryLevel < 15) {
      // Mode minimal
      await _enableMinimalMode();
    } else if (batteryLevel < 30) {
      // Mode économie
      await _enablePowerSavingMode();
    } else {
      // Mode normal
      await _enableNormalMode();
    }
  }
  
  static Future<void> _enableMinimalMode() async {
    // Désactiver animations, réduire sync, mode sombre
  }
  
  static Future<void> _enablePowerSavingMode() async {
    // Réduire fréquence de mise à jour, simplifier UI
  }
  
  static Future<void> _enableNormalMode() async {
    // Toutes les fonctionnalités activées
  }
}
```

## Cas d'usage typiques

1. **Applications de navigation** : Adaptation selon l'autonomie restante
2. **Jeux mobiles** : Réduction des effets visuels quand batterie faible
3. **Apps de fitness** : Gestion intelligente du tracking GPS
4. **Réseaux sociaux** : Optimisation du refresh automatique
5. **Apps professionnelles** : Mode économie pour les longues journées
6. **IoT et domotique** : Adaptation des connexions selon l'énergie disponible