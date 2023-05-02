import { NativeStackScreenProps } from '@react-navigation/native-stack';
import IconButton from 'components/buttons/icon-button/IconButton';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
} from 'react-native'
import { FormattedMessage } from 'react-intl';

import { RootStackParamList } from '@views/navigation/Navigation';
import { colors, spacing, typography } from 'styles';
import { useContext } from 'react';
import { AuthContext } from '@views/navigation/AuthProvider';


import TextButton from 'components/buttons/text-button';
import GoBack from 'assets/icons/Go-back.svg';
import LargeLogo from 'assets/logo/logo-bigger.svg'
import SubmitButton from 'components/buttons/submit-button';
import { SCREENS } from '@views/navigation/constants';
import OutlinedButton from 'components/buttons/outlined-button';



type WelcomeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

type WelcomeProps = {
    navigation: WelcomeScreenNavigationProp['navigation']
}

export default function Welcome({ navigation }: WelcomeProps) {
    const { signInAnonymously } = useContext(AuthContext);

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <View style={styles.actionContainer}>
                    <IconButton
                        onPress={() => navigation.goBack()}
                        size={42}
                    >
                        <GoBack />
                    </IconButton>
                    <TextButton
                        label={
                            <FormattedMessage
                                defaultMessage='Later'
                                id='views.auth.welcome.later'
                            />
                        }
                        onPress={() => signInAnonymously()}
                    />
                </View>
                <View style={styles.iconButton}>
                    <LargeLogo />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.textRegular}>
                        <FormattedMessage
                            defaultMessage='Get the latest information about the financial market: '
                            id='views.auth.welcome.first-part-text'
                        />
                        <Text style={styles.textBold}>
                            <FormattedMessage
                                defaultMessage='Log in or create an account'
                                id='views.auth.welcome.second-part-text'
                            />
                        </Text>

                        <FormattedMessage
                            defaultMessage='to receive the latest information about market sentiment and other significant market events.'
                            id='views.auth.welcome.third-part-text'
                        />
                    </Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <SubmitButton
                        label={
                            <FormattedMessage
                                defaultMessage='Login'
                                id='views.auth.welcome.login'
                            />
                        }
                        onPress={() => navigation.navigate(SCREENS.AUTH.LOGIN.ID)}
                        isChevronDisplayed
                        mode='submit'
                    />

                    <OutlinedButton
                        label={
                            <FormattedMessage
                                defaultMessage='Sign Up'
                                id='views.auth.welcome.signup'
                            />
                        }
                        onPress={() => navigation.navigate(SCREENS.AUTH.SIGN_UP.ID)}
                        isChevronDisplayed
                    />
                </View>
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
        paddingHorizontal: spacing.SCALE_20,
        paddingVertical: spacing.SCALE_18,
        justifyContent: 'space-between',
        backgroundColor: colors.LIGHT_COLORS.BACKGROUND,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconButton: {
        alignItems: 'center',
    },
    textContainer: {
        marginHorizontal: spacing.SCALE_8,
    },
    textRegular: {
        ...typography.FONT_REGULAR,
        color: colors.LIGHT_COLORS.TERTIARY,
        fontWeight: typography.FONT_WEIGHT_REGULAR,
        fontSize: typography.FONT_SIZE_16,
        textAlign: 'center',
    },
    textBold: {
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    buttonsContainer: {
        gap: spacing.SCALE_20
    }
});