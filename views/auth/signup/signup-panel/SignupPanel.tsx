import {
    View,
    StyleSheet,
    Text,
} from 'react-native';

import { FormattedMessage } from 'react-intl';
import { colors, spacing, typography } from 'styles';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from '../signUpValidationSchema';

import GoBack from 'assets/icons/Go-back.svg';
import SmallLogo from 'assets/logo/logo-smaller.svg';
import IconButton from 'components/buttons/icon-button';
import Person from 'assets/icons/Person.svg';


import SubmitButton from 'components/buttons/submit-button';
import TextField from 'components/text-field';

export default function SignupPanel() {

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    return (
        <>
            <View>
                <View style={styles.actionContainer}>
                    <View style={styles.actionContainerComponent} >
                        <IconButton onPress={() => { }}>
                            <GoBack />
                        </IconButton>
                    </View>
                    <SmallLogo />
                    <View style={styles.actionContainerComponent} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        <FormattedMessage
                            defaultMessage='Sign Up'
                            id='views.auth.signup.signup'
                        />
                    </Text>
                    <Text style={styles.subTitle}>
                        <FormattedMessage
                            defaultMessage='Hi there! Please provide us with your information so we can personalize your experience.'
                            id='views.auth.signup.subtitle-first-part'
                        />
                    </Text>
                </View>
                <View style={styles.textFieldsContainer}>
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
                        name='Last Name'
                        defaultValue=''
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextField
                                label='Last Name'
                                placeholder='Doe'
                                value={value}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                error={errors.lastName}
                            >
                                <Person />
                            </TextField>
                        )}
                    />
                </View>
            </View>
            <View>
                <SubmitButton
                    isChevronDisplayed
                    label={
                        <FormattedMessage
                            defaultMessage='Continue'
                            id='views.auth.signup.submit-button-continue'
                        />
                    }
                    onPress={() => { }}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionContainerComponent: {
        flex: 1 / 3
    },
    textContainer: {
        justifyContent: 'center',
        marginHorizontal: spacing.SCALE_20,
    },
    title: {
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_24,
        color: colors.LIGHT_COLORS.TERTIARY,
        textAlign: 'center',
        marginVertical: spacing.SCALE_12
    },
    subTitle: {
        ...typography.FONT_REGULAR,
        fontWeight: typography.FONT_WEIGHT_REGULAR,
        fontSize: typography.FONT_SIZE_12,
        color: colors.LIGHT_COLORS.TERTIARY,
        textAlign: 'center',
    },
    textFieldsContainer: {
        marginBottom: spacing.SCALE_20,
    }
});

