import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native'
import React, { ReactNode, useContext } from 'react'
import { colors, constants, spacing, typography } from 'styles'
import Pie from 'react-native-pie'
import GoFroward from 'assets/icons/Go-forward.svg'
import { FormattedMessage } from 'react-intl'
import { themeContext } from 'store/themeContext'

type TrendingNowProps = {
    name?: string;
    title: string | ReactNode;
    positive: number;
    neutral: number;
    negative: number;
    onPress?: () => void;
    trendingWidget: boolean;
}

export default function TrendingNow({ name, title, positive, neutral, negative, onPress, trendingWidget }: TrendingNowProps) {
    const theme = useContext(themeContext);
    const data = [
        {
            percentage: positive,
            color: theme.POSITIVE,
        },
        {
            percentage: negative,
            color: theme.NEGATIVE,
        },
        {
            percentage: neutral,
            color: theme.HINT
        },
    ]
    return (
        <View style={[styles.container, { borderColor: theme.LIGHT_HINT }]}>

            <View style={styles.topContainer}>
                <Text style={[styles.titleText, { color: theme.TERTIARY }]}>
                    {title}
                </Text>
                {trendingWidget &&
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[styles.detailsButton, { backgroundColor: theme.LIGHT_HINT }]}
                        onPress={onPress}
                    >
                        <Text style={[styles.buttonText, { color: theme.TERTIARY }]}>
                            <FormattedMessage
                                defaultMessage='Details'
                                id='views.home.overview.trending-now.details'
                            />
                        </Text>
                        <GoFroward width={6} style={{ color: theme.TERTIARY }} />
                    </TouchableOpacity>
                }
            </View>
            <View style={styles.bottomContainer}>
                <Pie
                    radius={60}
                    innerRadius={40}
                    sections={data}
                    strokeCap='butt'
                />

                <View>
                    {trendingWidget &&
                        <Text style={[styles.titleText, { color: theme.TERTIARY }]}>{name}</Text>
                    }
                    <View style={styles.legendContainer}>
                        <View style={[styles.dot, { backgroundColor: theme.POSITIVE }]} />
                        <View>
                            <Text style={[styles.buttonText, { color: theme.TERTIARY }]}>{positive}%</Text>
                            <Text style={{ color: theme.HINT }}>
                                <FormattedMessage
                                    defaultMessage='Positive'
                                    id='views.home.overview.trending-now.positive'
                                />
                            </Text>
                        </View>
                    </View>

                    <View style={styles.legendContainer}>
                        <View style={[styles.dot, { backgroundColor: theme.HINT }]} />
                        <View>
                            <Text style={[styles.buttonText, , { color: theme.TERTIARY }]}>{neutral}%</Text>
                            <Text style={{ color: theme.HINT }}>
                                <FormattedMessage
                                    defaultMessage='Neutral'
                                    id='views.home.overview.trending-now.neutral'
                                />
                            </Text>
                        </View>
                    </View>

                    <View style={styles.legendContainer}>
                        <View style={[styles.dot, { backgroundColor: theme.NEGATIVE }]} />
                        <View>
                            <Text style={[styles.buttonText, { color: theme.TERTIARY }]}>{negative}%</Text>
                            <Text style={{ color: theme.HINT }}>
                                <FormattedMessage
                                    defaultMessage='Negative'
                                    id='views.home.overview.trending-now.negative'
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
        marginVertical: spacing.SCALE_20,
    },
    titleText: {
        ...typography.FONT_BOLD,
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
        fontSize: typography.FONT_SIZE_12,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    detailsButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.SCALE_4,
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