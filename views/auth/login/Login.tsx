import { View, Text, Button } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Navigation';
import { useContext } from 'react';
import { AuthContext } from '../../navigation/AuthProvider';

type LoginScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Login'>;

type LoginProps = {
    navigation: LoginScreenNavigationProp['navigation']
}

export default function Login({ navigation }: LoginProps) {
    const { setUser } = useContext(AuthContext);



    return (
        <View>
            <Text>LoginScreen</Text>
            <Button
                title='Login'
                onPress={() => {
                    const newUser = { name: "Jan Kowalski", email: "jan@kowalski.com" };
                    setUser(newUser);
                }}
            />
        </View>
    );
};
