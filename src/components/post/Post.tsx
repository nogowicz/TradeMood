import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import Image from 'components/image';
import { useTheme } from 'store/themeContext';
import { constants, spacing, typography } from 'styles';
import firestore from '@react-native-firebase/firestore';
import HeartIcon from 'assets/icons/Heart-icon.svg';
import IconButton from 'components/buttons/icon-button';
import { AuthContext } from '@views/navigation/AuthProvider';
import { formatLongDate } from 'utils/dateFormat';
import { useIntl } from 'react-intl';


export type PostType = {
    createdAt: number;
    key?: string;
    likes: string[];
    text: string;
    uid: string;
    name: string;
    photoURL: string;
};

export default function Post({
    createdAt,
    likes,
    text,
    uid,
    name,
    photoURL
}: PostType) {
    const imageSize = 40;
    const theme = useTheme();
    const { user } = useContext(AuthContext);
    const intl = useIntl();
    const date = new Date(createdAt);

    console.log(uid)

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
            console.log('updated firebase collection.');
        } catch (error) {
            console.error('Error occurred while updating firebase collection:  ', error);
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
                    }]}>{name}</Text>
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
                            if (user) {
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
                    <Text style={{ color: theme.LIGHT_HINT }}>{likes.length}</Text>
                </View>
                <Text style={{ color: theme.HINT }}>{formatLongDate(date, intl)}</Text>
            </View>
        </View>

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
    }
})