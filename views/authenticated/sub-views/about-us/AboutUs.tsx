import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import React, { useContext } from 'react'
import IconButton from 'components/buttons/icon-button'

import { FormattedMessage } from 'react-intl'
import { spacing, typography } from 'styles'

import GoBack from 'assets/icons/Go-back.svg'
import SmallLogo from 'assets/logo/logo-smaller.svg'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@views/navigation/Navigation'
import { themeContext } from 'store/themeContext'


type AboutUsScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'AboutUs'>;

type AboutUsProps = {
    navigation: AboutUsScreenNavigationProp['navigation']
}

export default function AboutUs({ navigation }: AboutUsProps) {
    const theme = useContext(themeContext);
    return (
        <SafeAreaView style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <View style={styles.actionContainer}>
                    <View style={styles.actionContainerComponent} >
                        <IconButton
                            onPress={() => navigation.goBack()}
                            size={42}
                        >
                            <GoBack fill={theme.TERTIARY} />
                        </IconButton>
                    </View>
                    <SmallLogo />
                    <View style={styles.actionContainerComponent} />
                </View>
                <View style={styles.mainContainer}>
                    <View style={styles.sectionTitleContainer}>
                        <Text style={[styles.sectionTitle, { color: theme.TERTIARY }]}>
                            <FormattedMessage
                                defaultMessage='About Us'
                                id='views.home.profile.about-us.title'
                            />
                        </Text>
                    </View>

                </View>
            </View>
        </SafeAreaView>
    )
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
    },
    actionContainerComponent: {
        flex: 1 / 5
    },
    sectionTitle: {
        ...typography.FONT_BOLD,
        fontSize: typography.FONT_SIZE_32,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    mainContainer: {
        marginTop: spacing.SCALE_18,
    },
    sectionTitleContainer: {
        alignItems: 'center',
    },

})