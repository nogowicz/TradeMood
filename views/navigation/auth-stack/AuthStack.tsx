import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SCREENS } from '../constants';
import OnBoarding from '../../auth/onboarding';
import Login from '../../auth/login';
import Signup from '../../auth/signup';


export default function AuthStack() {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName={SCREENS.AUTH.ONBOARDING.ID}
            screenOptions={{
                headerShown: false,
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
                name={SCREENS.AUTH.SIGN_UP.ID}
                component={Signup}
            />
        </Stack.Navigator>
    );
};
