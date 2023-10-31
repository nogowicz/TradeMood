import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useTheme } from 'store/ThemeContext'
import { useAuth } from 'store/AuthProvider';
import CustomImage from 'components/custom-image';
import { constants, spacing, typography } from 'styles';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '@views/navigation/constants';
import { useIntl } from 'react-intl';

type UserInfoProps = {
    userUID?: string;
};

export default function UserInfo({ userUID }: UserInfoProps) {
    const theme = useTheme();
    const { user } = useAuth();
    const [photoURL, setPhotoURL] = useState();
    const [displayName, setDisplayName] = useState();
    const navigation = useNavigation();
    const isMyProfile = (user && (user.uid === userUID) || userUID === undefined) ? true : false;
    const intl = useIntl();
    //translations:
    const aboutMeTranslation = intl.formatMessage({
        id: 'views.home.profile-wall.about-me.placeholder',
        defaultMessage: 'Tell something about yourself'
    });

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
            <Text style={{
                ...styles.nameText,
                color: theme.TERTIARY,
            }}>{userUID ? displayName : user.displayName}</Text>

            <TextInput
                style={[{
                    ...styles.aboutMeText,
                    borderWidth: isMyProfile ? 1 : 0,
                    borderColor: theme.LIGHT_HINT,
                }]}
                placeholder={aboutMeTranslation}
                multiline={true}
                editable={isMyProfile}
                maxLength={280}
            />
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
    aboutMeText: {
        width: '100%',
        marginVertical: spacing.SCALE_20,
        borderRadius: constants.BORDER_RADIUS.INPUT,
        paddingHorizontal: spacing.SCALE_20,
        justifyContent: 'center',
    }
})