import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../views/navigation/Navigation';
import SubmitButton from 'components/buttons/submit-button';
import { AuthContext } from '@views/navigation/AuthProvider';

type ProfileScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Profile'>;

type ProfileProps = {
    navigation: ProfileScreenNavigationProp['navigation']
}


export default function Profile({ navigation }: ProfileProps) {
    const { logout } = useContext(AuthContext);
    return (
        <><View>
            <Text>Profile</Text>
        </View><SubmitButton
                label='Logout'
                onPress={() => logout()} /></>
    )
}

const styles = StyleSheet.create({})