import { StyleSheet, Text, View, SafeAreaView, ScrollView, } from 'react-native'
import React, { useContext, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import { spacing, typography } from 'styles';
import { InstrumentContext, InstrumentProps } from '@views/navigation/InstrumentProvider';
import { FormattedMessage, useIntl } from 'react-intl';
import InstrumentRecord from 'components/instrument-record';
import TextField from 'components/text-field';
import { SCREENS } from '@views/navigation/constants';
import { useTheme } from 'store/themeContext';

type SearchScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Search'>;

type SearchProps = {
    navigation: SearchScreenNavigationProp['navigation']
}

export default function Search({ navigation }: SearchProps) {
    const theme = useTheme();
    const instruments = useContext(InstrumentContext);
    const intl = useIntl();
    const [search, setSearch] = useState('');
    const [filteredInstruments, setFilteredInstruments] = useState<Array<InstrumentProps> | undefined>(instruments);


    const searchFilter = (searchText: string) => {
        setSearch(searchText);
        if (searchText) {
            const filtered = instruments?.filter((instrument: InstrumentProps) => {
                return (
                    instrument.crypto.toLowerCase().includes(searchText.toLowerCase()) ||
                    instrument.stockSymbol.toLowerCase().includes(searchText.toLowerCase()) ||
                    instrument.sentiment.toLowerCase().includes(searchText.toLowerCase())
                );
            });
            setFilteredInstruments(filtered);
        } else {
            setFilteredInstruments(instruments);
        }
    }



    const placeholderText = intl.formatMessage({
        id: 'views.home.search.text-field.placeholder',
        defaultMessage: 'ex. Bitcoin',
    });



    return (
        <SafeAreaView style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <View style={styles.mainContainer}>
                    <Text style={[styles.sectionTitle, { color: theme.TERTIARY }]}>
                        <FormattedMessage
                            defaultMessage='Search'
                            id='views.home.search.title'
                        />
                    </Text>
                </View>
                <View>
                    <TextField
                        onChangeText={searchFilter}
                        value={search}
                        placeholder={placeholderText}
                        clear={search.length > 0}
                        onClear={() => {
                            setSearch('');
                            setFilteredInstruments(instruments);
                        }}
                    />
                </View>

                <View style={styles.listTitle}>
                    <Text style={[styles.listTitleText, { color: theme.TERTIARY }]}>
                        <FormattedMessage
                            defaultMessage='All Cryptocurrencies'
                            id='views.home.search.all-cryptocurrencies'
                        />
                    </Text>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1, }}
                >
                    <View>
                        {filteredInstruments && filteredInstruments.map((instrument: InstrumentProps) => {
                            return (
                                <InstrumentRecord
                                    key={instrument.id}
                                    crypto={instrument.crypto}
                                    sentimentDirection={instrument.sentimentDirection}
                                    sentiment={instrument.sentiment}
                                    photoUrl={instrument.photoUrl}
                                    onPress={() => {
                                        navigation.navigate(SCREENS.HOME.INSTRUMENT_DETAILS.ID, { instrument: instrument } as any);
                                    }}
                                />
                            )

                        })}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.SCALE_20,
        paddingTop: spacing.SCALE_20,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionContainerLeftSide: {
        flexDirection: 'row',
        gap: spacing.SCALE_16
    },
    sectionTitle: {
        ...typography.FONT_BOLD,
        fontSize: typography.FONT_SIZE_32,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    mainContainer: {
        marginVertical: spacing.SCALE_18,
    },
    listTitleText: {
        ...typography.FONT_BOLD,
        fontSize: typography.FONT_SIZE_24,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    listTitle: {
        marginVertical: spacing.SCALE_16,
    }
});