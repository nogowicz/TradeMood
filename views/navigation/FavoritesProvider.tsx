import { firebase } from '@react-native-firebase/auth';
import { ReactNode, createContext, useEffect, useState } from 'react';

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

    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching favorite crypto")
            const user = firebase.auth().currentUser;
            if (user) {
                const userRef = firebase.firestore().collection('users').doc(user.uid);
                const doc = await userRef.get();
                if (doc.exists) {
                    console.log('Doc exists');
                    const data = doc.data();
                    if (data && data.favoriteCryptoIds) {
                        setFavoriteCryptoIds(data.favoriteCryptoIds);
                    }
                } else {
                    console.log('Doc does not exist');
                    const newData = {
                        favoriteCryptoIds: [],
                    };
                    await userRef.set(newData);
                }
            }
        };

        fetchData();
    }, []);

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
