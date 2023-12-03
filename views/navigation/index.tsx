import Routes from './Routes';
import { AuthProvider } from 'store/AuthProvider';
import { InstrumentProvider } from 'store/InstrumentProvider';
import FavoritesContextProvider from 'store/FavoritesProvider';
import { PostsContextProvider } from 'store/PostsProvider';
import FollowingContextProvider from 'store/FollowingProvider';


export default function Providers() {

  return (
    <AuthProvider>
      <InstrumentProvider>
        <FollowingContextProvider>
          <PostsContextProvider>
            <FavoritesContextProvider>
              <Routes />
            </FavoritesContextProvider>
          </PostsContextProvider>
        </FollowingContextProvider>
      </InstrumentProvider>
    </AuthProvider>
  );
}
