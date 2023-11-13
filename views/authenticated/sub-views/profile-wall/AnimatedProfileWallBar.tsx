import { Animated, StyleSheet, Text, View } from 'react-native'
import React, { Dispatch, SetStateAction, useLayoutEffect, useState } from 'react'
import { useTheme } from 'store/ThemeContext'
import { useAuth } from 'store/AuthProvider';
import { spacing, typography } from 'styles';
import { FormattedMessage } from 'react-intl';
import firestore from '@react-native-firebase/firestore';

import NavBar from './NavBar';
import UserInfo from './UserInfo';


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
    SCROLL_DISTANCE,
}: AnimatedProfileWallBarProps) {
    const theme = useTheme();
    const { user } = useAuth();

    const [photoURL, setPhotoURL] = useState();
    const [displayName, setDisplayName] = useState<string>();
    const [aboutMe, setAboutMe] = useState<string>("");
    const [isSaveButtonAvailable, setIsSaveButtonAvailable] = useState<boolean>(false);

    const animatedHeaderHeight = value.interpolate({
        inputRange: [0, SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp',
    });



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

    useLayoutEffect(() => {
        if (newAboutMe !== aboutMe) {
            setIsSaveButtonAvailable(true);
        } else {
            setIsSaveButtonAvailable(false);
        }
    }, [newAboutMe, aboutMe]);


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
        <Animated.View style={[{
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
            <UserInfo
                SCROLL_DISTANCE={SCROLL_DISTANCE}
                displayName={displayName}
                newAboutMe={newAboutMe}
                photoURL={photoURL}
                setNewAboutMe={setNewAboutMe}
                value={value}
                userUID={userUID}
            />

        </Animated.View>
    );

}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        left: 0,
        right: 0,
        paddingHorizontal: spacing.SCALE_20,
        paddingVertical: spacing.SCALE_20,
        zIndex: 2,
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

    },
});