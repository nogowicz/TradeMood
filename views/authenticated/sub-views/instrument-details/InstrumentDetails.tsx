import {
    StyleSheet,
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    Animated
} from 'react-native'
import React, { useContext, useRef } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import { RouteProp } from '@react-navigation/native';
import { spacing, typography } from 'styles';
import GoBack from 'assets/icons/Go-back.svg'
import IconButton from 'components/buttons/icon-button';
import Bookmark from 'assets/icons/Bookmark.svg'
import BookmarkSelected from 'assets/icons/Bookmark-selected.svg'
import FastImage from 'react-native-fast-image';
import { FavoritesContext } from '@views/navigation/FavoritesProvider';
import { InstrumentProps } from '@views/navigation/InstrumentProvider';
import { FormattedMessage, useIntl } from 'react-intl';
import TrendingNow from 'components/trending-now';
import ActivityCompare from 'components/activity-compare';
import { useTheme } from 'store/themeContext';
import { AuthContext } from '@views/navigation/AuthProvider';
import { formatLongDate } from 'utils/dateFormat';
import CustomChart from './CustomChart';

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
    const theme = useTheme();
    const { user } = useContext(AuthContext);
    const backIconMargin = 8;
    const intl = useIntl();

    if (!instrument) {
        return (
            <SafeAreaView style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
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
                        <Text style={[styles.errorText, { color: theme.TERTIARY }]}>
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
        const formattedUpdateDate = formatLongDate(date, intl);
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
            <SafeAreaView style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
                <View style={styles.container}>
                    <Animated.View style={[styles.actionContainer, { marginBottom }]}>
                        <View style={styles.actionContainerComponent} >
                            <IconButton
                                onPress={() => navigation.goBack()}
                                size={42}
                            >
                                <GoBack fill={theme.TERTIARY} />
                            </IconButton>
                        </View>
                        <Animated.View
                            style={[
                                {
                                    marginLeft: -(backIconMargin),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transform: [{ scale: logoScale },
                                    { translateY: logoTranslateY }],
                                    maxWidth: '50%',
                                },
                            ]}
                        >
                            <FastImage
                                source={{ uri: instrument.photoUrl }}
                                style={styles.image}
                            />
                            <Text
                                style={[
                                    styles.sectionTitle,
                                    { color: theme.TERTIARY }
                                ]}
                                ellipsizeMode='tail'
                                numberOfLines={2}
                            >
                                {instrument.crypto}
                            </Text>
                        </Animated.View>
                        {!user?.isAnonymous ?
                            <TouchableOpacity
                                onPress={changeFavoriteStatusHandler}
                                style={{ marginTop: backIconMargin }}
                            >
                                {cryptoIsFavorite ?
                                    <BookmarkSelected width={32} height={32} /> :
                                    <Bookmark stroke={theme.TERTIARY} width={32} height={32} />
                                }
                            </TouchableOpacity> :
                            <View style={{ width: 32 }} />
                        }
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
                        <CustomChart
                            instrument={instrument}
                        />

                        <View>
                            <Text style={[styles.dateText, { color: theme.HINT }]}>
                                <FormattedMessage
                                    defaultMessage='Update time:'
                                    id='views.home.instrument-details.update-time'
                                />
                                {formattedUpdateDate}
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
        fontSize: typography.FONT_SIZE_32,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        textAlign: 'center',
    },
    mainContainer: {
        flex: 1,
    },
    errorText: {
        ...typography.FONT_BOLD,
        fontSize: typography.FONT_SIZE_24,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        marginBottom: spacing.SCALE_20,
    },
    dateText: {
        ...typography.FONT_REGULAR,
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
        marginBottom: spacing.SCALE_20,
    },

})