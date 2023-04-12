import { SafeAreaView, Text } from 'react-native';
import { useContext } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormattedMessage } from 'react-intl';

import { RootStackParamList } from '../../navigation/Navigation';
import { AuthContext } from '@views/navigation/AuthProvider';
import SubmitButton from 'components/buttons/submit-button';

type OverviewScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Overview'>;

type OverviewProps = {
    navigation: OverviewScreenNavigationProp['navigation']
}

export default function Overview({ navigation }: OverviewProps) {
    const { user, logout } = useContext(AuthContext);
    console.log(user)
    return (
        <SafeAreaView>
            <Text>
                <FormattedMessage defaultMessage="Hello" id="hello" />
            </Text>
            <SubmitButton
                label='Logout'
                onPress={() => logout()}
            />
        </SafeAreaView>
    );
}
