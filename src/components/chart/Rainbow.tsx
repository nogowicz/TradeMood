import React from "react";
import { StyleSheet, View } from "react-native";

import Graph from "./Graph";



const Rainbow = () => {
    return (
        <View style={styles.container}>
            <Graph />
        </View>
    );
};

export default Rainbow;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "space-between",
    },
});