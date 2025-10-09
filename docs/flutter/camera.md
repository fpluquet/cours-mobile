# Appareil photo et caméra

## Introduction

L'accès à l'appareil photo et à la caméra est essentiel pour de nombreuses applications mobiles. Flutter offre plusieurs solutions pour capturer des photos, enregistrer des vidéos et traiter les images.

## Packages Flutter

### image_picker
```yaml
dependencies:
  image_picker: ^1.0.4
```

### camera
```yaml
dependencies:
  camera: ^0.10.5+4
```

### image
```yaml
dependencies:
  image: ^4.1.3
```

## Configuration

### Android (android/app/src/main/AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### iOS (ios/Runner/Info.plist)
```xml
<key>NSCameraUsageDescription</key>
<string>Cette app utilise l'appareil photo pour capturer des images</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Cette app accède à la galerie pour sélectionner des images</string>
<key>NSMicrophoneUsageDescription</key>
<string>Cette app utilise le microphone pour enregistrer des vidéos avec son</string>
```

## Exemples d'implémentation

### Service de capture d'images
```dart
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class CameraService {
  static final ImagePicker _picker = ImagePicker();
  
  // Prendre une photo avec l'appareil photo
  static Future<File?> takePhoto({
    double maxWidth = 1024,
    double maxHeight = 1024,
    int imageQuality = 85,
  }) async {
    try {
      final XFile? photo = await _picker.pickImage(
        source: ImageSource.camera,
        maxWidth: maxWidth,
        maxHeight: maxHeight,
        imageQuality: imageQuality,
      );
      
      return photo != null ? File(photo.path) : null;
    } catch (e) {
      print('Erreur lors de la capture: $e');
      return null;
    }
  }
  
  // Sélectionner une image depuis la galerie
  static Future<File?> pickImageFromGallery({
    double maxWidth = 1024,
    double maxHeight = 1024,
    int imageQuality = 85,
  }) async {
    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: maxWidth,
        maxHeight: maxHeight,
        imageQuality: imageQuality,
      );
      
      return image != null ? File(image.path) : null;
    } catch (e) {
      print('Erreur lors de la sélection: $e');
      return null;
    }
  }
  
  // Sélectionner plusieurs images
  static Future<List<File>> pickMultipleImages() async {
    try {
      final List<XFile> images = await _picker.pickMultipleImages(
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );
      
      return images.map((xfile) => File(xfile.path)).toList();
    } catch (e) {
      print('Erreur lors de la sélection multiple: $e');
      return [];
    }
  }
  
  // Enregistrer une vidéo
  static Future<File?> recordVideo({
    Duration maxDuration = const Duration(minutes: 1),
  }) async {
    try {
      final XFile? video = await _picker.pickVideo(
        source: ImageSource.camera,
        maxDuration: maxDuration,
      );
      
      return video != null ? File(video.path) : null;
    } catch (e) {
      print('Erreur lors de l\'enregistrement: $e');
      return null;
    }
  }
}
```

### Widget de capture avancée avec caméra
```dart
import 'package:camera/camera.dart';

class AdvancedCameraWidget extends StatefulWidget {
  @override
  _AdvancedCameraWidgetState createState() => _AdvancedCameraWidgetState();
}

class _AdvancedCameraWidgetState extends State<AdvancedCameraWidget> {
  CameraController? _controller;
  List<CameraDescription> _cameras = [];
  int _currentCameraIndex = 0;
  bool _isRecording = false;
  File? _capturedImage;

  @override
  void initState() {
    super.initState();
    _initializeCamera();
  }

  Future<void> _initializeCamera() async {
    _cameras = await availableCameras();
    if (_cameras.isNotEmpty) {
      _controller = CameraController(
        _cameras[_currentCameraIndex],
        ResolutionPreset.high,
        enableAudio: true,
      );
      
      await _controller!.initialize();
      setState(() {});
    }
  }

  Future<void> _takePicture() async {
    if (_controller == null || !_controller!.value.isInitialized) return;

    try {
      final XFile image = await _controller!.takePicture();
      setState(() {
        _capturedImage = File(image.path);
      });
      
      // Afficher l'image capturée ou la traiter
      _showCapturedImage();
    } catch (e) {
      print('Erreur lors de la capture: $e');
    }
  }

  Future<void> _toggleRecording() async {
    if (_controller == null || !_controller!.value.isInitialized) return;

    if (_isRecording) {
      final XFile video = await _controller!.stopVideoRecording();
      setState(() {
        _isRecording = false;
      });
      
      // Traiter la vidéo
      _processVideo(File(video.path));
    } else {
      await _controller!.startVideoRecording();
      setState(() {
        _isRecording = true;
      });
    }
  }

  void _switchCamera() {
    if (_cameras.length > 1) {
      _currentCameraIndex = (_currentCameraIndex + 1) % _cameras.length;
      _initializeCamera();
    }
  }

  void _showCapturedImage() {
    if (_capturedImage == null) return;
    
    showDialog(
      context: context,
      builder: (context) => Dialog(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.file(_capturedImage!),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                TextButton(
                  onPressed: () {
                    setState(() {
                      _capturedImage = null;
                    });
                    Navigator.pop(context);
                  },
                  child: Text('Supprimer'),
                ),
                ElevatedButton(
                  onPressed: () {
                    _saveImage(_capturedImage!);
                    Navigator.pop(context);
                  },
                  child: Text('Sauvegarder'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _processVideo(File video) {
    // Traitement de la vidéo
    print('Vidéo enregistrée: ${video.path}');
  }

  void _saveImage(File image) {
    // Sauvegarder l'image
    print('Image sauvegardée: ${image.path}');
  }

  @override
  Widget build(BuildContext context) {
    if (_controller == null || !_controller!.value.isInitialized) {
      return Center(child: CircularProgressIndicator());
    }

    return Scaffold(
      body: Stack(
        children: [
          // Aperçu de la caméra
          CameraPreview(_controller!),
          
          // Contrôles
          Positioned(
            bottom: 50,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                // Changer de caméra
                IconButton(
                  onPressed: _switchCamera,
                  icon: Icon(Icons.flip_camera_ios, color: Colors.white, size: 30),
                ),
                
                // Capturer photo
                GestureDetector(
                  onTap: _takePicture,
                  child: Container(
                    width: 70,
                    height: 70,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.grey, width: 3),
                    ),
                  ),
                ),
                
                // Enregistrer vidéo
                IconButton(
                  onPressed: _toggleRecording,
                  icon: Icon(
                    _isRecording ? Icons.stop : Icons.videocam,
                    color: _isRecording ? Colors.red : Colors.white,
                    size: 30,
                  ),
                ),
              ],
            ),
          ),
          
          // Indicateur d'enregistrement
          if (_isRecording)
            Positioned(
              top: 50,
              left: 20,
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.red,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.fiber_manual_record, color: Colors.white, size: 12),
                    SizedBox(width: 5),
                    Text('REC', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
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
    _controller?.dispose();
    super.dispose();
  }
}
```

### Traitement d'images
```dart
import 'package:image/image.dart' as img;

class ImageProcessingService {
  // Redimensionner une image
  static Future<File> resizeImage(File imageFile, int width, int height) async {
    final bytes = await imageFile.readAsBytes();
    final image = img.decodeImage(bytes);
    
    if (image == null) throw Exception('Impossible de décoder l\'image');
    
    final resized = img.copyResize(image, width: width, height: height);
    final resizedBytes = img.encodeJpg(resized);
    
    final resizedFile = File('${imageFile.path}_resized.jpg');
    await resizedFile.writeAsBytes(resizedBytes);
    
    return resizedFile;
  }
  
  // Appliquer des filtres
  static Future<File> applyFilter(File imageFile, ImageFilter filter) async {
    final bytes = await imageFile.readAsBytes();
    final image = img.decodeImage(bytes);
    
    if (image == null) throw Exception('Impossible de décoder l\'image');
    
    img.Image filteredImage;
    
    switch (filter) {
      case ImageFilter.grayscale:
        filteredImage = img.grayscale(image);
        break;
      case ImageFilter.sepia:
        filteredImage = img.sepia(image);
        break;
      case ImageFilter.blur:
        filteredImage = img.gaussianBlur(image, radius: 3);
        break;
      default:
        filteredImage = image;
    }
    
    final filteredBytes = img.encodeJpg(filteredImage);
    final filteredFile = File('${imageFile.path}_filtered.jpg');
    await filteredFile.writeAsBytes(filteredBytes);
    
    return filteredFile;
  }
  
  // Compresser une image
  static Future<File> compressImage(File imageFile, {int quality = 85}) async {
    final bytes = await imageFile.readAsBytes();
    final image = img.decodeImage(bytes);
    
    if (image == null) throw Exception('Impossible de décoder l\'image');
    
    final compressedBytes = img.encodeJpg(image, quality: quality);
    final compressedFile = File('${imageFile.path}_compressed.jpg');
    await compressedFile.writeAsBytes(compressedBytes);
    
    return compressedFile;
  }
}

enum ImageFilter {
  none,
  grayscale,
  sepia,
  blur,
}
```

### Widget de sélection d'image avec prévisualisation
```dart
class ImagePickerWidget extends StatefulWidget {
  final Function(File) onImageSelected;
  
  const ImagePickerWidget({Key? key, required this.onImageSelected}) : super(key: key);

  @override
  _ImagePickerWidgetState createState() => _ImagePickerWidgetState();
}

class _ImagePickerWidgetState extends State<ImagePickerWidget> {
  File? _selectedImage;

  void _showImageSourceDialog() {
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: Icon(Icons.camera_alt),
              title: Text('Appareil photo'),
              onTap: () {
                Navigator.pop(context);
                _takePhoto();
              },
            ),
            ListTile(
              leading: Icon(Icons.photo_library),
              title: Text('Galerie'),
              onTap: () {
                Navigator.pop(context);
                _pickFromGallery();
              },
            ),
            if (_selectedImage != null)
              ListTile(
                leading: Icon(Icons.delete),
                title: Text('Supprimer'),
                onTap: () {
                  Navigator.pop(context);
                  _removeImage();
                },
              ),
          ],
        ),
      ),
    );
  }

  Future<void> _takePhoto() async {
    final image = await CameraService.takePhoto();
    if (image != null) {
      setState(() {
        _selectedImage = image;
      });
      widget.onImageSelected(image);
    }
  }

  Future<void> _pickFromGallery() async {
    final image = await CameraService.pickImageFromGallery();
    if (image != null) {
      setState(() {
        _selectedImage = image;
      });
      widget.onImageSelected(image);
    }
  }

  void _removeImage() {
    setState(() {
      _selectedImage = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _showImageSourceDialog,
      child: Container(
        width: 150,
        height: 150,
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey),
          borderRadius: BorderRadius.circular(10),
        ),
        child: _selectedImage == null
            ? Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.add_a_photo, size: 40, color: Colors.grey),
                  SizedBox(height: 8),
                  Text('Ajouter une image', style: TextStyle(color: Colors.grey)),
                ],
              )
            : ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Image.file(
                  _selectedImage!,
                  fit: BoxFit.cover,
                ),
              ),
      ),
    );
  }
}
```

## Bonnes pratiques

### Performance
- **Compression** : Réduire la taille des images selon l'usage
- **Résolution adaptée** : Choisir la résolution appropriée
- **Cache** : Mettre en cache les images traitées
- **Traitement asynchrone** : Éviter de bloquer l'UI

### UX/UI
- **Permissions claires** : Expliquer pourquoi l'accès caméra est nécessaire
- **Feedback visuel** : Indiquer les actions en cours
- **Prévisualisation** : Permettre de valider avant de sauvegarder
- **Gestion d'erreurs** : Messages d'erreur clairs

### Sécurité et vie privée
- **Stockage sécurisé** : Protéger les images sensibles
- **Permissions minimales** : Demander uniquement les accès nécessaires
- **Suppression automatique** : Nettoyer les fichiers temporaires

## Cas d'usage typiques

1. **Réseaux sociaux** : Partage de photos avec filtres
2. **E-commerce** : Photos de produits pour la vente
3. **Documentation** : Scan de documents et OCR
4. **Sécurité** : Authentification par reconnaissance faciale
5. **Réalité augmentée** : Superposition d'éléments virtuels
6. **Applications médicales** : Capture et analyse d'images diagnostiques