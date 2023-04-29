import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';

type SearchScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Search'>;

type SearchProps = {
    navigation: SearchScreenNavigationProp['navigation']
}

export default function Search({ navigation }: SearchProps) {
    return (
        <View>
            <Text>Search</Text>
        </View>
    )
}

const styles = StyleSheet.create({})