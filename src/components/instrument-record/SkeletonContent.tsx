import { StyleSheet, View } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { constants, spacing, typography } from 'styles';

export function SkeletonContent() {
  return (
    <SkeletonPlaceholder>
      <View style={styles.container}>
        <SkeletonPlaceholder.Item
          width={spacing.SCALE_50}
          height={spacing.SCALE_50}
          borderRadius={spacing.SCALE_50 / 2}
        />
        <View style={styles.middleContainer}>
          <SkeletonPlaceholder.Item width={spacing.SCALE_120} height={spacing.SCALE_20} borderRadius={constants.BORDER_RADIUS.SKELETON_4} />
          <SkeletonPlaceholder.Item width={spacing.SCALE_80} height={spacing.SCALE_20} borderRadius={constants.BORDER_RADIUS.SKELETON_4} marginTop={spacing.SCALE_10} />
        </View>
        <View style={styles.arrowContainer}>
          <SkeletonPlaceholder.Item width={spacing.SCALE_30} height={spacing.SCALE_30} borderRadius={constants.BORDER_RADIUS.SKELETON_15} />
        </View>
      </View>
    </SkeletonPlaceholder>

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
    width: spacing.SCALE_50,
    alignItems: 'center',
    justifyContent: 'center',
  }
})