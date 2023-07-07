import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
} from 'react-native'
import React from 'react'
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../views/navigation/Navigation';
import { colors, spacing } from 'styles';
import SubmitButton from 'components/buttons/submit-button/SubmitButton';


type NotificationScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Notification'>;

type NotificationProps = {
    navigation: NotificationScreenNavigationProp['navigation']
}


export default function Notification({ navigation }: NotificationProps) {

    async function onDisplayNotification() {
        await notifee.requestPermission();

        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        });

        await notifee.displayNotification({
            title: "Title",
            body: "This is body of notification",
            android: {
                channelId,
                pressAction: {
                    id: 'default'
                }
            }
        });
    }

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <SubmitButton label="Display Notification" mode='submit' onPress={() => onDisplayNotification()} />
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
})