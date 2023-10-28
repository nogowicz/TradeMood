import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';
import { useIntl } from 'react-intl';
import { useAuth } from './AuthProvider';
import { useTheme } from './ThemeContext';


export type PostType = {
    createdAt: number;
    likes: string[];
    text: string;
    uid: string;
    userUID: string;
    key?: string;
};

type PostsContextType = {
    posts: PostType[];
    fetchPosts: () => void;
    isLoading: boolean;
    addPost: (postText: string) => void;
    deletePost: (postUID: string) => void;
    toggleLikePost: (postUID: string, currentUserUID: string, likes: string[]) => void;
};

const PostsContext = createContext<PostsContextType | undefined>(undefined);

type PostsContextProviderProps = {
    children: ReactNode;
};

export function PostsContextProvider({ children }: PostsContextProviderProps) {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const intl = useIntl();
    const { user } = useAuth();
    const theme = useTheme();

    //translations:
    const likeError = intl.formatMessage({
        id: 'views.home.discussion.error.like',
        defaultMessage: 'An error occurred while trying to like a post'
    });
    const deletingError = intl.formatMessage({
        id: 'views.home.discussion.error.deleting',
        defaultMessage: 'An error occurred while trying to delete a post'
    });
    const addingError = intl.formatMessage({
        id: 'views.home.discussion.error.adding',
        defaultMessage: 'An error occurred while trying to add a post'
    });
    const loadingPostsErrorTranslation = intl.formatMessage({
        defaultMessage: "Error occurred while loading posts",
        id: 'views.home.discussion.error.loading-data'
    });
    const tryAgainTranslation = intl.formatMessage({
        defaultMessage: "Try again",
        id: 'views.home.instrument-details.error.try-again'
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
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
                            onPress: fetchPosts
                        }
                    });
                    setIsLoading(false);
                }
            });
        return () => subscriber();
    }

    async function addPost(postText: string) {
        if (postText.length > 0 && user) {
            try {
                const postRef = await firestore()
                    .collection('posts')
                    .add({
                        likes: [],
                        text: postText,
                        createdAt: firestore.FieldValue.serverTimestamp(),
                        userUID: user.uid,
                    });

                const newPost: PostType = {
                    createdAt: new Date().getTime(),
                    likes: [],
                    text: postText,
                    uid: postRef.id,
                    userUID: user.uid,
                };
                setPosts([...posts, newPost]);
            } catch (error) {
                console.log("An error occurred while trying to add a post: ", error);
                Snackbar.show({
                    text: addingError,
                    duration: Snackbar.LENGTH_SHORT
                });
            }
        }
    }


    async function deletePost(postUID: string) {
        try {
            const postRef = firestore().collection('posts').doc(postUID);
            await postRef.delete();
            const updatedPosts = posts.filter((post) => post.uid !== postUID);
            setPosts(updatedPosts);
        } catch (error) {
            console.log('An error occurred while deleting the post:', error);
            Snackbar.show({
                text: deletingError,
                duration: Snackbar.LENGTH_SHORT

            });
        }
    }

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

    return (
        <PostsContext.Provider value={{ posts, fetchPosts, isLoading, addPost, deletePost, toggleLikePost }}>
            {children}
        </PostsContext.Provider>
    );
}

export function usePosts() {
    const context = useContext(PostsContext);
    if (!context) {
        throw new Error('usePosts must be used within a PostsContextProvider');
    }
    return context;
}
