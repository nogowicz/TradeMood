import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { constants, spacing, typography } from 'styles'
import { useTheme } from 'store/ThemeContext'

export default function SkeletonContent() {
    const theme = useTheme();
    return (
        <SkeletonPlaceholder highlightColor={theme.PRIMARY} backgroundColor={theme.LIGHT_HINT}>
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <SkeletonPlaceholder.Item width={spacing.SCALE_100} height={spacing.SCALE_10} borderRadius={constants.BORDER_RADIUS.SKELETON_4} />
                    <SkeletonPlaceholder.Item width={spacing.SCALE_60} height={spacing.SCALE_10} borderRadius={constants.BORDER_RADIUS.SKELETON_4} marginTop={spacing.SCALE_10} />
                </View>
                <SkeletonPlaceholder.Item
                    width={spacing.SCALE_40}
                    height={spacing.SCALE_40}
                    borderRadius={spacing.SCALE_40 / 2}
                />
            </View>
        </SkeletonPlaceholder>

    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: constants.BORDER_RADIUS.PROFILE_BAR,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: spacing.SCALE_8,
        gap: spacing.SCALE_8,
    },
    textContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },

})