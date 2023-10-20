import { StyleSheet, Text, View, SafeAreaView, } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Navigation';
import { spacing, typography } from 'styles';
import { FormattedMessage, useIntl } from 'react-intl';
import { useTheme } from 'store/themeContext';
import { AuthContext } from '@views/navigation/AuthProvider';
import DiscussionTextArea from 'components/discussion-text-area';
import firestore from '@react-native-firebase/firestore';



type DiscussionScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Discussion'>;

type DiscussionProps = {
    navigation: DiscussionScreenNavigationProp['navigation']
}


export default function Discussion({ navigation }: DiscussionProps) {
    const [posts, setPosts] = useState<any[]>([]);
    const { user } = useContext(AuthContext);
    const theme = useTheme();
    const intl = useIntl();

    useEffect(() => {
        const subscriber = firestore()
            .collection('posts')
            .onSnapshot((querySnapshot) => {
                const posts: any[] = [];

                querySnapshot.forEach((documentSnapshot) => {
                    posts.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });

                setPosts(posts);
            });

        console.log(posts)
        return () => subscriber();
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
    },

})