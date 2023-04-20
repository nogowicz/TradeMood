import { Dispatch, SetStateAction, useRef } from "react"
import { SignupScreenNavigationProp } from "./Signup"
import IconButton from "components/buttons/icon-button";


import GoBack from 'assets/icons/Go-back.svg';
import SmallLogo from 'assets/logo/logo-smaller.svg';
import Person from 'assets/icons/Person.svg';
import Email from 'assets/icons/Email.svg';
import Password from 'assets/icons/Password.svg';
import AddPhoto from 'assets/signup-screen/AddPhoto.svg';

import { FormattedMessage } from "react-intl";
import { Controller, useForm } from "react-hook-form";
import TextField from "components/text-field";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./signUpValidationSchema";
import { View } from "react-native";
import { spacing } from "styles";


type PrepareSignupPagesType = {
    navigation: SignupScreenNavigationProp,
    handleBack: Dispatch<SetStateAction<number>>,
    handleNextPage: Dispatch<SetStateAction<number>>,
    handlePageWithError: Function,
}

export function prepareSignupPages({
    navigation,
    handleBack,
    handleNextPage,
    handlePageWithError,
}: PrepareSignupPagesType) {


    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });


    const onSubmit = (data: any) => console.log(data);




    return [
        {
            id: 'names',
            action: (
                <IconButton onPress={() => navigation.goBack()}>
                    <GoBack />
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
                <>
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
                                    <Person />
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
                                    <Person />
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
            id: 'profile-photo',
            action: (
                <IconButton onPress={handleBack}>
                    <GoBack />
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
                <View style={{
                    alignItems: 'center',
                    marginTop: spacing.SCALE_90,
                    marginBottom: spacing.SCALE_40
                }}>
                    <AddPhoto />
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
            id: 'credentials',
            action: (
                <IconButton onPress={handleBack}>
                    <GoBack />
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
                                    placeholder='********'
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    error={errors.password}
                                >
                                    <Password />
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
                                >
                                    <Password />
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
    ];
}