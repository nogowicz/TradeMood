import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native'
import React from 'react'
import { colors, constants, spacing, typography } from 'styles'
import { FormattedMessage } from 'react-intl';

type ProfileBarProps = {
    displayName: string | null | undefined;
    imageUrl: string | null | undefined;
    activeOpacity?: number;
    isAnonymous: boolean | undefined;
}

export default function ProfileBar({ displayName, imageUrl, activeOpacity = 0.5, isAnonymous }: ProfileBarProps) {
    const imageSize = 40;
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={activeOpacity}
        >
            <View style={styles.textContainer}>
                <Text style={styles.welcomeText}>
                    {(currentHour >= 5 && currentHour < 12) &&
                        <FormattedMessage
                            defaultMessage='Good Morning!'
                            id='views.home.welcome_text-good_morning'
                        />}
                    {(currentHour >= 12 && currentHour < 18) &&
                        <FormattedMessage
                            defaultMessage='Good Afternoon!'
                            id='views.home.welcome_text-good_afternoon'
                        />}
                    {(currentHour >= 18 && currentHour < 24) &&
                        <FormattedMessage
                            defaultMessage='Good evening!'
                            id='views.home.welcome_text-good_evening'
                        />}
                    {(currentHour >= 0 && currentHour < 5) &&
                        <FormattedMessage
                            defaultMessage='Hello!'
                            id='views.home.welcome_text-hello'
                        />}
                </Text>
                <Text style={styles.displayName}>
                    {isAnonymous ?
                        <FormattedMessage
                            defaultMessage='Stranger'
                            id='views.home.welcome_text-anonymous'
                        />
                        :
                        displayName}
                </Text>
            </View>
            <View
                style={{
                    width: imageSize,
                    height: imageSize,
                    borderRadius: imageSize / 2,
                    borderWidth: 1,
                    borderColor: colors.LIGHT_COLORS.HINT,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                {imageUrl ?
                    <Image
                        source={{ uri: imageUrl }}
                        style={{ width: imageSize, height: imageSize, borderRadius: imageSize / 2 }}
                    /> :
                    <Image
                        source={require('assets/profile/profile-picture.png')}
                        style={{ width: imageSize, height: imageSize, borderRadius: imageSize / 2 }}
                    />}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colors.LIGHT_COLORS.LIGHT_HINT,
        borderRadius: constants.BORDER_RADIUS.PROFILE_BAR,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: spacing.SCALE_8,
        gap: spacing.SCALE_8,
    },
    welcomeText: {
        ...typography.FONT_REGULAR,
        color: colors.LIGHT_COLORS.HINT,
        fontSize: typography.FONT_SIZE_10,
        fontWeight: typography.FONT_WEIGHT_REGULAR,
    },
    displayName: {
        ...typography.FONT_BOLD,
        color: colors.LIGHT_COLORS.TERTIARY,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_14,
    },
    textContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    }
})