import React, { useState } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import * as shape from "d3-shape";
import Svg, { Path } from "react-native-svg";
import { scaleLinear } from "d3-scale";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";


import Header from "./Header";
import Cursor from "./Cursor";
import data from "./data2.json";
import { useVector } from "react-native-redash";
import { useSharedValue } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const values = data;
const POINTS = 60;

export const SIZE = Dimensions.get("window").width;

type GraphIndex = 0;
type PriceList = number[][];

const buildGraph = (datapoints: PriceList) => {
    console.log("Data:", datapoints)
    const priceList = datapoints.slice(0, POINTS);
    const formattedValues = priceList.map(
        (price) => [price[1], price[0]] as [number, number]
    );
    const prices = formattedValues.map((value) => value[0]);
    const dates = formattedValues.map((value) => value[1]);
    const scaleX = scaleLinear()
        .domain([Math.min(...dates), Math.max(...dates)])
        .range([0, SIZE]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const scaleY = scaleLinear().domain([minPrice, maxPrice]).range([SIZE / 2, 0]);
    return {
        path: shape
            .line()
            .x(([, x]) => scaleX(x) as number)
            .y(([y]) => scaleY(y) as number)
            .curve(shape.curveBasis)(formattedValues) as string,
    };
};

const graph = [
    {
        label: "Last Month",
        value: 0,
        data: buildGraph(values),
    },
];



const Graph = () => {
    const translation = useVector();
    const [selected, setSelected] = useState(0);
    const current = useSharedValue<GraphIndex>(0);

    const graph = [
        {
            label: "Last Month",
            value: 0,
            data: buildGraph(values),
        },
    ];

    const currentPath = graph[current.value].data.path;

    return (
        <View style={styles.container}>
            <Header translation={translation} index={current} />
            <View>
                <Svg width={SIZE} height={SIZE / 2}>
                    <Path
                        d={currentPath}
                        fill="transparent"
                        stroke="black"
                        strokeWidth={3}
                    />
                </Svg>
                <Cursor translation={translation} index={current} />
            </View>
            <View style={styles.selection}>
                <View style={StyleSheet.absoluteFill}>
                    <View
                        style={[
                            styles.backgroundSelection,
                            { transform: [{ translateX: BUTTON_WIDTH * selected }] },
                        ]}
                    />
                </View>
                {graph.map((graph, index) => {
                    return (
                        <TouchableWithoutFeedback
                            key={graph.label}
                            onPress={() => {
                                setSelected(index);
                            }}
                        >
                            <View style={[styles.labelContainer]}>
                                <Text style={styles.label}>{graph.label}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                })}
            </View>
        </View>
    );
};


export default Graph;

const SELECTION_WIDTH = width - 32;
const BUTTON_WIDTH = (width - 32) / graph.length;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    backgroundSelection: {
        backgroundColor: "#f3f3f3",
        ...StyleSheet.absoluteFillObject,
        width: BUTTON_WIDTH,
        borderRadius: 8,
    },
    selection: {
        flexDirection: "row",
        width: SELECTION_WIDTH,
        alignSelf: "center",
    },
    labelContainer: {
        padding: 16,
        width: BUTTON_WIDTH,
    },
    label: {
        fontSize: 16,
        color: "black",
        fontWeight: "bold",
        textAlign: "center",
    },
});