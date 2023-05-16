import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
} from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormattedMessage } from 'react-intl';

import { RootStackParamList } from '../../navigation/Navigation';
import { AuthContext } from '@views/navigation/AuthProvider';
import { colors, spacing, typography } from 'styles';
import ProfileBar from 'components/profile-bar';
import IconButton from 'components/buttons/icon-button';

import Bell from 'assets/icons/Bell-icon.svg'
import Search from 'assets/icons/Search.svg'
import { SCREENS } from '@views/navigation/constants';
import TrendingNow from 'components/trending-now';
import { InstrumentContext, InstrumentProps } from '@views/navigation/InstrumentProvider';
import { FavoritesContext } from '@views/navigation/FavoritesProvider';
import InstrumentRecord from 'components/instrument-record';


type OverviewScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Overview'>;

type OverviewProps = {
    navigation: OverviewScreenNavigationProp['navigation'];
}


export default function Overview({ navigation }: OverviewProps) {
    const { user } = useContext(AuthContext);
    const instruments = useContext(InstrumentContext);
    const favoriteMealsCtx = useContext(FavoritesContext);

    const favoriteCrypto = instruments?.filter((instrument) =>
        favoriteMealsCtx.ids.includes(instrument.id)
    );


    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <View style={styles.actionContainer}>
                    <View style={styles.actionContainerLeftSide}>
                        <IconButton
                            onPress={() => navigation.navigate(SCREENS.HOME.SEARCH.ID)}
                            size={48}
                            backgroundColor={colors.LIGHT_COLORS.LIGHT_HINT}
                        >
                            <Search />
                        </IconButton>
                        <IconButton
                            onPress={() => navigation.navigate(SCREENS.HOME.NOTIFICATION.ID)}
                            size={48}
                            backgroundColor={colors.LIGHT_COLORS.LIGHT_HINT}
                        >
                            <Bell />
                        </IconButton>
                    </View>
                    <ProfileBar
                        displayName={user?.displayName}
                        imageUrl={user?.photoURL}
                        isAnonymous={user?.isAnonymous}
                        onPress={() => navigation.navigate(SCREENS.HOME.EDIT_PROFILE.ID)}
                    />
                </View>
                <View style={styles.mainContainer}>
                    <Text style={styles.sectionTitle}>
                        <FormattedMessage
                            defaultMessage='Overview'
                            id='views.home.overview.title'
                        />
                    </Text>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1, }}
                >
                    <View>

                        <TrendingNow
                            name={instruments ? instruments[0].crypto : ''}
                            positive={instruments ? instruments[0].sentimentPositive : 0}
                            neutral={instruments ? instruments[0].sentimentNeutral : 0}
                            negative={instruments ? instruments[0].sentimentNegative : 0}
                            onPress={() => {
                                if (instruments && instruments.length > 0) {
                                    navigation.navigate(SCREENS.HOME.INSTRUMENT_DETAILS.ID, { instrument: instruments[0] } as any);
                                }
                            }}

                        />
                    </View>
                    <View>
                        {favoriteCrypto && favoriteCrypto?.length > 0 &&
                            <Text style={styles.listTitleText}>
                                <FormattedMessage
                                    defaultMessage='Favorites'
                                    id='views.home.overview.favorites'
                                />
                            </Text>
                        }
                        {favoriteCrypto && favoriteCrypto.map((instrument: InstrumentProps) => {
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
        backgroundColor: colors.LIGHT_COLORS.BACKGROUND,
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
        color: colors.LIGHT_COLORS.TERTIARY,
        fontSize: typography.FONT_SIZE_32,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    mainContainer: {
        marginVertical: spacing.SCALE_18,
    },
    listTitleText: {
        ...typography.FONT_BOLD,
        color: colors.LIGHT_COLORS.TERTIARY,
        fontSize: typography.FONT_SIZE_24,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    }
});