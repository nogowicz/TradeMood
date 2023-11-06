import { StyleSheet, Text, View, TouchableOpacity, Image, } from 'react-native'
import React from 'react'
import { constants, spacing, typography } from 'styles'
import { FormattedMessage } from 'react-intl';

import Placeholder from 'assets/icons/crypto-placeholder.svg'
import Arrow from 'assets/icons/Go-forward.svg';;
import { useTheme } from 'store/ThemeContext';

type InstrumentRecordProps = {
    crypto: string;
    overallSentiment: string;
    sentimentDirection: string;
    photoUrl: string;
    onPress: () => void;
}
const photoSize = 50;
export default function InstrumentRecord({ crypto, overallSentiment, sentimentDirection, photoUrl, onPress }: InstrumentRecordProps) {
    const theme = useTheme();
    return (
        <TouchableOpacity
            style={[styles.container, { borderColor: theme.LIGHT_HINT }]}
            activeOpacity={0.6}
            onPress={onPress}
        >
            {photoUrl ?
                <Image
                    source={{ uri: photoUrl }}
                    style={{
                        width: photoSize,
                        height: photoSize,
                        borderRadius: photoSize / 2,
                    }} />
                : <Placeholder width={photoSize} height={photoSize} />}
            <View style={styles.middleContainer}>
                <Text style={[styles.titleText, { color: theme.TERTIARY }]}>{crypto}</Text>
                <Text style={[styles.titleText, { color: theme.TERTIARY },
                overallSentiment === 'Positive' && { color: theme.POSITIVE },
                overallSentiment === 'Neutral' && { color: theme.HINT },
                overallSentiment === 'Negative' && { color: theme.NEGATIVE }
                ]}>
                    {overallSentiment === "Positive" &&
                        <FormattedMessage
                            defaultMessage='Positive'
                            id='views.home.overview.trending-now.positive'
                        />
                    }

                    {overallSentiment === "Neutral" &&
                        <FormattedMessage
                            defaultMessage='Neutral'
                            id='views.home.overview.trending-now.neutral'
                        />
                    }

                    {overallSentiment === "Negative" &&
                        <FormattedMessage
                            defaultMessage='Negative'
                            id='views.home.overview.trending-now.negative'
                        />
                    }
                </Text>
            </View>
            <View>
                {sentimentDirection === 'up' &&
                    <View style={[
                        styles.arrowContainer,
                        {
                            transform: [{ rotate: '-90deg' }],
                        }]}>
                        <Arrow style={{ color: theme.POSITIVE }} />
                    </View>
                }
                {sentimentDirection === 'steady' &&
                    <View style={[
                        styles.arrowContainer,
                        {
                            transform: [{ rotate: '0deg' }],
                        }]}>
                        <Arrow style={{ color: theme.HINT }} />
                    </View>
                }
                {sentimentDirection === 'down' &&
                    <View style={[
                        styles.arrowContainer,
                        {
                            transform: [{ rotate: '90deg' }],
                        }]}>
                        <Arrow style={{ color: theme.NEGATIVE }} />
                    </View>
                }
            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        paddingVertical: spacing.SCALE_12,
        marginVertical: spacing.SCALE_8,
        paddingHorizontal: spacing.SCALE_20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleText: {
        ...typography.FONT_BOLD,
        fontSize: typography.FONT_SIZE_16,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    middleContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    arrowContainer: {
        width: photoSize,
        alignItems: 'center',
        justifyContent: 'center',
    }
})