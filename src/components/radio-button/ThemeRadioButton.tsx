import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Appearance,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { constants, spacing } from 'styles';
import { FormattedMessage } from 'react-intl';
import { useTheme } from 'store/ThemeContext';
import { EventRegister } from 'react-native-event-listeners';
import { getItem, setItem } from 'utils/asyncStorage';

type ThemeObject = {
    [key: string]: () => JSX.Element;
};

type RadioButtonProps = {
    values: any[];
}

export default function ThemeRadioButton({ values }: RadioButtonProps) {
    const theme = useTheme();
    const [themeMode, setThemeMode] = useState<boolean>();
    const colorScheme = Appearance.getColorScheme();



    useEffect(() => {
        const fetchThemeMode = async () => {
            await getItem('theme').then((storedTheme) => {
                console.log(storedTheme)
                if (storedTheme !== null) {
                    setThemeMode(storedTheme === "false" ? false : true);
                } else {
                    setThemeMode(colorScheme === "dark" ? true : false);
                }
            });
        };

        fetchThemeMode();
    }, []);



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
        ),
    }

    return (
        <View>
            {values.map(res => {
                return (
                    <TouchableOpacity
                        key={res.key}
                        style={styles.container}
                        activeOpacity={constants.ACTIVE_OPACITY.MEDIUM}
                        onPress={() => {
                            EventRegister.emit("changeTheme", res.value);
                            setThemeMode(res.value)
                            setItem('theme', res.value.toString());
                        }}
                    >
                        <View style={[styles.radioCircle, { borderColor: theme.TERTIARY }]}>
                            {themeMode === res.value && <View style={[styles.selectedRb, { backgroundColor: theme.TERTIARY }]} />}
                        </View>
                        <Text style={[styles.radioText, { color: theme.TERTIARY }]}>
                            {themeTranslation[res.key]()}
                        </Text>
                    </TouchableOpacity>
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
        fontWeight: '700'
    },
    radioCircle: {
        height: 30,
        width: 30,
        borderRadius: 100,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRb: {
        width: 15,
        height: 15,
        borderRadius: 50,
    },
});