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
}

function FavoritesContextProvider({ children }: FavoritesContextProviderProps) {
    const [favoriteCryptoIds, setFavoriteCryptoIds] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const user = firebase.auth().currentUser;

            if (user) {
                const userRef = firebase.firestore().collection('users').doc(user.uid);
                const doc = await userRef.get();
                if (doc.exists) {
                    console.log("lala")
                    const data = doc.data();
                    if (data && data.favoriteCryptoIds) {
                        setFavoriteCryptoIds(data.favoriteCryptoIds);
                    }
                } else {
                    const newData = {
                        favoriteCryptoIds: []
                    };
                    await userRef.set(newData);
                }


            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const user = firebase.auth().currentUser;
        if (user) {
            const userRef = firebase.firestore().collection('users').doc(user.uid);
            userRef.set({ favoriteCryptoIds }, { merge: true });
        }
    }, [favoriteCryptoIds]);




    function addFavorite(id: string) {
        setFavoriteCryptoIds((currentFavIds: string[]) => [...currentFavIds, id]);
    }

    function removeFavorite(id: string) {
        setFavoriteCryptoIds((currentFavIds: string[]) =>
            currentFavIds.filter((cryptoId: string) => cryptoId !== id)
        );
    }

    const value = {
        ids: favoriteCryptoIds,
        addFavorite: addFavorite,
        removeFavorite: removeFavorite,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}


export default FavoritesContextProvider;