import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList,
    Dimensions,
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Navigation';
import { spacing, typography } from 'styles';
import { FormattedMessage, useIntl } from 'react-intl';
import NotificationWidget from 'components/notification-widget';
import { getItem } from 'utils/asyncStorage';
import { useTheme } from 'store/themeContext';
import { AuthContext } from '@views/navigation/AuthProvider';
import Snackbar from 'react-native-snackbar';


type DiscussionScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Discussion'>;

type DiscussionProps = {
    navigation: DiscussionScreenNavigationProp['navigation']
}



const windowHeight = Dimensions.get('window').height;

export default function Discussion({ navigation }: DiscussionProps) {

    const { user } = useContext(AuthContext);
    const theme = useTheme();
    const intl = useIntl();



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
    subtitleContainer: {
        height: windowHeight - 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subtitleText: {
        fontSize: typography.FONT_SIZE_16,
        textAlign: 'center',
    },

})