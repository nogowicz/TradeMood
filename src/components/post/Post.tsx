import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import firestore from '@react-native-firebase/firestore';
import Animated, { useSharedValue, withTiming, Easing, useAnimatedStyle } from 'react-native-reanimated';
import { useIntl } from 'react-intl';

import { SCREENS } from '@views/navigation/constants';
import { RootStackParamList } from '@views/navigation/Navigation';
import { useTheme } from 'store/ThemeContext';
import { constants, spacing, typography } from 'styles';
import { useAuth } from 'store/AuthProvider';
import { formatLongDate } from 'utils/dateFormat';
import { PostType, usePosts } from 'store/PostsProvider';
import { useFollowing } from 'store/FollowingProvider';


import CustomImage from 'components/custom-image';
import IconButton from 'components/buttons/icon-button';

import HeartIcon from 'assets/icons/Heart-icon.svg';
import ThreeDotsIcon from 'assets/icons/ThreeDots-icon.svg';
import TrashIcon from 'assets/icons/Trash-icon.svg';
import PlusIcon from 'assets/icons/Plus-icon.svg';
import CheckIcon from 'assets/icons/Check-icon.svg';
import { SkeletonContent } from './SkeletonContent';



export default function Post(post: PostType) {
    const { userUID, text, createdAt, likes, uid } = post;
    const theme = useTheme();
    const { user } = useAuth();
    const { deletePost, toggleLikePost } = usePosts();
    const { follow, unFollow, isFollowing } = useFollowing();
    const intl = useIntl();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const trashScale = useSharedValue(0);

    const [isTrashVisible, setIsTrashVisible] = useState(false);
    const [photoURL, setPhotoURL] = useState(undefined);
    const [displayName, setDisplayName] = useState(undefined);
    const [isFollowingState, setIsFollowingState] = useState<boolean>();
    const [isLoading, setIsLoading] = useState(false);


    const date = new Date(createdAt);
    const formattedDate = formatLongDate(date, intl)
    const isLiked = user && likes.includes(user.uid);
    const isMyProfile = user && userUID === user.uid;
    const isNotAnonymousAndNotMyProfile = user && user.uid !== userUID && !user.isAnonymous;

    useEffect(() => {
        if (post && displayName) {
            setIsLoading(false);
        }
    }, [post, userUID]);

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



    useEffect(() => {
        trashScale.value = withTiming(isTrashVisible ? 1 : 0, {
            duration: 200,
            easing: Easing.inOut(Easing.ease),
        });
    }, [isTrashVisible])


    const handleToggleTrash = () => {
        setIsTrashVisible(!isTrashVisible);
    }

    async function toggleFollowUser(userUID: string) {
        if (user) {
            if (isFollowing(userUID)) {
                unFollow(userUID);
            } else {
                follow(userUID);
            }
        }
    }

    const handleLikePress = () => {
        if (user && !user.isAnonymous) {
            toggleLikePost(uid, user?.uid, likes);
        }
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: trashScale.value }],
        };
    });

    if (isLoading) {
        return <SkeletonContent />
    }

    return (
        <View style={{
            ...styles.container,
            borderColor: theme.LIGHT_HINT
        }}>
            <View style={styles.upperContainer}>
                <View style={styles.upperLeftContainer}>
                    <TouchableOpacity
                        style={styles.upperLeftContainer}
                        activeOpacity={constants.ACTIVE_OPACITY.MEDIUM}
                        onPress={() => navigation.navigate(SCREENS.HOME.PROFILE_WALL.ID, {
                            userUID: userUID
                        })}
                    >
                        {photoURL ? (
                            <CustomImage
                                url={photoURL}
                                style={styles.imageStyle}
                            />
                        ) : (
                            <CustomImage
                                source={require('assets/profile/profile-picture.png')}
                                style={styles.imageStyle}
                            />
                        )}
                        <Text testID='username' style={{
                            ...styles.nameText,
                            color: theme.TERTIARY,
                        }}>{displayName}</Text>
                    </TouchableOpacity>
                    {isNotAnonymousAndNotMyProfile &&
                        <IconButton
                            onPress={() => toggleFollowUser(userUID)}
                            size={constants.ICON_SIZE.ICON}
                        >
                            <View testID='follow'>
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
                            </View>
                        </IconButton>}
                </View>
                {isMyProfile &&
                    <View style={styles.myProfileOptions}>

                        <Animated.View style={animatedStyle} testID='trashIcon'>
                            <IconButton
                                onPress={() => deletePost(uid)}
                                size={constants.ICON_SIZE.ACTIVITY_INDICATOR}
                            >
                                <TrashIcon
                                    stroke={theme.NEGATIVE}
                                    strokeWidth={constants.STROKE_WIDTH.MEDIUM}
                                />
                            </IconButton>
                        </Animated.View>


                        <View testID='threeDotsIcon'>
                            <IconButton
                                onPress={handleToggleTrash}
                                size={constants.ICON_SIZE.ACTIVITY_INDICATOR}
                                isBorder={false}
                            >
                                <ThreeDotsIcon
                                    fill={theme.TERTIARY}
                                    width={constants.ICON_SIZE.ACTIVITY_INDICATOR / 2}
                                    height={constants.ICON_SIZE.ACTIVITY_INDICATOR / 2}
                                />
                            </IconButton>
                        </View>
                    </View>
                }
            </View >
            <Text style={{
                ...styles.contentText,
                color: theme.TERTIARY,
            }}>{text}</Text>
            <View style={styles.bottomContainer}>
                <View style={styles.likesContainer}>
                    <IconButton
                        onPress={handleLikePress}
                        size={constants.ICON_SIZE.ICON_MEDIUM}
                        isBorder={false}
                    >
                        <HeartIcon
                            stroke={theme.LIGHT_HINT}
                            fill={isLiked ? theme.NEGATIVE : theme.BACKGROUND}
                            width={constants.ICON_SIZE.ICON_MEDIUM}
                            height={constants.ICON_SIZE.ICON_MEDIUM}
                        />
                    </IconButton>
                    <Text style={{ color: theme.LIGHT_HINT, fontSize: typography.FONT_SIZE_18 }}>
                        {likes.length}
                    </Text>
                </View>
                <Text style={{ color: theme.HINT }}>{formattedDate}</Text>
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
    imageStyle: {
        width: constants.ICON_SIZE.POST_IMAGE,
        height: constants.ICON_SIZE.POST_IMAGE,
        borderRadius: constants.ICON_SIZE.POST_IMAGE / 2
    },
    myProfileOptions: {
        flexDirection: 'row',
        gap: spacing.SCALE_8,
    }
})