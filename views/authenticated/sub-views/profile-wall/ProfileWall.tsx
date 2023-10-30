import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import { useTheme } from 'store/ThemeContext';
import { constants, spacing } from 'styles';
import UserInfo from './UserInfo';
import IconButton from 'components/buttons/icon-button';
import { SCREENS } from '@views/navigation/constants';
import { RouteProp } from '@react-navigation/native';
import { useFollowing } from 'store/FollowingProvider';
import { useAuth } from 'store/AuthProvider';

import GoBack from 'assets/icons/Go-back.svg';
import EditProfile from 'assets/icons/Edit-profile.svg';
import PlusIcon from 'assets/icons/Plus-icon.svg';
import CheckIcon from 'assets/icons/Check-icon.svg';


type ProfileWallScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'ProfileWall'>;

type ProfileWallScreenRouteProp = RouteProp<RootStackParamList, 'ProfileWall'>

type ProfileWallProps = {
    navigation: ProfileWallScreenNavigationProp['navigation'];
    route: ProfileWallScreenRouteProp & {
        params?: {
            userUID?: string;
        };
    };
};

export default function ProfileWall({ navigation, route }: ProfileWallProps) {
    const theme = useTheme();
    const { userUID }: { userUID?: string } = route.params ?? {};
    const { user } = useAuth();
    const { follow, unFollow, isFollowing } = useFollowing();
    const [isFollowingState, setIsFollowingState] = useState<boolean>();

    useLayoutEffect(() => {
        if (userUID) {
            setIsFollowingState(isFollowing(userUID));
        }
    }, [isFollowing, userUID]);

    console.log(userUID)

    async function toggleFollowUser(userUID?: string) {
        if (user && userUID) {
            if (isFollowing(userUID)) {
                unFollow(userUID);
            } else {
                follow(userUID);
            }
        }
    }


    return (
        <View style={[{
            ...styles.root,
            backgroundColor: theme.BACKGROUND,
        }]}>
            <View style={styles.container}>
                <View style={styles.navbar}>
                    <IconButton
                        onPress={() => navigation.goBack()}
                        size={constants.ICON_SIZE.GO_BACK}
                    >
                        <GoBack fill={theme.TERTIARY} />
                    </IconButton>
                    {!userUID || userUID === user?.uid ?
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
                        </IconButton> :
                        <IconButton
                            onPress={() => toggleFollowUser(userUID)}
                            size={constants.ICON_SIZE.ICON}
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
                <UserInfo userUID={userUID} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        padding: spacing.SCALE_20,
    },
    navbar: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    }
})