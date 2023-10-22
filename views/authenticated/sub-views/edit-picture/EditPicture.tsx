import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React, { useState, } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import { FormattedMessage, useIntl } from 'react-intl';
import { constants, spacing, typography } from 'styles';
import { useAuth } from 'store/AuthProvider';
import { useTheme } from 'store/ThemeContext';

import ProfileImagePicker from 'components/profile-image-picker';
import IconButton from 'components/buttons/icon-button';
import ProgressBar from 'components/progress-bar';
import ImagePickerButtons from 'components/profile-image-picker/ImagePickerButtons';


import GoBack from 'assets/icons/Go-back.svg'
import SmallLogo from 'assets/logo/logo-smaller.svg'

type EditPictureScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'EditPicture'>;

type EditPictureProps = {
    navigation: EditPictureScreenNavigationProp['navigation']
}


export default function EditPicture({ navigation }: EditPictureProps) {
    const { user } = useAuth();
    const [uploadingImage, setUploadingImage] = useState(false);
    const [step, setStep] = useState(0);
    const theme = useTheme();
    const [imageUrl, setImageUrl] = useState<string | null | undefined>(user?.photoURL);

    return (
        <SafeAreaView style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <View>
                    <View style={styles.actionContainer}>
                        <View style={styles.actionContainerComponent} >
                            <IconButton
                                onPress={
                                    () => {
                                        navigation.goBack()
                                    }}
                                size={42}
                            >
                                <GoBack fill={theme.TERTIARY} />
                            </IconButton>
                        </View>
                        <SmallLogo />

                        <View style={styles.actionContainerComponent} />
                    </View>
                    <View style={styles.textContainer}>
                        <View style={styles.textContainer}>
                            <Text style={[styles.title, { color: theme.TERTIARY }]}>
                                <FormattedMessage
                                    defaultMessage='Edit Your Profile Picture'
                                    id='views.home.profile.edit-picture.title'
                                />
                            </Text>
                            <Text style={[styles.subTitle, { color: theme.TERTIARY }]}>
                                <FormattedMessage
                                    defaultMessage='Please provide us with your profile picture'
                                    id='views.home.profile.edit-picture.subtitle'
                                />
                            </Text>
                        </View>

                    </View>
                    <View style={styles.mainContent}>
                        <ProfileImagePicker
                            imageUrl={imageUrl}
                            setImageUrl={setImageUrl}
                            size={constants.ICON_SIZE.IMAGE_PICKER_BIG}
                        />
                    </View>
                </View>

                <View>
                    {uploadingImage ?
                        <View style={styles.progressBar}>
                            <ProgressBar step={step} steps={100} height={constants.ICON_SIZE.PROGRESS_BAR_HEIGHT} />
                        </View>
                        :
                        <ImagePickerButtons
                            setUploadingImage={setUploadingImage}
                            setStep={setStep}
                            setImageUrl={setImageUrl}
                            imageUrl={imageUrl}
                        />}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {
        height: '100%',
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.SCALE_18,
        paddingVertical: spacing.SCALE_18,
        justifyContent: 'space-between',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionContainerComponent: {
        flex: 1 / 5
    },
    textContainer: {
        justifyContent: 'center',
    },
    title: {
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_24,
        textAlign: 'center',
        marginTop: spacing.SCALE_4
    },
    subTitle: {
        ...typography.FONT_REGULAR,
        fontWeight: typography.FONT_WEIGHT_REGULAR,
        fontSize: typography.FONT_SIZE_12,
        textAlign: 'center',
    },
    mainContent: {
        alignItems: 'center',
        marginTop: spacing.SCALE_90,
    },
    bottomSheetActionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: spacing.SCALE_20,
    },
    iconButtonBottomSheetText: {
        textAlign: 'center',
        fontWeight: typography.FONT_WEIGHT_SEMI_BOLD,
    },
    iconButtonBottomSheet: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.SCALE_8,
    },
    progressBar: {
        paddingHorizontal: spacing.SCALE_20,
        justifyContent: 'center',
        marginVertical: spacing.SCALE_40,
    }
})