import Routes from './Routes';
import { AuthProvider } from 'store/AuthProvider';
import { InstrumentProvider } from 'store/InstrumentProvider';
import FavoritesContextProvider from 'store/FavoritesProvider';


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
