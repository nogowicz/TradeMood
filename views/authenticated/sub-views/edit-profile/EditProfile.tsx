import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import { constants, spacing, typography } from 'styles';
import IconButton from 'components/buttons/icon-button';


import { FormattedMessage } from 'react-intl';
import { SCREENS } from '@views/navigation/constants';
import SubmitButton from 'components/buttons/submit-button';

import Email from 'assets/icons/Email-light.svg'
import Id from 'assets/icons/Id.svg'
import Picture from 'assets/icons/Picture.svg'
import GoBack from 'assets/icons/Go-back.svg'
import SmallLogo from 'assets/logo/logo-smaller.svg'
import Password from 'assets/icons/Password-light.svg'
import { useTheme } from 'store/themeContext';

type EditProfileScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

type EditProfileProps = {
    navigation: EditProfileScreenNavigationProp['navigation']
}


export default function EditProfile({ navigation }: EditProfileProps) {
    const theme = useTheme();
    return (
        <SafeAreaView style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <View style={styles.actionContainer}>
                    <View style={styles.actionContainerComponent} >
                        <IconButton
                            onPress={() => navigation.goBack()}
                            size={42}
                        >
                            <GoBack fill={theme.TERTIARY} />
                        </IconButton>
                    </View>
                    <SmallLogo />
                    <View style={styles.actionContainerComponent} />
                </View>
                <View style={styles.mainContainer}>
                    <View style={styles.sectionTitleContainer}>
                        <Text style={[styles.sectionTitle, { color: theme.TERTIARY }]}>
                            <FormattedMessage
                                defaultMessage='Edit Your Profile'
                                id='views.home.profile.edit-profile.title'
                            />
                        </Text>
                    </View>
                    <View style={[styles.optionsContainer, { backgroundColor: theme.LIGHT_HINT }]}>
                        <SubmitButton
                            label={
                                <FormattedMessage
                                    defaultMessage='Email'
                                    id='views.home.profile.edit-profile.email'
                                />
                            }
                            onPress={() => navigation.navigate(SCREENS.HOME.EDIT_EMAIL.ID)}
                            mode='option'
                            icon={<Email
                                stroke={theme.TERTIARY}
                                strokeWidth={1.5}
                            />}
                            activeOpacity={0.5}
                        />
                        <SubmitButton
                            label={
                                <FormattedMessage
                                    defaultMessage='Password'
                                    id='views.home.profile.edit-profile.password'
                                />
                            }
                            onPress={() => navigation.navigate(SCREENS.HOME.EDIT_PASSWORD.ID)}
                            mode='option'
                            icon={<Password strokeWidth={1.5} stroke={theme.TERTIARY} />}
                            activeOpacity={0.5}
                        />
                        <SubmitButton
                            label={
                                <FormattedMessage
                                    defaultMessage='Personal Info'
                                    id='views.home.profile.edit-profile.personal-info'
                                />
                            }
                            onPress={() => navigation.navigate(SCREENS.HOME.EDIT_PERSONAL_INFO.ID)}
                            mode='option'
                            icon={<Id
                                stroke={theme.TERTIARY}
                                strokeWidth={1.5}
                            />}
                            activeOpacity={0.5}
                        />
                        <SubmitButton
                            label={
                                <FormattedMessage
                                    defaultMessage='Profile Picture'
                                    id='views.home.profile.edit-profile.profile-picture'
                                />
                            }
                            onPress={() => navigation.navigate(SCREENS.HOME.EDIT_PICTURE.ID)}
                            mode='option'
                            icon={<Picture strokeWidth={1.5} stroke={theme.TERTIARY} />}
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
        borderRadius: constants.BORDER_RADIUS.BOTTOM_SHEET,
        marginVertical: spacing.SCALE_40,
        justifyContent: 'center',
    },
})