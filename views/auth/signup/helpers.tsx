import { Dispatch, SetStateAction } from "react"
import { SignupScreenNavigationProp } from "./Signup"
import IconButton from "components/buttons/icon-button";


import GoBack from 'assets/icons/Go-back.svg';
import SmallLogo from 'assets/logo/logo-smaller.svg';
import Person from 'assets/icons/Person.svg';
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
    handleNextPage: Dispatch<SetStateAction<number>>
}

export function prepareSignupPages({
    navigation,
    handleBack,
    handleNextPage,
}: PrepareSignupPagesType) {
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

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
                        name='First Name'
                        rules={{
                            required: true,
                        }}
                        defaultValue=''
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <TextField
                                    label='First Name'
                                    maxLength={25}
                                    placeholder='John'
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={(value: string) => onChange(value)}
                                    error={errors.firstName}
                                >
                                    <Person />
                                </TextField>

                            )
                        }}
                    />

                    <Controller
                        name='Last Name'
                        defaultValue=''
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <TextField
                                    label='Last Name'
                                    maxLength={25}
                                    placeholder='Doe'
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={(value: string) => onChange(value)}
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
            buttonAction: (
                handleSubmit((data) => {
                    console.log(data)
                })
            )

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

        }
    ];
}