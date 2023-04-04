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
        borderColor: colors.LIGHT_COLORS.LIGHT_HINT,
        borderRadius: spacing.SCALE_20,
        padding: spacing.SCALE_8,
    }
});