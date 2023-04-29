import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Animated,
    Keyboard,
    Alert,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../navigation/AuthProvider';
import SubmitButton from 'components/buttons/submit-button';
import { colors, spacing, typography } from 'styles';
import IconButton from 'components/buttons/icon-button';

import GoBack from 'assets/icons/Go-back.svg';
import SmallLogo from 'assets/logo/logo-smaller.svg';
import Email from 'assets/icons/Email.svg';
import Password from 'assets/icons/Password.svg';
import { FormattedMessage } from 'react-intl';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './validationSchema'
import TextField from 'components/text-field';
import { SCREENS } from '@views/navigation/constants';

type LoginScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Login'>;

type LoginProps = {
    navigation: LoginScreenNavigationProp['navigation']
}

export default function Login({ navigation }: LoginProps) {
    const { login } = useContext(AuthContext);
    const { control, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit: SubmitHandler<FieldValues> = async ({ email, password }) => {
        try {
            await login(email, password);
        } catch (error: any) {
            console.log(error)
            if (error.code === 'auth/user-not-found') {
                setError('email', { message: 'User not found' });
            } else if (error.code === 'auth/wrong-password') {
                setError('password', { message: 'Password is incorrect' });
            } else if (error.code === 'auth/user-disabled') {
                setError('email', { message: 'This account has been disabled' });
            } else if (error.code === 'auth/invalid-email') {
                setError('email', { message: 'Email is not valid' });
            }
            else {
                setError('email', { message: 'Internal error, please try again later' });
            }
        }

    }



    const scaleValue = useRef(new Animated.Value(1)).current;
    const translateYValue = useRef(new Animated.Value(0)).current;

    const animationDuration = 400;
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                handleKeyboardOut();
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                handleKeyboardIn();
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const handleKeyboardIn = () => {
        Animated.parallel([
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: animationDuration,
                useNativeDriver: true,
            }),
            Animated.timing(translateYValue, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleKeyboardOut = () => {
        Animated.parallel([
            Animated.timing(scaleValue, {
                toValue: 0.5,
                duration: animationDuration,
                useNativeDriver: true,
            }),
            Animated.timing(translateYValue, {
                toValue: -70,
                duration: animationDuration,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <View>
                    <View style={styles.actionContainer}>
                        <View style={styles.actionContainerComponent} >
                            <IconButton
                                onPress={() => navigation.goBack()}
                                size={42}
                            >
                                <GoBack />
                            </IconButton>
                        </View>
                        <Animated.View style={{ transform: [{ scale: scaleValue }, { translateY: translateYValue }] }}>
                            <SmallLogo />
                        </Animated.View>
                        <View style={styles.actionContainerComponent} />
                    </View>
                    <Animated.View style={[styles.textContainer, { transform: [{ translateY: translateYValue }] }]}>
                        <Animated.View style={styles.textContainer}>
                            <Text style={styles.title}>
                                <FormattedMessage
                                    defaultMessage='Login'
                                    id='views.auth.login.login'
                                />
                            </Text>
                            <Text style={styles.subTitle}>
                                <FormattedMessage
                                    defaultMessage='Hi there! Please provide us with your information so we can personalize your experience.'
                                    id='views.auth.login.subtitle'
                                />
                            </Text>
                        </Animated.View>
                        <View style={styles.mainContent}>
                            <Controller
                                name='email'
                                rules={{
                                    required: true,
                                }}
                                defaultValue=''
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => {
                                    return (
                                        <TextField
                                            label={(
                                                <FormattedMessage
                                                    defaultMessage='Email'
                                                    id='views.auth.signup.email'
                                                />
                                            )}
                                            placeholder='johndoe@trademood.com'
                                            value={value}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            error={errors.email}
                                        >
                                            <Email />
                                        </TextField>

                                    )
                                }}
                            />

                            <Controller
                                name='password'
                                defaultValue=''
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => {
                                    return (
                                        <TextField
                                            label={(
                                                <FormattedMessage
                                                    defaultMessage='Password'
                                                    id='views.auth.signup.password'
                                                />
                                            )}
                                            actionLabel={
                                                <FormattedMessage
                                                    defaultMessage='Forgot password?'
                                                    id='views.auth.login.forgot-password'
                                                />
                                            }
                                            action={() => {
                                                navigation.navigate(SCREENS.AUTH.FORGOT_PASSWORD.ID)
                                            }}
                                            placeholder='********'
                                            value={value}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            error={errors.password}
                                            password
                                        >
                                            <Password />
                                        </TextField>
                                    )
                                }}
                            />
                        </View>
                    </Animated.View>
                </View>

                <Animated.View style={[{ transform: [{ translateY: translateYValue }] }]}>
                    <SubmitButton
                        isChevronDisplayed
                        label={
                            <FormattedMessage
                                defaultMessage='Login'
                                id='views.auth.login.submit-button'
                            />
                        }
                        onPress={handleSubmit(onSubmit)}
                    />
                </Animated.View>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        height: '100%',
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.SCALE_18,
        paddingVertical: spacing.SCALE_18,
        justifyContent: 'space-between',
        backgroundColor: colors.LIGHT_COLORS.BACKGROUND,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionContainerComponent: {
        flex: 1 / 5
    },
    textContainer: {
        justifyContent: 'center',
    },
    title: {
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_24,
        color: colors.LIGHT_COLORS.TERTIARY,
        textAlign: 'center',
        marginTop: spacing.SCALE_4
    },
    subTitle: {
        ...typography.FONT_REGULAR,
        fontWeight: typography.FONT_WEIGHT_REGULAR,
        fontSize: typography.FONT_SIZE_12,
        color: colors.LIGHT_COLORS.TERTIARY,
        textAlign: 'center',
    },
    mainContent: {
        marginBottom: spacing.SCALE_4,
    }
});
