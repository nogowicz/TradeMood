import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import { colors, constants, spacing, typography } from 'styles';
import IconButton from 'components/buttons/icon-button';

import GoBack from 'assets/icons/Go-back.svg'
import SmallLogo from 'assets/logo/logo-smaller.svg'
import { FormattedMessage } from 'react-intl';
import { SCREENS } from '@views/navigation/constants';
import SubmitButton from 'components/buttons/submit-button';

import Email from 'assets/icons/Email-light.svg'
import Person from 'assets/icons/Person-light.svg'
import Picture from 'assets/icons/Picture.svg'

type EditProfileScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

type EditProfileProps = {
    navigation: EditProfileScreenNavigationProp['navigation']
}


export default function EditProfile({ navigation }: EditProfileProps) {
    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <View style={styles.actionContainer}>
                    <View style={styles.actionContainerComponent} >
                        <IconButton
                            onPress={() => navigation.goBack()}
                            size={42}
                        >
                            <GoBack />
                        </IconButton>
                    </View>
                    <SmallLogo />
                    <View style={styles.actionContainerComponent} />
                </View>
                <View style={styles.mainContainer}>
                    <View style={styles.sectionTitleContainer}>
                        <Text style={styles.sectionTitle}>
                            <FormattedMessage
                                defaultMessage='Edit Your Profile'
                                id='views.home.profile-edit_profile-title'
                            />
                        </Text>
                    </View>
                    <View style={styles.optionsContainer}>
                        <SubmitButton
                            label={
                                <FormattedMessage
                                    defaultMessage='Email'
                                    id='views.home.profile-edit_profile-email'
                                />
                            }
                            onPress={() => console.log("Email")}
                            mode='option'
                            icon={<Email />}
                            activeOpacity={0.5}
                        />
                        <SubmitButton
                            label={
                                <FormattedMessage
                                    defaultMessage='Personal Info'
                                    id='views.home.profile-edit_profile-personal_info'
                                />
                            }
                            onPress={() => console.log("Personal Info")}
                            mode='option'
                            icon={<Person style={{ marginLeft: spacing.SCALE_4 }} />}
                            activeOpacity={0.5}
                        />
                        <SubmitButton
                            label={
                                <FormattedMessage
                                    defaultMessage='Profile Picture'
                                    id='views.home.profile-edit_profile-profile_picture'
                                />
                            }
                            onPress={() => console.log("Profile Picture")}
                            mode='option'
                            icon={<Picture />}
                            activeOpacity={0.5}
                        />

                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.LIGHT_COLORS.BACKGROUND,
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.SCALE_20,
        paddingTop: spacing.SCALE_20,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionContainerComponent: {
        flex: 1 / 5
    },
    sectionTitle: {
        ...typography.FONT_BOLD,
        color: colors.LIGHT_COLORS.TERTIARY,
        fontSize: typography.FONT_SIZE_32,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    mainContainer: {
        marginTop: spacing.SCALE_18,
    },
    sectionTitleContainer: {
        alignItems: 'center',
    },
    optionsContainer: {
        backgroundColor: colors.LIGHT_COLORS.LIGHT_HINT,
        borderRadius: constants.BORDER_RADIUS.BOTTOM_SHEET,
        marginVertical: spacing.SCALE_40,
        justifyContent: 'center',
    },
})