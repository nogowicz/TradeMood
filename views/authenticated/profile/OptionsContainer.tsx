import { StyleSheet, View } from 'react-native'
import React from 'react'
import { useAuth } from 'store/AuthProvider';
import { FormattedMessage } from 'react-intl';
import { constants, spacing } from 'styles';
import { useTheme } from 'store/ThemeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@views/navigation/Navigation';
import { SCREENS } from '@views/navigation/constants';
import { handleLogout } from 'utils/asyncStorage';

import SubmitButton from 'components/buttons/submit-button';

import ProfileIcon from 'assets/icons/Profile.svg';
import EditProfile from 'assets/icons/Edit-profile.svg';
import Logout from 'assets/icons/Logout.svg'
import Settings from 'assets/icons/Settings.svg'
import About from 'assets/icons/About.svg'
import LogIn from 'assets/icons/Log-in.svg'

export default function OptionsContainer() {
    const { user, logout } = useAuth();
    const theme = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const onLogoutPressHandle = () => {
        logout().then(() => {
            handleLogout(['instruments', 'fcmToken'])
            navigation.navigate(SCREENS.AUTH.WELCOME.ID);

        });
    };

    return (
        <>
            <View style={{
                ...styles.optionsContainer,
                backgroundColor: theme.LIGHT_HINT,
            }}>
                {!user?.isAnonymous &&
                    <SubmitButton
                        label={
                            <FormattedMessage
                                defaultMessage='Your Profile'
                                id='views.home.profile.your-profile'
                            />
                        }
                        onPress={() => navigation.navigate(SCREENS.HOME.PROFILE_WALL.ID)}
                        mode='option'
                        activeOpacity={constants.ACTIVE_OPACITY.MEDIUM}
                        icon={
                            <ProfileIcon
                                strokeWidth={constants.STROKE_WIDTH.MEDIUM}
                                stroke={theme.TERTIARY}
                                width={constants.ICON_SIZE.ICON_MEDIUM}
                                height={constants.ICON_SIZE.ICON_MEDIUM}
                            />
                        }
                    />
                }
                {!user?.isAnonymous &&
                    <SubmitButton
                        label={
                            <FormattedMessage
                                defaultMessage='Edit Profile'
                                id='views.home.profile.edit-profile'
                            />
                        }
                        onPress={() => navigation.navigate(SCREENS.HOME.EDIT_PROFILE.ID)}
                        mode='option'
                        activeOpacity={constants.ACTIVE_OPACITY.MEDIUM}
                        icon={
                            <EditProfile
                                strokeWidth={constants.STROKE_WIDTH.MEDIUM}
                                stroke={theme.TERTIARY}
                                width={constants.ICON_SIZE.ICON_MEDIUM}
                                height={constants.ICON_SIZE.ICON_MEDIUM}
                            />
                        }
                    />
                }
                <SubmitButton
                    label={
                        <FormattedMessage
                            defaultMessage='App Settings'
                            id='views.home.profile.app-settings'
                        />
                    }
                    onPress={() => navigation.navigate(SCREENS.HOME.APP_SETTINGS.ID)}
                    mode='option'
                    activeOpacity={constants.ACTIVE_OPACITY.MEDIUM}
                    icon={
                        <Settings
                            stroke={theme.TERTIARY}
                            strokeWidth={constants.STROKE_WIDTH.MEDIUM}
                            width={constants.ICON_SIZE.ICON_MEDIUM}
                            height={constants.ICON_SIZE.ICON_MEDIUM}
                        />
                    }
                />
                <SubmitButton
                    label={
                        <FormattedMessage
                            defaultMessage='About'
                            id='views.home.profile.about'
                        />
                    }
                    onPress={() => navigation.navigate(SCREENS.HOME.ABOUT_US.ID)}
                    mode='option'
                    activeOpacity={constants.ACTIVE_OPACITY.MEDIUM}
                    icon={
                        <About
                            strokeWidth={constants.STROKE_WIDTH.MEDIUM}
                            stroke={theme.TERTIARY}
                            width={constants.ICON_SIZE.ICON_MEDIUM}
                            height={constants.ICON_SIZE.ICON_MEDIUM}
                        />
                    }
                />
                {!user?.isAnonymous &&
                    <SubmitButton
                        label={
                            <FormattedMessage
                                defaultMessage='Logout'
                                id='views.home.profile.logout'
                            />
                        }
                        onPress={onLogoutPressHandle}
                        mode='option'
                        activeOpacity={constants.ACTIVE_OPACITY.MEDIUM}
                        icon={
                            <Logout
                                strokeWidth={constants.STROKE_WIDTH.MEDIUM}
                                stroke={theme.TERTIARY}
                                width={constants.ICON_SIZE.ICON_MEDIUM}
                                height={constants.ICON_SIZE.ICON_MEDIUM}
                            />}
                    />
                }

                {user?.isAnonymous &&
                    <SubmitButton
                        label={
                            <FormattedMessage
                                defaultMessage='Log in or Sign in'
                                id='views.home.profile.log-in-or-sign-in'
                            />
                        }
                        onPress={onLogoutPressHandle}
                        mode='option'
                        activeOpacity={constants.ACTIVE_OPACITY.MEDIUM}
                        icon={
                            <LogIn
                                strokeWidth={constants.STROKE_WIDTH.MEDIUM}
                                stroke={theme.TERTIARY}
                                width={constants.ICON_SIZE.ICON_MEDIUM}
                                height={constants.ICON_SIZE.ICON_MEDIUM}
                            />
                        }
                    />}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    optionsContainer: {
        borderRadius: constants.BORDER_RADIUS.BOTTOM_SHEET,
        marginVertical: spacing.SCALE_40,
    },
})