import {

    StyleSheet,
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import { RouteProp } from '@react-navigation/native';
import { constants, spacing, typography } from 'styles';
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
import { useTheme } from 'store/themeContext';
import { AuthContext } from '@views/navigation/AuthProvider';
import { LineChart } from "react-native-chart-kit";

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
    const theme = useTheme();
    const { user } = useContext(AuthContext);
    const [data, setData] = useState<any>();

    const [chartData, setChartData] = useState<any>();

    function convertData(data: any) {
        let labels = [];
        let dataset = [];

        for (let i = 0; i < data.length; i++) {
            labels.push(data[i].Date);
            dataset.push(data[i].Close);
        }

        return {
            labels: labels,
            datasets: [{
                data: dataset
            }]
        };
    }

    useEffect(() => {
        if (data) {
            setChartData(convertData(data));
        }
    }, [data]);

    useEffect(() => {
        if (instrument?.stockSymbol) {
            async function getData() {
                let currentTimestamp = Math.floor(Date.now() / 1000);
                let date = new Date();
                date.setFullYear(date.getFullYear() - 1);
                date.setHours(0, 0, 0, 0);

                let newTimestamp = Math.floor(date.getTime() / 1000);

                fetch(`https://query1.finance.yahoo.com/v7/finance/download/${instrument?.stockSymbol}-USD?period1=${newTimestamp}&period2=${currentTimestamp}&interval=3mo&events=history`)
                    .then(response => response.text())
                    .then(data => {
                        const lines: string[] = data.split('\n');
                        const headers: string[] = lines[0].split(',');
                        const json: any[] = lines.slice(1).map((line: string) => {
                            const values: string[] = line.split(',');
                            return headers.reduce((object: { [key: string]: string }, header: string, index: number) => {
                                object[header] = values[index];
                                return object;
                            }, {});
                        });
                        setData(json);
                        // console.log(json);
                    });


            }
            getData();
        }

    }, []);

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
                        <View>
                            {chartData ?
                                <LineChart
                                    data={chartData}
                                    width={(Dimensions.get("window").width) - 50}
                                    height={450}
                                    yAxisLabel="$"
                                    yAxisSuffix="k"
                                    yAxisInterval={1}
                                    chartConfig={{
                                        backgroundColor: theme.BACKGROUND,
                                        backgroundGradientFrom: theme.BACKGROUND,
                                        backgroundGradientTo: theme.BACKGROUND,
                                        decimalPlaces: 2,
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        style: {
                                            borderRadius: 16,
                                        },
                                        propsForDots: {
                                            r: "4",
                                            strokeWidth: "1",
                                            stroke: theme.PRIMARY
                                        }
                                    }}
                                    bezier
                                    verticalLabelRotation={90}
                                    horizontalLabelRotation={-50}
                                    style={{
                                        borderRadius: constants.BORDER_RADIUS.BOTTOM_SHEET,
                                        borderWidth: 2,
                                        borderColor: theme.LIGHT_HINT,
                                        paddingTop: 20,
                                    }}

                                    formatXLabel={(xValue) => {
                                        const date = new Date(xValue);
                                        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                        const month = monthNames[date.getMonth()];
                                        const year = date.getFullYear();
                                        return `${month} ${year}`;
                                    }}

                                /> :
                                <Text>Loading data...</Text>
                            }
                        </View>

                        <View>
                            <Text style={[styles.dateText, { color: theme.HINT }]}>
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
    }
})