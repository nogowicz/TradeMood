import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { constants, spacing } from 'styles'
import { useTheme } from 'store/ThemeContext'

export function SkeletonContent() {
    const theme = useTheme();
    return (
        <SkeletonPlaceholder highlightColor={theme.PRIMARY} backgroundColor={theme.LIGHT_HINT}>
            <SkeletonPlaceholder.Item
                flexDirection="column"
                alignItems="stretch"
                padding={spacing.SCALE_20}
                marginVertical={spacing.SCALE_10}
                borderRadius={spacing.SCALE_10}
                borderWidth={constants.STROKE_WIDTH.MEDIUM}
                borderColor={theme.LIGHT_HINT}
            >
                <SkeletonPlaceholder.Item gap={spacing.SCALE_20} flexDirection='row' alignItems='center'>
                    <SkeletonPlaceholder.Item width={constants.ICON_SIZE.POST_IMAGE} height={constants.ICON_SIZE.POST_IMAGE} borderRadius={constants.ICON_SIZE.POST_IMAGE / 2} />
                    <SkeletonPlaceholder.Item width={spacing.SCALE_120} height={spacing.SCALE_16} borderRadius={constants.BORDER_RADIUS.SKELETON_4} />
                </SkeletonPlaceholder.Item>

                <SkeletonPlaceholder.Item marginTop={spacing.SCALE_20} marginBottom={spacing.SCALE_20} width="100%" height={spacing.SCALE_16} borderRadius={constants.BORDER_RADIUS.SKELETON_4} />
                <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" justifyContent="space-between">
                    <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                        <SkeletonPlaceholder.Item
                            width={constants.ICON_SIZE.ICON_MEDIUM}
                            height={constants.ICON_SIZE.ICON_MEDIUM}
                            borderRadius={(constants.ICON_SIZE.ICON_MEDIUM) / 2}
                        />
                        <SkeletonPlaceholder.Item marginLeft={spacing.SCALE_10} width={spacing.SCALE_40} height={spacing.SCALE_16} borderRadius={constants.BORDER_RADIUS.SKELETON_4} />
                    </SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item width={spacing.SCALE_100} height={spacing.SCALE_16} borderRadius={constants.BORDER_RADIUS.SKELETON_4} />
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    )
}
