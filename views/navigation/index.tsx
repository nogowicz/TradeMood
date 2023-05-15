import Routes from './Routes';
import { AuthProvider } from './AuthProvider';
import { InstrumentProvider } from './InstrumentProvider';
import FavoritesContextProvider from './FavoritesProvider';


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
