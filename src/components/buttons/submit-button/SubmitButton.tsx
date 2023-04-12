import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
} from 'react-native'
import { Dispatch, ReactNode, SetStateAction } from 'react'

import { colors, constants, spacing, typography } from '../../../styles';

import GoForward from '../../../assets/icons/Go-forward.svg';


type SubmitButtonProps = {
    label: ReactNode,
    activeOpacity?: number,
    onPress: Dispatch<SetStateAction<number>> | (any),
    isChevronDisplayed?: boolean,
    disabled?: boolean,
}

export default function SubmitButton({
    label,
    activeOpacity = 0.75,
    onPress,
    isChevronDisplayed = false,
    disabled = false
}: SubmitButtonProps) {
    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={disabled ? null : onPress}
            style={[styles.container, disabled ? styles.disabled : {}]}
        >
            <View style={styles.actionLeftContainer} />
            <Text style={[styles.label]}>{label}</Text>
            <View style={styles.actionRightContainer}>
                {isChevronDisplayed ?
                    <GoForward /> : null}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.LIGHT_COLORS.TERTIARY,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.SCALE_12,
        paddingHorizontal: spacing.SCALE_18,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
    },
    label: {
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_24,
        color: colors.LIGHT_COLORS.BACKGROUND
    },
    actionLeftContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    actionRightContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    disabled: {
        opacity: 0.75
    },
});