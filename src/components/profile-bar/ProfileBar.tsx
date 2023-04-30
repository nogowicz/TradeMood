import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native'
import React from 'react'
import { colors, constants, spacing, typography } from 'styles'

type ProfileBarProps = {
    displayName: string | null | undefined;
    imageUrl: string | null | undefined;
    activeOpacity?: number;
}

export default function ProfileBar({ displayName, imageUrl, activeOpacity = 0.5 }: ProfileBarProps) {
    const imageSize = 40;
    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={activeOpacity}
        >
            <View style={styles.textContainer}>
                <Text style={styles.welcomeText}>Good Morning!</Text>
                <Text style={styles.displayName}>{displayName}</Text>
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