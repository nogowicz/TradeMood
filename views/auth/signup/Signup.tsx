import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    SafeAreaView,
    Text,
    StyleSheet,
    View
} from 'react-native'
import { RootStackParamList } from '../../navigation/Navigation';
import { useContext } from 'react';
import { AuthContext } from '@views/navigation/AuthProvider';
import SubmitButton from 'components/buttons/submit-button/SubmitButton';
import { spacing } from 'styles';
import SignupPanel from './signup-panel/SignupPanel';

type SignupScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Signup'>;

type SignupProps = {
    navigation: SignupScreenNavigationProp['navigation']
}

export default function Signup({ navigation }: SignupProps) {
    const { register } = useContext(AuthContext);

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <SignupPanel />
            </View>

        </SafeAreaView>
    );
};

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
    actionContainer: {
        alignItems: 'flex-end',
    },
});