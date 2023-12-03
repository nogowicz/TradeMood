import { StyleSheet, Text, View, SafeAreaView, } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../views/navigation/Navigation';
import { constants, spacing } from 'styles';
import { useTheme } from 'store/ThemeContext';

import OptionsContainer from './OptionsContainer';
import ProfileInfo from './ProfileInfo';

type ProfileScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Profile'>;

type ProfileProps = {
    navigation: ProfileScreenNavigationProp['navigation']
}


export default function Profile({ navigation }: ProfileProps) {
    const theme = useTheme();

    return (
        <SafeAreaView style={{
            ...styles.root,
            backgroundColor: theme.BACKGROUND,
        }}>
            <View style={styles.container}>
                <ProfileInfo />
                <OptionsContainer />
            </View>
            <View style={styles.infoTextContainer}>
                <Text style={{ color: theme.HINT }}>{constants.APP.NAME}</Text>
                <Text style={{ color: theme.HINT }}>{constants.APP.VERSION}</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.SCALE_20,
        paddingTop: spacing.SCALE_20,
    },
    infoTextContainer: {
        alignItems: 'center',
        marginVertical: spacing.SCALE_8,
    },
})