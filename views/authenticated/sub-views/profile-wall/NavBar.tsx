import { Keyboard, StyleSheet, Text, View } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import IconButton from 'components/buttons/icon-button'
import { useTheme } from 'store/ThemeContext'
import { constants } from 'styles';
import { useAuth } from 'store/AuthProvider';
import { useFollowing } from 'store/FollowingProvider';


import GoBack from 'assets/icons/Go-back.svg';
import EditProfile from 'assets/icons/Edit-profile.svg';
import PlusIcon from 'assets/icons/Plus-icon.svg';
import CheckIcon from 'assets/icons/Check-icon.svg';
import SaveButtonIcon from 'assets/icons/Save-icon.svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import { SCREENS } from '@views/navigation/constants';

type NavBarProps = {
    userUID?: string;
    setIsSaveButtonAvailable: Dispatch<SetStateAction<boolean>>;
    isSaveButtonAvailable: boolean;
    newAboutMe: string;
};

export default function NavBar({
    userUID,
    setIsSaveButtonAvailable,
    isSaveButtonAvailable,
    newAboutMe
}: NavBarProps) {
    const theme = useTheme();
    const { user, updateAboutMe } = useAuth();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const { follow, unFollow, isFollowing } = useFollowing();
    const [isFollowingState, setIsFollowingState] = useState<boolean>();

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
        if (userUID) {
            setIsFollowingState(isFollowing(userUID));
        }
    }, [isFollowing, userUID]);

    return (
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
                                strokeWidth={constants.STROKE_WIDTH.HIGH}
                                stroke={theme.TERTIARY}
                                width={constants.ICON_SIZE.SMALL_ICON}
                                height={constants.ICON_SIZE.SMALL_ICON}
                            />
                        </IconButton> :
                        <IconButton
                            onPress={() => navigation.navigate(SCREENS.HOME.EDIT_PROFILE.ID)}
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
                            strokeWidth={constants.STROKE_WIDTH.HIGH}
                            stroke={theme.TERTIARY}
                            width={constants.ICON_SIZE.ICON - 10}
                            height={constants.ICON_SIZE.ICON - 10}
                        /> :
                        <PlusIcon
                            strokeWidth={constants.STROKE_WIDTH.HIGH}
                            stroke={theme.TERTIARY}
                            width={constants.ICON_SIZE.ICON - 10}
                            height={constants.ICON_SIZE.ICON - 10}
                        />}
                </IconButton>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    navbar: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
})