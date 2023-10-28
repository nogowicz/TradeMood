import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import IconButton from 'components/buttons/icon-button'
import SmallLogo from 'assets/logo/logo-smaller.svg'
import GoBack from 'assets/icons/Go-back.svg'
import { useTheme } from 'store/ThemeContext'
import { constants, spacing, typography } from 'styles'
import { NavigationProp } from '@react-navigation/native'
import { RootStackParamList } from '@views/navigation/Navigation'
import { FormattedMessage } from 'react-intl'


type AnimatedNavigationBarProps = {
    scrollY: Animated.Value;
    navigation: NavigationProp<RootStackParamList>;
};

export default function AnimatedNavigationBar({ scrollY, navigation }: AnimatedNavigationBarProps) {
    const theme = useTheme();
    const backIconMargin = 8;


    const logoScale = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.5],
        extrapolate: 'clamp',
    });

    const logoTranslateY = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -50],
        extrapolate: 'clamp',
    });

    const marginBottom = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -50],
        extrapolate: 'clamp',
    });



    return (
        <Animated.View style={[styles.actionContainer, { marginBottom }]}>
            <View style={styles.actionContainerComponent} >
                <IconButton
                    onPress={() => navigation.goBack()}
                    size={constants.ICON_SIZE.GO_BACK}
                >
                    <GoBack fill={theme.TERTIARY} />
                </IconButton>
            </View>
            <Animated.View
                style={[
                    {
                        marginLeft: -(backIconMargin),
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: [{ scale: logoScale },
                        { translateY: logoTranslateY }],
                        maxWidth: '50%',
                    },
                ]}
            >
                <SmallLogo />
                <Text
                    style={[
                        styles.sectionTitle,
                        { color: theme.TERTIARY }
                    ]}
                    ellipsizeMode='tail'
                    numberOfLines={2}
                >
                    <FormattedMessage
                        defaultMessage='About Us'
                        id='views.home.profile.about-us.title'
                    />
                </Text>
            </Animated.View>
            <View style={styles.actionContainerComponent} />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionContainerComponent: {
        flex: 1 / 5,
    },
    sectionTitle: {
        ...typography.FONT_BOLD,
        fontSize: typography.FONT_SIZE_28,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        textAlign: 'center',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: spacing.SCALE_20,
    },
})