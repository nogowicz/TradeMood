import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';

type ProfileWallScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'ProfileWall'>;


type ProfileWallProps = {
    navigation: ProfileWallScreenNavigationProp['navigation'];
};

export default function ProfileWall({ navigation }: ProfileWallProps) {
    return (
        <View>
            <Text>Profile</Text>
        </View>
    )
}

const styles = StyleSheet.create({})