import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navegador';

type AjustesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Ajustes'>;

const AjustesScreen = () => {
  const navigation = useNavigation<AjustesScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Ajustes</Text>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => navigation.navigate('CambiarFoto')}
      >
        <Text style={styles.optionText}>Cambiar Foto de Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => navigation.navigate('CambiarTelefono')}
      >
        <Text style={styles.optionText}>Cambiar Número de Teléfono</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => navigation.navigate('Ayuda')}
      >
        <Text style={styles.optionText}>Ayuda</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#14A199',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default AjustesScreen;
