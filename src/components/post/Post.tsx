import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import Image from 'components/image';
import { useTheme } from 'store/ThemeContext';
import { constants, spacing, typography } from 'styles';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from 'store/AuthProvider';
import { formatLongDate } from 'utils/dateFormat';
import { useIntl } from 'react-intl';
import Animated, { useSharedValue, withTiming, Easing, useAnimatedStyle } from 'react-native-reanimated';
import IconButton from 'components/buttons/icon-button';

import HeartIcon from 'assets/icons/Heart-icon.svg';
import ThreeDotsIcon from 'assets/icons/ThreeDots-icon.svg';
import TrashIcon from 'assets/icons/Trash-icon.svg';
import Snackbar from 'react-native-snackbar';

export type PostType = {
    createdAt: number;
    key?: string;
    likes: string[];
    text: string;
    uid: string;
    userUID: string;
};

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
    const intl = useIntl();
    const date = new Date(createdAt);
    const [isTrashVisible, setIsTrashVisible] = useState(false);
    const trashScale = useSharedValue(0);
    const [photoURL, setPhotoURL] = useState();
    const [displayName, setDisplayName] = useState();

    //translations:
    const likeError = intl.formatMessage({
        id: 'views.home.discussion.error.like',
        defaultMessage: 'An error occurred while trying to like a post'
    });
    const deletingError = intl.formatMessage({
        id: 'views.home.discussion.error.deleting',
        defaultMessage: 'An error occurred while trying to delete a post'
    });

    useLayoutEffect(() => {
        async function getUserDetails() {
            const userDoc = await firestore().collection('users').doc(userUID).get();
            const userData = userDoc.data();

            setDisplayName(userData?.displayName);
            setPhotoURL(userData?.photoURL);
        }
        getUserDetails();
    }, [userUID]);

    async function toggleLikePost(postUID: string, currentUserUID: string, likes: string[]) {
        const userIndex = likes.indexOf(currentUserUID);

        if (userIndex === -1) {
            likes.push(currentUserUID);
        } else {
            likes.splice(userIndex, 1);
        }

        const postRef = firestore().collection('posts').doc(postUID)
        try {
            await postRef.update({ likes });
        } catch (error) {
            console.log('Error occurred while updating firebase collection:  ', error);
            Snackbar.show({
                text: likeError,
                duration: Snackbar.LENGTH_SHORT

            });
        }
    }

    function handleToggleTrash() {
        setIsTrashVisible(!isTrashVisible);
        trashScale.value = withTiming(isTrashVisible ? 1 : 0, {
            duration: 300,
            easing: Easing.inOut(Easing.ease),
        });
    }

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: trashScale.value }],
        };
    });

    async function deletePost(postUID: string) {
        try {
            const postRef = firestore().collection('posts').doc(postUID);
            await postRef.delete();
        } catch (error) {
            console.log('An error occurred while deleting the post:', error);
            Snackbar.show({
                text: deletingError,
                duration: Snackbar.LENGTH_SHORT

            });
        }
    }

    return (
        <View style={[
            styles.container,
            {
                borderColor: theme.LIGHT_HINT
            }
        ]}>
            <View style={styles.upperContainer}>
                <View style={styles.upperLeftContainer}>
                    {photoURL ? (
                        <Image
                            url={photoURL}
                            style={{ width: imageSize, height: imageSize, borderRadius: imageSize / 2 }}
                        />
                    ) : (
                        <Image
                            source={require('assets/profile/profile-picture.png')}
                            style={{ width: imageSize, height: imageSize, borderRadius: imageSize / 2 }}
                        />
                    )}
                    <Text style={[
                        styles.nameText,
                        {
                            color: theme.TERTIARY,
                        }]}>{displayName}</Text>
                </View>
                {(user && userUID === user.uid) &&
                    <View style={{
                        flexDirection: 'row',
                        gap: spacing.SCALE_8,
                    }}>

                        <Animated.View style={animatedStyle}>
                            <IconButton
                                onPress={() => deletePost(uid)}
                                size={constants.ICON_SIZE.ACTIVITY_INDICATOR}
                            >
                                <TrashIcon stroke={theme.NEGATIVE} strokeWidth={constants.STROKE_WIDTH.MEDIUM} />
                            </IconButton>
                        </Animated.View>


                        <IconButton
                            onPress={handleToggleTrash}
                            size={constants.ICON_SIZE.ACTIVITY_INDICATOR}
                            isBorder={false}
                        >
                            <ThreeDotsIcon fill={theme.TERTIARY} width={constants.ICON_SIZE.ACTIVITY_INDICATOR / 2} height={constants.ICON_SIZE.ACTIVITY_INDICATOR / 2} />
                        </IconButton>
                    </View>
                }
            </View>
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