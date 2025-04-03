import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navegador';
import { useNavigation } from '@react-navigation/native';

type RegistroNavigationProp = NativeStackNavigationProp<RootStackParamList,'Acerca'>
const AcercaDeScreen = () => {
  const navigation = useNavigation<RegistroNavigationProp>()
    
  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Regresar</Text>
        </TouchableOpacity>
      <Text style={styles.title}>Acerca de la App</Text>
      <Text style={styles.content}>
        Esta es una aplicación de gestión de denuncias que permite a los usuarios registrar y ver el historial de sus denuncias.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  content: {
    fontSize: 16,
    color: '#555',
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
});

export default AcercaDeScreen;