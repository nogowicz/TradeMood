import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SCREENS } from '../constants';
import OnBoarding from '@views/auth/onboarding';
import Login from '@views/auth/login';
import Signup from '@views/auth/signup';
import Welcome from '@views//auth/welcome';
import ForgotPassword from '@views/auth/forgot-password';


export default function AuthStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName={SCREENS.AUTH.ONBOARDING.ID}
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen
                name={SCREENS.AUTH.ONBOARDING.ID}
                component={OnBoarding}
            />

            <Stack.Screen
                name={SCREENS.AUTH.LOGIN.ID}
                component={Login}
            />

            <Stack.Screen
                name={SCREENS.AUTH.FORGOT_PASSWORD.ID}
                component={ForgotPassword}
            />

            <Stack.Screen
                name={SCREENS.AUTH.SIGN_UP.ID}
                component={Signup}
            />

            <Stack.Screen
                name={SCREENS.AUTH.WELCOME.ID}
                component={Welcome}
            />
        </Stack.Navigator>
    );
};
