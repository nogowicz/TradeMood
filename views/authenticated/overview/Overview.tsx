import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useMemo } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormattedMessage } from 'react-intl';
import { RootStackParamList } from '../../navigation/Navigation';
import { useAuth } from 'store/AuthProvider';
import { spacing, typography } from 'styles';
import { SCREENS } from '@views/navigation/constants';
import { InstrumentProps, getMaxSentimentPositive, useInstrument } from 'store/InstrumentProvider';
import { useTheme } from 'store/ThemeContext';
import { useFavoriteCrypto } from 'hooks/useFavoriteCrypto';
import { useFolloweesPosts } from 'hooks/useFolloweesPosts';
import { PostType } from 'store/PostsProvider';

import Post from 'components/post';
import TrendingNow from 'components/trending-now';
import InstrumentRecord from 'components/instrument-record';
import ProfileOverviewBar from 'components/profile-overview-bar';




type OverviewScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Overview'>;

type OverviewProps = {
    navigation: OverviewScreenNavigationProp['navigation'];
}


export default function Overview({ navigation }: OverviewProps) {
    const { user } = useAuth();
    const theme = useTheme();
    const instruments = useInstrument();
    const { favoriteCrypto } = useFavoriteCrypto();
    const { followeesPosts } = useFolloweesPosts();

    const trendingInstrument = useMemo(() => getMaxSentimentPositive(instruments), [instruments]);
    const dataAvailable = useMemo(() => instruments && favoriteCrypto && followeesPosts, [instruments, favoriteCrypto, followeesPosts]);

    const followeesAvailable = followeesPosts && followeesPosts.length > 0;
    const favoriteCryptoAvailable = favoriteCrypto && favoriteCrypto?.length > 0;

    return (
        <SafeAreaView style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <ProfileOverviewBar />
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
                    <TrendingNow
                        name={trendingInstrument ? trendingInstrument.crypto : ''}
                        positive={trendingInstrument ? trendingInstrument.sentimentPositive : 0}
                        neutral={trendingInstrument ? trendingInstrument.sentimentNeutral : 0}
                        negative={trendingInstrument ? trendingInstrument.sentimentNegative : 0}
                        trendingWidget
                        title={
                            <FormattedMessage
                                defaultMessage='Trending Now'
                                id='views.home.overview.trending-now.title'
                            />
                        }
                        onPress={() => {
                            if (dataAvailable) {
                                navigation.navigate(SCREENS.HOME.INSTRUMENT_DETAILS.ID, { instrument: trendingInstrument } as any);
                            }
                        }}

                    />
                    {!user?.isAnonymous && (dataAvailable || followeesAvailable) ?
                        <View>
                            <View>
                                {followeesAvailable &&
                                    <Text style={[styles.listTitleText, { color: theme.TERTIARY }]}>
                                        <FormattedMessage
                                            defaultMessage='Favorites'
                                            id='views.home.overview.favorites'
                                        />
                                    </Text>}
                                {favoriteCryptoAvailable && favoriteCrypto.map((instrument: InstrumentProps) => (
                                    <InstrumentRecord {...instrument} key={instrument.id} />
                                ))}
                            </View>
                            <View>
                                {followeesAvailable &&
                                    <Text style={[styles.listTitleText, { color: theme.TERTIARY }]}>
                                        <FormattedMessage
                                            defaultMessage='Following'
                                            id='views.home.overview.following'
                                        />
                                    </Text>}
                                {followeesAvailable && followeesPosts.map((post: PostType) => (
                                    <Post {...post} key={post.uid} />
                                ))}
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