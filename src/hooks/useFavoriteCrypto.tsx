import { useContext, useEffect, useState } from 'react';
import { FavoritesContext } from 'store/FavoritesProvider';
import { InstrumentContext, InstrumentProps } from 'store/InstrumentProvider';

export function useFavoriteCrypto() {
    const [favoriteCrypto, setFavoriteCrypto] = useState<InstrumentProps[] | undefined>();
    const { ids, addFavorite, removeFavorite } = useContext(FavoritesContext);
    const instruments = useContext(InstrumentContext);

    useEffect(() => {
        const fetchFavoriteCrypto = async () => {
            if (ids.length > 0) {
                const favoriteCryptoFilter: InstrumentProps[] | undefined = instruments?.filter((instrument) =>
                    ids.includes(instrument.id)
                );
                setFavoriteCrypto(favoriteCryptoFilter);
            } else {
                setFavoriteCrypto([]);
            }
        };

        fetchFavoriteCrypto();
    }, [ids]);

    const addFavoriteCrypto = (id: string) => {
        addFavorite(id);
    };

    const removeFavoriteCrypto = (id: string) => {
        removeFavorite(id);
    };

    return {
        favoriteCrypto,
        addFavoriteCrypto,
        removeFavoriteCrypto,
    };
}
