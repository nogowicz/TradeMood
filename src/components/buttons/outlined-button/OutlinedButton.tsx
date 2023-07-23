import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
} from 'react-native'
import { Dispatch, ReactNode, SetStateAction, useContext } from 'react'

import { constants, spacing, typography } from '../../../styles';

import GoForward from '../../../assets/icons/Go-forward.svg';
import { themeContext } from 'store/themeContext';


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
    const theme = useContext(themeContext);
    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onPress}
            style={[styles.container, { backgroundColor: theme.BACKGROUND, borderColor: theme.HINT }]}
        >
            <View style={styles.actionLeftContainer} />
            <Text style={[styles.label, { color: theme.TERTIARY }]}>{label}</Text>
            <View style={styles.actionRightContainer}>
                {isChevronDisplayed ?
                    <GoForward style={{ color: theme.TERTIARY }} /> : null}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
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