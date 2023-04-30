import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@views/navigation/Navigation";
import { SCREENS } from "@views/navigation/constants";
import IconButton from "components/buttons/icon-button";
import SubmitButton from "components/buttons/submit-button";
import TextField from "components/text-field";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Controller, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { Animated, Keyboard, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { spacing, colors, typography } from "styles";

import GoBack from 'assets/icons/Go-back.svg';
import SmallLogo from 'assets/logo/logo-smaller.svg';
import Email from 'assets/icons/Email.svg';
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthContext } from "@views/navigation/AuthProvider";
import { schema } from "./validationSchema"

type ForgotPasswordScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

type ForgotPasswordProps = {
    navigation: ForgotPasswordScreenNavigationProp['navigation']
}


export default function ForgotPassword({ navigation }: ForgotPasswordProps) {
    const [messageVisible, setMessageVisible] = useState(false);
    const { resetPassword } = useContext(AuthContext);
    const { control, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onResetPassword: SubmitHandler<FieldValues> = async ({ email }) => {
        console.log("DEBUG")
        try {
            await resetPassword(email)
                .then(() => {
                    setMessageVisible(true);
                    setTimeout(() => {
                        navigation.goBack();
                        setMessageVisible(false);
                    }, 3000)
                });
        } catch (error: any) {
            console.log(error)
            if (error.code === 'auth/invalid-email') {
                setError('email', { message: 'Email is not valid' });
            } else if (error.code === 'auth/user-not-found') {
                setError('email', { message: 'User not found' });
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
                                    defaultMessage='Password Reset'
                                    id='views.auth.forgot-password-title'
                                />
                            </Text>
                            <Text style={styles.subTitle}>
                                <FormattedMessage
                                    defaultMessage='Please provide us with your email address, and we will send you the link necessary to create a new password.'
                                    id='views.auth.forgot-password-subtitle'
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

                            {messageVisible &&
                                <Text
                                    style={[styles.subTitle]}
                                >
                                    <FormattedMessage
                                        defaultMessage='The link to change your password has been sent to your email address.'
                                        id='views.auth.forgot-password-message'
                                    />
                                </Text>}

                        </View>
                    </Animated.View>
                </View>


                <SubmitButton
                    isChevronDisplayed
                    label={
                        <FormattedMessage
                            defaultMessage='Send'
                            id='views.auth.forgot-password-send'
                        />
                    }
                    onPress={handleSubmit(onResetPassword)}
                />
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