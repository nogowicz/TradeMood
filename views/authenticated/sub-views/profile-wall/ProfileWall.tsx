import { Animated, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import { useTheme } from 'store/ThemeContext';
import { spacing, typography } from 'styles';
import { RouteProp } from '@react-navigation/native';
import { useAuth } from 'store/AuthProvider';
import { PostType, usePosts } from 'store/PostsProvider';

import Post from 'components/post';
import AnimatedProfileWallBar from './AnimatedProfileWallBar';
import DiscussionTextArea from 'components/discussion-text-area/DiscussionTextArea';
import { FormattedMessage } from 'react-intl';


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
    const { userUID }: { userUID?: string } = route.params ?? {};

    const theme = useTheme();
    const { user } = useAuth();
    const { posts } = usePosts();

    const [newAboutMe, setNewAboutMe] = useState<string>("");
    const [userPosts, setUserPosts] = useState<PostType[]>();
    const scrollOffsetY = useRef(new Animated.Value(0)).current;

    const isMyProfile = (user && (user.uid === userUID) || userUID === undefined) ? true : false;
    const HEADER_MAX_HEIGHT = 360;
    const HEADER_MIN_HEIGHT = 80;
    const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
        {
            useNativeDriver: false,
        },
    );

    async function fetchUserPosts(userUID: string) {
        const postsFilter: PostType[] | undefined = posts?.filter((posts) =>
            userUID === posts.userUID
        );
        setUserPosts(postsFilter);
    };

    useEffect(() => {
        if (isMyProfile && user) {
            fetchUserPosts(user.uid);
        } else if (userUID) {
            fetchUserPosts(userUID);
        }
    }, [posts]);



    return (
        <View style={[{
            ...styles.root,
            backgroundColor: theme.BACKGROUND,
        }]}>
            <View style={[{
                ...styles.container,
            }]}>
                <AnimatedProfileWallBar
                    userUID={userUID}
                    newAboutMe={newAboutMe}
                    setNewAboutMe={setNewAboutMe}
                    value={scrollOffsetY}
                    HEADER_MIN_HEIGHT={HEADER_MIN_HEIGHT}
                    HEADER_MAX_HEIGHT={HEADER_MAX_HEIGHT}
                    SCROLL_DISTANCE={SCROLL_DISTANCE}
                />

                <FlatList
                    data={userPosts}
                    contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT + 10 }}
                    onScroll={onScroll}
                    style={{ zIndex: 1 }}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    renderItem={({ item: post }) => (
                        <Post
                            createdAt={post.createdAt}
                            likes={post.likes}
                            text={post.text}
                            uid={post.uid}
                            userUID={post.userUID}
                            key={post.key}
                        />
                    )}
                    ListHeaderComponent={() => (
                        <>
                            <Text style={[{
                                ...styles.sectionTitle,
                                color: theme.TERTIARY
                            }]}>
                                {isMyProfile ?
                                    <FormattedMessage
                                        id='views.home.profile-wall.about-me.your-wall'
                                        defaultMessage="Your Wall"
                                    /> :
                                    <FormattedMessage
                                        id='views.home.profile-wall.about-me.posts'
                                        defaultMessage="Posts"
                                    />}
                            </Text>
                            {isMyProfile && <DiscussionTextArea isProfileImage={false} />}
                        </>
                    )}
                />

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