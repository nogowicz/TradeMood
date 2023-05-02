import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
} from 'react-native'
import React, { useContext } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../views/navigation/Navigation';
import SubmitButton from 'components/buttons/submit-button';
import { AuthContext } from '@views/navigation/AuthProvider';
import { colors, spacing } from 'styles';

type ProfileScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Profile'>;

type ProfileProps = {
    navigation: ProfileScreenNavigationProp['navigation']
}


export default function Profile({ navigation }: ProfileProps) {
    const { logout } = useContext(AuthContext);
    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <Text>Profile</Text>

                <SubmitButton
                    label='Logout'
                    onPress={() => logout()} />
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