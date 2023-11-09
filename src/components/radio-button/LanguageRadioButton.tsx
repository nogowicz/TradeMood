import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import React, { useContext, useState } from 'react'
import { constants, spacing } from 'styles';
import { LangContext } from '../../lang/LangProvider';
import { FormattedMessage } from 'react-intl';
import { Entry } from '@views/authenticated/sub-views/app-settings/AppSettings';
import { languagesCodes } from 'lang/constants';
import { useTheme } from 'store/ThemeContext';

type LanguageObject = {
    [key: string]: () => JSX.Element;
};

type RadioButtonProps = {
    values: Entry[];
}

export default function LanguageRadioButton({ values }: RadioButtonProps) {
    const theme = useTheme();
    const [language, setLanguage] = useContext(LangContext);
    const [value, setValue] = useState<string>(languagesCodes[language]);
    const languageTranslation: LanguageObject = {
        "PL": () => (
            <FormattedMessage
                defaultMessage='Polish'
                id='views.home.profile.app-settings.language.pl'
            />
        ),
        "ENG": () => (
            <FormattedMessage
                defaultMessage='English'
                id='views.home.profile.app-settings.language.eng'
            />
        )
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
                            setLanguage(res.value)
                            setValue(res.key);
                        }}
                    >
                        <View style={[styles.radioCircle, { borderColor: theme.TERTIARY }]}>
                            {value === res.key && <View style={[styles.selectedRb, { backgroundColor: theme.TERTIARY }]} />}
                        </View>
                        <Text style={[styles.radioText, { color: theme.TERTIARY }]}>
                            {languageTranslation[res.key]()}
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