import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import IconButton from 'components/buttons/icon-button'
import FastImage from 'react-native-fast-image'
import { AuthContext } from '@views/navigation/AuthProvider'
import { FavoritesContext } from '@views/navigation/FavoritesProvider'
import Bookmark from 'assets/icons/Bookmark.svg'
import BookmarkSelected from 'assets/icons/Bookmark-selected.svg'
import GoBack from 'assets/icons/Go-back.svg'
import { useTheme } from 'store/themeContext'
import { spacing, typography } from 'styles'
import { InstrumentProps } from '@views/navigation/InstrumentProvider'
import { NavigationProp } from '@react-navigation/native'
import { RootStackParamList } from '@views/navigation/Navigation'


type AnimatedNavigationBarProps = {
    scrollY: Animated.Value;
    instrument: InstrumentProps;
    navigation: NavigationProp<RootStackParamList>;
};

export default function AnimatedNavigationBar({ scrollY, instrument, navigation }: AnimatedNavigationBarProps) {
    const favoriteCryptoCtx = useContext(FavoritesContext);
    const cryptoIsFavorite = favoriteCryptoCtx.ids.includes(instrument.id);
    const { user } = useContext(AuthContext);
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
                favoriteCryptoCtx.addFavorite(instrument.id);
            }
        }
    }

    return (
        <Animated.View style={[styles.actionContainer, { marginBottom }]}>
            <View style={styles.actionContainerComponent} >
                <IconButton
                    onPress={() => navigation.goBack()}
                    size={42}
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
                <FastImage
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
                    {cryptoIsFavorite ?
                        <BookmarkSelected width={32} height={32} /> :
                        <Bookmark stroke={theme.TERTIARY} width={32} height={32} />
                    }
                </TouchableOpacity> :
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
        fontSize: typography.FONT_SIZE_32,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        textAlign: 'center',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: spacing.SCALE_20,
    },
})