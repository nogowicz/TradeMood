import React, { useEffect } from 'react';
import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';

import LangProvider, { LangModeProvider } from './src/lang/LangProvider';
import Overview from './views/authenticated/overview/Overview';
import { colors } from './src/styles';




function App() {

  const Stack = createNativeStackNavigator();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor={colors.LIGHT_COLORS.BACKGROUND}
        barStyle='dark-content'
      />
      <LangModeProvider>
        <LangProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name='Overview'
                component={Overview}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </LangProvider>
      </LangModeProvider>
    </>
  );
}



export default App;
