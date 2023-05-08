import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native'
import React from 'react'
import { colors, constants, spacing, typography } from 'styles'
import Pie from 'react-native-pie'
import GoFroward from 'assets/icons/Go-forward.svg'
import { FormattedMessage } from 'react-intl'

type TrendingNowProps = {
    name: string;
    positive: number;
    neutral: number;
    negative: number;
    onPress: () => void;
}

export default function TrendingNow({ name, positive, neutral, negative, onPress }: TrendingNowProps) {
    const data = [
        {
            percentage: positive,
            color: colors.LIGHT_COLORS.POSITIVE,
        },
        {
            percentage: negative,
            color: colors.LIGHT_COLORS.NEGATIVE,
        },
        {
            percentage: neutral,
            color: colors.LIGHT_COLORS.LIGHT_HINT
        },
    ]
    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.titleText}>
                    <FormattedMessage
                        defaultMessage='Trending Now'
                        id='views.home.overview-trending_now-title'
                    />
                </Text>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.detailsButton}
                    onPress={onPress}
                >
                    <Text style={styles.buttonText}>
                        <FormattedMessage
                            defaultMessage='Details'
                            id='views.home.overview-trending_now-details'
                        />
                    </Text>
                    <GoFroward width={6} style={{ color: colors.LIGHT_COLORS.TERTIARY }} />
                </TouchableOpacity>
            </View>
            <View style={styles.bottomContainer}>
                <Pie
                    radius={60}
                    innerRadius={40}
                    sections={data}
                    strokeCap='butt'
                />

                <View>
                    <Text style={styles.titleText}>{name}</Text>
                    <View style={styles.legendContainer}>
                        <View style={[styles.dot, { backgroundColor: colors.LIGHT_COLORS.POSITIVE }]} />
                        <View>
                            <Text style={styles.buttonText}>{positive}%</Text>
                            <Text style={{ color: colors.LIGHT_COLORS.HINT }}>
                                <FormattedMessage
                                    defaultMessage='Positive'
                                    id='views.home.overview-trending_now-positive'
                                />
                            </Text>
                        </View>
                    </View>

                    <View style={styles.legendContainer}>
                        <View style={[styles.dot, { backgroundColor: colors.LIGHT_COLORS.LIGHT_HINT }]} />
                        <View>
                            <Text style={styles.buttonText}>{neutral}%</Text>
                            <Text style={{ color: colors.LIGHT_COLORS.HINT }}>
                                <FormattedMessage
                                    defaultMessage='Neutral'
                                    id='views.home.overview-trending_now-neutral'
                                />
                            </Text>
                        </View>
                    </View>

                    <View style={styles.legendContainer}>
                        <View style={[styles.dot, { backgroundColor: colors.LIGHT_COLORS.NEGATIVE }]} />
                        <View>
                            <Text style={styles.buttonText}>{negative}%</Text>
                            <Text style={{ color: colors.LIGHT_COLORS.HINT }}>
                                <FormattedMessage
                                    defaultMessage='Negative'
                                    id='views.home.overview-trending_now-negative'
                                />
                            </Text>
                        </View>
                    </View>

                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        padding: spacing.SCALE_12,
        borderColor: colors.LIGHT_COLORS.LIGHT_HINT,
        marginVertical: spacing.SCALE_20,
    },
    titleText: {
        ...typography.FONT_BOLD,
        color: colors.LIGHT_COLORS.TERTIARY,
        fontSize: typography.FONT_SIZE_16,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: spacing.SCALE_16,
    },
    buttonText: {
        ...typography.FONT_BOLD,
        color: colors.LIGHT_COLORS.TERTIARY,
        fontSize: typography.FONT_SIZE_12,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    detailsButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.SCALE_4,
        backgroundColor: colors.LIGHT_COLORS.LIGHT_HINT,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        paddingVertical: spacing.SCALE_4,
        paddingHorizontal: spacing.SCALE_8
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: spacing.SCALE_8,
        marginHorizontal: spacing.SCALE_16,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.SCALE_12,
        marginTop: spacing.SCALE_4,
    },
})