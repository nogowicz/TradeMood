import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import CustomImage from 'components/custom-image';
import { useTheme } from 'store/ThemeContext';
import { constants, spacing, typography } from 'styles';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from 'store/AuthProvider';
import { formatLongDate } from 'utils/dateFormat';
import { useIntl } from 'react-intl';
import Animated, { useSharedValue, withTiming, Easing, useAnimatedStyle } from 'react-native-reanimated';
import IconButton from 'components/buttons/icon-button';
import { PostType, usePosts } from 'store/PostsProvider';
import { useFollowing } from 'store/FollowingProvider';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '@views/navigation/constants';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';

import HeartIcon from 'assets/icons/Heart-icon.svg';
import ThreeDotsIcon from 'assets/icons/ThreeDots-icon.svg';
import TrashIcon from 'assets/icons/Trash-icon.svg';
import PlusIcon from 'assets/icons/Plus-icon.svg';
import CheckIcon from 'assets/icons/Check-icon.svg';



export default function Post({
    createdAt,
    likes,
    text,
    uid,
    userUID,
}: PostType) {
    const imageSize = 40;
    const theme = useTheme();
    const { user } = useAuth();
    const { deletePost, toggleLikePost } = usePosts();
    const intl = useIntl();
    const date = new Date(createdAt);
    const [isTrashVisible, setIsTrashVisible] = useState(false);
    const trashScale = useSharedValue(0);
    const [photoURL, setPhotoURL] = useState();
    const [displayName, setDisplayName] = useState();
    const { follow, unFollow, isFollowing } = useFollowing();
    const [isFollowingState, setIsFollowingState] = useState<boolean>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useLayoutEffect(() => {
        setIsFollowingState(isFollowing(userUID));
    }, [isFollowing, userUID]);

    useLayoutEffect(() => {
        async function getUserDetails() {
            const userDoc = await firestore().collection('users').doc(userUID).get();
            const userData = userDoc.data();
            setDisplayName(userData?.displayName);
            setPhotoURL(userData?.photoURL);
        }
        getUserDetails();
    }, [userUID]);


    async function toggleFollowUser(userUID: string) {
        if (user) {
            if (isFollowing(userUID)) {
                unFollow(userUID);
            } else {
                follow(userUID);
            }
        }
    }
    useEffect(() => {
        trashScale.value = withTiming(isTrashVisible ? 1 : 0, {
            duration: 200,
            easing: Easing.inOut(Easing.ease),
        });
    }, [isTrashVisible])


    function handleToggleTrash() {
        setIsTrashVisible(!isTrashVisible);
    }

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: trashScale.value }],
        };
    });



    return (
        <View style={[
            styles.container,
            {
                borderColor: theme.LIGHT_HINT
            }
        ]}>
            <View style={styles.upperContainer}>
                <View style={styles.upperLeftContainer}>
                    <TouchableOpacity
                        style={styles.upperLeftContainer}
                        activeOpacity={constants.ACTIVE_OPACITY.MEDIUM}
                        //@ts-ignore
                        onPress={() => navigation.navigate(SCREENS.HOME.PROFILE_WALL.ID, {
                            userUID: userUID
                        })}
                    >
                        {photoURL ? (
                            <CustomImage
                                url={photoURL}
                                style={{ width: imageSize, height: imageSize, borderRadius: imageSize / 2 }}
                            />
                        ) : (
                            <CustomImage
                                source={require('assets/profile/profile-picture.png')}
                                style={{ width: imageSize, height: imageSize, borderRadius: imageSize / 2 }}
                            />
                        )}
                        <Text style={[
                            styles.nameText,
                            {
                                color: theme.TERTIARY,
                            }]}>{displayName}</Text>
                    </TouchableOpacity>
                    {(user && user.uid !== userUID && !user.isAnonymous) &&
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
                        </IconButton>}
                </View>
                {(user && userUID === user.uid) &&
                    <View style={{
                        flexDirection: 'row',
                        gap: spacing.SCALE_8,
                    }}>

                        <Animated.View style={animatedStyle} testID='trashIcon'>
                            <IconButton
                                onPress={() => deletePost(uid)}
                                size={constants.ICON_SIZE.ACTIVITY_INDICATOR}
                            >
                                <TrashIcon stroke={theme.NEGATIVE} strokeWidth={constants.STROKE_WIDTH.MEDIUM} />
                            </IconButton>
                        </Animated.View>


                        <View testID='threeDotsIcon'>
                            <IconButton
                                onPress={handleToggleTrash}
                                size={constants.ICON_SIZE.ACTIVITY_INDICATOR}
                                isBorder={false}
                            >
                                <ThreeDotsIcon fill={theme.TERTIARY} width={constants.ICON_SIZE.ACTIVITY_INDICATOR / 2} height={constants.ICON_SIZE.ACTIVITY_INDICATOR / 2} />
                            </IconButton>
                        </View>
                    </View>
                }
            </View >
            <Text style={[
                styles.contentText,
                {
                    color: theme.TERTIARY,
                }
            ]}>{text}</Text>
            <View style={styles.bottomContainer}>
                <View style={styles.likesContainer}>
                    <IconButton
                        onPress={() => {
                            if (user && !user.isAnonymous) {
                                toggleLikePost(uid, user?.uid, likes);
                            }
                        }}
                        size={35}
                        isBorder={false}
                    >
                        <HeartIcon
                            stroke={theme.LIGHT_HINT}
                            fill={(user && likes.includes(user.uid)) ? theme.NEGATIVE : theme.BACKGROUND}
                            width={35}
                            height={35}
                        />
                    </IconButton>
                    <Text style={{ color: theme.LIGHT_HINT, fontSize: typography.FONT_SIZE_18 }}>{likes.length}</Text>
                </View>
                <Text style={{ color: theme.HINT }}>{formatLongDate(date, intl)}</Text>
            </View>
        </View >

    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderRadius: constants.BORDER_RADIUS.INPUT,
        padding: spacing.SCALE_12,
        marginVertical: spacing.SCALE_12,
    },
    upperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.SCALE_20,
    },
    upperLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.SCALE_20,
    },
    nameText: {
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_16,
    },
    contentText: {
        marginVertical: spacing.SCALE_20,
        fontSize: typography.FONT_SIZE_16,
        marginHorizontal: spacing.SCALE_12,
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    likesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.SCALE_4,
    },
})