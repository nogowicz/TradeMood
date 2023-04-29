import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../views/navigation/Navigation';

type NotificationScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Notification'>;

type NotificationProps = {
    navigation: NotificationScreenNavigationProp['navigation']
}


export default function Notification({ navigation }: NotificationProps) {
    return (
        <View>
            <Text>Notification</Text>
        </View>
    )
}

const styles = StyleSheet.create({})