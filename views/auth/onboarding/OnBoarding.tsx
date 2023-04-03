import { SafeAreaView, StyleSheet, View, Button } from 'react-native'

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { spacing } from '../../../src/styles';
import { RootStackParamList } from '../../navigation/Navigation';
import { SCREENS } from '../../navigation/constants';

type OnBoardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ONBOARDING'>;

type OnBoardingProps = {
    navigation: OnBoardingScreenNavigationProp;
}

export default function OnBoarding({ navigation }: OnBoardingProps) {
    return (
        <SafeAreaView>
            <View>
                <Button
                    title='Go to Login'
                    onPress={() => {
                        navigation.navigate(SCREENS.AUTH.LOGIN.ID)
                    }}
                />

                <Button
                    title='Go to Signup'
                    onPress={() => {
                        navigation.navigate(SCREENS.AUTH.SIGN_UP.ID)
                    }}
                />
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