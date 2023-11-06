import { StyleSheet, SafeAreaView, Text, View, Animated } from 'react-native'
import React, { useRef } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import { RouteProp } from '@react-navigation/native';
import { constants, spacing, typography } from 'styles';
import GoBack from 'assets/icons/Go-back.svg'
import IconButton from 'components/buttons/icon-button';
import { InstrumentProps } from 'store/InstrumentProvider';
import { FormattedMessage, useIntl } from 'react-intl';
import TrendingNow from 'components/trending-now';
import ActivityCompare from 'components/activity-compare';
import { useTheme } from 'store/ThemeContext';
import { formatLongDate } from 'utils/dateFormat';
import CustomChart from './CustomChart';
import AnimatedNavigationBar from './AnimatedNavigationBar';

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
    const theme = useTheme();
    const intl = useIntl();
    const { instrument }: { instrument?: InstrumentProps } = route.params ?? {};

    if (!instrument) {
        return (
            <SafeAreaView style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
                <View style={styles.container}>
                    <View style={styles.actionContainer}>
                        <View style={styles.actionContainerComponent} >
                            <IconButton
                                onPress={() => navigation.goBack()}
                                size={constants.ICON_SIZE.GO_BACK}
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
        const date = new Date(instrument.datetime * 1000);
        const formattedUpdateDate = formatLongDate(date, intl);

        const onScroll = Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
        );

        return (
            <SafeAreaView style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
                <View style={styles.container}>
                    <AnimatedNavigationBar
                        instrument={instrument}
                        navigation={navigation}
                        scrollY={scrollY}
                    />
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
                                        defaultMessage="Today's Activity vs Week's"
                                        id='views.home.instrument-details.todays-activity.weeks'
                                    />
                                }
                                activity={instrument.activityWeekly}
                            />

                            <ActivityCompare
                                name={
                                    <FormattedMessage
                                        defaultMessage="Today's Activity vs Yesterday's"
                                        id='views.home.instrument-details.todays-activity.yesterdays'
                                    />
                                }
                                activity={instrument.activityDaily}
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
        fontSize: typography.FONT_SIZE_28,
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