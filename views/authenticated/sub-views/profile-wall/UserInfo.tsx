import { Animated, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { SCREENS } from '@views/navigation/constants';
import { constants, spacing, typography } from 'styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import { useAuth } from 'store/AuthProvider';
import { FormattedMessage, useIntl } from 'react-intl';
import { useTheme } from 'store/ThemeContext';
import CustomImage from 'components/custom-image';
import { useFollowing } from 'store/FollowingProvider';

type UserInfoProps = {
    userUID?: string;
    SCROLL_DISTANCE: number;
    value: Animated.Value;
    photoURL?: string;
    newAboutMe: string;
    setNewAboutMe: Dispatch<SetStateAction<string>>;
    displayName?: string;
};

export default function UserInfo({
    userUID,
    SCROLL_DISTANCE,
    value,
    photoURL,
    newAboutMe,
    setNewAboutMe,
    displayName,
}: UserInfoProps) {
    const { user } = useAuth();
    const intl = useIntl();
    const theme = useTheme();
    const { getFollowersCount, getFollowingCount } = useFollowing();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [focus, setFocus] = useState(false);

    const isMyProfile = (user && (user.uid === userUID) || userUID === undefined) ? true : false;

    //translations:
    const aboutMeTranslation = intl.formatMessage({
        id: 'views.home.profile-wall.about-me.placeholder',
        defaultMessage: 'Tell something about yourself'
    });

    //animations:
    const logoTranslateY = value.interpolate({
        inputRange: [0, SCROLL_DISTANCE],
        outputRange: [0, -300],
        extrapolate: 'clamp',
    });

    const textTranslateY = value.interpolate({
        inputRange: [0, SCROLL_DISTANCE],
        outputRange: [0, -195],
        extrapolate: 'clamp',
    });

    const animatedOpacity = value.interpolate({
        inputRange: [0, SCROLL_DISTANCE],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const textSize = value.interpolate({
        inputRange: [0, SCROLL_DISTANCE],
        outputRange: [28, 24],
        extrapolate: 'clamp',
    });

    const logoScale = value.interpolate({
        inputRange: [0, SCROLL_DISTANCE],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    useEffect(() => {
        const handleKeyboardDidHide = () => {
            setFocus(false);
        };

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

        return () => {
            keyboardDidHideListener.remove();
        };
    }, []);


    if (!user) {
        return (
            <View style={styles.errorContainer}>
                <Text style={{
                    ...styles.errorText,
                    color: theme.TERTIARY,
                }}>
                    <FormattedMessage
                        defaultMessage="Error occurred try again later"
                        id="views.home.profile-wall.about-me.error"
                    />
                </Text>
            </View>
        );
    }

    return (
        <>
            <Animated.View style={{
                transform: [{
                    translateY: logoTranslateY,
                },
                {
                    scale: logoScale
                }
                ],
                opacity: animatedOpacity,
                alignItems: 'center',
                flexDirection: 'column',
            }}>

                {userUID && photoURL ?
                    <CustomImage
                        url={photoURL}
                        style={{
                            ...styles.profileImage
                        }} /> :
                    <TouchableOpacity
                        activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                        onPress={() => navigation.navigate(SCREENS.HOME.EDIT_PICTURE.ID as never)}
                    >
                        <CustomImage
                            url={user.photoURL}
                            style={{
                                ...styles.profileImage
                            }} />
                    </TouchableOpacity>}
            </Animated.View>
            <Animated.Text style={{
                ...styles.nameText,
                fontSize: textSize,
                color: theme.TERTIARY,
                transform: [{ translateY: textTranslateY }],
            }}>{userUID ? displayName : user.displayName}</Animated.Text>
            <Animated.View style={{
                transform: [{
                    translateY: logoTranslateY,
                }],
                opacity: animatedOpacity,
                width: '100%',
                minHeight: '100%'
            }}>
                <View style={styles.followersContainer}>
                    <Text style={{
                        ...styles.followersText,
                        color: theme.TERTIARY,
                    }}>Followers: {isMyProfile ? getFollowersCount(user.uid) : userUID && getFollowersCount(userUID)}</Text>
                    <Text style={{
                        ...styles.followersText,
                        color: theme.TERTIARY,
                    }}>Following: {isMyProfile ? getFollowingCount(user.uid) : userUID && getFollowingCount(userUID)}</Text>
                </View>
                <View
                    style={[{
                        ...styles.aboutMeText,
                        borderWidth: isMyProfile ? 2 : 0,
                        borderColor: focus ? theme.PRIMARY : theme.LIGHT_HINT,
                    }]}>
                    <TextInput
                        style={{
                            color: theme.TERTIARY,
                        }}
                        value={newAboutMe}
                        onChangeText={(text: string) => setNewAboutMe(text)}
                        placeholder={isMyProfile ? aboutMeTranslation : ""}
                        multiline={true}
                        editable={isMyProfile}
                        maxLength={120}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                    />
                </View>
            </Animated.View>
        </>
    )
}

const styles = StyleSheet.create({
    aboutMeText: {
        width: '100%',
        marginVertical: spacing.SCALE_20,
        borderRadius: constants.BORDER_RADIUS.INPUT,
        paddingHorizontal: spacing.SCALE_20,
        justifyContent: 'center',
    },
    profileImage: {
        borderRadius: constants.BORDER_RADIUS.CIRCLE,
        width: constants.ICON_SIZE.PROFILE_WALL_PHOTO,
        height: constants.ICON_SIZE.PROFILE_WALL_PHOTO,
        marginVertical: spacing.SCALE_12,
    },
    nameText: {
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        textAlign: 'center',
    },
    followersContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.SCALE_60,
        marginTop: spacing.SCALE_8,
    },
    followersText: {
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_16
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    errorText: {
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_20,
        textAlign: 'center',
    }
})