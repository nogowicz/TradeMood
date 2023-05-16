import {

    StyleSheet,
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
} from 'react-native'
import React, { useContext } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import { RouteProp } from '@react-navigation/native';
import { colors, spacing, typography } from 'styles';
import GoBack from 'assets/icons/Go-back.svg'
import IconButton from 'components/buttons/icon-button';
import Bookmark from 'assets/icons/Bookmark.svg'
import BookmarkSelected from 'assets/icons/Bookmark-selected.svg'
import FastImage from 'react-native-fast-image';
import { FavoritesContext } from '@views/navigation/FavoritesProvider';
import { InstrumentProps } from '@views/navigation/InstrumentProvider';
import { FormattedMessage } from 'react-intl';

type InstrumentDetailsScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'InstrumentDetails'>;
type InstrumentDetailsScreenRouteProp = RouteProp<RootStackParamList, 'InstrumentDetails'>




type InstrumentDetailsProps = {
    navigation: InstrumentDetailsScreenNavigationProp['navigation'];
    route: InstrumentDetailsScreenRouteProp & {
        params?: {
            instrument?: InstrumentProps | undefined;
        };
    };
}




export default function InstrumentDetails({ navigation, route }: InstrumentDetailsProps) {
    const { instrument }: { instrument?: InstrumentProps } = route.params ?? {};
    const favoriteCryptoCtx = useContext(FavoritesContext);


    if (!instrument) {
        return (
            <SafeAreaView style={styles.root}>
                <View style={styles.container}>
                    <View style={styles.actionContainer}>
                        <View style={styles.actionContainerComponent} >
                            <IconButton
                                onPress={() => navigation.goBack()}
                                size={42}
                            >
                                <GoBack />
                            </IconButton>
                        </View>
                    </View>
                    <View style={styles.mainContainer}>
                        <Text style={styles.errorText}>
                            <FormattedMessage
                                defaultMessage='There is no instrument data'
                                id='views.home.instrument-details.no-data'
                            />
                        </Text>
                    </View>
                </View>
            </SafeAreaView >
        );
    } else {
        const milliseconds = instrument.time.seconds * 1000 + instrument.time.nanoseconds / 1000000;
        const date = new Date(milliseconds);
        const options: Object = {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const cryptoIsFavorite = favoriteCryptoCtx.ids.includes(instrument.id);

        function changeFavoriteStatusHandler() {
            if (instrument) {
                if (cryptoIsFavorite) {
                    favoriteCryptoCtx.removeFavorite(instrument.id);
                } else {
                    favoriteCryptoCtx.addFavorite(instrument.id);
                }
            }
        }
        return (
            <SafeAreaView style={styles.root}>
                <View style={styles.container}>
                    <View style={styles.actionContainer}>
                        <View style={styles.actionContainerComponent} >
                            <IconButton
                                onPress={() => navigation.goBack()}
                                size={42}
                            >
                                <GoBack />
                            </IconButton>
                        </View>
                        <TouchableOpacity
                            onPress={changeFavoriteStatusHandler}
                        >
                            {cryptoIsFavorite ?
                                <BookmarkSelected width={32} height={32} /> :
                                <Bookmark width={32} height={32} />
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.mainContainer}>
                        <Text style={styles.sectionTitle}>{instrument.crypto}</Text>
                        <Text>Updated time: {formattedDate}</Text>
                        <FastImage
                            source={{ uri: instrument.photoUrl }}
                            style={{ width: 100, height: 100 }}
                        />
                    </View>
                </View>
            </SafeAreaView >
        )
    }
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
    actionContainerComponent: {
        flex: 1 / 5
    },
    sectionTitle: {
        ...typography.FONT_BOLD,
        color: colors.LIGHT_COLORS.TERTIARY,
        fontSize: typography.FONT_SIZE_32,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        marginBottom: spacing.SCALE_20,
    },
    mainContainer: {
        marginTop: spacing.SCALE_18,
    },
    errorText: {
        ...typography.FONT_BOLD,
        color: colors.LIGHT_COLORS.TERTIARY,
        fontSize: typography.FONT_SIZE_24,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        marginBottom: spacing.SCALE_20,
    }
})