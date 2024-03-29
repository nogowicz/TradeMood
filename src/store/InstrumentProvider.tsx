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

    if (!instruments) {
        console.log('useInstrument must be used within an InstrumentProvider');
    }

    return instruments;
}


export function getMaxSentimentPositive(data: InstrumentProps[] | undefined): InstrumentProps | undefined {
    if (data) {

        if (data.length === 0) {
            return undefined;
        }

        let maxSentimentPositive = data[0];
        for (let i = 1; i < data.length; i++) {
            if (data[i].sentimentPositive > maxSentimentPositive.sentimentPositive) {
                maxSentimentPositive = data[i];
            }
        }

        return maxSentimentPositive;
    }
}
