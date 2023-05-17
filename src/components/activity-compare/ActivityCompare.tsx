import { StyleSheet, Text, View } from 'react-native'
import React, { ReactNode } from 'react'
import { colors, constants, spacing, typography } from 'styles';
import Arrow from 'assets/icons/Go-forward.svg';

type ActivityCompareProps = {
    name: string | ReactNode;
    activity: number;
}

export default function ActivityCompare({ name, activity }: ActivityCompareProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{name}</Text>
            <View style={styles.activityContainer}>
                {activity > 0 &&
                    <View style={[
                        styles.arrowContainer,
                        {
                            transform: [{ rotate: '-90deg' }],
                        }]}>
                        <Arrow style={{ color: colors.LIGHT_COLORS.POSITIVE }} />
                    </View>
                }
                {activity === 0 &&
                    <View style={[
                        styles.arrowContainer,
                        {
                            transform: [{ rotate: '0deg' }],
                        }]}>
                        <Arrow style={{ color: colors.LIGHT_COLORS.HINT }} />
                    </View>
                }
                {activity < 0 &&
                    <View style={[
                        styles.arrowContainer,
                        {
                            transform: [{ rotate: '90deg' }],
                        }]}>
                        <Arrow style={{ color: colors.LIGHT_COLORS.NEGATIVE }} />
                    </View>
                }
                <Text style={[
                    activity > 0 && { color: colors.LIGHT_COLORS.POSITIVE },
                    activity === 0 && { color: colors.LIGHT_COLORS.HINT },
                    activity < 0 && { color: colors.LIGHT_COLORS.NEGATIVE }
                    ,
                    styles.activityText
                ]}>{activity}%</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colors.LIGHT_COLORS.LIGHT_HINT,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        flex: 1,
        padding: spacing.SCALE_12,
        gap: spacing.SCALE_12,
    },
    text: {
        color: colors.LIGHT_COLORS.TERTIARY,
        fontSize: typography.FONT_SIZE_20,
        textAlign: 'center',
    },
    arrowContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityContainer: {
        flexDirection: 'row',
        gap: spacing.SCALE_12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityText: {
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_20,
    }
})