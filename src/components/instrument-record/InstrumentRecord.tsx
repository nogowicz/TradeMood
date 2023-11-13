import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native'
import React from 'react'
import { constants, spacing, typography } from 'styles'
import { FormattedMessage } from 'react-intl';
import { useTheme } from 'store/ThemeContext';
import { InstrumentProps } from 'store/InstrumentProvider';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '@views/navigation/constants';
import { RootStackParamList } from '@views/navigation/Navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import CustomImage from 'components/custom-image';

import Arrow from 'assets/icons/Go-forward.svg';

const photoSize = 50;

export default function InstrumentRecord(instrument: InstrumentProps) {
    const { crypto, overallSentiment, sentimentDirection, photoUrl } = instrument;
    const theme = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const onPress = () => {
        navigation.navigate(SCREENS.HOME.INSTRUMENT_DETAILS.ID, { instrument: instrument });
    };

    const sentimentColors: Record<InstrumentProps['overallSentiment'], string> = {
        Positive: theme.POSITIVE,
        Neutral: theme.HINT,
        Negative: theme.NEGATIVE,
    };

    const sentimentMessages: Record<InstrumentProps['overallSentiment'], string> = {
        Positive: 'views.home.overview.trending-now.positive',
        Neutral: 'views.home.overview.trending-now.neutral',
        Negative: 'views.home.overview.trending-now.negative',
    };

    const arrowDirections: Record<InstrumentProps['sentimentDirection'], string> = {
        up: '-90deg',
        steady: '0deg',
        down: '90deg',
    };

    const arrowColors: Record<InstrumentProps['sentimentDirection'], string> = {
        up: theme.POSITIVE,
        steady: theme.HINT,
        down: theme.NEGATIVE,
    };

    return (
        <TouchableOpacity
            style={[styles.container, { borderColor: theme.LIGHT_HINT }]}
            activeOpacity={constants.ACTIVE_OPACITY.MEDIUM}
            onPress={onPress}
        >
            <CustomImage
                source={{ uri: photoUrl }}
                style={{ width: photoSize, height: photoSize, borderRadius: photoSize / 2 }}
            />
            <View style={styles.middleContainer}>
                <Text style={[styles.titleText, { color: theme.TERTIARY }]}>{crypto}</Text>
                <Text style={{
                    ...styles.titleText,
                    color: sentimentColors[overallSentiment],
                }}>
                    <FormattedMessage
                        defaultMessage={overallSentiment}
                        id={sentimentMessages[overallSentiment]}
                    />
                </Text>
            </View>
            <View testID='sentimentDirection'>
                <View style={{
                    ...styles.arrowContainer,
                    transform: [{ rotate: arrowDirections[sentimentDirection] }],
                }}>
                    <Arrow style={{ color: arrowColors[sentimentDirection] }} />
                </View>
            </View>
        </TouchableOpacity >
    );
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
});