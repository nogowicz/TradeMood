import Routes from './Routes';
import { AuthProvider } from 'store/AuthProvider';
import { InstrumentProvider } from 'store/InstrumentProvider';
import FavoritesContextProvider from 'store/FavoritesProvider';
import { PostsContextProvider } from 'store/PostsProvider';
import FollowingContextProvider from 'store/FollowingProvider';


export default function Providers() {

  return (
    <AuthProvider>
      <FollowingContextProvider>
        <InstrumentProvider>
          <PostsContextProvider>
            <FavoritesContextProvider>
              <Routes />
            </FavoritesContextProvider>
          </PostsContextProvider>
        </InstrumentProvider>
      </FollowingContextProvider>
    </AuthProvider>
  );
}
