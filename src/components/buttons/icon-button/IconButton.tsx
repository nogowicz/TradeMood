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
    spacing,
} from 'styles';
import { useTheme } from 'store/themeContext';


type IconButtonProps = {
    children: ReactNode;
    activeOpacity?: number;
    onPress: Dispatch<SetStateAction<number>> | any,
    TouchableOpacityProps?: TouchableOpacityProps;
    ContainerProps?: ViewProps;
    size: number;
    backgroundColor?: string;
    isBorder?: boolean;
}

export default function IconButton({
    children,
    activeOpacity = 0.7,
    onPress,
    TouchableOpacityProps,
    ContainerProps,
    size,
    backgroundColor = 'transparent',
    isBorder = true
}: IconButtonProps) {
    const theme = useTheme();
    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size,
                    borderColor: theme.LIGHT_HINT,
                    backgroundColor: backgroundColor,
                    borderWidth: isBorder ? 1 : 0,
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.SCALE_8,
    }
});