import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../views/navigation/Navigation';
import { colors, spacing, typography } from 'styles';
import { FormattedMessage } from 'react-intl';
import NotificationWidget from 'components/notification-widget';
import { getItem } from 'utils/asyncStorage';


type NotificationScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Notification'>;

type NotificationProps = {
    navigation: NotificationScreenNavigationProp['navigation']
}

type Notification = {
    title: string;
    body: string;
    date: string;
};

export default function Notification({ navigation }: NotificationProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

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
            }
        };

        fetchNotifications();
    }, []);

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <View style={styles.mainContainer}>
                    <Text style={styles.sectionTitle}>
                        <FormattedMessage
                            defaultMessage='Notifications'
                            id='views.home.notifications.title'
                        />
                    </Text>

                    <FlatList
                        data={notifications}
                        renderItem={({ item }) => (
                            <NotificationWidget
                                title={item.title}
                                content={item.body}
                                date={item.date}
                            />
                        )}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.LIGHT_COLORS.BACKGROUND,
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.SCALE_20,
        paddingTop: spacing.SCALE_20,
    },
    sectionTitle: {
        ...typography.FONT_BOLD,
        color: colors.LIGHT_COLORS.TERTIARY,
        fontSize: typography.FONT_SIZE_32,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    mainContainer: {
        marginVertical: spacing.SCALE_18,
    },
})