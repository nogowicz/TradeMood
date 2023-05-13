import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import React, { useContext, useState } from 'react'
import { colors, spacing } from 'styles';
import { LangContext } from '../../lang/LangProvider';
import { FormattedMessage } from 'react-intl';
import { LanguageEntry } from '@views/authenticated/sub-views/app-settings/AppSettings';
import { languagesCodes } from 'lang/constants';

type LanguageObject = {
    [key: string]: () => JSX.Element;
};

type RadioButtonProps = {
    values: LanguageEntry[];
}

export default function RadioButton({ values }: RadioButtonProps) {
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
                    <View key={res.key} style={styles.container}>
                        <TouchableOpacity
                            style={styles.radioCircle}
                            onPress={() => {
                                setLanguage(res.value)
                                setValue(res.key);
                            }}>
                            {value === res.key && <View style={styles.selectedRb} />}
                        </TouchableOpacity>
                        <Text style={styles.radioText}>
                            {languageTranslation[res.key]()}
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