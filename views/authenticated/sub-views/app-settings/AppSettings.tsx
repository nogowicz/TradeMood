import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import React, { useCallback, useRef } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import { SCREENS } from '@views/navigation/constants';
import IconButton from 'components/buttons/icon-button';
import SubmitButton from 'components/buttons/submit-button';
import { FormattedMessage } from 'react-intl';
import { colors, spacing, typography, constants } from 'styles';
import BottomSheet from 'components/bottom-sheet';

import Language from 'assets/icons/Language.svg'
import GoBack from 'assets/icons/Go-back.svg'
import SmallLogo from 'assets/logo/logo-smaller.svg'
import { BottomSheetRefProps } from 'components/bottom-sheet/BottomSheet';
import RadioButton from 'components/radio-button/RadioButton';
import { LANGUAGES } from 'lang/constants';

type AppSettingsScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'AppSettings'>;

type AppSettingsProps = {
    navigation: AppSettingsScreenNavigationProp['navigation']
}

export type LanguageEntry = {
    key: string;
    value: string;
};


export default function AppSettings({ navigation }: AppSettingsProps) {
    const ref = useRef<BottomSheetRefProps>(null);
    const handleShowBottomSheet = useCallback(() => {
        const isActive = ref?.current?.isActive();
        if (isActive) {
            ref?.current?.scrollTo(0);
        } else {
            ref?.current?.scrollTo(-200);
        }
    }, []);

    const langArray: LanguageEntry[] = Object.entries(LANGUAGES).map(([key, value]) => ({ key, value }));


    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <View style={styles.actionContainer}>
                    <View style={styles.actionContainerComponent} >
                        <IconButton
                            onPress={() => navigation.goBack()}
                            size={42}
                        >
                            <GoBack />
                        </IconButton>
                    </View>
                    <SmallLogo />
                    <View style={styles.actionContainerComponent} />
                </View>
                <View style={styles.mainContainer}>
                    <View style={styles.sectionTitleContainer}>
                        <Text style={styles.sectionTitle}>
                            <FormattedMessage
                                defaultMessage='App Settings'
                                id='views.home.profile.app-settings.title'
                            />
                        </Text>
                    </View>
                    <View style={styles.optionsContainer}>
                        <SubmitButton
                            label={
                                <FormattedMessage
                                    defaultMessage='Language'
                                    id='views.home.profile.app-settings.language'
                                />
                            }
                            onPress={() => handleShowBottomSheet()}
                            mode='option'
                            icon={<Language />}
                            activeOpacity={0.5}
                        />

                    </View>
                </View>
            </View>
            <BottomSheet ref={ref}>
                <Text style={styles.bottomSheetTitleText}>
                    <FormattedMessage
                        defaultMessage='Choose Language'
                        id='views.home.profile.app-settings.choose-language'
                    />
                </Text>
                <RadioButton values={langArray} />
            </BottomSheet>
        </SafeAreaView>
    )
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
    },
    actionContainerComponent: {
        flex: 1 / 5
    },
    sectionTitle: {
        ...typography.FONT_BOLD,
        color: colors.LIGHT_COLORS.TERTIARY,
        fontSize: typography.FONT_SIZE_32,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    mainContainer: {
        marginTop: spacing.SCALE_18,
    },
    sectionTitleContainer: {
        alignItems: 'center',
    },
    optionsContainer: {
        backgroundColor: colors.LIGHT_COLORS.LIGHT_HINT,
        borderRadius: constants.BORDER_RADIUS.BOTTOM_SHEET,
        marginVertical: spacing.SCALE_40,
        justifyContent: 'center',
    },
    bottomSheetTitleText: {
        ...typography.FONT_BOLD,
        color: colors.LIGHT_COLORS.BACKGROUND,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: typography.FONT_SIZE_20,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        textAlign: 'center',
        marginBottom: spacing.SCALE_20,
    }
})