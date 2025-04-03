import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navegador';
import AuthService from '../Servicios/Autenticación';

type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenProp>();
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateInputs = (): boolean => {
    if (!rut.trim()) {
      setError('Ingrese su RUT');
      return false;
    }
    if (!password.trim()) {
      setError('Ingrese su contraseña');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      setError('');
      if (!validateInputs()) return;

      setLoading(true);
      await AuthService.login(rut, password);
      navigation.replace('Inicio');
    } catch (error: any) {
      const errorMessage = error.detail || 'Error al iniciar sesión. Intente nuevamente.';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/fondo.jpg')}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.contentContainer}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
              />
              
              <Text style={styles.title}>Denuncia Ciudadana</Text>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TextInput
                style={styles.input}
                placeholder="Rut"
                value={rut}
                onChangeText={(text) => {
                  setError('');
                  setRut(text);
                }}
                placeholderTextColor="#666"
                editable={!loading}
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setError('');
                  setPassword(text);
                }}
                placeholderTextColor="#666"
                editable={!loading}
              />

              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Iniciar Sesión</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => navigation.navigate('Registro')}
                disabled={loading}
                style={styles.registerButton}
              >
                <Text style={styles.registerText}>
                  ¿No tienes una cuenta? Regístrate
                </Text>
              </TouchableOpacity>

              <View style={styles.footer}>
                <View style={styles.rainbowBar} />
                <Text style={styles.footerText}>
                  ILUSTRE MUNICIPALIDAD DE CALAMA
                </Text>
                <Text style={styles.footerSubText}>
                  Vicuña Mackenna N° 2001.
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    backgroundColor: '#E67E22',
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 20,
    padding: 10,
  },
  registerText: {
    color: '#000',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  rainbowBar: {
    height: 4,
    width: '100%',
    backgroundColor: '#00ff00',
    marginBottom: 10,
  },
  footerText: {
    color: '#009688',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerSubText: {
    color: '#009688',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LoginScreen;