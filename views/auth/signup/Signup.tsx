import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text } from 'react-native'
import { RootStackParamList } from '../../navigation/Navigation';

type SignupScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Signup'>;

type SignupProps = {
    navigation: SignupScreenNavigationProp['navigation']
}

export default function Signup({ navigation }: SignupProps) {
    return (
        <View>
            <Text>SignupScreen</Text>
        </View>
    );
};
