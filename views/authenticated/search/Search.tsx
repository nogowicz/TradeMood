import { StyleSheet, Text, View, SafeAreaView, ScrollView, } from 'react-native'
import React, { useCallback, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import { spacing, typography } from 'styles';
import { InstrumentProps, useInstrument } from 'store/InstrumentProvider';
import { FormattedMessage, useIntl } from 'react-intl';
import { useTheme } from 'store/ThemeContext';

import InstrumentRecord from 'components/instrument-record';
import TextField from 'components/text-field';

type SearchScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Search'>;

type SearchProps = {
    navigation: SearchScreenNavigationProp['navigation']
}

export default function Search({ navigation }: SearchProps) {
    const theme = useTheme();
    const instruments = useInstrument();
    const intl = useIntl();
    const [search, setSearch] = useState('');
    const [filteredInstruments, setFilteredInstruments] = useState<Array<InstrumentProps> | undefined>(instruments);

    //translations:
    const placeholderText = intl.formatMessage({
        id: 'views.home.search.text-field.placeholder',
        defaultMessage: 'ex. Bitcoin',
    });

    const filterInstruments = useCallback((searchText: string) => {
        if (searchText) {
            return instruments?.filter((instrument: InstrumentProps) => {
                return (
                    instrument.crypto.toLowerCase().includes(searchText.toLowerCase()) ||
                    instrument.cryptoSymbol.toLowerCase().includes(searchText.toLowerCase()) ||
                    instrument.overallSentiment.toLowerCase().includes(searchText.toLowerCase())
                );
            });
        } else {
            return instruments;
        }
    }, [instruments]);

    const searchFilter = useCallback((searchText: string) => {
        setSearch(searchText);
        setFilteredInstruments(filterInstruments(searchText));
    }, [filterInstruments]);

    const onClearHandle = useCallback(() => {
        setSearch('');
        setFilteredInstruments(instruments);
    }, [instruments]);

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
                <TextField
                    onChangeText={searchFilter}
                    value={search}
                    placeholder={placeholderText}
                    clear={search.length > 0}
                    onClear={onClearHandle}
                />
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
                    style={{ flex: 1 }}
                >
                    <View>
                        {filteredInstruments && filteredInstruments.map((instrument: InstrumentProps) => {
                            return <InstrumentRecord {...instrument} key={instrument.id} />
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
        fontSize: typography.FONT_SIZE_28,
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