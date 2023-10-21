import { Animated, Easing, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { constants, spacing, typography } from 'styles';
import { useTheme } from 'store/themeContext';

type ActivityIndicatorProps = {
    text: String;
};

export default function ActivityIndicator({ text }: ActivityIndicatorProps) {
    const theme = useTheme();
    const lowestScale = 0.4;
    const scaleAnim = useRef(new Animated.Value(lowestScale)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(
                    scaleAnim,
                    {
                        toValue: 1,
                        duration: 800,
                        easing: Easing.elastic(2),
                        useNativeDriver: true
                    }
                ),
                Animated.timing(
                    scaleAnim,
                    {
                        toValue: lowestScale,
                        duration: 800,
                        easing: Easing.back(2),
                        useNativeDriver: true
                    }
                )
            ])
        ).start();
    }, [scaleAnim]);

    return (
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: spacing.SCALE_12,
            flex: 1,
        }}>
            <Animated.View
                style={{
                    ...styles.indicator,
                    scaleX: scaleAnim,
                    scaleY: scaleAnim,
                    backgroundColor: theme.PRIMARY,
                    opacity: constants.ACTIVE_OPACITY.LOW
                }} />
            <Text style={{
                color: theme.TERTIARY,
                fontSize: typography.FONT_SIZE_18,
            }}>
                {text}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    indicator: {
        borderRadius: constants.BORDER_RADIUS.CIRCLE,
        width: constants.ICON_SIZE.ACTIVITY_INDICATOR,
        height: constants.ICON_SIZE.ACTIVITY_INDICATOR,
    },
})