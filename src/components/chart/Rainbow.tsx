import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Graph from "./Graph";
import { colors } from "styles";
import { FormattedMessage } from "react-intl";



const Rainbow = (data: any) => {
    return (
        <View style={styles.container}>
            <Graph data={data} />
            <Text
                style={styles.text}
            >
                <FormattedMessage
                    defaultMessage='Data from'
                    id="views.home.instrument-details.data-from"
                />
                CoinGecko</Text>
        </View>
    );
};

export default Rainbow;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.LIGHT_COLORS.BACKGROUND,
        justifyContent: "space-between",
    },
    text: {
        color: colors.LIGHT_COLORS.TERTIARY,
        textAlign: 'right',
    }
});