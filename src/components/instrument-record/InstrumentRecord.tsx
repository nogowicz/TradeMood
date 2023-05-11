import { StyleSheet, Text, View, TouchableOpacity, Image, } from 'react-native'
import React from 'react'
import { constants, spacing, colors, typography } from 'styles'
import { FormattedMessage } from 'react-intl';

import Placeholder from 'assets/icons/crypto-placeholder.svg'
import Arrow from 'assets/icons/Go-forward.svg';
import FastImage from 'react-native-fast-image';

type InstrumentRecordProps = {
    crypto: string;
    sentiment: string;
    sentimentDirection: string;
    photoUrl: string;
}
const photoSize = 50;
export default function InstrumentRecord({ crypto, sentiment, sentimentDirection, photoUrl }: InstrumentRecordProps) {
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.6}>
            {photoUrl ?
                <FastImage source={{ uri: photoUrl }} style={{ width: photoSize, height: photoSize }} />
                : <Placeholder width={photoSize} height={photoSize} />}
            <View style={styles.middleContainer}>
                <Text style={styles.titleText}>{crypto}</Text>
                <Text style={[styles.titleText,
                sentiment === 'Positive' && { color: colors.LIGHT_COLORS.POSITIVE },
                sentiment === 'Neutral' && { color: colors.LIGHT_COLORS.HINT },
                sentiment === 'Negative' && { color: colors.LIGHT_COLORS.NEGATIVE }
                ]}>
                    {sentiment === "Positive" &&
                        <FormattedMessage
                            defaultMessage='Positive'
                            id='views.home.overview.trending-now.positive'
                        />
                    }

                    {sentiment === "Neutral" &&
                        <FormattedMessage
                            defaultMessage='Neutral'
                            id='views.home.overview.trending-now.neutral'
                        />
                    }

                    {sentiment === "Negative" &&
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
                        <Arrow style={{ color: colors.LIGHT_COLORS.POSITIVE }} />
                    </View>
                }
                {sentimentDirection === 'steady' &&
                    <View style={[
                        styles.arrowContainer,
                        {
                            transform: [{ rotate: '0deg' }],
                        }]}>
                        <Arrow style={{ color: colors.LIGHT_COLORS.HINT }} />
                    </View>
                }
                {sentimentDirection === 'down' &&
                    <View style={[
                        styles.arrowContainer,
                        {
                            transform: [{ rotate: '90deg' }],
                        }]}>
                        <Arrow style={{ color: colors.LIGHT_COLORS.NEGATIVE }} />
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
        borderColor: colors.LIGHT_COLORS.LIGHT_HINT,
        marginVertical: spacing.SCALE_8,
        paddingHorizontal: spacing.SCALE_20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleText: {
        ...typography.FONT_BOLD,
        color: colors.LIGHT_COLORS.TERTIARY,
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