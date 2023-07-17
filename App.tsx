import React, { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'react-native'
import SplashScreen from 'react-native-splash-screen';
import LangProvider, { LangModeProvider } from './src/lang/LangProvider';
import { colors } from './src/styles';
import Routes from './views/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { checkNotificationPermission, notificationListener } from 'helpers/pushNotificationHelper';
import { EventRegister } from 'react-native-event-listeners';
import { themeContext } from 'store/themeContext';
import { theme } from 'styles/colors';
import { getItem } from 'utils/asyncStorage';

function App() {
  const [themeMode, setThemeMode] = useState(Boolean(getItem('theme') ?? false));
  const themeCtx = useContext(themeContext);
  useEffect(() => {
    let eventListener = EventRegister.addEventListener(
      "changeTheme",
      (theme: boolean) => {
        setThemeMode(theme);
      }
    );

    return () => {
      if (typeof eventListener === 'string') {
        EventRegister.removeEventListener(eventListener);
      }
    };
  }, []);

  useEffect(() => {
    SplashScreen.hide();
    checkNotificationPermission();
    notificationListener();
  }, []);

  return (
    <themeContext.Provider value={themeMode ? theme.dark : theme.light}>
      <StatusBar
        backgroundColor={themeMode ? '#000000' : '#ffffff'}
        barStyle={themeMode ? 'light-content' : 'dark-content'}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LangModeProvider>
          <LangProvider>
            <Routes />
          </LangProvider>
        </LangModeProvider>
      </GestureHandlerRootView>
    </themeContext.Provider>
  );
}



export default App;
