import React, { ReactNode, createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';
import { useIntl } from 'react-intl';
import { useTheme } from 'store/themeContext';

export const InstrumentContext = createContext<InstrumentProps[] | undefined>(undefined);

type InstrumentProviderProps = {
    children: ReactNode;
}

export type InstrumentProps = {
    id: string;
    stockSymbol: string;
    crypto: string;
    activityTM: number;
    activityTW: number;
    sentimentPositive: number;
    sentimentNeutral: number;
    sentimentNegative: number;
    sentiment: string;
    sentimentDirection: string;
    time: FirebaseFirestoreTypes.Timestamp;
    photoUrl: string;
}

export function InstrumentProvider({ children }: InstrumentProviderProps) {
    const [instruments, setInstruments] = useState<InstrumentProps[]>();
    const collectionRef = firestore().collection('instruments');
    const intl = useIntl();
    const theme = useTheme();

    //translations:
    const fetchingDataErrorTranslation = intl.formatMessage({
        id: "views.home.profile.provider.error.fetching-data",
        defaultMessage: "Error occurred while fetching data"
    });
    const tryAgainTranslation = intl.formatMessage({
        id: "views.home.profile.provider.error.try-again",
        defaultMessage: "Try again"
    });

    useEffect(() => {
        const fetchInstruments = async () => {
            try {
                const data = await AsyncStorage.getItem('instruments');
                if (data) {
                    const parsedData = JSON.parse(data) as InstrumentProps[];
                    setInstruments(parsedData);
                }
            } catch (error) {
                console.log('Error while fetching instruments from AsyncStorage', error);
                Snackbar.show({
                    text: fetchingDataErrorTranslation,
                    duration: Snackbar.LENGTH_SHORT,
                    action: {
                        text: tryAgainTranslation,
                        onPress: fetchInstruments,
                        textColor: theme.PRIMARY
                    }
                });
            }
        };

        fetchInstruments();
    }, []);

    useEffect(() => {
        const unsubscribe = collectionRef.onSnapshot((querySnapshot) => {
            const list: InstrumentProps[] = [];
            querySnapshot.forEach((doc) => {
                const {
                    stockSymbol,
                    crypto,
                    activityTM,
                    activityTW,
                    sentimentPositive,
                    sentimentNeutral,
                    sentimentNegative,
                    sentiment,
                    sentimentDirection,
                    time,
                    photoUrl
                } = doc.data();

                const instrument: InstrumentProps = {
                    id: doc.id,
                    stockSymbol,
                    crypto,
                    activityTM,
                    activityTW,
                    sentimentPositive,
                    sentimentNeutral,
                    sentimentNegative,
                    sentiment,
                    sentimentDirection,
                    time,
                    photoUrl
                };

                const existingInstrument = list.find((item) => item.crypto === instrument.crypto);
                if (!existingInstrument) {
                    list.push(instrument);
                }
            });

            setInstruments(list);

            const transactionPromises = list.map((instrument) => {
                const documentRef = collectionRef.doc(instrument.crypto);
                return firestore()
                    .runTransaction(async (transaction) => {
                        const snapshot = await transaction.get(documentRef);
                        const existingData = snapshot.data();
                        const newData = { ...existingData, instruments: instrument };
                        transaction.set(documentRef, newData);
                        AsyncStorage.setItem('instruments', JSON.stringify(list));
                    })
                    .catch((error) => {
                        console.log('Error while saving instruments', error)
                        Snackbar.show({
                            text: fetchingDataErrorTranslation,
                            duration: Snackbar.LENGTH_SHORT,
                        });
                    });
            });

            Promise.all(transactionPromises)
                .then(() => console.log('Instruments list saved to Firestore and AsyncStorage'))
                .catch((error) => {
                    console.log('Error while saving instruments', error)
                    Snackbar.show({
                        text: fetchingDataErrorTranslation,
                        duration: Snackbar.LENGTH_SHORT,
                    });
                });
        });

        return () => unsubscribe();
    }, []);

    return (
        <InstrumentContext.Provider value={instruments}>
            {children}
        </InstrumentContext.Provider>
    );
}
