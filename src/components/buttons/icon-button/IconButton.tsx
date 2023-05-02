import {
    StyleSheet,
    TouchableOpacity,
    View,
    TouchableOpacityProps,
    ViewProps,
} from 'react-native'
import {
    ReactNode,
    Dispatch,
    SetStateAction,
} from 'react'

import {
    colors,
    spacing,
} from 'styles';


type IconButtonProps = {
    children: ReactNode;
    activeOpacity?: number;
    onPress: Dispatch<SetStateAction<number>> | any,
    TouchableOpacityProps?: TouchableOpacityProps;
    ContainerProps?: ViewProps;
    size: number;
    color?: string;
    backgroundColor?: string;
}

export default function IconButton({
    children,
    activeOpacity = 0.7,
    onPress,
    TouchableOpacityProps,
    ContainerProps,
    size,
    color = colors.LIGHT_COLORS.LIGHT_HINT,
    backgroundColor = 'transparent'
}: IconButtonProps) {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size,
                    borderColor: color,
                    backgroundColor: backgroundColor
                }]}
            activeOpacity={activeOpacity}
            onPress={onPress}
            {...TouchableOpacityProps}

        >
            <View
                {...ContainerProps}
            >
                {children}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.SCALE_8,
    }
});