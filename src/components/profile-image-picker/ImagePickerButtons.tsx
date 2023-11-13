import { StyleSheet, Text, View } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { constants, spacing, typography } from 'styles'
import { useTheme } from 'store/ThemeContext'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import storage from '@react-native-firebase/storage';
import IconButton from 'components/buttons/icon-button'
import { useAuth } from 'store/AuthProvider'
import Snackbar from 'react-native-snackbar'
import ImageResizer from '@bam.tech/react-native-image-resizer';

import Gallery from 'assets/icons/Gallery.svg'
import DeletePhoto from 'assets/icons/DeletePhoto.svg'
import Camera from 'assets/icons/Camera.svg'



type ImagePickerButtonsProps = {
    setUploadingImage: Dispatch<SetStateAction<boolean>>;
    setStep: Dispatch<SetStateAction<number>>;
    setImageUrl: Dispatch<SetStateAction<string | undefined | null>>;
    imageUrl: string | null | undefined;
};

export default function ImagePickerButtons({
    setUploadingImage,
    setStep,
    setImageUrl,
    imageUrl
}: ImagePickerButtonsProps) {
    const { updateProfilePicture } = useAuth();
    const theme = useTheme();
    const intl = useIntl();

    const [oldImageUrl, setOldImageUrl] = useState<string | null | undefined>();

    //translations:
    const uploadingImageErrorTranslation = intl.formatMessage({
        id: "views.home.profile.edit-picture.uploading-error",
        defaultMessage: "Error occurred while uploading image"
    });
    const deletingImageErrorTranslation = intl.formatMessage({
        id: "views.home.profile.edit-picture.deleting-error",
        defaultMessage: "Error occurred while deleting image"
    });

    useEffect(() => {
        if (oldImageUrl) {
            deleteImage(oldImageUrl, true).then(() => {
                console.log('Old image has been deleted.');
            }).catch((deleteError) => {
                console.error('Error occurred while deleting old photo:', deleteError);
            }).finally(() => {
                setOldImageUrl(null);
            });
        }
    }, [oldImageUrl]);

    const onSubmit = async (imageUrl: string | undefined | null) => {
        try {
            await updateProfilePicture(imageUrl)
        } catch (error: any) {
            console.log(error);
            Snackbar.show({
                text: uploadingImageErrorTranslation,
                duration: Snackbar.LENGTH_SHORT,
            });
        }
    }

    const uploadImage = async () => {
        launchImageLibrary({
            mediaType: 'photo'
        }, async (response) => {
            if (response.assets && response.assets.length > 0) {
                let { uri, fileName } = response.assets[0];
                if (uri) {

                    await ImageResizer.createResizedImage(
                        uri,
                        500,
                        500,
                        'JPEG',
                        70,
                    ).then((resizedImageUri) => {
                        uri = resizedImageUri.uri;
                    });

                }
                const storageRef = storage().ref(`usersProfilePictures/${fileName}`);

                const blob = uri ? await fetch(uri).then((response) => response.blob()) : null;

                if (blob) {
                    const uploadTask = storageRef.put(blob);

                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            setUploadingImage(true);
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setStep(Math.floor(progress));
                            console.log(`Uploading progress: ${progress}%`);
                        },
                        (error) => {
                            console.log(error);
                            setUploadingImage(false);
                            Snackbar.show({
                                text: uploadingImageErrorTranslation,
                                duration: Snackbar.LENGTH_SHORT,
                            });
                        },
                        () => {
                            if (uploadTask.snapshot !== null) {
                                console.log('Upload is ' + uploadTask.snapshot.bytesTransferred + ' bytes done.');
                                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                    setOldImageUrl(imageUrl);
                                    console.log('File available at', downloadURL);
                                    setUploadingImage(false);
                                    setImageUrl(downloadURL);
                                    onSubmit(downloadURL);
                                });
                            } else {
                                Snackbar.show({
                                    text: uploadingImageErrorTranslation,
                                    duration: Snackbar.LENGTH_SHORT,
                                });
                                console.log('Error occurred while uploading.');
                                setUploadingImage(false);
                            }
                        }
                    )
                } else {
                    console.error('Error no data in file');
                    Snackbar.show({
                        text: uploadingImageErrorTranslation,
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }
            }
        });
    };

    const takePhoto = async () => {
        launchCamera({ mediaType: 'photo' }, async (response) => {
            if (response.assets && response.assets.length > 0) {
                let { uri, fileName } = response.assets[0];
                if (uri) {

                    await ImageResizer.createResizedImage(
                        uri,
                        500,
                        500,
                        'JPEG',
                        70,
                    ).then((resizedImageUri) => {
                        uri = resizedImageUri.uri;
                    });

                }
                const storageRef = storage().ref(`usersProfilePictures/${fileName}`);

                const blob = uri ? await fetch(uri).then((response) => response.blob()) : null;

                if (blob) {
                    const uploadTask = storageRef.put(blob);

                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            setUploadingImage(true);
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setStep(Math.floor(progress));
                            console.log(`Uploading progress: ${progress}%`);
                        },
                        (error) => {
                            console.log(error);
                            setUploadingImage(false);
                            Snackbar.show({
                                text: uploadingImageErrorTranslation,
                                duration: Snackbar.LENGTH_SHORT,
                            });
                        },
                        () => {
                            if (uploadTask.snapshot !== null) {
                                console.log('Upload is ' + uploadTask.snapshot.bytesTransferred + ' bytes done.');
                                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                    setOldImageUrl(imageUrl);
                                    setUploadingImage(false);
                                    console.log('File available at', downloadURL);
                                    setImageUrl(downloadURL);
                                    onSubmit(downloadURL);
                                });
                            } else {
                                console.log('Error occurred while uploading image.');
                                setUploadingImage(false);
                                Snackbar.show({
                                    text: uploadingImageErrorTranslation,
                                    duration: Snackbar.LENGTH_SHORT,
                                });
                            }
                        }
                    )
                } else {
                    console.error('Error: no file data');
                    Snackbar.show({
                        text: uploadingImageErrorTranslation,
                        duration: Snackbar.LENGTH_SHORT,
                    });
                }
            }
        });
    };

    const deleteImage = async (imageUrlToDelete: string, isUploadingNewPicture: boolean) => {
        if (imageUrlToDelete) {
            try {
                const ref = storage().refFromURL(imageUrlToDelete);

                await ref.delete().then(() => {
                    setUploadingImage(true);
                    if (!isUploadingNewPicture) {
                        setImageUrl(null);
                        onSubmit(null);
                    }
                });

                console.log('File has been deleted.');
                setUploadingImage(false);
            } catch (error) {
                console.error('Error occurred while deleting:', error);
                setUploadingImage(false);
                Snackbar.show({
                    text: deletingImageErrorTranslation,
                    duration: Snackbar.LENGTH_SHORT,
                });
            }
        }

    }

    return (
        <View style={styles.bottomSheetActionContainer}>
            <View style={[styles.iconButtonBottomSheet]}>
                <IconButton
                    onPress={uploadImage}
                    size={constants.ICON_SIZE.IMAGE_PICKER_BUTTON}
                >
                    <Gallery stroke={theme.TERTIARY} strokeWidth={constants.STROKE_WIDTH.BOLD} />
                </IconButton>
                <Text style={[styles.iconButtonBottomSheetText, { color: theme.TERTIARY }]}>
                    <FormattedMessage
                        defaultMessage='Gallery'
                        id='views.auth.signup.gallery'
                    />
                </Text>
            </View>

            <View style={[styles.iconButtonBottomSheet]}>
                <IconButton
                    onPress={takePhoto}
                    size={constants.ICON_SIZE.IMAGE_PICKER_BUTTON}
                >
                    <Camera stroke={theme.TERTIARY} strokeWidth={constants.STROKE_WIDTH.BOLD} />
                </IconButton>
                <Text style={[styles.iconButtonBottomSheetText, { color: theme.TERTIARY }]}>
                    <FormattedMessage
                        defaultMessage='Camera'
                        id='views.auth.signup.camera'
                    />
                </Text>
            </View>
            {imageUrl &&
                <View style={styles.iconButtonBottomSheet}>
                    <IconButton
                        onPress={() => deleteImage(imageUrl, false)}
                        size={constants.ICON_SIZE.IMAGE_PICKER_BUTTON}
                    >
                        <DeletePhoto strokeWidth={constants.STROKE_WIDTH.BOLD} />
                    </IconButton>
                    <Text
                        style={[
                            styles.iconButtonBottomSheetText,
                            { color: theme.NEGATIVE }
                        ]}>
                        <FormattedMessage
                            defaultMessage='Delete'
                            id='views.auth.signup.delete'
                        />
                    </Text>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
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
})