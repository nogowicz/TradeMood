import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import React, { useContext, useState } from 'react'
import { colors, spacing } from 'styles';
import { FormattedMessage } from 'react-intl';
import { themeContext } from 'store/themeContext';
import { EventRegister } from 'react-native-event-listeners';
import { getItem, setItem } from 'utils/asyncStorage';

type ThemeObject = {
    [key: string]: () => JSX.Element;
};

type RadioButtonProps = {
    values: any[];
}

export default function ThemeRadioButton({ values }: RadioButtonProps) {
    const theme = useContext(themeContext);
    const [themeMode, setThemeMode] = useState(Boolean(getItem('theme')) ?? false);
    const themeTranslation: ThemeObject = {
        "Dark": () => (
            <FormattedMessage
                defaultMessage='Dark'
                id='views.home.profile.app-settings.theme.dark'
            />
        ),
        "Light": () => (
            <FormattedMessage
                defaultMessage='Light'
                id='views.home.profile.app-settings.theme.light'
            />
        )
    }

    return (
        <View>
            {values.map(res => {
                return (
                    <View key={res.key} style={styles.container}>
                        <TouchableOpacity
                            style={styles.radioCircle}
                            onPress={() => {
                                EventRegister.emit("changeTheme", res.value);
                                setItem('theme', String(res.value))
                                setThemeMode(res.value)
                            }}>
                            {themeMode === res.value && <View style={styles.selectedRb} />}
                        </TouchableOpacity>
                        <Text style={styles.radioText}>
                            {themeTranslation[res.key]()}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 35,
        alignItems: 'center',
        flexDirection: 'row',
        gap: spacing.SCALE_20,
        marginHorizontal: spacing.SCALE_20,
    },
    radioText: {
        marginRight: 35,
        fontSize: 20,
        color: '#ffff',
        fontWeight: '700'
    },
    radioCircle: {
        height: 30,
        width: 30,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: colors.LIGHT_COLORS.PRIMARY,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRb: {
        width: 15,
        height: 15,
        borderRadius: 50,
        backgroundColor: colors.LIGHT_COLORS.PRIMARY,
    },
});