import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Overview from '../../authenticated/overview/Overview';
import { SCREENS } from '../constants';


export default function HomeStack() {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName={SCREENS.HOME.OVERVIEW.ID}
        >
            <Stack.Screen
                name={SCREENS.HOME.OVERVIEW.ID}
                component={Overview}
            />
        </Stack.Navigator>
    );
};
