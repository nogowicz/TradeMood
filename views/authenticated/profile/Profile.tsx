import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
} from 'react-native'
import React, { useContext } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../views/navigation/Navigation';
import { AuthContext } from '@views/navigation/AuthProvider';
import { colors, constants, spacing, typography } from 'styles';
import IconButton from 'components/buttons/icon-button';
import { FormattedMessage } from 'react-intl';
import SubmitButton from 'components/buttons/submit-button';

import EditProfile from 'assets/icons/Edit-profile.svg';
import Logout from 'assets/icons/Logout.svg'
import Settings from 'assets/icons/Settings.svg'
import About from 'assets/icons/About.svg'
import { SCREENS } from '@views/navigation/constants';
import FastImage from 'react-native-fast-image';




type ProfileScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Profile'>;

type ProfileProps = {
    navigation: ProfileScreenNavigationProp['navigation']
}


export default function Profile({ navigation }: ProfileProps) {
    const { user, logout } = useContext(AuthContext);
    const imageSize = 80;
    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <View style={styles.actionBar}>
                    {user?.photoURL ?
                        <FastImage
                            source={{ uri: user?.photoURL }}
                            style={{ width: imageSize, height: imageSize, borderRadius: imageSize / 2 }}
                        /> :
                        <FastImage
                            source={require('assets/profile/profile-picture.png')}
                            style={{ width: imageSize, height: imageSize, borderRadius: imageSize / 2 }}
                        />
                    }

                </View>
                <View style={styles.mainContainer}>
                    <View style={styles.sectionTitleContainer}>
                        <Text style={styles.sectionTitle}>
                            <FormattedMessage
                                defaultMessage='Hello, '
                                id='views.home.profile.title'
                            />
                        </Text>
                        <Text style={styles.sectionTitle}>
                            {user?.isAnonymous ?
                                <FormattedMessage
                                    defaultMessage='Stranger'
                                    id='views.home.welcome-text.anonymous'
                                />
                                :
                                user?.displayName?.split(" ")[0]}
                        </Text>
                    </View>


                    <View style={styles.optionsContainer}>
                        <SubmitButton
                            label={
                                <FormattedMessage
                                    defaultMessage='Edit Profile'
                                    id='views.home.profile.edit-profile'
                                />
                            }
                            onPress={() => navigation.navigate(SCREENS.HOME.EDIT_PROFILE.ID)}
                            mode='option'
                            icon={<EditProfile />}
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
                            icon={<Settings />}
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
                            icon={<About />}
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
                                    navigation.navigate(SCREENS.AUTH.WELCOME.ID);
                                });
                            }}
                            mode='option'
                            icon={<Logout />}
                            activeOpacity={0.5}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.infoTextContainer}>
                <Text style={styles.infoText}>TradeMood</Text>
                <Text style={styles.infoText}>v1.0.0</Text>
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
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between'
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
        flexDirection: 'row',
    },
    optionsContainer: {
        backgroundColor: colors.LIGHT_COLORS.LIGHT_HINT,
        borderRadius: constants.BORDER_RADIUS.BOTTOM_SHEET,
        marginVertical: spacing.SCALE_40,
    },
    infoTextContainer: {
        alignItems: 'center',
        marginVertical: spacing.SCALE_8,
    },
    infoText: {
        color: colors.LIGHT_COLORS.HINT
    }
})