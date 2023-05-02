import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
} from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../views/navigation/Navigation';
import { colors, spacing } from 'styles';

type NotificationScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Notification'>;

type NotificationProps = {
    navigation: NotificationScreenNavigationProp['navigation']
}


export default function Notification({ navigation }: NotificationProps) {
    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <Text>Notification</Text>
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