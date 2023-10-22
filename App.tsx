import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StatusBar, Appearance } from 'react-native'
import SplashScreen from 'react-native-splash-screen';
import LangProvider, { LangModeProvider } from './src/lang/LangProvider';
import Routes from './views/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { checkNotificationPermission, notificationListener } from 'helpers/pushNotificationHelper';
import { EventRegister } from 'react-native-event-listeners';
import { ThemeContext } from 'store/ThemeContext';
import { theme } from 'styles/colors';
import { getItem } from 'utils/asyncStorage';
import Snackbar from 'react-native-snackbar';

function App() {
  const colorScheme = Appearance.getColorScheme();
  const [themeMode, setThemeMode] = useState(false);

  useLayoutEffect(() => {
    async function fetchTheme() {
      try {
        await getItem('theme').then((storedTheme) => {
          const storedThemeAsBoolean = JSON.parse(storedTheme as string);
          const initialThemeMode = storedTheme !== null ? storedThemeAsBoolean : (colorScheme === "dark" ? true : false);
          setThemeMode(initialThemeMode);
        });

      } catch (error) {
        console.error('Error fetching theme:', error);
        Snackbar.show({
          text: "Error occurred while fetching theme",
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    }
    checkNotificationPermission();
    fetchTheme();
  }, []);


  useLayoutEffect(() => {
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
    console.log(colorScheme)
  }, []);

  return (
    <ThemeContext.Provider value={themeMode ? theme.dark : theme.light}>
      <StatusBar
        backgroundColor={themeMode ? '#0A2129' : '#ffffff'}
        barStyle={themeMode ? 'light-content' : 'dark-content'}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LangModeProvider>
          <LangProvider>
            <Routes />
          </LangProvider>
        </LangModeProvider>
      </GestureHandlerRootView>
    </ThemeContext.Provider>
  );
}



export default App;
