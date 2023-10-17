import { StyleSheet, Text, View } from 'react-native'
import React, { ReactNode } from 'react'
import { constants, spacing, typography } from 'styles';
import Arrow from 'assets/icons/Go-forward.svg';
import { useTheme } from 'store/themeContext';

type ActivityCompareProps = {
    name: string | ReactNode;
    activity: number;
}

export default function ActivityCompare({ name, activity }: ActivityCompareProps) {
    const theme = useTheme();;
    return (
        <View style={[styles.container, { borderColor: theme.LIGHT_HINT }]}>
            <Text style={[styles.text, { color: theme.TERTIARY }]}>{name}</Text>
            <View style={styles.activityContainer}>
                {activity > 0 &&
                    <View style={[
                        styles.arrowContainer,
                        {
                            transform: [{ rotate: '-90deg' }],
                        }]}>
                        <Arrow style={{ color: theme.POSITIVE }} />
                    </View>
                }
                {activity === 0 &&
                    <View style={[
                        styles.arrowContainer,
                        {
                            transform: [{ rotate: '0deg' }],
                        }]}>
                        <Arrow style={{ color: theme.HINT }} />
                    </View>
                }
                {activity < 0 &&
                    <View style={[
                        styles.arrowContainer,
                        {
                            transform: [{ rotate: '90deg' }],
                        }]}>
                        <Arrow style={{ color: theme.NEGATIVE }} />
                    </View>
                }
                <Text style={[
                    activity > 0 && { color: theme.POSITIVE },
                    activity === 0 && { color: theme.HINT },
                    activity < 0 && { color: theme.NEGATIVE }
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
        borderRadius: constants.BORDER_RADIUS.BUTTON,
        flex: 1,
        padding: spacing.SCALE_12,
        gap: spacing.SCALE_12,
    },
    text: {
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