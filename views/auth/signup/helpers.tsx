import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { SignUpScreenNavigationProp } from "./Signup"
import IconButton from "components/buttons/icon-button";
import { FormattedMessage } from "react-intl";
import { Controller, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import TextField from "components/text-field";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from './validationSchema';
import { StyleSheet, Text, View } from "react-native";
import { constants, spacing } from "styles";
import { useAuth } from "store/AuthProvider";
import ProfileImagePicker from "components/profile-image-picker";
import { useTheme } from "store/ThemeContext";
import ProgressBar from "components/progress-bar";
import ImagePickerButtons from "components/profile-image-picker/ImagePickerButtons";

import GoBack from 'assets/icons/Go-back.svg';
import SmallLogo from 'assets/logo/logo-smaller.svg';
import Email from 'assets/icons/Email.svg';
import Password from 'assets/icons/Password.svg';
import Person from 'assets/icons/Person.svg';


type PrepareSignUpPagesType = {
    navigation: SignUpScreenNavigationProp;
    handleBack: Dispatch<SetStateAction<number>>;
    handleNextPage: Dispatch<SetStateAction<number>>;
    handlePageWithError: Function;
    imageUrl: string | null | undefined;
    setImageUrl: Dispatch<SetStateAction<string | null | undefined>>;
    deleteImage: Function;
    setStep: Dispatch<SetStateAction<number>>;
    step: number;
    uploadingImage: boolean;
    setUploadingImage: Dispatch<SetStateAction<boolean>>;
}

export function prepareSignUpPages({
    navigation,
    handleBack,
    handleNextPage,
    handlePageWithError,
    imageUrl,
    setImageUrl,
    deleteImage,
    setStep,
    step,
    uploadingImage,
    setUploadingImage
}: PrepareSignUpPagesType) {
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const { control, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const theme = useTheme();

    const onSubmit: SubmitHandler<FieldValues> = async ({ firstName, lastName, email, password, confirmPassword }) => {
        setLoading(true);
        try {
            await register(email, password, firstName, lastName, imageUrl)
                .then(() => setLoading(false));
        } catch (error: any) {
            console.log(error)
            if (error.code === 'auth/email-already-in-use') {
                setError('email', { message: 'That email address is already in use' });
                handlePageWithError(0);
            } else if (error.code === 'auth/weak-password') {
                setError('password', { message: 'Password is too weak' });
                handlePageWithError(0);
            } else if (error.code === 'auth/invalid-email') {
                setError('email', { message: 'Email is not valid' });
                handlePageWithError(0);
            } else if (error.code === 'auth/operation-not-allowed') {
                setError('email', { message: 'Internal error, please try again later' });
                handlePageWithError(0);
            }
            else {
                setError('email', { message: 'Internal error, please try again later' });
                setError('password', { message: 'Internal error, please try again later' });
                setError('confirmPassword', { message: 'Internal error, please try again later' });
                handlePageWithError(0);
            }
            setLoading(false)
        }
    };

    if (errors) {
        useEffect(() => {
            if (errors.email || errors.password || errors.confirmPassword) {
                handlePageWithError(0);
            } else if (errors.firstName || errors.lastName) {
                handlePageWithError(1);
            }
        }, [errors]);
    }




    return [
        {
            id: 'credentials',
            action: (
                <IconButton
                    onPress={() => {
                        navigation.goBack()
                        if (imageUrl) {
                            deleteImage(imageUrl);
                        }
                    }}
                    size={42}
                >
                    <GoBack fill={theme.TERTIARY} />
                </IconButton>
            ),
            logo: (
                <SmallLogo />
            ),
            title: (
                <FormattedMessage
                    defaultMessage='Sign Up'
                    id='views.auth.signup.signup'
                />
            ),
            subTitle: (<></>),
            mainContent: (
                <>
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
                                    <Email stroke={theme.TERTIARY} />
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
                                    placeholder='********'
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    error={errors.password}
                                    password
                                >
                                    <Password stroke={theme.TERTIARY} />
                                </TextField>
                            )
                        }}
                    />


                    <Controller
                        name='confirmPassword'
                        defaultValue=''
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <TextField
                                    label={(
                                        <FormattedMessage
                                            defaultMessage='Confirm Password'
                                            id='views.auth.signup.confirm-password'
                                        />
                                    )}
                                    placeholder='********'
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    error={errors.confirmPassword}
                                    password
                                >
                                    <Password stroke={theme.TERTIARY} />
                                </TextField>
                            )
                        }}
                    />
                </>
            ),
            buttonLabel: (
                <FormattedMessage
                    defaultMessage='Continue'
                    id='views.auth.signup.submit-button-continue'
                />
            ),
            buttonAction: handleNextPage


        },
        {
            id: 'names',
            action: (
                <IconButton
                    onPress={handleBack}
                    size={42}
                >
                    <GoBack fill={theme.TERTIARY} />
                </IconButton>
            ),
            logo: (
                <SmallLogo />
            ),
            title: (
                <FormattedMessage
                    defaultMessage='Sign Up'
                    id='views.auth.signup.signup'
                />
            ),
            subTitle: (
                <FormattedMessage
                    defaultMessage='Hi there! Please provide us with your information so we can personalize your experience.'
                    id='views.auth.signup.subtitle-first-part'
                />
            ),
            mainContent: (
                <View>
                    <Controller
                        name='firstName'
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
                                            defaultMessage='First Name'
                                            id='views.auth.signup.first-name'
                                        />
                                    )}
                                    placeholder='John'
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
                        defaultValue=''
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <TextField
                                    label={(
                                        <FormattedMessage
                                            defaultMessage='Last Name'
                                            id='views.auth.signup.last-name'
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
                </View>
            ),
            buttonLabel: (
                <FormattedMessage
                    defaultMessage='Continue'
                    id='views.auth.signup.submit-button-continue'
                />
            ),
            buttonAction: handleNextPage


        },
        {
            id: 'profile-photo',
            action: (
                <IconButton
                    onPress={handleBack}
                    size={constants.ICON_SIZE.GO_BACK}>
                    <GoBack fill={theme.TERTIARY} />
                </IconButton>
            ),
            logo: (
                <SmallLogo />
            ),
            title: (
                <FormattedMessage
                    defaultMessage='Sign Up'
                    id='views.auth.signup.signup'
                />
            ),
            subTitle: (
                <FormattedMessage
                    defaultMessage='Add profile picture (optional): You can add a profile picture to personalize your account.'
                    id='views.auth.signup.subtitle-second-part'
                />
            ),
            mainContent: (
                <>
                    <View style={{
                        alignItems: 'center',
                        marginVertical: 40
                    }}>
                        <ProfileImagePicker
                            imageUrl={imageUrl}
                            setImageUrl={setImageUrl}
                            size={constants.ICON_SIZE.IMAGE_PICKER_MEDIUM}

                        />

                    </View>
                    <View>
                        {uploadingImage ?
                            <View style={styles.progressBar}>
                                <ProgressBar step={step} steps={100} height={constants.ICON_SIZE.PROGRESS_BAR_HEIGHT} />
                            </View>
                            :
                            <ImagePickerButtons
                                setUploadingImage={setUploadingImage}
                                setStep={setStep}
                                setImageUrl={setImageUrl}
                                imageUrl={imageUrl}
                            />}
                    </View>

                </>
            ),
            buttonLabel: (
                loading ?
                    <FormattedMessage
                        defaultMessage='Loading...'
                        id='views.auth.loading'
                    /> :
                    <FormattedMessage
                        defaultMessage='Sign up'
                        id='views.auth.signup.submit-button-signup'
                    />
            ),
            buttonAction: handleSubmit(onSubmit)

        },

    ];
}

const styles = StyleSheet.create({
    bottomSheetActionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    iconButtonBottomSheetText: {
        textAlign: 'center',
    },
    iconButtonBottomSheet: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.SCALE_8,
        marginBottom: spacing.SCALE_20,
    },
    progressBar: {
        paddingHorizontal: spacing.SCALE_20,
        justifyContent: 'center',
        marginVertical: spacing.SCALE_40,
    }
});