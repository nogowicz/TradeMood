import Routes from './Routes';
import { AuthProvider } from './AuthProvider';
import { InstrumentProvider } from './InstrumentProvider';


export default function Providers() {

  return (
    <AuthProvider>
      <InstrumentProvider>
        <Routes />
      </InstrumentProvider>
    </AuthProvider>
  );
}
