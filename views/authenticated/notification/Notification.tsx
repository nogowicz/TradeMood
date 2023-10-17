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
import { RootStackParamList } from '../../../views/navigation/Navigation';
import { spacing, typography } from 'styles';
import { FormattedMessage, useIntl } from 'react-intl';
import NotificationWidget from 'components/notification-widget';
import { getItem } from 'utils/asyncStorage';
import { useTheme } from 'store/themeContext';
import { AuthContext } from '@views/navigation/AuthProvider';
import Snackbar from 'react-native-snackbar';


type NotificationScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Notification'>;

type NotificationProps = {
    navigation: NotificationScreenNavigationProp['navigation']
}

type Notification = {
    title: string;
    body: string;
    date: string;
};

const windowHeight = Dimensions.get('window').height;

export default function Notification({ navigation }: NotificationProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { user } = useContext(AuthContext);
    const theme = useTheme();
    const intl = useIntl();

    //translations:
    const fetchingNotificationsErrorTranslation = intl.formatMessage({
        id: "views.home.notifications.error.fetching-error",
        defaultMessage: "Error occurred while fetching notifications"
    });
    const tryAgainTranslation = intl.formatMessage({
        id: "views.home.profile.provider.error.try-again",
        defaultMessage: "Try again"
    });

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const notificationsData = await getItem('notifications');
                if (notificationsData) {
                    const parsedNotifications = JSON.parse(notificationsData);
                    setNotifications(parsedNotifications);
                }
            } catch (error) {
                console.log(error);
                Snackbar.show({
                    text: fetchingNotificationsErrorTranslation,
                    duration: Snackbar.LENGTH_LONG,
                    action: {
                        text: tryAgainTranslation,
                        onPress: fetchNotifications,
                        textColor: theme.PRIMARY
                    }
                })
            }
        };

        fetchNotifications();
    }, []);

    return (
        <SafeAreaView style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <View style={styles.mainContainer}>
                    <Text style={[styles.sectionTitle, { color: theme.TERTIARY }]}>
                        <FormattedMessage
                            defaultMessage='Notifications'
                            id='views.home.notifications.title'
                        />
                    </Text>
                    {notifications.length !== 0 && (!user?.isAnonymous) ?
                        <FlatList
                            data={notifications}
                            renderItem={({ item }) => (
                                <NotificationWidget
                                    title={item.title}
                                    content={item.body}
                                    date={item.date}
                                />
                            )}
                        /> :

                        <View style={styles.subtitleContainer}>
                            <Text style={[styles.subtitleText, { color: theme.TERTIARY }]}>
                                {!user?.isAnonymous ?
                                    <FormattedMessage
                                        defaultMessage='Be alert - notifications coming soon.'
                                        id='views.home.notifications.subtitle'
                                    /> :
                                    <FormattedMessage
                                        defaultMessage='Log in to see your notifications'
                                        id='views.home.notifications.login'
                                    />
                                }

                            </Text>
                        </View>
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