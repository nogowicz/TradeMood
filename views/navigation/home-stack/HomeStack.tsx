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
import { useContext } from 'react';
import { themeContext } from 'store/themeContext';

export default function HomeStack() {
    const theme = useContext(themeContext);
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();

    function MyTabs() {
        return (
            <Tab.Navigator
                initialRouteName={SCREENS.HOME.OVERVIEW.ID}
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        height: spacing.SCALE_60,
                        backgroundColor: theme.BACKGROUND,
                    },
                    tabBarHideOnKeyboard: true,
                }}
            >
                <Tab.Screen
                    name={SCREENS.HOME.OVERVIEW.ID}
                    component={Overview}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            focused ? <OverviewActive /> : <OverviewInactive stroke={theme.TERTIARY} />
                        ),
                    }}
                />
                <Tab.Screen
                    name={SCREENS.HOME.SEARCH.ID}
                    component={Search}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            focused ? <SearchActive /> : <SearchInactive stroke={theme.TERTIARY} />
                        ),
                    }}
                />
                <Tab.Screen
                    name={SCREENS.HOME.NOTIFICATION.ID}
                    component={Notification}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            focused ? <NotificationActive /> : <NotificationInactive stroke={theme.TERTIARY} />
                        ),
                    }}
                />
                <Tab.Screen
                    name={SCREENS.HOME.PROFILE.ID}
                    component={Profile}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            focused ? <ProfileActive /> : <ProfileInactive stroke={theme.TERTIARY} />
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }

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
