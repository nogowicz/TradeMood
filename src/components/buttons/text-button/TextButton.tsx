import {
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native'
import { ReactNode } from 'react'


import { colors, constants, spacing, typography } from '../../../styles';

type TextButtonProps = {
    label: ReactNode,
    activeOpacity?: number,
    onPress: () => void,
}

export default function TextButton({
    label,
    activeOpacity = 0.75,
    onPress,
}: TextButtonProps) {
    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onPress}
            style={styles.container}
        >
            <Text style={[styles.label]}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: spacing.SCALE_8 + 20
    },
    label: {
        fontSize: typography.FONT_SIZE_16,
        fontWeight: typography.FONT_WEIGHT_SEMI_BOLD,
        color: colors.LIGHT_COLORS.HINT
    },
});