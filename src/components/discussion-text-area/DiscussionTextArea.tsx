import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { constants, spacing } from 'styles';
import { useTheme } from 'store/themeContext';
import { AuthContext } from '@views/navigation/AuthProvider';
import SendIcon from 'assets/icons/Send-icon.svg';
import Image from 'components/image';
import IconButton from 'components/buttons/icon-button';
import { useIntl } from 'react-intl';
import firestore from '@react-native-firebase/firestore';

export default function DiscussionTextArea() {
    const theme = useTheme();
    const intl = useIntl();
    const { user } = useContext(AuthContext);
    const imageSize = 55;

    const [focus, setFocus] = useState(false);
    const [text, setText] = useState('');

    //translations:
    const placeholderTranslation = intl.formatMessage({
        defaultMessage: 'Want to share something?',
        id: 'views.home.discussion.text-input.placeholder'
    });

    const addPost = () => {
        if (text.length > 0) {
            firestore()
                .collection('posts')
                .add({
                    name: user?.displayName,
                    photoURL: user?.photoURL,
                    likes: [],
                    text: text,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    userUID: user?.uid,
                })
                .then(() => {
                    setText('');
                });
        }
    };

    useEffect(() => {
        const handleKeyboardDidHide = () => {
            setFocus(false);
        };

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

        return () => {
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <View style={[
            styles.container,
        ]}>
            <View style={styles.imageContainer}>
                {user?.photoURL ?
                    <Image
                        url={user?.photoURL}
                        style={{ width: imageSize, height: imageSize, borderRadius: imageSize / 2 }}
                    />
                    :
                    <Image
                        source={require('assets/profile/profile-picture.png')}
                        style={{ width: imageSize, height: imageSize, borderRadius: imageSize / 2 }}
                    />
                }
            </View>
            <View style={[
                styles.inputContainer,
                {
                    borderColor: focus ? theme.PRIMARY : theme.LIGHT_HINT,
                }
            ]}>
                <TextInput
                    placeholder={placeholderTranslation}
                    maxLength={280}
                    placeholderTextColor={theme.HINT}
                    multiline={true}
                    onFocus={() => setFocus(true)}
                    onChangeText={(text) => setText(text)}
                    style={[{
                        color: theme.TERTIARY,
                        flex: 1,
                    }]}
                    onBlur={() => setFocus(false)}
                    value={text}
                />
                <View style={styles.rightContainer}>
                    <IconButton
                        onPress={addPost}
                        size={20}
                        isBorder={false}
                    >
                        <SendIcon
                            stroke={focus ? theme.PRIMARY : theme.LIGHT_HINT}
                            strokeWidth={constants.STROKE_WIDTH.MEDIUM}
                        />
                    </IconButton>
                    {focus &&
                        <Text style={{ color: theme.LIGHT_HINT }}>{text.length > 9 ? text.length : '0' + text.length}/280</Text>}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: spacing.SCALE_12,
        paddingVertical: spacing.SCALE_20,
    },
    inputContainer: {
        borderWidth: 2,
        borderRadius: constants.BORDER_RADIUS.INPUT,
        flex: 1,
        paddingHorizontal: spacing.SCALE_12,
        paddingVertical: spacing.SCALE_4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    imageContainer: {
        paddingVertical: spacing.SCALE_4
    },
    rightContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});