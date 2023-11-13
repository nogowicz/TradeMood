import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import IconButton from 'components/buttons/icon-button';
import { useTheme } from 'store/ThemeContext';
import { constants, spacing } from 'styles';
import { useNavigation } from '@react-navigation/native';
import ProfileBar from 'components/profile-bar';
import { useAuth } from 'store/AuthProvider';
import { SCREENS } from '@views/navigation/constants';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';

import Discussion from 'assets/icons/Discussion-Inactive.svg'
import Search from 'assets/icons/Search.svg'


export default function ProfileOverviewBar() {
    const theme = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    return (
        <View style={styles.actionContainer}>
            <View style={styles.actionContainerLeftSide}>
                <IconButton
                    onPress={() => navigation.navigate(SCREENS.HOME.SEARCH.ID)}
                    size={constants.ICON_SIZE.BIG_ICON}
                    backgroundColor={theme.LIGHT_HINT}
                >
                    <Search stroke={theme.TERTIARY} strokeWidth={constants.STROKE_WIDTH.MEDIUM} />
                </IconButton>
                <IconButton
                    onPress={() => navigation.navigate(SCREENS.HOME.DISCUSSION.ID)}
                    size={constants.ICON_SIZE.BIG_ICON}
                    backgroundColor={theme.LIGHT_HINT}
                >
                    <Discussion stroke={theme.TERTIARY} strokeWidth={constants.STROKE_WIDTH.MEDIUM} />
                </IconButton>
            </View>
            <ProfileBar />
        </View>
    )
}

const styles = StyleSheet.create({
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionContainerLeftSide: {
        flexDirection: 'row',
        gap: spacing.SCALE_16
    },
})