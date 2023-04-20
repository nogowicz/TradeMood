import {
    View,
    TextInput,
    ViewStyle,
    TextInputProps,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import {
    ReactNode,
    useState
} from 'react';


import { colors, constants, spacing, typography } from 'styles';

import PasswordVisible from 'assets/icons/Password-visible.svg';
import PasswordInvisible from 'assets/icons/Password-invisible.svg';

type TextFieldProps = {
    style?: ViewStyle
    label?: ReactNode,
    value: string,
    children: ReactNode,
    onBlur?: () => void,
    onChangeText: (value: any) => void,
    actionLabel?: string,
    action?: () => any,
    placeholder?: string,
    error?: any,
    props?: TextInputProps,
    autoCapitalize?: any,
    password?: boolean,
}

export default function TextField({
    style,
    label,
    children,
    actionLabel,
    action,
    placeholder,
    error,
    password = false,
    ...props
}: TextFieldProps) {
    const [focus, setFocus] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    return (
        <View style={styles.root}>
            {(actionLabel || label) && (
                <View style={styles.actionContainer}>
                    <Text style={styles.label}>{label}</Text>
                    {actionLabel && <Text style={styles.action}>{actionLabel}</Text>}
                </View>
            )}
            <View style={[styles.container, focus ? styles.focus : {}, error ? styles.error : {}, error ? styles.containerWithError : {}]}>
                {children}
                <TextInput
                    {...props}
                    selectionColor={colors.LIGHT_COLORS.TERTIARY}
                    placeholderTextColor={colors.LIGHT_COLORS.HINT}
                    placeholder={placeholder}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    style={[styles.textInput]}
                    secureTextEntry={(password && secureTextEntry)}
                />
                {password ?
                    <TouchableOpacity
                        onPress={() => setSecureTextEntry(!secureTextEntry)}
                        activeOpacity={0.7}
                    >
                        {secureTextEntry ?
                            <PasswordVisible /> : <PasswordInvisible />}
                    </TouchableOpacity>
                    : null
                }
            </View>
            {error && <Text style={styles.errorLabel}>{error?.message}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        marginVertical: spacing.SCALE_4,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: constants.BORDER_RADIUS.INPUT,
        paddingHorizontal: spacing.SCALE_12,
        paddingVertical: spacing.SCALE_4,
        justifyContent: 'space-between',
    },
    containerWithError: {

    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.SCALE_4,
        paddingHorizontal: spacing.SCALE_12,
    },
    label: {
        ...typography.FONT_BOLD,
        color: colors.LIGHT_COLORS.TERTIARY,
        fontSize: typography.FONT_SIZE_14,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    action: {
        fontSize: typography.FONT_SIZE_14,
        ...typography.FONT_BOLD,
        fontWeight: 'bold',
        color: colors.LIGHT_COLORS.PRIMARY,
    },
    textInput: {
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_16,
        marginHorizontal: spacing.SCALE_12,
        color: colors.LIGHT_COLORS.TERTIARY,
        flex: 1,
    },
    focus: {
        borderColor: colors.LIGHT_COLORS.PRIMARY,
    },
    error: {
        borderColor: 'red',
    },
    errorLabel: {
        color: 'red',
        fontSize: typography.FONT_SIZE_12,
        paddingLeft: spacing.SCALE_8
    },
});