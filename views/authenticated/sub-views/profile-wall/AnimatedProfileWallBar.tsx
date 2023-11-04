import { Animated, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTheme } from 'store/ThemeContext'
import { useAuth } from 'store/AuthProvider';
import { constants, spacing, typography } from 'styles';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '@views/navigation/constants';
import { useIntl } from 'react-intl';
import { useFollowing } from 'store/FollowingProvider';
import { RootStackParamList } from '@views/navigation/Navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomImage from 'components/custom-image';
import NavBar from './NavBar';



type AnimatedProfileWallBarProps = {
    userUID?: string;
    newAboutMe: string;
    setNewAboutMe: Dispatch<SetStateAction<string>>;
    value: Animated.Value;
    HEADER_MAX_HEIGHT: number;
    HEADER_MIN_HEIGHT: number;
    SCROLL_DISTANCE: number;
};

export default function AnimatedProfileWallBar({
    userUID,
    newAboutMe,
    setNewAboutMe,
    value,
    HEADER_MAX_HEIGHT,
    HEADER_MIN_HEIGHT,
    SCROLL_DISTANCE
}: AnimatedProfileWallBarProps) {
    const theme = useTheme();
    const intl = useIntl();
    const { user } = useAuth();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [photoURL, setPhotoURL] = useState();
    const [displayName, setDisplayName] = useState();
    const [aboutMe, setAboutMe] = useState<string>("");
    const [focus, setFocus] = useState(false);
    const [isSaveButtonAvailable, setIsSaveButtonAvailable] = useState<boolean>(false);

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

    useEffect(() => {
        const handleKeyboardDidHide = () => {
            setFocus(false);
        };

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

        return () => {
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
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
            style={[{
                ...styles.header,
                height: animatedHeaderHeight,
                backgroundColor: theme.BACKGROUND,
            }]}>
            <NavBar
                userUID={userUID}
                setIsSaveButtonAvailable={setIsSaveButtonAvailable}
                isSaveButtonAvailable={isSaveButtonAvailable}
                newAboutMe={newAboutMe}
            />

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

})