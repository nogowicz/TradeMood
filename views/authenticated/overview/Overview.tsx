import {
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native';
import { useContext } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormattedMessage } from 'react-intl';

import { RootStackParamList } from '../../navigation/Navigation';
import { AuthContext } from '@views/navigation/AuthProvider';
import { colors, spacing } from 'styles';
import ProfileBar from 'components/profile-bar';
import IconButton from 'components/buttons/icon-button/IconButton';


type OverviewScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Overview'>;

type OverviewProps = {
    navigation: OverviewScreenNavigationProp['navigation']
}

export default function Overview({ navigation }: OverviewProps) {
    const { user } = useContext(AuthContext);

    console.log(user)
    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <View style={styles.actionContainer}>

                    <IconButton
                        onPress={console.log("lal")}
                        size={40}
                    >
                        <View />
                    </IconButton>
                    <ProfileBar
                        displayName={user?.displayName}
                        imageUrl={user?.photoURL}
                        isAnonymous={user?.isAnonymous}
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
    }
});