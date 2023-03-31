import React from 'react';

import LangProvider, { LangModeProvider } from './src/lang/LangProvider';
import { FormattedMessage } from 'react-intl';
import { Text } from 'react-native';
import Overview from './views/authenticated/overview/Overview';




function App() {
  return (
    <LangModeProvider>
      <LangProvider>
        <Overview />
      </LangProvider>
    </LangModeProvider>
  );
}



export default App;
