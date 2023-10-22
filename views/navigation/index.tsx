import Routes from './Routes';
import { AuthProvider } from '../../src/store/AuthProvider';
import { InstrumentProvider } from '../../src/store/InstrumentProvider';
import FavoritesContextProvider from '../../src/store/FavoritesProvider';


export default function Providers() {

  return (
    <AuthProvider>
      <InstrumentProvider>
        <FavoritesContextProvider>
          <Routes />
        </FavoritesContextProvider>
      </InstrumentProvider>
    </AuthProvider>
  );
}
