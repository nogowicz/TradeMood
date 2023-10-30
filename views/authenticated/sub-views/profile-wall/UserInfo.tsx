import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useTheme } from 'store/ThemeContext'
import { useAuth } from 'store/AuthProvider';
import CustomImage from 'components/custom-image';
import { constants, spacing, typography } from 'styles';
import firestore from '@react-native-firebase/firestore';

type UserInfoProps = {
    userUID?: string;
};

export default function UserInfo({ userUID }: UserInfoProps) {
    const theme = useTheme();
    const { user } = useAuth();
    const [photoURL, setPhotoURL] = useState();
    const [displayName, setDisplayName] = useState();

    useLayoutEffect(() => {
        async function getUserDetails() {
            if (userUID) {
                const userDoc = await firestore().collection('users').doc(userUID).get();
                const userData = userDoc.data();
                setDisplayName(userData?.displayName);
                setPhotoURL(userData?.photoURL);
            }
        }
        getUserDetails();
    }, [userUID]);

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
        <View style={styles.container}>
            {userUID && photoURL ?
                <CustomImage
                    url={photoURL}
                    style={{
                        ...styles.profileImage
                    }}
                /> :
                <CustomImage
                    url={user.photoURL}
                    style={{
                        ...styles.profileImage
                    }}
                />}
            <Text style={{
                ...styles.nameText,
                color: theme.TERTIARY,
            }}>{userUID ? displayName : user.displayName}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    profileImage: {
        borderRadius: constants.BORDER_RADIUS.CIRCLE,
        width: constants.ICON_SIZE.PROFILE_WALL_PHOTO,
        height: constants.ICON_SIZE.PROFILE_WALL_PHOTO,
        marginVertical: spacing.SCALE_20,
    },
    nameText: {
        ...typography.FONT_BOLD,
        fontSize: typography.FONT_SIZE_28,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        textAlign: 'center',
    },
})