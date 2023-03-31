import { SafeAreaView, StyleSheet, View } from 'react-native'

import { spacing } from '../../../src/styles';

export default function OnBoarding() {
    return (
        <SafeAreaView>
            <View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        height: '100%',
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.SCALE_18,
        paddingVertical: spacing.SCALE_18,
        justifyContent: 'space-between',
    },
});