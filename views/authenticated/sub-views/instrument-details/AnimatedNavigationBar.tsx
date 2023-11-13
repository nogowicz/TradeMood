import { Animated, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import IconButton from 'components/buttons/icon-button'
import { useAuth } from 'store/AuthProvider'
import { useFavoriteInstrument } from 'store/FavoritesProvider'
import Bookmark from 'assets/icons/Bookmark.svg'
import BookmarkSelected from 'assets/icons/Bookmark-selected.svg'
import GoBack from 'assets/icons/Go-back.svg'
import { useTheme } from 'store/ThemeContext'
import { constants, spacing, typography } from 'styles'
import { InstrumentProps } from 'store/InstrumentProvider'
import { NavigationProp } from '@react-navigation/native'
import { RootStackParamList } from '@views/navigation/Navigation'


type AnimatedNavigationBarProps = {
    scrollY: Animated.Value;
    instrument: InstrumentProps;
    navigation: NavigationProp<RootStackParamList>;
};

export default function AnimatedNavigationBar({ scrollY, instrument, navigation }: AnimatedNavigationBarProps) {
    const favoriteCryptoCtx = useFavoriteInstrument();
    const cryptoIsFavorite = favoriteCryptoCtx.ids.includes(instrument.id);
    const { user } = useAuth();
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

    function changeFavoriteStatusHandler() {
        if (instrument) {
            if (cryptoIsFavorite) {
                favoriteCryptoCtx.removeFavorite(instrument.id);
            } else {
                console.log(cryptoIsFavorite)
                favoriteCryptoCtx.addFavorite(instrument.id);
            }
        }
    }

    return (
        <Animated.View style={[styles.actionContainer, { marginBottom }]}>
            <IconButton
                onPress={() => navigation.goBack()}
                size={constants.ICON_SIZE.GO_BACK}
            >
                <View testID="goBack">
                    <GoBack fill={theme.TERTIARY} />
                </View>
            </IconButton>
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
                <Image
                    source={{ uri: instrument.photoUrl }}
                    style={styles.image}
                />
                <Text
                    style={[
                        styles.sectionTitle,
                        { color: theme.TERTIARY }
                    ]}
                    ellipsizeMode='tail'
                    numberOfLines={2}
                >
                    {instrument.crypto}
                </Text>
            </Animated.View>
            {!user?.isAnonymous ?

                <TouchableOpacity
                    onPress={changeFavoriteStatusHandler}
                    style={{ marginTop: backIconMargin }}
                >
                    <View testID="bookmark">
                        {cryptoIsFavorite ?
                            <BookmarkSelected width={32} height={32} /> :
                            <Bookmark stroke={theme.TERTIARY} width={32} height={32} />
                        }
                    </View>
                </TouchableOpacity>
                :
                <View style={{ width: 32 }} />
            }
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