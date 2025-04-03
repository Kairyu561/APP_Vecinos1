import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
  Animated,
  PermissionsAndroid 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import AuthService from '../Servicios/Autenticación';
import { API_ROUTES } from '../Servicios/Rutas';
import Geolocation from '@react-native-community/geolocation';

interface Categoria {
  id: number;
  nombre: string;
  departamento: {
    id: number;
    nombre: string;
  };
}

interface ImagenSeleccionada {
  uri: string;
  type: string;
  name: string;
}

const generarCoordenadaAleatoria = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const PantallaFormulario = () => {
  const navigation = useNavigation();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number>(0);
  const [ubicacion, setUbicacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [selectedImages, setSelectedImages] = useState<ImagenSeleccionada[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  
  // Inicializar estados de coordenadas como null
  const [latitud, setLatitud] = useState<number | null>(null);
  const [longitud, setLongitud] = useState<number | null>(null);

  // Función para usar coordenadas aleatorias como fallback
  const usarCoordenadasAleatorias = () => {
    setLatitud(parseFloat(generarCoordenadaAleatoria(-22.4800, -22.4000).toFixed(6)));
    setLongitud(parseFloat(generarCoordenadaAleatoria(-68.9500, -68.8500).toFixed(6)));
  };

  useEffect(() => {
    cargarCategorias();
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    setLocationLoading(true);
    try {
      if (Platform.OS === 'ios') {
        getCurrentLocation();
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permiso de ubicación",
            message: "Necesitamos acceso a tu ubicación para registrar el reporte",
            buttonNeutral: "Preguntar luego",
            buttonNegative: "Cancelar",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          console.log("Permiso de ubicación denegado - usando coordenadas aleatorias");
          usarCoordenadasAleatorias();
          setLocationLoading(false);
        }
      }
    } catch (err) {
      console.warn(err);
      usarCoordenadasAleatorias();
      setLocationLoading(false);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLatitud(parseFloat(position.coords.latitude.toFixed(6)));
        setLongitud(parseFloat(position.coords.longitude.toFixed(6)));
        setLocationLoading(false);
      },
      (error) => {
        console.log('Error de geolocalización:', error);
        usarCoordenadasAleatorias();
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const cargarCategorias = async () => {
    try {
      const token = await AuthService.getAccessToken();
      if (!token) throw new Error('No hay token de autenticación');

      const response = await fetch(API_ROUTES.MUNICIPALIDAD.CATEGORIAS,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Error al cargar categorías');

      const data = await response.json();
      setCategorias(data);
      if (data.length > 0) {
        setCategoriaSeleccionada(data[0].id);
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
      Alert.alert('Error', 'No se pudieron cargar las categorías');
    } finally {
      setLoadingCategorias(false);
    }
  };

  const selectImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: false,
      maxWidth: 1280,
      maxHeight: 1280,
      quality: 0.8,
    };

    try {
      const result = await launchImageLibrary(options);

      if (result.assets && result.assets.length > 0) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri || '',
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'image.jpg',
        }));

        setSelectedImages([...selectedImages, ...newImages]);
      }
    } catch (error) {
      console.error('Error seleccionando imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleSubmit = async () => {
    if (!titulo.trim() || !categoriaSeleccionada || !ubicacion.trim()) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    if (latitud === null || longitud === null) {
      Alert.alert('Error', 'No se han podido obtener las coordenadas');
      return;
    }

    try {
      setLoading(true);
      const userId = await AuthService.getUserId();
      const token = await AuthService.getAccessToken();

      if (!userId || !token) {
        throw new Error('No se pudo obtener la información del usuario');
      }

      const categoriaActual = categorias.find(cat => cat.id === categoriaSeleccionada);
      if (!categoriaActual) {
        throw new Error('Categoría no válida');
      }

      const publicacionData = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        usuario: userId,
        categoria: categoriaSeleccionada,
        departamento: categoriaActual.departamento.id,
        junta_vecinal: categoriaSeleccionada,
        latitud,
        longitud,
        ubicacion: ubicacion.trim(),
        
      };

      const publicacionResponse = await fetch(API_ROUTES.PUBLICACIONES.BASE,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(publicacionData),
        }
      );

      if (!publicacionResponse.ok) {
        const errorData = await publicacionResponse.json();
        throw new Error(errorData.detail || 'Error al crear la publicación');
      }

      const publicacionCreada = await publicacionResponse.json();
      
      if (selectedImages.length > 0) {
        await subirImagenes(publicacionCreada.id, token);
      }

      Alert.alert('Éxito', 'Publicación creada correctamente');
      limpiarFormulario();
      navigation.goBack();

    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'No se pudo crear la publicación');
    } finally {
      setLoading(false);
    }
  };

  const subirImagenes = async (publicacionId: number, token: string) => {
    setUploadingImages(true);
    try {
      for (const imagen of selectedImages) {
        const formData = new FormData();
        formData.append('archivo', {
          uri: imagen.uri,
          type: imagen.type,
          name: imagen.name,
        });
        formData.append('publicacion_id', publicacionId.toString());
        formData.append('extension', imagen.name.split('.').pop() || 'jpg');

        const response = await fetch(API_ROUTES.EVIDENCIAS,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error('Error al subir una imagen');
        }
      }
    } catch (error) {
      console.error('Error subiendo imágenes:', error);
      Alert.alert('Advertencia', 'La publicación se creó pero hubo problemas al subir algunas imágenes');
    } finally {
      setUploadingImages(false);
    }
  };

  const limpiarFormulario = () => {
    setTitulo('');
    setDescripcion('');
    setUbicacion('');
    setSelectedImages([]);
    if (categorias.length > 0) {
      setCategoriaSeleccionada(categorias[0].id);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Nueva Publicación</Text>

        {locationLoading && (
          <View style={styles.locationLoadingContainer}>
            <ActivityIndicator size="small" color="#E67E22" />
            <Text style={styles.locationLoadingText}>
              Obteniendo ubicación...
            </Text>
          </View>
        )}

        {!locationLoading && latitud !== null && longitud !== null && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>
              Ubicación obtenida: {latitud.toFixed(6)}, {longitud.toFixed(6)}
            </Text>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>*Categoría</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoriaSeleccionada}
              onValueChange={(itemValue) => setCategoriaSeleccionada(Number(itemValue))}
              style={[styles.picker, { color: '#aaa' }]}
            >
              {categorias.map((categoria) => (
                <Picker.Item 
                  key={categoria.id} 
                  label={`${categoria.nombre} - ${categoria.departamento.nombre}`} 
                  value={categoria.id} 
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese el nombre de la calle"
            placeholderTextColor="#aaa" 
            value={ubicacion}
            onChangeText={setUbicacion}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>*Problema</Text>
          <TextInput
            style={styles.input}
            placeholder="Ejemplo: Poste Caído"
            placeholderTextColor="#aaa" 
            value={titulo}
            onChangeText={setTitulo}
            maxLength={100}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ejemplo: Poste Abatido sobre la calle frente al antiguo hospital"
            placeholderTextColor="#aaa" 
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
          <Text style={styles.imageButtonText}>
            {selectedImages.length > 0 ? 'Agregar otra imagen' : 'Agregar imagen'}
          </Text>
        </TouchableOpacity>

        {selectedImages.length > 0 && (
          <View style={styles.imagePreviewContainer}>
            <Text style={styles.imagePreviewTitle}>
              Imágenes seleccionadas: {selectedImages.length}
            </Text>
            <ScrollView horizontal style={styles.imagePreviewScroll}>
              {selectedImages.map((image, index) => (
                <Image key={index} source={{ uri: image.uri }} style={styles.imagePreview} />
              ))}
            </ScrollView>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.submitButton, (loading || uploadingImages) && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading || uploadingImages || locationLoading}
        >
          {loading || uploadingImages ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={[styles.submitButtonText, { marginLeft: 10 }]}>
                {uploadingImages ? 'Subiendo imágenes...' : 'Publicando...'}
              </Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Publicar</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  content: {
    padding: 20,
    flex: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 24,
    color: '#E67E22',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontWeight: 'bold',
},
title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
    textAlign: 'center',
    position: 'relative',
},
inputGroup: {
    marginBottom: 20,
    width: '100%',
},
label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
    backgroundColor: '#1a237e',
    padding: 8,
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    alignSelf: 'flex-start',
},
pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
},
picker: {
  height: 50,
  width: '100%',
  color: '#333', // Texto visible
},
input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    color: '#333'
},
textArea: {
    height: 120,
    textAlignVertical: 'top',
},
imageButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    transform: [{ scale: 0.98 }],
},
imageButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
},
imagePreviewContainer: {
    marginBottom: 20,
},
imagePreviewTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
},
imagePreviewScroll: {
    flexDirection: 'row',
},
imagePreview: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
},
submitButton: {
    backgroundColor: '#E67E22',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
    width: '100%',
},
buttonDisabled: {
    opacity: 0.7,
},
submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
},
locationLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: '#fff8e1',
    padding: 8,
    borderRadius: 5,
},
locationLoadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
},
locationContainer: {
    backgroundColor: '#e8f5e9',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
},
locationText: {
    color: '#2e7d32',
    fontSize: 14,
    textAlign: 'center',
}
});

export default PantallaFormulario;