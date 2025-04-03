import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground,
  Animated,
  Image,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';


const { width } = Dimensions.get('window');
const BUTTON_SIZE = width * 0.4;



// Iconos usando componentes nativos de React Native
const IconoRegistro = () => (
  <View style={iconStyles.container}>
    <View style={iconStyles.document}>
      <View style={iconStyles.line}/>
      <View style={iconStyles.line}/>
      <View style={[iconStyles.line, {width: '60%'}]}/>
    </View>
  </View>
);

const IconoDenuncia = () => (
  <View style={iconStyles.container}>
    <View style={iconStyles.pencil}>
      <View style={iconStyles.pencilTip}/>
      <View style={iconStyles.pencilBody}/>
      <View style={iconStyles.pencilEraser}/>
    </View>
  </View>
);

const IconoEventos = () => (
  <View style={iconStyles.container}>
    <View style={iconStyles.calendar}>
      <View style={iconStyles.calendarTop}/>
      <View style={iconStyles.calendarBody}>
        <View style={iconStyles.calendarDot}/>
      </View>
    </View>
  </View>
);

const IconoCandado = () => (
  <View style={iconStyles.container}>
    <View style={iconStyles.lock}>
      <View style={iconStyles.lockBody}/>
      <View style={iconStyles.lockShackle}/>
    </View>
  </View>
);

const iconStyles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilos para icono de documento
  document: {
    width: 32,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 6,
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: '#17A589',
    marginVertical: 4,
  },
  // Estilos para icono de lÃ¡piz
  pencil: {
    width: 8,
    height: 40,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  pencilTip: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
  },
  pencilBody: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  pencilEraser: {
    width: 8,
    height: 8,
    backgroundColor: '#FFCCCC',
  },
  // Estilos para icono de calendario
  calendar: {
    width: 36,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  calendarTop: {
    height: 10,
    backgroundColor: '#FF4444',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  calendarBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDot: {
    width: 6,
    height: 6,
    backgroundColor: '#17A589',
    borderRadius: 3,
  },
  // Estilos para icono de candado
  lock: {
    width: 32,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockBody: {
    width: 28,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    marginTop: 8,
  },
  lockShackle: {
    width: 20,
    height: 20,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    borderBottomColor: 'transparent',
    position: 'absolute',
    top: 0,
  },
});

const PantallaInicio = () => {
  const navigation = useNavigation();

  const escalasBotones = [
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ];

  const botones = [
    {
      texto: 'Historial de Denuncias',
      Icono: IconoRegistro,
      ruta: 'Historial',
      color: '#17A589'
    },
    {
      texto: 'Realizar Denuncia',
      Icono: IconoDenuncia,
      ruta: 'Formulario',
      color: '#148F77'
    },
    {
      texto: 'Anuncios Municipales',
      Icono: IconoEventos,
      ruta: 'Eventos',
      color: '#148F77'
    },
    {
      texto: 'Proximamente',
      Icono: IconoCandado,
      ruta: '',
      color: '#148F77'
    }
   
    
  ];

  const animarBoton = (indice: number) => {
    const scaleDown = Animated.timing(escalasBotones[indice], {
      toValue: 0.92,
      duration: 150,
      useNativeDriver: true,
    });

    const scaleUp = Animated.spring(escalasBotones[indice], {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    });

    Animated.sequence([scaleDown, scaleUp]).start();
  };

  return (
    
    <ImageBackground
      source={require('../assets/zorro.png')}
      style={estilos.contenedor}
      resizeMode="cover"
    >
      <SafeAreaView style={estilos.safeArea}>
        
        <View style={estilos.header}>
        
          <Image 
            source={require('../assets/logo.png')}
            style={estilos.logoImage}
          />
        </View>
        <View style={estilos.contenido}>
          <View style={estilos.botonesGrid}>
            {botones.map((boton, indice) => (
              <Animated.View
                key={boton.texto}
                style={[
                  estilos.contenedorBoton,
                  {
                    transform: [{ scale: escalasBotones[indice] }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[estilos.boton, { backgroundColor: boton.color }]}
                  onPress={() => {
                    animarBoton(indice);
                    setTimeout(() => {
                      navigation.navigate(boton.ruta as never);
                    }, 200);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={estilos.iconoContainer}>
                    <boton.Icono />
                  </View>
                  <Text style={estilos.textoBoton}>{boton.texto}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 40,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  logoImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  contenido: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  botonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'center',
    gap: 20,
    paddingVertical: 20,
  },
  contenedorBoton: {
    width: BUTTON_SIZE,
    aspectRatio: 1,
  },
  boton: {
    flex: 1,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuOptions: {
    width: '100%',
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#14A199',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  iconoContainer: {
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
    padding: 12,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default PantallaInicio;