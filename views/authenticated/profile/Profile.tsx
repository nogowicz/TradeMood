import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
} from 'react-native'
import React, { useContext } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../views/navigation/Navigation';
import { AuthContext } from '@views/navigation/AuthProvider';
import { constants, spacing, typography } from 'styles';
import { FormattedMessage } from 'react-intl';
import SubmitButton from 'components/buttons/submit-button';

import EditProfile from 'assets/icons/Edit-profile.svg';
import Logout from 'assets/icons/Logout.svg'
import Settings from 'assets/icons/Settings.svg'
import About from 'assets/icons/About.svg'
import { SCREENS } from '@views/navigation/constants';
import { clearAsyncStorage } from 'utils/asyncStorage';
import Image from 'components/image';
import { themeContext } from 'store/themeContext';




type ProfileScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Profile'>;

type ProfileProps = {
    navigation: ProfileScreenNavigationProp['navigation']
}


export default function Profile({ navigation }: ProfileProps) {
    const { user, logout } = useContext(AuthContext);
    const theme = useContext(themeContext);
    const imageSize = 80;
    return (
        <SafeAreaView style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <View style={styles.actionBar}>
                    {user?.photoURL ?
                        <Image
                            url={user?.photoURL}
                            style={{ width: imageSize, height: imageSize, borderRadius: imageSize / 2 }}
                        />
                        :
                        <Image
                            source={require('assets/profile/profile-picture.png')}
                            style={{ width: imageSize, height: imageSize, borderRadius: imageSize / 2 }}
                        />
                    }

                </View>
                <View style={styles.mainContainer}>
                    <View style={styles.sectionTitleContainer}>
                        <Text style={[styles.sectionTitle, { color: theme.TERTIARY }]}>
                            <FormattedMessage
                                defaultMessage='Hello, '
                                id='views.home.profile.title'
                            />
                        </Text>
                        <Text style={[styles.sectionTitle, { color: theme.TERTIARY }]}>
                            {user?.isAnonymous ?
                                <FormattedMessage
                                    defaultMessage='Stranger'
                                    id='views.home.welcome-text.anonymous'
                                />
                                :
                                user?.displayName?.split(" ")[0]}
                        </Text>
                    </View>


                    <View style={[styles.optionsContainer, { backgroundColor: theme.LIGHT_HINT }]}>
                        <SubmitButton
                            label={
                                <FormattedMessage
                                    defaultMessage='Edit Profile'
                                    id='views.home.profile.edit-profile'
                                />
                            }
                            onPress={() => navigation.navigate(SCREENS.HOME.EDIT_PROFILE.ID)}
                            mode='option'
                            icon={<EditProfile
                                stroke={theme.TERTIARY}
                                fill={theme.BACKGROUND}
                            />}
                            activeOpacity={0.5}
                        />
                        <SubmitButton
                            label={
                                <FormattedMessage
                                    defaultMessage='App Settings'
                                    id='views.home.profile.app-settings'
                                />
                            }
                            onPress={() => navigation.navigate(SCREENS.HOME.APP_SETTINGS.ID)}
                            mode='option'
                            icon={<Settings stroke={theme.TERTIARY} />}
                            activeOpacity={0.5}
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
                            icon={<About
                                stroke={theme.TERTIARY}
                                fill={theme.BACKGROUND}
                            />}
                            activeOpacity={0.5}
                        />
                        <SubmitButton
                            label={
                                <FormattedMessage
                                    defaultMessage='Logout'
                                    id='views.home.profile.logout'
                                />
                            }
                            onPress={() => {
                                logout().then(() => {
                                    clearAsyncStorage();
                                    navigation.navigate(SCREENS.AUTH.WELCOME.ID);

                                });
                            }}
                            mode='option'
                            icon={<Logout
                                stroke={theme.TERTIARY}
                            />}
                            activeOpacity={0.5}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.infoTextContainer}>
                <Text style={[styles.infoText, { color: theme.LIGHT_HINT }]}>TradeMood</Text>
                <Text style={[styles.infoText, { color: theme.LIGHT_HINT }]}>v1.0.0</Text>
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
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between'
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
        flexDirection: 'row',
    },
    optionsContainer: {
        borderRadius: constants.BORDER_RADIUS.BOTTOM_SHEET,
        marginVertical: spacing.SCALE_40,
    },
    infoTextContainer: {
        alignItems: 'center',
        marginVertical: spacing.SCALE_8,
    },
    infoText: {
    }
})