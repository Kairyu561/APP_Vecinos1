import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navegador';
import { useNavigation } from '@react-navigation/native';
import AuthService from '../Servicios/Autenticación';
import { API_ROUTES } from '../Servicios/Rutas';
import { validate, format } from 'rut.js';

type RegistroNavigationProp = NativeStackNavigationProp<RootStackParamList,'Registro'>;

const Registro = () => {
  const navigation = useNavigation<RegistroNavigationProp>();
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRutChange = (text: string) => {
    const formattedRut = format(text);
    setRut(formattedRut);
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      // Validaciones de campos requeridos
      if (!nombre || !rut || !contrasena || !correo) {
        Alert.alert('Error', 'Todos los campos son obligatorios');
        return;
      }

      // Validación de RUT usando rut.js
      if (!validate(rut)) {
        Alert.alert(
          'Error', 
          'El RUT ingresado no es válido. Por favor verifica el formato y el dígito verificador.'
        );
        return;
      }

      // Validación de correo
      if (!/\S+@\S+\.\S+/.test(correo)) {
        Alert.alert('Error', 'El correo electrónico no es válido');
        return;
      }

      // Validación de teléfono (opcional)
      if (telefono && (!/^\d+$/.test(telefono) || telefono.length > 9)) {
        Alert.alert('Error', 'El número de teléfono debe tener máximo 9 dígitos numéricos');
        return;
      }

      const userData = {
        rut,
        password: contrasena,
        nombre,
        email: correo,
        ...(telefono && { numero_telefonico_movil: telefono })
      };

      const response = await fetch(API_ROUTES.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Registro Exitoso',
          'Tu cuenta ha sido creada correctamente. Por favor inicia sesión.',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('Login')
            }
          ]
        );
      } else {
        // Manejar errores específicos del servidor
        const errorMessage = data.detail || 
                           (typeof data === 'object' ? Object.values(data)[0] : 'Error en el registro');
        Alert.alert('Error', Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
      }

    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/Registro.png')}
      style={styles.backgroundImage}
    >
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
          />
          
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Text style={styles.backButtonText}>Regresar</Text>
          </TouchableOpacity>

          <Text style={styles.slogan}>Por un Calama más seguro</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>*Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresar nombre"
              placeholderTextColor="#999"
              value={nombre}
              onChangeText={setNombre}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>*Rut</Text>
            <TextInput
              style={styles.input}
              placeholder="Formato: 12.345.678-9"
              placeholderTextColor="#999"
              value={rut}
              onChangeText={handleRutChange}
              editable={!isLoading}
              autoCapitalize="none"
              keyboardType="default"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>N° teléfono</Text>
            <TextInput
              style={styles.input}
              placeholder="Agregar teléfono"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
              editable={!isLoading}
              maxLength={9}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo</Text>
            <TextInput
              style={styles.input}
              placeholder="ejemplo@correo.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={correo}
              onChangeText={setCorreo}
              editable={!isLoading}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>*Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese una contraseña"
              placeholderTextColor="#999"
              secureTextEntry
              value={contrasena}
              onChangeText={setContrasena}
              editable={!isLoading}
            />
          </View>

          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonLoading]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Registrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButtonText: {
    color: '#14A199',
    fontSize: 16,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 10,
    resizeMode: 'contain',
  },
  slogan: {
    fontSize: 24,
    color: '#E67E22',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
    backgroundColor: '#1a237e',
    padding: 8,
    borderRadius: 5,
    overflow: 'hidden',
  },
  input: {
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#00796b',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonLoading: {
    backgroundColor: '#26a69a',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 5,
    borderRadius: 5,
  },
});

export default Registro;