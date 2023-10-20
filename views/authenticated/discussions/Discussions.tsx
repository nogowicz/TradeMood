import { StyleSheet, Text, View, SafeAreaView, ScrollView, RefreshControl, FlatList, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Navigation';
import { constants, spacing, typography } from 'styles';
import { FormattedMessage, useIntl } from 'react-intl';
import { useTheme } from 'store/themeContext';
import { AuthContext } from '@views/navigation/AuthProvider';
import DiscussionTextArea from 'components/discussion-text-area';
import firestore from '@react-native-firebase/firestore';
import Post, { PostType } from 'components/post/Post';
import BottomSheet from 'components/bottom-sheet';
import { BottomSheetRefProps } from 'components/bottom-sheet/BottomSheet';
import TrashIcon from 'assets/icons/Trash-icon.svg';
import post from 'components/post';



type DiscussionScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Discussion'>;

type DiscussionProps = {
    navigation: DiscussionScreenNavigationProp['navigation']
}




export default function Discussion({ navigation }: DiscussionProps) {
    const [posts, setPosts] = useState<PostType[]>([]);
    const { user } = useContext(AuthContext);
    const [refreshing, setRefreshing] = useState(false);
    const theme = useTheme();
    const refDeletePost = useRef<BottomSheetRefProps>(null);
    const deletePostSheetOpen = useRef(false);
    const intl = useIntl();
    const { height } = useWindowDimensions();

    const handleShowDeleteButton = useCallback(() => {
        deletePostSheetOpen.current = !deletePostSheetOpen.current;
        if (!deletePostSheetOpen.current) {
            refDeletePost.current?.scrollTo(0);
        } else {
            refDeletePost.current?.scrollTo(-(height - constants.BOTTOM_SHEET_HEIGHT.DELETE_POST));
        }
    }, []);



    const onRefresh = useCallback(() => {
        const subscriber = firestore()
            .collection('posts')
            .onSnapshot((querySnapshot) => {
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
                console.log(sortedPosts)
                setPosts(sortedPosts);
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
                    <DiscussionTextArea />
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

})