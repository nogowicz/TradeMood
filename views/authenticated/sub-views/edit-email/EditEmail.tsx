import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Animated,
    Keyboard,
} from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { spacing, typography } from 'styles'

import GoBack from 'assets/icons/Go-back.svg'
import SmallLogo from 'assets/logo/logo-smaller.svg'
import IconButton from 'components/buttons/icon-button'
import { RootStackParamList } from '@views/navigation/Navigation'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FormattedMessage } from 'react-intl'
import { SCREENS } from '@views/navigation/constants'
import SubmitButton from 'components/buttons/submit-button'
import TextField from 'components/text-field'
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from '@views/authenticated/sub-views/edit-email/validationSchema';
import { AuthContext } from '@views/navigation/AuthProvider'
import auth from '@react-native-firebase/auth';

import Email from 'assets/icons/Email.svg';
import { themeContext } from 'store/themeContext'

type EditEmailScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'EditEmail'>;

type EditEmailProps = {
    navigation: EditEmailScreenNavigationProp['navigation']
}


export default function EditEmail({ navigation }: EditEmailProps) {
    const [loading, setLoading] = useState(false);
    const [messageVisible, setMessageVisible] = useState(false);
    const { updateEmail } = useContext(AuthContext);
    const theme = useContext(themeContext);
    const user = auth().currentUser;
    const { control, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit: SubmitHandler<FieldValues> = async ({ newEmail }) => {
        setLoading(true);
        try {
            await updateEmail(newEmail)
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
            if (error.code === 'auth/invalid-email') {
                setError('newEmail', { message: 'Email is not valid' })
            } else if (error.code === 'auth/email-already-in-use') {
                setError('newEmail', { message: 'That email address is already in use' })
            } else if (error.code === 'auth/requires-recent-login') {
                setError('newEmail', { message: "This operation requires re-authentication to ensure it's you" })
            }
            else {
                setError('newEmail', { message: 'Internal error, please try again later' });
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
                                    defaultMessage='Edit Your Email'
                                    id='views.home.profile.edit-email.title'
                                />
                            </Text>
                            <Text style={[styles.subTitle, { color: theme.TERTIARY }]}>
                                <FormattedMessage
                                    defaultMessage='Please provide us with new email address'
                                    id='views.home.profile.edit-email.subtitle'
                                />
                            </Text>
                        </Animated.View>
                        <View style={styles.mainContent}>
                            <TextField
                                editable={false}
                                label={(
                                    <FormattedMessage
                                        defaultMessage='Current Email'
                                        id='views.home.profile.edit-email.current-email' />
                                )}
                                value={user?.email ?? ''}
                                onChangeText={function (value: string): void {
                                    throw new Error('Function not implemented.')
                                }}

                            >
                                <Email stroke={theme.TERTIARY} />
                            </TextField>
                            <Controller
                                name='newEmail'
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
                                                    defaultMessage='New Email'
                                                    id='views.home.profile.edit-email.new-email'
                                                />
                                            )}
                                            placeholder='johnydoe@trademood.com'
                                            value={value}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            error={errors.newEmail}
                                        >
                                            <Email stroke={theme.TERTIARY} />
                                        </TextField>

                                    )
                                }}
                            />

                            {messageVisible &&
                                <Text
                                    style={[styles.subTitle, { color: theme.TERTIARY }]}
                                >
                                    <FormattedMessage
                                        defaultMessage='Your address email has been update successfully, please check your inbox.'
                                        id='views.home.profile.edit-email.message'
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