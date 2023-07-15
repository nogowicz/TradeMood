import {

    StyleSheet,
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    Animated,
} from 'react-native'
import React, { useContext, useRef } from 'react'
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
import { LangContext } from 'lang/LangProvider';
import TrendingNow from 'components/trending-now';
import ActivityCompare from 'components/activity-compare';
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
    const scrollY = useRef(new Animated.Value(0)).current;
    const { instrument }: { instrument?: InstrumentProps } = route.params ?? {};
    const favoriteCryptoCtx = useContext(FavoritesContext);
    const [language] = useContext(LangContext);
    const backIconMargin = 8;
    const dateLocationLanguage = language === 'pl' ? 'pl-PL' : 'en-US';

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
            weekday: 'long',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const formattedDate = date.toLocaleDateString(dateLocationLanguage, options);

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

        const onScroll = Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
        );

        const logoScale = scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0.5],
            extrapolate: 'clamp',
        });

        const logoTranslateY = scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [0, -50],
            extrapolate: 'clamp',
        });

        const marginBottom = scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [0, -50],
            extrapolate: 'clamp',
        });

        return (
            <SafeAreaView style={styles.root}>
                <View style={styles.container}>
                    <Animated.View style={[styles.actionContainer, { marginBottom }]}>
                        <View style={styles.actionContainerComponent} >
                            <IconButton
                                onPress={() => navigation.goBack()}
                                size={42}
                            >
                                <GoBack />
                            </IconButton>
                        </View>
                        <Animated.View
                            style={[
                                { marginLeft: -(backIconMargin), alignItems: 'center', justifyContent: 'center', transform: [{ scale: logoScale }, { translateY: logoTranslateY }] },
                            ]}
                        >
                            <FastImage
                                source={{ uri: instrument.photoUrl }}
                                style={styles.image}
                            />
                            <Text style={styles.sectionTitle}>{instrument.crypto}</Text>
                        </Animated.View>
                        <TouchableOpacity
                            onPress={changeFavoriteStatusHandler}
                            style={{ marginTop: backIconMargin }}
                        >
                            {cryptoIsFavorite ?
                                <BookmarkSelected width={32} height={32} /> :
                                <Bookmark width={32} height={32} />
                            }
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.ScrollView
                        style={styles.mainContainer}
                        showsVerticalScrollIndicator={false}
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                    >
                        <TrendingNow
                            title={
                                <FormattedMessage
                                    defaultMessage='Sentiment Details'
                                    id='views.home.instrument-details.sentiment-details'
                                />
                            }
                            positive={instrument.sentimentPositive}
                            neutral={instrument.sentimentNeutral}
                            negative={instrument.sentimentNegative}
                            trendingWidget={false}
                        />

                        <View style={styles.activitiesContainer}>
                            <ActivityCompare
                                name={
                                    <FormattedMessage
                                        defaultMessage="Today's Activity vs Week"
                                        id='views.home.instrument-details.todays-activity.week'
                                    />
                                }
                                activity={instrument.activityTW}
                            />

                            <ActivityCompare
                                name={
                                    <FormattedMessage
                                        defaultMessage="Today's Activity vs Month"
                                        id='views.home.instrument-details.todays-activity.month'
                                    />
                                }
                                activity={instrument.activityTM}
                            />
                        </View>
                        <View>
                            <Text style={styles.dateText}>
                                <FormattedMessage
                                    defaultMessage='Update time:'
                                    id='views.home.instrument-details.update-time'
                                />
                                {formattedDate}
                            </Text>
                        </View>
                    </Animated.ScrollView>
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
    },
    actionContainerComponent: {
        flex: 1 / 5,
    },
    sectionTitle: {
        ...typography.FONT_BOLD,
        color: colors.LIGHT_COLORS.TERTIARY,
        fontSize: typography.FONT_SIZE_32,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    mainContainer: {
        flex: 1,
    },
    errorText: {
        ...typography.FONT_BOLD,
        color: colors.LIGHT_COLORS.TERTIARY,
        fontSize: typography.FONT_SIZE_24,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        marginBottom: spacing.SCALE_20,
    },
    dateText: {
        ...typography.FONT_REGULAR,
        color: colors.LIGHT_COLORS.HINT,
        fontSize: typography.FONT_SIZE_14,
        fontWeight: typography.FONT_WEIGHT_REGULAR,
        marginVertical: spacing.SCALE_20,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: spacing.SCALE_20,
    },
    activitiesContainer: {
        flexDirection: 'row',
        gap: spacing.SCALE_16,
    }
})