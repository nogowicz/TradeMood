import { Animated, Keyboard, SafeAreaView, StyleSheet, Text, View, } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from 'store/AuthProvider';
import IconButton from 'components/buttons/icon-button';
import SubmitButton from 'components/buttons/submit-button';
import TextField from 'components/text-field';
import { useForm, SubmitHandler, FieldValues, Controller } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { spacing, typography } from 'styles';
import { schema } from '../edit-password/validationSchema';

import GoBack from 'assets/icons/Go-back.svg';
import SmallLogo from 'assets/logo/logo-smaller.svg';
import Password from 'assets/icons/Password.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import { useTheme } from 'store/ThemeContext';

type EditPasswordScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'EditPassword'>;

type EditEmailProps = {
    navigation: EditPasswordScreenNavigationProp['navigation']
}

export default function EditPassword({ navigation }: EditEmailProps) {
    const [loading, setLoading] = useState(false);
    const [messageVisible, setMessageVisible] = useState(false);
    const { updatePassword } = useAuth();
    const theme = useTheme();
    const { control, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit: SubmitHandler<FieldValues> = async ({ newPassword }) => {
        setLoading(true);
        try {
            await updatePassword(newPassword)
                .then(() => {
                    setMessageVisible(true);
                    setLoading(false);
                    setTimeout(() => {
                        navigation.goBack();
                        setMessageVisible(false);
                    }, 3000)
                });
        } catch (error: any) {
            console.log(error)
            if (error.code === 'auth/weak-password') {
                setError('newPassword', { message: 'Password is too weak' })
            } else if (error.code === 'auth/requires-recent-login') {
                setError('newPassword', { message: "This operation requires re-authentication to ensure it's you" })
            } else {
                setError('newPassword', { message: 'Internal error, please try again later' });
            }
            setLoading(false);
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
        <SafeAreaView style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <View>
                    <View style={styles.actionContainer}>
                        <View style={styles.actionContainerComponent} >
                            <IconButton
                                onPress={() => navigation.goBack()}
                                size={42}
                            >
                                <GoBack fill={theme.TERTIARY} />
                            </IconButton>
                        </View>
                        <Animated.View style={{ transform: [{ scale: scaleValue }, { translateY: translateYValue }] }}>
                            <SmallLogo />
                        </Animated.View>
                        <View style={styles.actionContainerComponent} />
                    </View>
                    <Animated.View style={[styles.textContainer, { transform: [{ translateY: translateYValue }] }]}>
                        <Animated.View style={styles.textContainer}>
                            <Text style={[styles.title, { color: theme.TERTIARY }]}>
                                <FormattedMessage
                                    defaultMessage='Edit Your Password'
                                    id='views.home.profile.edit-password.title'
                                />
                            </Text>
                            <Text style={[styles.subTitle, { color: theme.TERTIARY }]}>
                                <FormattedMessage
                                    defaultMessage='Please provide us with new password'
                                    id='views.home.profile.edit-password.subtitle'
                                />
                            </Text>
                        </Animated.View>
                        <View style={styles.mainContent}>
                            <Controller
                                name='newPassword'
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
                                                    defaultMessage='New Password'
                                                    id='views.home.profile.edit-password.new-password'
                                                />
                                            )}
                                            placeholder='********'
                                            value={value}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            error={errors.newPassword}
                                            password
                                        >
                                            <Password stroke={theme.TERTIARY} strokeWidth={1.5} />
                                        </TextField>

                                    )
                                }}
                            />

                            <Controller
                                name='confirmNewPassword'
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
                                                    defaultMessage='Confirm New Password'
                                                    id='views.home.profile.edit-password.confirm-new-password'
                                                />
                                            )}
                                            placeholder='********'
                                            value={value}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            error={errors.confirmNewPassword}
                                            password
                                        >
                                            <Password stroke={theme.TERTIARY} strokeWidth={1.5} />
                                        </TextField>

                                    )
                                }}
                            />

                            {messageVisible &&
                                <Text
                                    style={[styles.subTitle, { color: theme.TERTIARY }]}
                                >
                                    <FormattedMessage
                                        defaultMessage='Your password has been updated successfully.'
                                        id='views.home.profile.edit-password.message'
                                    />
                                </Text>}

                        </View>

                    </Animated.View>
                </View>
                <SubmitButton
                    isChevronDisplayed
                    label={
                        loading ?
                            <FormattedMessage
                                defaultMessage='Loading...'
                                id='views.auth.loading'
                            /> :
                            <FormattedMessage
                                defaultMessage='Submit'
                                id='views.home.profile.edit-email.submit'
                            />
                    }
                    onPress={handleSubmit(onSubmit)}
                    mode="submit"
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {
        height: '100%',
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.SCALE_18,
        paddingVertical: spacing.SCALE_18,
        justifyContent: 'space-between',
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
        textAlign: 'center',
        marginTop: spacing.SCALE_4
    },
    subTitle: {
        ...typography.FONT_REGULAR,
        fontWeight: typography.FONT_WEIGHT_REGULAR,
        fontSize: typography.FONT_SIZE_12,
        textAlign: 'center',
    },
    mainContent: {
        marginBottom: spacing.SCALE_4,
    }
})