# Performances et optimisation

## Introduction

L'optimisation des performances est cruciale pour offrir une expérience utilisateur fluide sur mobile. Cela inclut la gestion de la mémoire, l'optimisation du rendu, la minimisation des reconstructions de widgets, et l'optimisation réseau.

## Métriques de performance importantes

### Frame Rate (FPS)
- **Objectif** : 60 FPS (16.67ms par frame)
- **Seuil critique** : < 55 FPS
- **Outil** : Performance Overlay

### Mémoire
- **Heap size** : Taille totale allouée
- **Memory leaks** : Objets non libérés
- **GC pauses** : Pauses de garbage collection

### Temps de démarrage
- **Cold start** : Première ouverture de l'app
- **Warm start** : Retour depuis l'arrière-plan
- **Hot start** : Retour immédiat

## Outils de profiling

### Flutter Inspector
```dart
// Activer les outils de développement
void main() {
  runApp(MyApp());
  
  // En mode debug uniquement
  if (kDebugMode) {
    // Activer l'overlay de performance
    WidgetsBinding.instance.addPostFrameCallback((_) {
      WidgetsBinding.instance.window.onReportTimings = (List<FrameTiming> timings) {
        for (final timing in timings) {
          print('Frame: ${timing.totalSpan.inMilliseconds}ms');
        }
      };
    });
  }
}
```

### Performance Overlay
```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: MyHomePage(),
      // Activer l'overlay de performance
      showPerformanceOverlay: kDebugMode,
      // Ou seulement en cas de besoin
      // showPerformanceOverlay: true,
    );
  }
}
```

## Optimisation des widgets

### Utilisation de const constructors
```dart
// ❌ Mauvais - widget reconstruit à chaque fois
class BadWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Text('Hello World'),
    );
  }
}

// ✅ Bon - widget marqué comme constant
class GoodWidget extends StatelessWidget {
  const GoodWidget({Key? key}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return const Container(
      child: Text('Hello World'),
    );
  }
}

// Utilisation
Widget build(BuildContext context) {
  return Column(
    children: [
      const GoodWidget(), // Ne sera jamais reconstruit
      GoodWidget(), // Sera reconstruit à chaque build
    ],
  );
}
```

### Éviter les reconstructions inutiles
```dart
class OptimizedListView extends StatefulWidget {
  @override
  _OptimizedListViewState createState() => _OptimizedListViewState();
}

class _OptimizedListViewState extends State<OptimizedListView> {
  final List<String> items = List.generate(1000, (i) => 'Item $i');
  
  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      // Utiliser itemExtent pour de meilleures performances
      itemExtent: 60.0,
      itemCount: items.length,
      itemBuilder: (context, index) {
        // Utiliser const autant que possible
        return ListTile(
          title: Text(items[index]),
          // Widget constant pour la trailing icon
          trailing: const Icon(Icons.arrow_forward),
        );
      },
    );
  }
}
```

### RepaintBoundary pour éviter les repaints
```dart
class ExpensiveWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return RepaintBoundary(
      child: CustomPaint(
        painter: ComplexPainter(),
        size: Size(200, 200),
      ),
    );
  }
}

class ComplexPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    // Dessin complexe qui ne change pas souvent
    final paint = Paint()..color = Colors.blue;
    canvas.drawCircle(Offset(size.width / 2, size.height / 2), 50, paint);
  }
  
  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}
```

## Optimisation des listes

### ListView optimisé
```dart
class OptimizedListWidget extends StatelessWidget {
  final List<Item> items;
  
  const OptimizedListWidget({Key? key, required this.items}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      // Hauteur fixe pour de meilleures performances
      itemExtent: 80.0,
      
      // Nombre d'éléments à précharger
      cacheExtent: 500.0,
      
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        
        // Utiliser une key pour l'optimisation
        return ListItemWidget(
          key: ValueKey(item.id),
          item: item,
        );
      },
    );
  }
}

class ListItemWidget extends StatelessWidget {
  final Item item;
  
  const ListItemWidget({Key? key, required this.item}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          // Optimiser le chargement d'images
          backgroundImage: CachedNetworkImageProvider(item.imageUrl),
        ),
        title: Text(item.title),
        subtitle: Text(item.subtitle),
      ),
    );
  }
}
```

### Pagination et lazy loading
```dart
class PaginatedListWidget extends StatefulWidget {
  @override
  _PaginatedListWidgetState createState() => _PaginatedListWidgetState();
}

class _PaginatedListWidgetState extends State<PaginatedListWidget> {
  final ScrollController _scrollController = ScrollController();
  final List<Item> _items = [];
  bool _isLoading = false;
  int _currentPage = 1;
  final int _itemsPerPage = 20;
  
  @override
  void initState() {
    super.initState();
    _loadMoreItems();
    _scrollController.addListener(_onScroll);
  }
  
  void _onScroll() {
    if (_scrollController.position.pixels >= 
        _scrollController.position.maxScrollExtent - 200) {
      _loadMoreItems();
    }
  }
  
  Future<void> _loadMoreItems() async {
    if (_isLoading) return;
    
    setState(() {
      _isLoading = true;
    });
    
    try {
      final newItems = await ApiService.getItems(
        page: _currentPage,
        limit: _itemsPerPage,
      );
      
      setState(() {
        _items.addAll(newItems);
        _currentPage++;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      controller: _scrollController,
      itemCount: _items.length + (_isLoading ? 1 : 0),
      itemBuilder: (context, index) {
        if (index == _items.length) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }
        
        return ListItemWidget(item: _items[index]);
      },
    );
  }
  
  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }
}
```

## Optimisation des images

### Gestion efficace des images
```dart
class OptimizedImageWidget extends StatelessWidget {
  final String imageUrl;
  final double? width;
  final double? height;
  
  const OptimizedImageWidget({
    Key? key,
    required this.imageUrl,
    this.width,
    this.height,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return CachedNetworkImage(
      imageUrl: imageUrl,
      width: width,
      height: height,
      
      // Placeholder pendant le chargement
      placeholder: (context, url) => Container(
        width: width,
        height: height,
        color: Colors.grey[200],
        child: const Center(
          child: CircularProgressIndicator(),
        ),
      ),
      
      // Widget d'erreur
      errorWidget: (context, url, error) => Container(
        width: width,
        height: height,
        color: Colors.grey[300],
        child: const Icon(Icons.error),
      ),
      
      // Optimisations
      memCacheWidth: width?.toInt(),
      memCacheHeight: height?.toInt(),
      fadeInDuration: const Duration(milliseconds: 200),
      
      // Compression
      imageBuilder: (context, imageProvider) => Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            image: imageProvider,
            fit: BoxFit.cover,
          ),
        ),
      ),
    );
  }
}

// Service de cache d'images
class ImageCacheManager {
  static void preloadImages(List<String> urls, BuildContext context) {
    for (final url in urls) {
      precacheImage(NetworkImage(url), context);
    }
  }
  
  static Future<void> clearCache() async {
    await DefaultCacheManager().emptyCache();
    imageCache.clear();
    imageCache.clearLiveImages();
  }
  
  static void optimizeImageCache() {
    // Limiter la taille du cache
    imageCache.maximumSize = 100;
    imageCache.maximumSizeBytes = 50 << 20; // 50 MB
  }
}
```

## Optimisation réseau

### Gestion efficace des requêtes
```dart
class ApiOptimizationService {
  static final Dio _dio = Dio();
  static final Map<String, dynamic> _cache = {};
  static final Map<String, Timer> _cacheTimers = {};
  
  static void init() {
    // Intercepteur de cache
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        final cacheKey = _getCacheKey(options);
        
        if (_cache.containsKey(cacheKey)) {
          // Retourner depuis le cache
          final cachedResponse = _cache[cacheKey];
          return handler.resolve(cachedResponse);
        }
        
        handler.next(options);
      },
      onResponse: (response, handler) {
        final cacheKey = _getCacheKey(response.requestOptions);
        
        // Mettre en cache pour 5 minutes
        _cache[cacheKey] = response;
        _cacheTimers[cacheKey] = Timer(Duration(minutes: 5), () {
          _cache.remove(cacheKey);
          _cacheTimers.remove(cacheKey);
        });
        
        handler.next(response);
      },
    ));
    
    // Timeout et retry
    _dio.options.connectTimeout = const Duration(seconds: 10);
    _dio.options.receiveTimeout = const Duration(seconds: 10);
  }
  
  static String _getCacheKey(RequestOptions options) {
    return '${options.method}_${options.uri}_${options.data}';
  }
  
  // Requêtes avec debouncing
  static Timer? _searchTimer;
  static Future<List<SearchResult>> searchWithDebounce(
    String query,
    Function(List<SearchResult>) onResults,
  ) async {
    _searchTimer?.cancel();
    
    _searchTimer = Timer(Duration(milliseconds: 300), () async {
      try {
        final results = await search(query);
        onResults(results);
      } catch (e) {
        onResults([]);
      }
    });
    
    return [];
  }
  
  // Batch requests
  static Future<List<T>> batchRequests<T>(
    List<Future<T>> requests,
    {int batchSize = 5}
  ) async {
    final results = <T>[];
    
    for (int i = 0; i < requests.length; i += batchSize) {
      final batch = requests.skip(i).take(batchSize).toList();
      final batchResults = await Future.wait(batch);
      results.addAll(batchResults);
      
      // Pause entre les batches
      if (i + batchSize < requests.length) {
        await Future.delayed(Duration(milliseconds: 100));
      }
    }
    
    return results;
  }
}
```

## Optimisation de l'état

### State management efficace
```dart
// Provider optimisé
class OptimizedCounterProvider extends ChangeNotifier {
  int _counter = 0;
  int get counter => _counter;
  
  void increment() {
    _counter++;
    // Ne notifier que si nécessaire
    notifyListeners();
  }
  
  // Mise à jour granulaire
  void updateSpecificValue(String key, dynamic value) {
    // Notifier seulement les listeners concernés
    notifyListeners();
  }
}

// Widget avec Selector pour écouter seulement les changements pertinents
class OptimizedCounterWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Selector<OptimizedCounterProvider, int>(
      selector: (context, provider) => provider.counter,
      builder: (context, counter, child) {
        return Text('Counter: $counter');
      },
    );
  }
}

// BLoC avec transformation de stream
class OptimizedBloc extends Bloc<CounterEvent, CounterState> {
  OptimizedBloc() : super(CounterInitial()) {
    on<IncrementEvent>(
      (event, emit) async {
        emit(CounterUpdated(state.counter + 1));
      },
      // Throttling pour éviter trop d'événements
      transformer: throttleDroppable(Duration(milliseconds: 100)),
    );
  }
}

// Extension pour throttling
EventTransformer<E> throttleDroppable<E>(Duration duration) {
  return (events, mapper) {
    return droppable<E>().call(events.throttle(duration), mapper);
  };
}
```

## Monitoring et analytics

### Performance monitoring
```dart
class PerformanceMonitor {
  static final Stopwatch _stopwatch = Stopwatch();
  static final Map<String, Duration> _metrics = {};
  
  static void startMeasurement(String operation) {
    _stopwatch.reset();
    _stopwatch.start();
  }
  
  static void endMeasurement(String operation) {
    _stopwatch.stop();
    _metrics[operation] = _stopwatch.elapsed;
    
    // Log si la performance est dégradée
    if (_stopwatch.elapsedMilliseconds > 100) {
      print('⚠️  Slow operation: $operation took ${_stopwatch.elapsedMilliseconds}ms');
    }
  }
  
  static void measureOperation<T>(String operation, Function() callback) {
    startMeasurement(operation);
    try {
      callback();
    } finally {
      endMeasurement(operation);
    }
  }
  
  static Future<T> measureAsyncOperation<T>(
    String operation,
    Future<T> Function() callback,
  ) async {
    startMeasurement(operation);
    try {
      return await callback();
    } finally {
      endMeasurement(operation);
    }
  }
  
  static Map<String, Duration> getMetrics() => Map.from(_metrics);
  
  static void clearMetrics() => _metrics.clear();
}

// Utilisation
class OptimizedService {
  static Future<List<Data>> loadData() async {
    return await PerformanceMonitor.measureAsyncOperation(
      'loadData',
      () async {
        // Opération coûteuse
        return await ApiService.fetchData();
      },
    );
  }
}
```

## Bonnes pratiques

### Règles générales
1. **Profiler avant d'optimiser** : Mesurer pour identifier les vrais goulots d'étranglement
2. **const partout** : Utiliser const constructors autant que possible
3. **Keys appropriées** : Utiliser les bonnes keys pour les widgets dynamiques
4. **Éviter les rebuilds** : Structurer l'état pour minimiser les reconstructions

### Widgets
- **RepaintBoundary** : Isoler les zones de repaint coûteuses
- **AutomaticKeepAliveClientMixin** : Garder l'état des onglets
- **SingleChildScrollView vs ListView** : Choisir selon le cas d'usage

### Images et assets
- **Formats optimaux** : WebP pour les images, SVG pour les icônes
- **Tailles appropriées** : Ne pas charger d'images plus grandes que nécessaire
- **Lazy loading** : Charger les images seulement quand visibles

### Réseau
- **Cache intelligent** : Mettre en cache les réponses fréquentes
- **Compression** : Utiliser gzip pour les requêtes
- **Timeouts** : Définir des timeouts appropriés

## Cas d'usage d'optimisation

1. **Listes longues** : Pagination, hauteurs fixes, cache
2. **Animations complexes** : RepaintBoundary, FPS monitoring
3. **Images nombreuses** : Cache, compression, lazy loading
4. **Applications temps réel** : Throttling, debouncing
5. **Offline-first** : Cache intelligent, synchronisation
6. **Applications riches en données** : State management optimisé