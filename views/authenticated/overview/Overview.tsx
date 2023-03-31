import { SafeAreaView, Text } from 'react-native';

import { FormattedMessage } from 'react-intl';

export default function Overview() {
    return (
        <SafeAreaView>
            <Text>
                <FormattedMessage defaultMessage="Hello" id="hello" />
            </Text>
        </SafeAreaView>
    );
}
