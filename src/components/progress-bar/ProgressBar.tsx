import {
    useEffect,
    useRef,
    useState,
} from "react";
import {
    Animated,
    View,
    StyleSheet
} from "react-native";

import { colors, constants } from "styles";

type ProgressBarProps = {
    step: number;
    steps: number;
    height: number;

}

export default function ProgressBar({ step, steps, height }: any) {
    const [width, setWidth] = useState(0);
    const animatedValue = useRef(new Animated.Value(-1000)).current;
    const reactive = useRef(new Animated.Value(-1000)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: reactive,
            duration: 300,
            useNativeDriver: true,
        }).start()
    }, [])

    useEffect(() => {
        reactive.setValue(-width + (width * step) / steps);
    }, [step, width])

    return (
        <View style={[styles.container, { height }]}>
            <Animated.View
                onLayout={e => {
                    const newWidth = e.nativeEvent.layout.width;
                    setWidth(newWidth);
                }}
                style={[
                    styles.progressBar,
                    {
                        height,
                        transform: [{
                            translateX: animatedValue,
                        }]
                    }]}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.LIGHT_COLORS.QUATERNARY,
        overflow: 'hidden',
        borderRadius: constants.BORDER_RADIUS.INPUT
    },
    progressBar: {
        width: '100%',
        backgroundColor: colors.LIGHT_COLORS.PRIMARY,
        position: 'absolute',
        left: 0,
        top: 0,
    }
});