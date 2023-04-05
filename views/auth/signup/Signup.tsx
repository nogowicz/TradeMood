import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text } from 'react-native'
import { RootStackParamList } from '../../navigation/Navigation';
import { useContext } from 'react';
import { AuthContext } from '@views/navigation/AuthProvider';
import SubmitButton from 'components/buttons/submit-button/SubmitButton';

type SignupScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Signup'>;

type SignupProps = {
    navigation: SignupScreenNavigationProp['navigation']
}

export default function Signup({ navigation }: SignupProps) {
    const { register } = useContext(AuthContext);

    return (
        <View>
            <Text>SignupScreen</Text>
            <SubmitButton
                label='Register'
                onPress={() => register('xxx@xx.com', 'haslomaslo')}
            />
        </View>
    );
};
