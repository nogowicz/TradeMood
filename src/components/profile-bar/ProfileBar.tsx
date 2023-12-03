import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { constants, spacing, typography } from 'styles'
import { FormattedMessage } from 'react-intl';
import { useTheme } from 'store/ThemeContext';
import { useAuth } from 'store/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import { SCREENS } from '@views/navigation/constants';
import CustomImage from 'components/custom-image';

import SkeletonContent from './SkeletonContent';


export default function ProfileBar() {
    const theme = useTheme();
    const { user } = useAuth();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setIsLoading(false);
        }
    }, [user]);

    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    const onPress = () => {
        if (user?.isAnonymous) {
            navigation.navigate(SCREENS.HOME.PROFILE.ID);
        } else {
            navigation.navigate(SCREENS.HOME.PROFILE_WALL.ID)
        }
    };

    const greetings = {
        morning: {
            condition: (currentHour: number) => currentHour >= 5 && currentHour < 12,
            defaultMessage: 'Good Morning!',
            id: 'views.home.welcome-text.good-morning',
        },
        afternoon: {
            condition: (currentHour: number) => currentHour >= 12 && currentHour < 18,
            defaultMessage: 'Good Afternoon!',
            id: 'views.home.welcome-text.good-afternoon',
        },
        evening: {
            condition: (currentHour: number) => currentHour >= 18 && currentHour < 24,
            defaultMessage: 'Good evening!',
            id: 'views.home.welcome-text.good-evening',
        },
        night: {
            condition: (currentHour: number) => currentHour >= 0 && currentHour < 5,
            defaultMessage: 'Hello!',
            id: 'views.home.welcome-text.hello',
        },
    };

    if (isLoading) {
        return <SkeletonContent />
    }

    return (
        <TouchableOpacity
            style={[styles.container, { borderColor: theme.LIGHT_HINT }]}
            activeOpacity={constants.ACTIVE_OPACITY.MEDIUM}
            onPress={onPress}
        >
            <View style={styles.textContainer}>
                <Text style={[styles.welcomeText, { color: theme.HINT }]}>
                    {Object.values(greetings).map((greeting) =>
                        greeting.condition(currentHour) && (
                            <FormattedMessage
                                defaultMessage={greeting.defaultMessage}
                                id={greeting.id}
                                key={greeting.id}
                            />
                        )
                    )}
                </Text>
                <Text style={[styles.displayName, { color: theme.TERTIARY }]}>
                    {user?.isAnonymous ?
                        <FormattedMessage
                            defaultMessage='Stranger'
                            id='views.home.welcome-text.anonymous'
                        /> :
                        user?.displayName}
                </Text>
            </View>
            <View>
                {user?.photoURL ?
                    <CustomImage source={{ uri: user?.photoURL }} style={styles.imageStyle} /> :
                    <CustomImage source={require('assets/profile/profile-picture.png')} style={styles.imageStyle} />
                }
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: constants.BORDER_RADIUS.PROFILE_BAR,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: spacing.SCALE_8,
        gap: spacing.SCALE_8,
    },
    welcomeText: {
        ...typography.FONT_REGULAR,
        fontSize: typography.FONT_SIZE_10,
        fontWeight: typography.FONT_WEIGHT_REGULAR,
    },
    displayName: {
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_14,
    },
    textContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    imageStyle: {
        width: spacing.SCALE_40,
        height: spacing.SCALE_40,
        borderRadius: spacing.SCALE_40 / 2
    }
})