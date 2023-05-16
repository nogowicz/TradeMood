import React, { ReactNode, createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

export const InstrumentContext = createContext<Array<InstrumentProps> | undefined>(undefined);


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
    time: {
        nanoseconds: number;
        seconds: number;
    };
    photoUrl: string;
}

export function InstrumentProvider({ children }: InstrumentProviderProps) {
    const [instruments, setInstruments] = useState<Array<InstrumentProps>>();
    const ref = firestore().collection('instruments');

    useEffect(() => {
        const fetchInstruments = async () => {
            try {
                const data = await AsyncStorage.getItem('instruments');
                if (data) {
                    const parsedData = JSON.parse(data);
                    setInstruments(parsedData);
                }
            } catch (error) {
                console.log('Błąd pobierania instrumentów', error);
            }
        };

        fetchInstruments();
    }, []);

    useEffect(() => {

        const unsubscribe = ref.onSnapshot((querySnapshot) => {
            const list: Array<InstrumentProps> = [];

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

                const existingInstrument = list.find((item) => item.id === instrument.id);

                if (!existingInstrument) {
                    list.push(instrument);
                }
            });

            setInstruments(list);

            AsyncStorage.setItem('instruments', JSON.stringify(list))
                .then(() => console.log('Lista instrumentów zapisana w AsyncStorage'))
                .catch((error) =>
                    console.log('Błąd zapisu listy instrumentów w AsyncStorage', error)
                );
        });

        return () => unsubscribe();
    }, []);

    return (
        <InstrumentContext.Provider value={instruments}>
            {children}
        </InstrumentContext.Provider>
    )
}