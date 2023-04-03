import { SafeAreaView, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormattedMessage } from 'react-intl';

import { RootStackParamList } from '../../navigation/Navigation';

type OverviewScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Overview'>;

type OverviewProps = {
    navigation: OverviewScreenNavigationProp['navigation']
}

export default function Overview({ navigation }: OverviewProps) {
    return (
        <SafeAreaView>
            <Text>
                <FormattedMessage defaultMessage="Hello" id="hello" />
            </Text>
        </SafeAreaView>
    );
}

