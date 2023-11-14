import { StyleSheet, Text, View, SafeAreaView, RefreshControl, FlatList } from 'react-native'
import React, { useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Navigation';
import { spacing, typography } from 'styles';
import { FormattedMessage, useIntl } from 'react-intl';
import { useTheme } from 'store/ThemeContext';
import { useAuth } from 'store/AuthProvider';
import DiscussionTextArea from 'components/discussion-text-area';
import Post from 'components/post/Post';
import ActivityIndicator from 'components/activity-indicator';
import { PostType, usePosts } from 'store/PostsProvider';


type DiscussionScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Discussion'>;

type DiscussionProps = {
    navigation: DiscussionScreenNavigationProp['navigation']
}

export default function Discussion({ navigation }: DiscussionProps) {
    const { user } = useAuth();
    const theme = useTheme();
    const intl = useIntl();
    const { posts, fetchPosts, isLoading } = usePosts();
    const [refreshing, setRefreshing] = useState(false);

    //translation:
    const loadingPostsTranslation = intl.formatMessage({
        defaultMessage: "Loading posts...",
        id: "views.home.discussion.loading-posts"
    });


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
                            style={{ flex: 1 }}
                            data={posts}
                            keyExtractor={(item: PostType) => (item.key || '').toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item: post }) => <Post {...post} key={post.uid} />}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={fetchPosts}
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
        fontSize: typography.FONT_SIZE_28,
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