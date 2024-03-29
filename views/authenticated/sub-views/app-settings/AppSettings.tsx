import { SafeAreaView, StyleSheet, Text, View, useWindowDimensions, } from 'react-native'
import React, { useCallback, useRef } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import IconButton from 'components/buttons/icon-button';
import SubmitButton from 'components/buttons/submit-button';
import { FormattedMessage } from 'react-intl';
import { spacing, typography, constants, colors } from 'styles';
import BottomSheet from 'components/bottom-sheet';

import Language from 'assets/icons/Language.svg';
import Theme from 'assets/icons/Theme.svg';
import GoBack from 'assets/icons/Go-back.svg';
import SmallLogo from 'assets/logo/logo-smaller.svg';
import { BottomSheetRefProps } from 'components/bottom-sheet/BottomSheet';
import LanguageRadioButton from 'components/radio-button/LanguageRadioButton';
import { LANGUAGES } from 'lang/constants';
import ThemeRadioButton from 'components/radio-button/ThemeRadioButton';
import { useTheme } from 'store/ThemeContext';

type AppSettingsScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'AppSettings'>;

type AppSettingsProps = {
    navigation: AppSettingsScreenNavigationProp['navigation']
}

export type Entry = {
    key: string;
    value: string;
};


export default function AppSettings({ navigation }: AppSettingsProps) {
    const theme = useTheme();
    const refLang = useRef<BottomSheetRefProps>(null);
    const refTheme = useRef<BottomSheetRefProps>(null);
    const themeSheetOpen = useRef(false);
    const langSheetOpen = useRef(false);

    const { height } = useWindowDimensions();


    const handleShowLangBottomSheet = useCallback(() => {
        if (themeSheetOpen.current) {
            refTheme.current?.scrollTo(0);
        }
        langSheetOpen.current = !langSheetOpen.current;
        if (!langSheetOpen.current) {
            refLang.current?.scrollTo(0);
        } else {
            refLang.current?.scrollTo(-(height - constants.BOTTOM_SHEET_HEIGHT.LANGUAGE_SELECTION));
        }
    }, []);

    const handleShowThemeBottomSheet = useCallback(() => {
        if (langSheetOpen.current) {
            refLang.current?.scrollTo(0);
        }
        themeSheetOpen.current = !themeSheetOpen.current;
        if (!themeSheetOpen.current) {
            refTheme.current?.scrollTo(0);
        } else {
            refTheme.current?.scrollTo(-(height - constants.BOTTOM_SHEET_HEIGHT.THEME_SELECTION));
        }
    }, []);



    const langArray: Entry[] = Object.entries(LANGUAGES).map(([key, value]) => ({ key, value }));

    const themesEntry = {
        Dark: true,
        Light: false,
    }

    const themesArray = Object.entries(themesEntry).map(([key, value]) => ({ key, value }));




    return (
        <SafeAreaView style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <View style={styles.actionContainer}>
                    <View style={styles.actionContainerComponent} >
                        <IconButton
                            onPress={() => navigation.goBack()}
                            size={constants.ICON_SIZE.GO_BACK}
                        >
                            <View testID='goBack'>
                                <GoBack fill={theme.TERTIARY} />
                            </View>
                        </IconButton>
                    </View>
                    <SmallLogo />
                    <View style={styles.actionContainerComponent} />
                </View>
                <View style={styles.mainContainer}>
                    <View style={styles.sectionTitleContainer}>
                        <Text style={[styles.sectionTitle, { color: theme.TERTIARY }]}>
                            <FormattedMessage
                                defaultMessage='App Settings'
                                id='views.home.profile.app-settings.title'
                            />
                        </Text>
                    </View>
                    <View style={[styles.optionsContainer, { backgroundColor: theme.LIGHT_HINT }]}>
                        <View testID='language'>
                            <SubmitButton
                                label={
                                    <FormattedMessage
                                        defaultMessage='Language'
                                        id='views.home.profile.app-settings.language'
                                    />
                                }
                                onPress={() => handleShowLangBottomSheet()}
                                mode='option'
                                icon={<Language
                                    fill={theme.TERTIARY}
                                    width={constants.ICON_SIZE.ICON_MEDIUM}
                                    height={constants.ICON_SIZE.ICON_MEDIUM}
                                />}
                                activeOpacity={constants.ACTIVE_OPACITY.MEDIUM}
                            />
                        </View>
                        <View testID='theme'>
                            <SubmitButton
                                label={
                                    <FormattedMessage
                                        defaultMessage='Theme'
                                        id='views.home.profile.app-settings.theme'
                                    />
                                }
                                onPress={() => handleShowThemeBottomSheet()}
                                mode='option'
                                icon={<Theme
                                    fill={theme.TERTIARY}
                                    stroke={theme.BACKGROUND}
                                    width={constants.ICON_SIZE.ICON_MEDIUM}
                                    height={constants.ICON_SIZE.ICON_MEDIUM}
                                />
                                }
                                activeOpacity={constants.ACTIVE_OPACITY.MEDIUM}
                            />
                        </View>
                    </View>
                </View>
            </View>
            <BottomSheet
                ref={refLang}
                height={constants.BOTTOM_SHEET_HEIGHT.LANGUAGE_SELECTION}
            >
                <Text style={[styles.bottomSheetTitleText, { color: theme.TERTIARY }]}>
                    <FormattedMessage
                        defaultMessage='Choose Language'
                        id='views.home.profile.app-settings.choose-language'
                    />
                </Text>
                <LanguageRadioButton values={langArray} />
            </BottomSheet>

            <BottomSheet ref={refTheme} height={constants.BOTTOM_SHEET_HEIGHT.THEME_SELECTION}>
                <Text style={[styles.bottomSheetTitleText, { color: theme.TERTIARY }]}>
                    <FormattedMessage
                        defaultMessage='Choose Theme'
                        id='views.home.profile.app-settings.choose-theme'
                    />
                </Text>
                <ThemeRadioButton values={themesArray} />
            </BottomSheet>
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
        fontSize: typography.FONT_SIZE_28,
        textAlign: 'center',
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    mainContainer: {
        marginTop: spacing.SCALE_18,
    },
    sectionTitleContainer: {
        alignItems: 'center',
    },
    optionsContainer: {
        borderRadius: constants.BORDER_RADIUS.BOTTOM_SHEET,
        marginVertical: spacing.SCALE_40,
        justifyContent: 'center',
    },
    bottomSheetTitleText: {
        ...typography.FONT_BOLD,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: typography.FONT_SIZE_20,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        textAlign: 'center',
        marginBottom: spacing.SCALE_20,
    }
})