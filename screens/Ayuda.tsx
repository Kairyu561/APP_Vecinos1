import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useNavigation } from '@react-navigation/native';

const Ayuda = () => {
  const navigation = useNavigation();
  const width = Dimensions.get('window').width;

  const steps = [
    {
      title: 'Paso 1',
      description: 'Presione en "Ingresar Denuncia".',
      //image: require('../assets/paso1.png'),
    },
    {
      title: 'Paso 2',
      description: 'Seleccione la categoría del problema.',
      //image: require('../assets/paso2.png'),
    },
    {
      title: 'Paso 3',
      description: 'Escriba su problema de manera breve, por ejemplo: "Poste caído".',
      //image: require('../assets/paso3.png'),
    },
    {
      title: 'Paso 4',
      description: 'Describa el problema con más detalles, como dónde ocurrió o cómo afecta.',
      //image: require('../assets/paso4.png'),
    },
    {
      title: 'Paso 5',
      description: 'Agregue evidencia (opcional), como fotos del problema.',
      //image: require('../assets/paso5.png'),
    },
    {
      title: 'Paso 6',
      description: 'Presione "Enviar" para completar la denuncia.',
      //image: require('../assets/paso6.png'),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cómo Hacer una Denuncia</Text>

      <Carousel
        width={width}
        height={300}
        data={steps}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.stepTitle}>{item.title}</Text>
            <Text style={styles.stepDescription}>{item.description}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  slide: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  image: { width: '100%', height: 200, resizeMode: 'contain', marginBottom: 20 },
  stepTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  stepDescription: { fontSize: 16, textAlign: 'center', color: '#555' },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default Ayuda;