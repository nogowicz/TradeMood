import { StyleSheet, View } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { constants, spacing, typography } from 'styles'
import { useTheme } from 'store/ThemeContext';

export function SkeletonContent() {
    const theme = useTheme();
    return (
        <SkeletonPlaceholder>
            <View style={{
                ...styles.container,
                borderColor: theme.HINT
            }}>
                <View style={styles.topContainer}>
                    <SkeletonPlaceholder.Item width={spacing.SCALE_120} height={spacing.SCALE_20} borderRadius={constants.BORDER_RADIUS.SKELETON_4} />
                    <SkeletonPlaceholder.Item width={spacing.SCALE_80} height={spacing.SCALE_30} borderRadius={constants.BORDER_RADIUS.SKELETON_4} marginLeft={spacing.SCALE_20} />
                </View>
                <View style={styles.bottomContainer}>
                    <SkeletonPlaceholder.Item width={spacing.SCALE_120} height={spacing.SCALE_120} borderRadius={spacing.SCALE_60} />
                    <View>
                        <SkeletonPlaceholder.Item width={spacing.SCALE_80} height={spacing.SCALE_20} borderRadius={constants.BORDER_RADIUS.SKELETON_4} />
                        <View style={styles.legendContainer}>
                            <SkeletonPlaceholder.Item width={spacing.SCALE_10} height={spacing.SCALE_10} borderRadius={constants.BORDER_RADIUS.SKELETON_5} />
                            <SkeletonPlaceholder.Item width={spacing.SCALE_60} height={spacing.SCALE_20} borderRadius={constants.BORDER_RADIUS.SKELETON_5} marginLeft={spacing.SCALE_10} />
                        </View>
                        <View style={styles.legendContainer}>
                            <SkeletonPlaceholder.Item width={spacing.SCALE_10} height={spacing.SCALE_10} borderRadius={constants.BORDER_RADIUS.SKELETON_5} />
                            <SkeletonPlaceholder.Item width={spacing.SCALE_60} height={spacing.SCALE_20} borderRadius={constants.BORDER_RADIUS.SKELETON_5} marginLeft={spacing.SCALE_10} />
                        </View>
                        <View style={styles.legendContainer}>
                            <SkeletonPlaceholder.Item width={spacing.SCALE_10} height={spacing.SCALE_10} borderRadius={constants.BORDER_RADIUS.SKELETON_5} />
                            <SkeletonPlaceholder.Item width={spacing.SCALE_60} height={spacing.SCALE_20} borderRadius={constants.BORDER_RADIUS.SKELETON_5} marginLeft={spacing.SCALE_10} />
                        </View>
                    </View>
                </View>
            </View>
        </SkeletonPlaceholder>
    );
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
        width: spacing.SCALE_10,
        height: spacing.SCALE_10,
        borderRadius: constants.BORDER_RADIUS.SKELETON_5,
    },
    legendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.SCALE_12,
        marginTop: spacing.SCALE_4,
    },
})