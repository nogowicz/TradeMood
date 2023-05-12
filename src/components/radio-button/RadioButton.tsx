import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import React, { useContext, useState } from 'react'
import { colors, spacing } from 'styles';
import { LangContext } from '../../lang/LangProvider';


export default function RadioButton({ values }) {
    const [value, setValue] = useState();
    const [language, setLanguage] = useContext(LangContext);
    return (
        <View>
            {values.map(res => {
                return (
                    <View key={res.key} style={styles.container}>
                        <TouchableOpacity
                            style={styles.radioCircle}
                            onPress={() => {
                                setValue(res.key);
                            }}>
                            {value === res.key && <View style={styles.selectedRb} />}
                        </TouchableOpacity>
                        <Text style={styles.radioText}>{res.value}</Text>
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