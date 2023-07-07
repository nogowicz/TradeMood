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
import { colors, spacing, typography } from 'styles';
import SubmitButton from 'components/buttons/submit-button/SubmitButton';
import { FormattedMessage } from 'react-intl';


type NotificationScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Notification'>;

type NotificationProps = {
    navigation: NotificationScreenNavigationProp['navigation']
}


export default function Notification({ navigation }: NotificationProps) {
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