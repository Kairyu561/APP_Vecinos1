import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './Navegador';  // Importar el archivo de navegación

const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;