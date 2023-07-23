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
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState
} from 'react';


import { constants, spacing, typography } from 'styles';

import PasswordVisible from 'assets/icons/Password-visible.svg';
import PasswordInvisible from 'assets/icons/Password-invisible.svg';
import Clear from 'assets/icons/Clear.svg';
import { FormattedMessage } from 'react-intl';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { themeContext } from 'store/themeContext';



type ErrorsType = {
    [key: string]: string;
};

type TextFieldProps = {
    style?: ViewStyle;
    label?: ReactNode;
    value: string;
    children?: ReactNode;
    onBlur?: () => void;
    onChangeText: (value: string) => void;
    actionLabel?: ReactNode;
    action?: () => void;
    placeholder?: string;
    error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
    props?: TextInputProps;
    autoCapitalize?: any;
    password?: boolean;
    editable?: boolean;
    clear?: boolean;
    onClear?: Dispatch<SetStateAction<string>>;
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
    clear = false,
    editable = true,
    onClear,
    ...props
}: TextFieldProps) {
    const [focus, setFocus] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [defaultMessage, setDefaultMessage] = useState('')
    const [id, setId] = useState('views.auth.errors.basic-error');
    const theme = useContext(themeContext);



    const errors: ErrorsType = {
        "Your first name is too long": "views.auth.errors.first-name.too-long",
        "Please enter valid first name": "views.auth.errors.first-name.invalid",
        "Please provide your first name": "views.auth.errors.first-name.empty",
        "Your last name is too long": "views.auth.errors.last-name.too-long",
        "Please enter valid last name": "views.auth.errors.last-name.invalid",
        "Please provide your last name": "views.auth.errors.last-name.empty",
        "Email is not valid": "views.auth.errors.email.invalid",
        "User not found": "views.auth.errors.user.not-found",
        "This account has been disabled": "views.auth.errors.user.disabled",
        "Please provide your email": "views.auth.errors.email.empty",
        "That email address is already in use": "views.auth.errors.email.in-use",
        "Password must be at least 6 characters": "views.auth.errors.password.too-short",
        "Please provide your password": "views.auth.errors.password.empty",
        "Password is incorrect": "views.auth.errors.wrong-password",
        "Field cannot be empty": "views.auth.errors.confirm-password.empty",
        "Password must match": "views.auth.errors.confirm-password.different",
        "Password is too weak": "views.auth.errors.weak-password",
        "Internal error, please try again later": "views.auth.errors.internal-error",
        "This operation requires re-authentication to ensure it's you": "views.home.profile.edit-email.error.re-authentication",
    };

    useEffect(() => {
        if (error) {
            console.log(error)
            setDefaultMessage(error.message as string);
            setId(errors[error.message as string]);
        } else {
            setId("views.auth.errors.basic-error");
        }
    }, [error, errors]);




    return (
        <View style={styles.root}>
            {(actionLabel || label) && (
                <View style={styles.actionContainer}>
                    <Text style={[styles.label, { color: theme.TERTIARY }]}>{label}</Text>
                    {actionLabel &&
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={action}
                        >
                            <Text style={[styles.action, { color: theme.TERTIARY }]}>{actionLabel}</Text>
                        </TouchableOpacity>
                    }
                </View>
            )}
            <View style={[styles.container, { borderColor: theme.LIGHT_HINT }, focus ? { borderColor: theme.PRIMARY } : {}, (error) ? styles.error : {}, (error) ? styles.containerWithError : {}]}>
                {children}
                <TextInput
                    {...props}
                    editable={editable}
                    selectionColor={theme.PRIMARY}
                    placeholderTextColor={theme.HINT}
                    placeholder={placeholder}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    style={[styles.textInput, { color: theme.TERTIARY }]}
                    secureTextEntry={(password && secureTextEntry)}

                />
                {password ?
                    <TouchableOpacity
                        onPress={() => setSecureTextEntry(!secureTextEntry)}
                        activeOpacity={0.7}
                    >
                        {secureTextEntry ?
                            <PasswordVisible strokeWidth={1.5} stroke={theme.TERTIARY} /> : <PasswordInvisible strokeWidth={1.5} stroke={theme.TERTIARY} />}
                    </TouchableOpacity>
                    : null
                }
                {clear ?
                    <TouchableOpacity
                        onPress={() => {
                            if (onClear) {
                                onClear('')
                            }
                        }}
                        activeOpacity={0.7}
                    >
                        <Clear stroke={theme.TERTIARY} />
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
        fontSize: typography.FONT_SIZE_14,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    action: {
        fontSize: typography.FONT_SIZE_14,
        ...typography.FONT_BOLD,
        fontWeight: 'bold',
    },
    textInput: {
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_16,
        marginHorizontal: spacing.SCALE_12,
        flex: 1,
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