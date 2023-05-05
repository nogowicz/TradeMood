import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useContext } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormattedMessage } from 'react-intl';

import { RootStackParamList } from '../../navigation/Navigation';
import { AuthContext } from '@views/navigation/AuthProvider';
import { colors, spacing, typography } from 'styles';
import ProfileBar from 'components/profile-bar';
import IconButton from 'components/buttons/icon-button';

import Bell from 'assets/icons/Bell-icon.svg'
import Search from 'assets/icons/Search.svg'
import { SCREENS } from '@views/navigation/constants';
import TrendingNow from 'components/trending-now';


type OverviewScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Overview'>;

type OverviewProps = {
    navigation: OverviewScreenNavigationProp['navigation']
}

export default function Overview({ navigation }: OverviewProps) {
    const { user } = useContext(AuthContext);

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <View style={styles.actionContainer}>
                    <View style={styles.actionContainerLeftSide}>
                        <IconButton
                            onPress={() => console.log("Navigating to search")}
                            size={48}
                            backgroundColor={colors.LIGHT_COLORS.LIGHT_HINT}
                        >
                            <Search />
                        </IconButton>
                        <IconButton
                            onPress={() => console.log("Navigating to notification")}
                            size={48}
                            backgroundColor={colors.LIGHT_COLORS.LIGHT_HINT}
                        >
                            <Bell />
                        </IconButton>
                    </View>
                    <ProfileBar
                        displayName={user?.displayName}
                        imageUrl={user?.photoURL}
                        isAnonymous={user?.isAnonymous}
                        onPress={() => console.log("Navigating to profile details")}
                    />
                </View>
                <View style={styles.mainContainer}>
                    <Text style={styles.sectionTitle}>
                        <FormattedMessage
                            defaultMessage='Overview'
                            id='views.home.overview-title'
                        />
                    </Text>
                </View>
                <View>
                    <TrendingNow
                        name='Bitcoin'
                        positive={60}
                        neutral={10}
                        negative={30}
                        onPress={() => console.log("Navigating to details screen")}
                    />
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.LIGHT_COLORS.BACKGROUND,
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
        color: colors.LIGHT_COLORS.TERTIARY,
        fontSize: typography.FONT_SIZE_32,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    mainContainer: {
        marginTop: spacing.SCALE_18,
    }
});