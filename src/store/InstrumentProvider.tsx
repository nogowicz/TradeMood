import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';
import { useIntl } from 'react-intl';
import { useTheme } from 'store/ThemeContext';

export const InstrumentContext = createContext<InstrumentProps[] | undefined>(undefined);

type InstrumentProviderProps = {
    children: ReactNode;
}

export type InstrumentProps = {
    id: string;
    cryptoSymbol: string;
    crypto: string;
    activityDaily: number;
    activityWeekly: number;
    sentimentPositive: number;
    sentimentNeutral: number;
    sentimentNegative: number;
    overallSentiment: string;
    sentimentDirection: string;
    datetime: number;
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
                    cryptoSymbol,
                    crypto,
                    activityDaily,
                    activityWeekly,
                    sentimentPositive,
                    sentimentNeutral,
                    sentimentNegative,
                    overallSentiment,
                    sentimentDirection,
                    datetime,
                    photoUrl
                } = doc.data();

                const instrument: InstrumentProps = {
                    id: doc.id,
                    cryptoSymbol,
                    crypto,
                    activityDaily,
                    activityWeekly,
                    sentimentPositive,
                    sentimentNeutral,
                    sentimentNegative,
                    overallSentiment,
                    sentimentDirection,
                    datetime,
                    photoUrl
                };

                const existingInstrument = list.find((item) => item.crypto === instrument.crypto);
                if (!existingInstrument) {
                    list.push(instrument);
                }
            });

            setInstruments(list);


            // const transactionPromises = list.map((instrument) => {
            //     const documentRef = collectionRef.doc(instrument.crypto);
            //     return firestore()
            //         .runTransaction(async (transaction) => {
            //             const snapshot = await transaction.get(documentRef);
            //             const existingData = snapshot.data();
            //             const newData = { ...existingData, instruments: instrument };
            //             transaction.set(documentRef, newData);
            //             AsyncStorage.setItem('instruments', JSON.stringify(list));
            //         })
            //         .catch((error) => {
            //             console.log('Error while saving instruments', error)
            //             Snackbar.show({
            //                 text: fetchingDataErrorTranslation,
            //                 duration: Snackbar.LENGTH_LONG,
            //             });
            //         });
            // });

            // Promise.all(transactionPromises)
            //     .then(() => console.log('Instruments list saved to Firestore and AsyncStorage'))
            //     .catch((error) => {
            //         console.log('Error while saving instruments', error)
            //         Snackbar.show({
            //             text: fetchingDataErrorTranslation,
            //             duration: Snackbar.LENGTH_SHORT,
            //         });
            //     });

            AsyncStorage.setItem('instruments', JSON.stringify(list));
        });

        return () => unsubscribe();
    }, []);

    return (
        <InstrumentContext.Provider value={instruments}>
            {children}
        </InstrumentContext.Provider>
    );
}

export function useInstrument() {
    const instruments = useContext(InstrumentContext);

    if (instruments === undefined) {
        throw new Error('useInstrument must be used within an InstrumentProvider');
    }

    return instruments;
}