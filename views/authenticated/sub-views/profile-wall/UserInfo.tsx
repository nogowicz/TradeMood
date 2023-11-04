import { Animated, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useLayoutEffect, useState } from 'react'
import { useTheme } from 'store/ThemeContext'
import { useAuth } from 'store/AuthProvider';
import CustomImage from 'components/custom-image';
import { constants, spacing, typography } from 'styles';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '@views/navigation/constants';
import { useIntl } from 'react-intl';

import GoBack from 'assets/icons/Go-back.svg';
import EditProfile from 'assets/icons/Edit-profile.svg';
import PlusIcon from 'assets/icons/Plus-icon.svg';
import CheckIcon from 'assets/icons/Check-icon.svg';
import SaveButtonIcon from 'assets/icons/Save-icon.svg';
import IconButton from 'components/buttons/icon-button';
import { useFollowing } from 'store/FollowingProvider';

type UserInfoProps = {
    userUID?: string;
    newAboutMe: string;
    setNewAboutMe: Dispatch<SetStateAction<string>>;
    value: any;
    HEADER_MAX_HEIGHT: number;
    HEADER_MIN_HEIGHT: number;
    SCROLL_DISTANCE: number;
};

export default function UserInfo({
    userUID,
    newAboutMe,
    setNewAboutMe,
    value,
    HEADER_MAX_HEIGHT,
    HEADER_MIN_HEIGHT,
    SCROLL_DISTANCE
}: UserInfoProps) {
    const theme = useTheme();
    const { user, updateAboutMe } = useAuth();
    const navigation = useNavigation();
    const isMyProfile = (user && (user.uid === userUID) || userUID === undefined) ? true : false;
    const intl = useIntl();
    const [photoURL, setPhotoURL] = useState();
    const [displayName, setDisplayName] = useState();
    const [aboutMe, setAboutMe] = useState<string>("");
    const [focus, setFocus] = useState(false);
    const { follow, unFollow, isFollowing } = useFollowing();
    const [isFollowingState, setIsFollowingState] = useState<boolean>();
    const [isSaveButtonAvailable, setIsSaveButtonAvailable] = useState<boolean>(false);

    //translations:
    const aboutMeTranslation = intl.formatMessage({
        id: 'views.home.profile-wall.about-me.placeholder',
        defaultMessage: 'Tell something about yourself'
    });




    const logoTranslateY = value.interpolate({
        inputRange: [0, SCROLL_DISTANCE],
        outputRange: [0, -300],
        extrapolate: 'clamp',
    });

    const textTranslateY = value.interpolate({
        inputRange: [0, SCROLL_DISTANCE],
        outputRange: [0, -225],
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

    const animatedHeaderHeight = value.interpolate({
        inputRange: [0, SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp',
    });

    const logoScale = value.interpolate({
        inputRange: [0, SCROLL_DISTANCE],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });




    useLayoutEffect(() => {
        if (userUID) {
            setIsFollowingState(isFollowing(userUID));
        }
    }, [isFollowing, userUID]);

    async function toggleFollowUser(userUID?: string) {
        if (user && userUID) {
            if (isFollowing(userUID)) {
                unFollow(userUID);
            } else {
                follow(userUID);
            }
        }
    }

    useEffect(() => {
        const handleKeyboardDidHide = () => {
            setFocus(false);
        };

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

        return () => {
            keyboardDidHideListener.remove();
        };
    }, []);

    useLayoutEffect(() => {
        async function getUserDetails() {
            if (userUID) {
                const userDoc = await firestore().collection('users').doc(userUID).get();
                const userData = userDoc.data();
                setDisplayName(userData?.displayName);
                setPhotoURL(userData?.photoURL);
                setAboutMe(userData?.aboutMe);
                setNewAboutMe(userData?.aboutMe);
            } else {
                const userDoc = await firestore().collection('users').doc(user?.uid).get();
                const userData = userDoc.data();
                setAboutMe(userData?.aboutMe);
                setNewAboutMe(userData?.aboutMe);
            }

        }
        getUserDetails();
    }, [userUID]);



    useEffect(() => {
        if (newAboutMe !== aboutMe) {
            setIsSaveButtonAvailable(true);
        } else {
            setIsSaveButtonAvailable(false);
        }
    }, [newAboutMe, aboutMe]);

    //image
    //name
    //about me
    if (!user) {
        return (

            //TODO:
            <View>
                <Text>ERROR</Text>
            </View>
        );
    }


    return (
        <Animated.View
            style={[
                styles.header,
                {
                    height: animatedHeaderHeight,
                    backgroundColor: theme.BACKGROUND,
                },
            ]}>
            <View style={styles.navbar}>
                <IconButton
                    onPress={() => navigation.goBack()}
                    size={constants.ICON_SIZE.GO_BACK}
                >
                    <GoBack fill={theme.TERTIARY} />
                </IconButton>
                {!userUID || userUID === user?.uid ?
                    <View>
                        {isSaveButtonAvailable ?
                            <IconButton
                                onPress={() => {
                                    updateAboutMe(newAboutMe)
                                    setIsSaveButtonAvailable(false)
                                    Keyboard.dismiss()
                                }
                                }
                                size={constants.ICON_SIZE.GO_BACK}
                            >
                                <SaveButtonIcon
                                    strokeWidth={constants.STROKE_WIDTH.MEDIUM}
                                    stroke={theme.TERTIARY}
                                    width={constants.ICON_SIZE.SMALL_ICON}
                                    height={constants.ICON_SIZE.SMALL_ICON}
                                />
                            </IconButton> :
                            <IconButton
                                onPress={() => navigation.navigate(SCREENS.HOME.EDIT_PROFILE.ID as never)}
                                size={constants.ICON_SIZE.GO_BACK}
                            >
                                <EditProfile
                                    strokeWidth={constants.STROKE_WIDTH.HIGH}
                                    stroke={theme.TERTIARY}
                                    width={constants.ICON_SIZE.SMALL_ICON}
                                    height={constants.ICON_SIZE.SMALL_ICON}
                                />
                            </IconButton>}
                    </View> :
                    <IconButton
                        onPress={() => toggleFollowUser(userUID)}
                        size={constants.ICON_SIZE.GO_BACK}
                    >
                        {isFollowingState ?
                            <CheckIcon
                                strokeWidth={constants.STROKE_WIDTH.MEDIUM}
                                stroke={theme.TERTIARY}
                                width={constants.ICON_SIZE.ICON - 10}
                                height={constants.ICON_SIZE.ICON - 10}
                            /> :
                            <PlusIcon
                                strokeWidth={constants.STROKE_WIDTH.MEDIUM}
                                stroke={theme.TERTIARY}
                                width={constants.ICON_SIZE.ICON - 10}
                                height={constants.ICON_SIZE.ICON - 10}
                            />}
                    </IconButton>
                }
            </View>

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
                        }}
                    /> :
                    <TouchableOpacity
                        activeOpacity={constants.ACTIVE_OPACITY.HIGH}
                        onPress={() => navigation.navigate(SCREENS.HOME.EDIT_PICTURE.ID as never)}
                    >
                        <CustomImage
                            url={user.photoURL}
                            style={{
                                ...styles.profileImage
                            }}
                        />
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
                <TextInput
                    style={[{
                        ...styles.aboutMeText,
                        borderWidth: isMyProfile ? 2 : 0,
                        borderColor: focus ? theme.PRIMARY : theme.LIGHT_HINT,
                        color: theme.TERTIARY,
                    }]}
                    value={newAboutMe}
                    onChangeText={(text: string) => setNewAboutMe(text)}
                    placeholder={isMyProfile ? aboutMeTranslation : ""}
                    multiline={true}
                    editable={isMyProfile}
                    maxLength={280}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                />
            </Animated.View>
        </Animated.View>
    );

}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    profileImage: {
        borderRadius: constants.BORDER_RADIUS.CIRCLE,
        width: constants.ICON_SIZE.PROFILE_WALL_PHOTO,
        height: constants.ICON_SIZE.PROFILE_WALL_PHOTO,
        marginVertical: spacing.SCALE_20,
    },
    nameText: {
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        textAlign: 'center',
    },
    aboutMeText: {
        width: '100%',
        marginVertical: spacing.SCALE_20,
        borderRadius: constants.BORDER_RADIUS.INPUT,
        paddingHorizontal: spacing.SCALE_20,
        justifyContent: 'center',
    },
    header: {
        position: 'absolute',
        left: 0,
        right: 0,
        paddingHorizontal: spacing.SCALE_20,
        paddingVertical: spacing.SCALE_20,
        zIndex: 1,
    },
    title: {
        color: '#ffff',
        fontWeight: 'bold',
        fontSize: 20,
    },
    navbar: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
})