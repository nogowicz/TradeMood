import {
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native'
import { ReactNode } from 'react'


import { spacing, typography } from '../../../styles';
import { useTheme } from 'store/themeContext';

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
    const theme = useTheme();
    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onPress}
            style={styles.container}
        >
            <Text style={[styles.label, { color: theme.HINT }]}>{label}</Text>
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
    },
});