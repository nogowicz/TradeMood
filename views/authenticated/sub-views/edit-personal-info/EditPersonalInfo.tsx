import {
    Animated,
    Keyboard,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
} from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import IconButton from 'components/buttons/icon-button';
import { FormattedMessage } from 'react-intl';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import TextField from 'components/text-field';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthContext } from '@views/navigation/AuthProvider';
import SubmitButton from 'components/buttons/submit-button';
import { spacing, typography } from 'styles';
import { schema } from '../edit-personal-info/validationSchema';
import GoBack from 'assets/icons/Go-back.svg'
import SmallLogo from 'assets/logo/logo-smaller.svg'
import Person from 'assets/icons/Person.svg'
import { themeContext } from 'store/themeContext';
import auth from '@react-native-firebase/auth';

type EditPersonalInfoScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'EditPersonalInfo'>;

type EditPersonalInfoProps = {
    navigation: EditPersonalInfoScreenNavigationProp['navigation']
}

export default function EditPersonalInfo({ navigation }: EditPersonalInfoProps) {
    const [loading, setLoading] = useState(false);
    const [messageVisible, setMessageVisible] = useState(false);
    const { updatePersonalData } = useContext(AuthContext);
    const theme = useContext(themeContext);
    const user = auth().currentUser;
    const { control, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit: SubmitHandler<FieldValues> = async ({ firstName, lastName }) => {
        setLoading(true);
        try {
            await updatePersonalData(firstName, lastName)
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

            setError('firstName', { message: 'Internal error, please try again later' });
            setError('lastName', { message: 'Internal error, please try again later' });

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
                                    defaultMessage='Edit Your Personal Info'
                                    id='views.home.profile.edit-personal-info.title'
                                />
                            </Text>
                            <Text style={[styles.subTitle, { color: theme.TERTIARY }]}>
                                <FormattedMessage
                                    defaultMessage='Please provide us with your first and last name'
                                    id='views.home.profile.edit-personal-info.subtitle'
                                />
                            </Text>
                        </Animated.View>
                        <View style={styles.mainContent}>
                            <Controller
                                name='firstName'
                                rules={{
                                    required: true,
                                }}
                                defaultValue={user?.displayName?.split(" ")[0]}
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => {
                                    return (
                                        <TextField
                                            label={(
                                                <FormattedMessage
                                                    defaultMessage='First Name'
                                                    id='views.home.profile.edit-personal-info.first-name'
                                                />
                                            )}
                                            placeholder='Johnny'
                                            value={value}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            error={errors.firstName}
                                        >
                                            <Person stroke={theme.TERTIARY} />
                                        </TextField>

                                    )
                                }}
                            />

                            <Controller
                                name='lastName'
                                rules={{
                                    required: true,
                                }}
                                defaultValue={user?.displayName?.split(" ")[1]}
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => {
                                    return (
                                        <TextField
                                            label={(
                                                <FormattedMessage
                                                    defaultMessage='Last Name'
                                                    id='views.home.profile.edit-personal-info.last-name'
                                                />
                                            )}
                                            placeholder='Doe'
                                            value={value}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            error={errors.lastName}
                                        >
                                            <Person stroke={theme.TERTIARY} />
                                        </TextField>

                                    )
                                }}
                            />

                            {messageVisible &&
                                <Text
                                    style={[styles.subTitle, { color: theme.TERTIARY }]}
                                >
                                    <FormattedMessage
                                        defaultMessage='Your data has been updated successfully.'
                                        id='views.home.profile.edit-personal-info.message'
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