import React, { useEffect } from 'react';
import { StatusBar } from 'react-native'
import SplashScreen from 'react-native-splash-screen';
import LangProvider, { LangModeProvider } from './src/lang/LangProvider';
import { colors } from './src/styles';
import Routes from './views/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { checkNotificationPermission, notificationListener } from 'helpers/pushNotificationHelper';








function App() {

  useEffect(() => {
    SplashScreen.hide();
    checkNotificationPermission();
    notificationListener();
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor={colors.LIGHT_COLORS.BACKGROUND}
        barStyle='dark-content'
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LangModeProvider>
          <LangProvider>
            <Routes />
          </LangProvider>
        </LangModeProvider>
      </GestureHandlerRootView>
    </>
  );
}



export default App;
