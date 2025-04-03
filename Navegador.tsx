import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PantallaInicio from './screens/PantallaInicio';  // Asegúrate de que esté exportado como default
import PantallaFormulario from './screens/PantallaFormulario';  // Asegúrate de que esté exportado como default
import LoginScreen from './screens/Login';
import HistorialDenuncias from './screens/Historial';
import Registro from './screens/Registro';
import AcercaDeScreen from './screens/Acerca_de';
import AjustesScreen from './screens/Ajustes';
import PantallaEventos from './screens/Eventos';
import AnunciosScreen from './screens/Eventos';
import Ayuda from './screens/Ayuda';
export type RootStackParamList = {
  Inicio: undefined;
  Formulario: undefined;
  Login: undefined;
  Historial: undefined;
  Registro: undefined;
  Acerca: undefined;
  CambiarFoto: undefined;
  CambiarTelefono: undefined;
  Ayuda: undefined;
  Ajustes: undefined;
  Eventos: undefined;

};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Inicio" 
        component={PantallaInicio} 
        options={{ title: 'Inicio' }}
      />
      <Stack.Screen 
        name="Formulario" 
        component={PantallaFormulario} 
        options={{ title: 'Formulario de Reporte' }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'Iniciar Sesión', headerShown: false }} 
      />
      <Stack.Screen 
        name="Historial" 
        component={HistorialDenuncias} 
        options={{ title: 'Historial de Denuncias' }}
      />
      <Stack.Screen
        name="Registro"
        component={Registro}
        options={{ title: 'Registro de Usuario' }}        
      />
      <Stack.Screen
        name="Acerca"
        component={AcercaDeScreen}
        options={{ title: 'Acerca De la Aplicación' }}        
      />
      <Stack.Screen
        name="Ajustes"
        component={AjustesScreen}
        options={{ title: 'Ajuste' }}        
      />
      <Stack.Screen
        name="Eventos"
        component={AnunciosScreen}
        options={{ title: 'Eventos' }}        
      />
      <Stack.Screen
        name="Ayuda"
        component={Ayuda}
        options={{ title: 'Ayuda' }}        
      />
      
    
    </Stack.Navigator>
  );
};

export default AppNavigator;