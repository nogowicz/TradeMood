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
}

export default function IconButton({
    children,
    activeOpacity = 0.7,
    onPress,
    TouchableOpacityProps,
    ContainerProps,
}: IconButtonProps) {
    return (
        <TouchableOpacity
            style={styles.container}
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
        width: 42,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: colors.LIGHT_COLORS.LIGHT_HINT,
        borderRadius: 42 / 2,
        padding: spacing.SCALE_8,
    }
});