import { firebase } from '@react-native-firebase/auth';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';

export const FavoritesContext = createContext<{
    ids: string[];
    addFavorite: (id: string) => void;
    removeFavorite: (id: string) => void;
}>({
    ids: [],
    addFavorite: (id: string) => { },
    removeFavorite: (id: string) => { },
});

type FavoritesContextProviderProps = {
    children: ReactNode;
};

function FavoritesContextProvider({ children }: FavoritesContextProviderProps) {
    const [favoriteCryptoIds, setFavoriteCryptoIds] = useState<string[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            const user = firebase.auth().currentUser;
            if (user) {
                const userRef = firebase.firestore().collection('users').doc(user.uid);
                const doc = await userRef.get();
                if (doc.exists) {
                    const data = doc.data();
                    if (data && data.favoriteCryptoIds) {
                        console.log("FAVORITE CRYPTO IDS: ", data.favoriteCryptoIds);
                        setFavoriteCryptoIds(data.favoriteCryptoIds);
                    }
                }
            }
        };
        if (!user?.isAnonymous) {
            console.log("User is not anonymous")
            fetchData();
        }
    }, [user]);

    function addFavorite(id: string) {
        const user = firebase.auth().currentUser;
        if (user) {
            const userRef = firebase.firestore().collection('users').doc(user.uid);
            firebase.firestore().runTransaction(async (transaction) => {
                const doc = await transaction.get(userRef);
                if (doc.exists) {
                    const data = doc.data();
                    if (data && data.favoriteCryptoIds) {
                        const updatedIds = [...data.favoriteCryptoIds, id];
                        transaction.update(userRef, { favoriteCryptoIds: updatedIds });
                        setFavoriteCryptoIds(updatedIds);
                    } else {
                        transaction.set(userRef, { favoriteCryptoIds: [id] }, { merge: true });
                        setFavoriteCryptoIds([id]);
                    }
                }
            });
        }
    }

    function removeFavorite(id: string) {
        const user = firebase.auth().currentUser;
        if (user) {
            const userRef = firebase.firestore().collection('users').doc(user.uid);
            firebase.firestore().runTransaction(async (transaction) => {
                const doc = await transaction.get(userRef);
                if (doc.exists) {
                    const data = doc.data();
                    if (data && data.favoriteCryptoIds) {
                        const updatedIds = data.favoriteCryptoIds.filter(
                            (cryptoId: string) => cryptoId !== id
                        );
                        transaction.update(userRef, { favoriteCryptoIds: updatedIds });
                        setFavoriteCryptoIds(updatedIds);
                    }
                }
            });
        }
    }

    const value = {
        ids: favoriteCryptoIds,
        addFavorite: addFavorite,
        removeFavorite: removeFavorite,
    };

    return (
        <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
    );
}

export default FavoritesContextProvider;



export function useFavoriteInstrument() {
    const favoriteInstrument = useContext(FavoritesContext);

    if (favoriteInstrument === undefined) {
        throw new Error('useFavoriteInstrument must be used within an FavoritesContext');
    }

    return favoriteInstrument;
}