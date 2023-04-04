import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
} from 'react-native'
import { Dispatch, ReactNode, SetStateAction } from 'react'

import { colors, constants, spacing, typography } from '../../../styles';

import GoForward from '../../../assets/icons/Go-forward-black.svg';


type OutlinedButtonProps = {
    label: ReactNode,
    activeOpacity?: number,
    onPress: Dispatch<SetStateAction<number>> | (any),
    isChevronDisplayed?: boolean
}

export default function OutlinedButton({
    label,
    activeOpacity = 0.75,
    onPress,
    isChevronDisplayed = false,
}: OutlinedButtonProps) {
    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onPress}
            style={styles.container}
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
        backgroundColor: colors.LIGHT_COLORS.BACKGROUND,
        borderWidth: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.SCALE_8,
        paddingHorizontal: spacing.SCALE_18,
        borderRadius: constants.BORDER_RADIUS.BUTTON,
    },
    label: {
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_24,
        color: colors.LIGHT_COLORS.TERTIARY
    },
    actionLeftContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    actionRightContainer: {
        flex: 1,
        alignItems: 'flex-end',
    }
});