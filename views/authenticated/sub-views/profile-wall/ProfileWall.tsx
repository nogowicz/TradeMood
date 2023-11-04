import { Animated, Keyboard, StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import { useTheme } from 'store/ThemeContext';
import { constants, spacing, typography } from 'styles';
import UserInfo from './UserInfo';
import IconButton from 'components/buttons/icon-button';

import { RouteProp } from '@react-navigation/native';
import { useFollowing } from 'store/FollowingProvider';
import { useAuth } from 'store/AuthProvider';


import DiscussionTextArea from 'components/discussion-text-area';
import { PostType, usePosts } from 'store/PostsProvider';
import Post from 'components/post';


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
    const { user, updateAboutMe } = useAuth();
    const isMyProfile = (user && (user.uid === userUID) || userUID === undefined) ? true : false;
    const [newAboutMe, setNewAboutMe] = useState<string>("");
    const { posts } = usePosts();
    const [userPosts, setUserPosts] = useState<PostType[]>();

    const HEADER_MAX_HEIGHT = 350;
    const HEADER_MIN_HEIGHT = 80;
    const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

    const scrollOffsetY = useRef(new Animated.Value(0)).current;


    async function fetchUserPosts(userUID: string) {
        const postsFilter: PostType[] | undefined = posts?.filter((posts) =>
            userUID === posts.userUID
        );
        setUserPosts(postsFilter);
    };



    useLayoutEffect(() => {
        if (isMyProfile && user) {
            fetchUserPosts(user.uid);
        } else if (userUID) {
            fetchUserPosts(userUID);
        }
    }, [])



    return (
        <View style={[{
            ...styles.root,
            backgroundColor: theme.BACKGROUND,
        }]}>
            <View style={[{
                ...styles.container,
            }]}>
                <UserInfo
                    userUID={userUID}
                    newAboutMe={newAboutMe}
                    setNewAboutMe={setNewAboutMe}
                    value={scrollOffsetY}
                    HEADER_MIN_HEIGHT={HEADER_MIN_HEIGHT}
                    HEADER_MAX_HEIGHT={HEADER_MAX_HEIGHT}
                    SCROLL_DISTANCE={SCROLL_DISTANCE}
                />
                <Animated.ScrollView
                    style={{
                        flex: 1
                    }}
                    contentContainerStyle={{
                        paddingTop: HEADER_MAX_HEIGHT,
                    }}

                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
                        {
                            useNativeDriver: false,
                        },
                    )}
                    scrollEventThrottle={16}
                >
                    <Text style={[{
                        ...styles.sectionTitle,
                        color: theme.TERTIARY
                    }]}>Your wall</Text>
                    {isMyProfile && <DiscussionTextArea isProfileImage={false} />}
                    <Animated.View>
                        {(userPosts && userPosts.length > 0) && userPosts.map((post: PostType) => {
                            return (
                                <Post
                                    createdAt={post.createdAt}
                                    likes={post.likes}
                                    text={post.text}
                                    uid={post.uid}
                                    userUID={post.userUID}
                                    key={post.key} />
                            )

                        })}
                    </Animated.View>
                </Animated.ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        height: '100%'
    },
    container: {
        padding: spacing.SCALE_20,
        flex: 1,
        height: '100%'
    },
    sectionTitle: {
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_20,
    },
})