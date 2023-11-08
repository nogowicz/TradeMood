import { SafeAreaView, StyleSheet, Text, View, ScrollView, } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormattedMessage } from 'react-intl';
import { RootStackParamList } from '../../navigation/Navigation';
import { useAuth } from 'store/AuthProvider';
import { constants, spacing, typography } from 'styles';
import ProfileBar from 'components/profile-bar';
import IconButton from 'components/buttons/icon-button';
import { SCREENS } from '@views/navigation/constants';
import TrendingNow from 'components/trending-now';
import { InstrumentContext, InstrumentProps, getMaxSentimentPositive } from 'store/InstrumentProvider';
import InstrumentRecord from 'components/instrument-record';
import { useTheme } from 'store/ThemeContext';
import { useFavoriteCrypto } from 'hooks/useFavoriteCrypto';
import { useFolloweesPosts } from 'hooks/useFolloweesPosts';
import { PostType } from 'store/PostsProvider';
import Post from 'components/post';

import Discussion from 'assets/icons/Discussion-Inactive.svg'
import Search from 'assets/icons/Search.svg'


type OverviewScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Overview'>;

type OverviewProps = {
    navigation: OverviewScreenNavigationProp['navigation'];
}


export default function Overview({ navigation }: OverviewProps) {
    const { user } = useAuth();
    const theme = useTheme();
    const instruments = useContext(InstrumentContext);
    const { favoriteCrypto } = useFavoriteCrypto();
    const { followeesPosts } = useFolloweesPosts();


    const trendingInstrument: InstrumentProps | undefined = getMaxSentimentPositive(instruments);

    return (
        <SafeAreaView style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <View style={styles.actionContainer}>
                    <View style={styles.actionContainerLeftSide}>
                        <IconButton
                            onPress={() => navigation.navigate(SCREENS.HOME.SEARCH.ID)}
                            size={constants.ICON_SIZE.BIG_ICON}
                            backgroundColor={theme.LIGHT_HINT}
                        >
                            <Search stroke={theme.TERTIARY} strokeWidth={constants.STROKE_WIDTH.MEDIUM} />
                        </IconButton>
                        <IconButton
                            onPress={() => navigation.navigate(SCREENS.HOME.DISCUSSION.ID)}
                            size={constants.ICON_SIZE.BIG_ICON}
                            backgroundColor={theme.LIGHT_HINT}
                        >
                            <Discussion stroke={theme.TERTIARY} strokeWidth={constants.STROKE_WIDTH.MEDIUM} />
                        </IconButton>
                    </View>
                    <ProfileBar
                        displayName={user?.displayName}
                        imageUrl={user?.photoURL}
                        isAnonymous={user?.isAnonymous}
                        onPress={() => {
                            if (user?.isAnonymous) {
                                navigation.navigate(SCREENS.HOME.PROFILE.ID);
                            } else {
                                navigation.navigate(SCREENS.HOME.PROFILE_WALL.ID)
                            }
                        }}
                    />
                </View>
                <View style={styles.mainContainer}>
                    <Text style={[styles.sectionTitle, { color: theme.TERTIARY }]}>
                        <FormattedMessage
                            defaultMessage='Overview'
                            id='views.home.overview.title'
                        />
                    </Text>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1, }}
                >
                    <View>

                        <TrendingNow
                            name={trendingInstrument ? trendingInstrument.crypto : ''}
                            title={
                                <FormattedMessage
                                    defaultMessage='Trending Now'
                                    id='views.home.overview.trending-now.title'
                                />
                            }
                            positive={trendingInstrument ? trendingInstrument.sentimentPositive : 0}
                            neutral={trendingInstrument ? trendingInstrument.sentimentNeutral : 0}
                            negative={trendingInstrument ? trendingInstrument.sentimentNegative : 0}
                            trendingWidget
                            onPress={() => {
                                if (instruments && instruments.length > 0) {
                                    navigation.navigate(SCREENS.HOME.INSTRUMENT_DETAILS.ID, { instrument: instruments[0] } as any);
                                }
                            }}

                        />
                    </View>
                    {!user?.isAnonymous && ((favoriteCrypto && favoriteCrypto?.length > 0) || followeesPosts && followeesPosts.length > 0) ?
                        <View>
                            <View>
                                {favoriteCrypto && favoriteCrypto?.length > 0 &&
                                    <Text style={[styles.listTitleText, { color: theme.TERTIARY }]}>
                                        <FormattedMessage
                                            defaultMessage='Favorites'
                                            id='views.home.overview.favorites'
                                        />
                                    </Text>}
                                {(favoriteCrypto && favoriteCrypto.length > 0) && favoriteCrypto.map((instrument: InstrumentProps) => {
                                    return (
                                        <InstrumentRecord
                                            key={instrument.id}
                                            crypto={instrument.crypto}
                                            sentimentDirection={instrument.sentimentDirection}
                                            overallSentiment={instrument.overallSentiment}
                                            photoUrl={instrument.photoUrl}
                                            onPress={() => {
                                                navigation.navigate(SCREENS.HOME.INSTRUMENT_DETAILS.ID, { instrument: instrument } as any);
                                            }}
                                        />
                                    )

                                })
                                }
                            </View>
                            <View>
                                {followeesPosts && followeesPosts.length > 0 &&
                                    <Text style={[styles.listTitleText, { color: theme.TERTIARY }]}>
                                        <FormattedMessage
                                            defaultMessage='Following'
                                            id='views.home.overview.following'
                                        />
                                    </Text>}
                                {(followeesPosts && followeesPosts.length > 0) && followeesPosts.map((post: PostType) => {
                                    return (
                                        <Post
                                            createdAt={post.createdAt}
                                            likes={post.likes}
                                            text={post.text}
                                            uid={post.uid}
                                            userUID={post.userUID}
                                            key={post.key} />
                                    )

                                })}
                            </View>
                        </View> :
                        <View>
                            {user?.isAnonymous ?
                                <View>
                                    <Text
                                        style={[{
                                            ...styles.noItemsInfoText,
                                            color: theme.LIGHT_HINT,
                                        }]}
                                    >
                                        <FormattedMessage
                                            defaultMessage='Log in or register'
                                            id='views.home.overview.anonymous.login-or-register'
                                        />
                                    </Text>
                                </View> :
                                <View>
                                    <Text
                                        style={[{
                                            ...styles.noItemsInfoText,
                                            color: theme.LIGHT_HINT,
                                        }]}
                                    >
                                        <FormattedMessage
                                            defaultMessage='When you observe instruments or other people, something will appear'
                                            id='views.home.overview.no-favorites-and-follows'
                                        />
                                    </Text>
                                </View>
                            }
                        </View>

                    }
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.SCALE_20,
        paddingTop: spacing.SCALE_20,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionContainerLeftSide: {
        flexDirection: 'row',
        gap: spacing.SCALE_16
    },
    sectionTitle: {
        ...typography.FONT_BOLD,
        fontSize: typography.FONT_SIZE_28,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    mainContainer: {
        marginVertical: spacing.SCALE_18,
    },
    listTitleText: {
        ...typography.FONT_BOLD,
        fontSize: typography.FONT_SIZE_24,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    noItemsInfoText: {
        fontSize: typography.FONT_SIZE_24,
        marginVertical: spacing.SCALE_16,
        textAlign: 'center'
    }
});