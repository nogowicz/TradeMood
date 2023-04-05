import { View, Text, Button } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Navigation';
import { useContext } from 'react';
import { AuthContext } from '../../navigation/AuthProvider';
import SubmitButton from 'components/buttons/submit-button';

type LoginScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Login'>;

type LoginProps = {
    navigation: LoginScreenNavigationProp['navigation']
}

export default function Login({ navigation }: LoginProps) {
    const { login } = useContext(AuthContext);

    return (
        <View>
            <Text>LoginScreen</Text>
            <SubmitButton
                label='Login'
                onPress={() => login('xxx@xx.com', 'haslomaslo')}
            />
        </View>
    );
};
