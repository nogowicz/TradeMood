import { StyleSheet, Text, View, SafeAreaView, RefreshControl, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Navigation';
import { spacing, typography } from 'styles';
import { FormattedMessage, useIntl } from 'react-intl';
import { useTheme } from 'store/ThemeContext';
import { useAuth } from 'store/AuthProvider';
import DiscussionTextArea from 'components/discussion-text-area';
import firestore from '@react-native-firebase/firestore';
import Post, { PostType } from 'components/post/Post';
import ActivityIndicator from 'components/activity-indicator';
import Snackbar from 'react-native-snackbar';


type DiscussionScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Discussion'>;

type DiscussionProps = {
    navigation: DiscussionScreenNavigationProp['navigation']
}

export default function Discussion({ navigation }: DiscussionProps) {
    const [posts, setPosts] = useState<PostType[]>([]);
    const { user } = useAuth();
    const theme = useTheme();
    const intl = useIntl();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    //translation:
    const loadingPostsTranslation = intl.formatMessage({
        defaultMessage: "Loading posts...",
        id: "views.home.discussion.loading-posts"
    });
    const loadingPostsErrorTranslation = intl.formatMessage({
        defaultMessage: "Error occurred while loading posts",
        id: 'views.home.discussion.error.loading-data'
    });
    const tryAgainTranslation = intl.formatMessage({
        defaultMessage: "Try again",
        id: 'views.home.instrument-details.error.try-again'
    });

    const onRefresh = useCallback(() => {
        setIsLoading(true);
        const subscriber = firestore()
            .collection('posts')
            .onSnapshot((querySnapshot) => {
                try {
                    const posts: PostType[] = [];
                    querySnapshot.forEach((documentSnapshot) => {
                        const data = documentSnapshot.data();
                        if (data.createdAt) {
                            posts.push({
                                createdAt: (data.createdAt.seconds * 1000 + data.createdAt.nanoseconds / 1000000),
                                key: documentSnapshot.id,
                                likes: data.likes,
                                text: data.text,
                                uid: documentSnapshot.id,
                                name: data.name,
                                photoURL: data.photoURL,
                                userUID: data.userUID
                            });
                        }
                    });

                    const sortedPosts = [...posts].sort((a, b) => b.createdAt - a.createdAt);
                    setPosts(sortedPosts);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error occurred while downloading data:', error);
                    Snackbar.show({
                        text: loadingPostsErrorTranslation,
                        duration: Snackbar.LENGTH_INDEFINITE,
                        action: {
                            text: tryAgainTranslation,
                            textColor: theme.PRIMARY,
                            onPress: onRefresh
                        }
                    });
                    setIsLoading(false);
                }
            });
        return () => subscriber();
    }, []);



    useEffect(() => {
        onRefresh();
    }, []);





    return (
        <SafeAreaView style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <View style={styles.mainContainer}>
                    <Text style={[styles.sectionTitle, { color: theme.TERTIARY }]}>
                        <FormattedMessage
                            defaultMessage='Discussion'
                            id='views.home.discussion.title'
                        />
                    </Text>
                    {user?.isAnonymous ?
                        <View>
                            <Text style={[
                                styles.anonymousText,
                                {
                                    color: theme.TERTIARY
                                }]}>
                                <FormattedMessage
                                    defaultMessage='Log in or register to add posts'
                                    id='views.home.discussion.anonymous.login-or-register'
                                />
                            </Text>
                        </View>
                        :
                        <DiscussionTextArea />}

                    {isLoading ?
                        <ActivityIndicator text={loadingPostsTranslation} /> :
                        <FlatList
                            style={{
                                flex: 1
                            }}
                            data={posts}
                            keyExtractor={(item: PostType) => (item.key || '').toString()}
                            renderItem={({ item: post }) => {
                                if (post) {
                                    return (
                                        <Post
                                            createdAt={post.createdAt}
                                            likes={post.likes}
                                            text={post.text}
                                            uid={post.uid}
                                            name={post.name}
                                            photoURL={post.photoURL}
                                            userUID={post.userUID}
                                        />
                                    );
                                } else {
                                    return null;
                                }
                            }}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={[theme.LIGHT_HINT]}
                                    progressBackgroundColor={theme.PRIMARY}
                                />}
                        />
                    }
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.SCALE_20,
        paddingTop: spacing.SCALE_20,
    },
    sectionTitle: {
        ...typography.FONT_BOLD,
        fontSize: typography.FONT_SIZE_32,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    mainContainer: {
        marginVertical: spacing.SCALE_18,
        flex: 1,
    },
    anonymousText: {
        fontSize: typography.FONT_SIZE_20,
        textAlign: 'center',
        marginVertical: spacing.SCALE_20,
    },

})