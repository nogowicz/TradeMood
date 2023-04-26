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
    useEffect,
    useState
} from 'react';


import { colors, constants, spacing, typography } from 'styles';

import PasswordVisible from 'assets/icons/Password-visible.svg';
import PasswordInvisible from 'assets/icons/Password-invisible.svg';
import { FormattedMessage } from 'react-intl';


type TextFieldProps = {
    style?: ViewStyle;
    name: string;
    label?: ReactNode;
    value: string;
    children: ReactNode;
    onBlur?: () => void;
    onChangeText: (value: any) => void;
    actionLabel?: string;
    action?: () => any;
    placeholder?: string;
    error?: any;
    props?: TextInputProps;
    autoCapitalize?: any;
    password?: boolean;
}

export default function TextField({
    style,
    name,
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
    const [defaultMessage, setDefaultMessage] = useState('')
    const [id, setId] = useState('views.auth.errors-basic-error');

    useEffect(() => {

        if (error) {
            setDefaultMessage(error.message)
            if (error.message === "Your first name is too long") {
                setId("views.auth.errors-first-name-too-long");
            } else if (error.message === "Please enter valid first name") {
                setId("views.auth.errors-first-name-invalid");
            } else if (error.message === "Please provide your first name") {
                setId("views.auth.errors-first-name-empty");
            } else if (error.message === "Your last name is too long") {
                setId("views.auth.errors-last-name-too-long");
            } else if (error.message === "Please enter valid last name") {
                setId("views.auth.errors-last-name-invalid");
            } else if (error.message === "Please provide your last name") {
                setId("views.auth.errors-last-name-empt");
            } else if (error.message === "Email is not valid") {
                setId("views.auth.errors-email-invalid");
            } else if (error.message === "User not found") {
                setId("views.auth.errors-user-not-found");
            } else if (error.message === "This account has been disabled") {
                setId("views.auth.errors-user-disabled");
            } else if (error.message === "Please provide your email") {
                setId("views.auth.errors-email-empty");
            } else if (error.message === "That email address is already in use") {
                setId("views.auth.errors-email-in-use");
            } else if (error.message === "Password must be at lest 6 characters") {
                setId("views.auth.errors-password-too-short");
            } else if (error.message === "Please provide your password") {
                setId("views.auth.errors-password-empty");
            } else if (error.message === "Password is incorrect") {
                setId("views.auth.errors-wrong-password");
            } else if (error.message === "Field can not be empty") {
                setId("views.auth.errors-confirm-password-empty");
            } else if (error.message === "Password must match") {
                setId("views.auth.errors-confirm-password-different");
            } else if (error.message === "Password is too weak") {
                setId("views.auth.errors-weak-password");
            } else if (error.message === "Internal error, please try again later") {
                setId("views.auth.errors-internal-error");
            } else {
                setId("views.auth.errors-basic-error");
            }
        }



    }, [error]);



    return (
        <View style={styles.root}>
            {(actionLabel || label) && (
                <View style={styles.actionContainer}>
                    <Text style={styles.label}>{label}</Text>
                    {actionLabel && <Text style={styles.action}>{actionLabel}</Text>}
                </View>
            )}
            <View style={[styles.container, focus ? styles.focus : {}, (error) ? styles.error : {}, (error) ? styles.containerWithError : {}]}>
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
            {(error) &&
                <Text style={styles.errorLabel}>
                    {(error) &&
                        <FormattedMessage
                            defaultMessage={defaultMessage}
                            id={`${id}`}
                        />
                    }
                </Text>}
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