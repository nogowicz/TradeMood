import React, { useEffect } from 'react';
import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';

import LangProvider, { LangModeProvider } from './src/lang/LangProvider';
import { colors } from './src/styles';
import { RootStackParamList } from './views/navigation/Navigation'

import Overview from './views/authenticated/overview/Overview';
import OnBoarding from './views/auth/onboarding/OnBoarding';
import Routes from './views/navigation';




function App() {
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
          <Routes />
        </LangProvider>
      </LangModeProvider>
    </>
  );
}



export default App;
