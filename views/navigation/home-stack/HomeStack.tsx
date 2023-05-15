import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREENS } from '../constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Overview from '@views/authenticated/overview';
import Search from '@views/authenticated/search';
import Notification from '@views/authenticated/notification';
import Profile from '@views/authenticated/profile';

import OverviewActive from 'assets/icons/Overview-Active.svg'
import OverviewInactive from 'assets/icons/Overview-Inactive.svg'

import SearchActive from 'assets/icons/Search-Active.svg'
import SearchInactive from 'assets/icons/Search.svg'

import NotificationInactive from 'assets/icons/Notification.svg'
import NotificationActive from 'assets/icons/Notification-Active.svg'

import ProfileInactive from 'assets/icons/Profile.svg'
import ProfileActive from 'assets/icons/Profile-Active.svg'
import { spacing } from 'styles';
import EditProfile from '@views/authenticated/sub-views/edit-profile';
import EditEmail from '@views/authenticated/sub-views/edit-email';
import EditPersonalInfo from '@views/authenticated/sub-views/edit-personal-info';
import EditPicture from '@views/authenticated/sub-views/edit-picture';
import EditPassword from '@views/authenticated/sub-views/edit-password';
import AppSettings from '@views/authenticated/sub-views/app-settings';
import AboutUs from '@views/authenticated/sub-views/about-us';
import InstrumentDetails from '@views/authenticated/sub-views/instrument-details';

export default function HomeStack() {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();

    function MyTabs() {
        return (
            <Tab.Navigator
                initialRouteName={SCREENS.HOME.OVERVIEW.ID}
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: { height: spacing.SCALE_60 },
                    tabBarHideOnKeyboard: true,
                }}

            >
                <Tab.Screen
                    name={SCREENS.HOME.OVERVIEW.ID}
                    component={Overview}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            focused ? <OverviewActive /> : <OverviewInactive />
                        ),
                    }}
                />
                <Tab.Screen
                    name={SCREENS.HOME.SEARCH.ID}
                    component={Search}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            focused ? <SearchActive /> : <SearchInactive />
                        ),
                    }}
                />
                <Tab.Screen
                    name={SCREENS.HOME.NOTIFICATION.ID}
                    component={Notification}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            focused ? <NotificationActive /> : <NotificationInactive />
                        ),
                    }}
                />
                <Tab.Screen
                    name={SCREENS.HOME.PROFILE.ID}
                    component={Profile}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            focused ? <ProfileActive /> : <ProfileInactive />
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }

    const instrumentData = {
        activityTM: 0,
        activityTW: 0,
        crypto: "Cryptocurrency",
        id: "Cryptocurrency",
        photoUrl: "https://cryptologos.cc/logos/binance-usd-busd-logo.png",
        sentiment: "Neutral",
        sentimentDirection: "steady",
        sentimentNegative: 0,
        sentimentNeutral: 0,
        sentimentPositive: 0,
        stockSymbol: "CRYPTO",
        time: new Date()
    };

    return (
        <Stack.Navigator
            initialRouteName='MyTabs'
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen
                name='MyTabs'
                component={MyTabs}
            />

            <Stack.Screen
                name={SCREENS.HOME.EDIT_PROFILE.ID}
                component={EditProfile}
            />

            <Stack.Screen
                name={SCREENS.HOME.EDIT_EMAIL.ID}
                component={EditEmail}
            />

            <Stack.Screen
                name={SCREENS.HOME.EDIT_PERSONAL_INFO.ID}
                component={EditPersonalInfo}
            />

            <Stack.Screen
                name={SCREENS.HOME.EDIT_PICTURE.ID}
                component={EditPicture}
            />

            <Stack.Screen
                name={SCREENS.HOME.EDIT_PASSWORD.ID}
                component={EditPassword}
            />

            <Stack.Screen
                name={SCREENS.HOME.APP_SETTINGS.ID}
                component={AppSettings}
            />

            <Stack.Screen
                name={SCREENS.HOME.ABOUT_US.ID}
                component={AboutUs}
            />

            <Stack.Screen
                name={SCREENS.HOME.INSTRUMENT_DETAILS.ID}
                //@ts-ignore
                component={InstrumentDetails}
            />
        </Stack.Navigator>
    );
};
