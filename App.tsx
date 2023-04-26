import React, { useEffect } from 'react';
import { StatusBar } from 'react-native'
import SplashScreen from 'react-native-splash-screen';
import LangProvider, { LangModeProvider } from './src/lang/LangProvider';
import { colors } from './src/styles';
import Routes from './views/navigation';
import { Provider } from 'react-redux';
import { store } from './src/store/store';






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
          <Provider store={store}>
            <Routes />
          </Provider>
        </LangProvider>
      </LangModeProvider>
    </>
  );
}



export default App;
