import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { constants, spacing } from 'styles';
import { useTheme } from 'store/ThemeContext';
import { useAuth } from 'store/AuthProvider';
import Image from 'components/image';
import IconButton from 'components/buttons/icon-button';
import { useIntl } from 'react-intl';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';

import SendIcon from 'assets/icons/Send-icon.svg';
import { usePosts } from 'store/PostsProvider';

export default function DiscussionTextArea() {
    const theme = useTheme();
    const intl = useIntl();
    const { user } = useAuth();
    const { addPost } = usePosts();
    const [focus, setFocus] = useState(false);
    const [text, setText] = useState('');
    const imageSize = 55;
    const maxInputLength = 280;

    //translations:
    const placeholderTranslation = intl.formatMessage({
        defaultMessage: 'Want to share something?',
        id: 'views.home.discussion.text-input.placeholder'
    });

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
                    maxLength={maxInputLength}
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
                    <View testID="sendPost">
                        <IconButton
                            onPress={addPost}
                            size={constants.ICON_SIZE.ICON}
                            isBorder={false}
                        >
                            <SendIcon
                                stroke={focus ? theme.PRIMARY : theme.LIGHT_HINT}
                                strokeWidth={constants.STROKE_WIDTH.MEDIUM}
                            />
                        </IconButton>
                    </View>
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