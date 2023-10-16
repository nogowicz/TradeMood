import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
} from 'react-native'
import React, { useCallback, useContext, useRef, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import IconButton from 'components/buttons/icon-button';
import { FormattedMessage } from 'react-intl';
import { spacing, typography } from 'styles';

import GoBack from 'assets/icons/Go-back.svg'
import SmallLogo from 'assets/logo/logo-smaller.svg'
import storage from '@react-native-firebase/storage';
import ProfileImagePicker from 'components/profile-image-picker';
import { AuthContext } from '@views/navigation/AuthProvider';
import BottomSheet from 'components/bottom-sheet';
import ProgressBar from 'components/progress-bar';

import Gallery from 'assets/icons/Gallery.svg'
import DeletePhoto from 'assets/icons/DeletePhoto.svg'
import Camera from 'assets/icons/Camera.svg'
import { BottomSheetRefProps } from 'components/bottom-sheet/BottomSheet';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from 'store/themeContext';

type EditPictureScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'EditPicture'>;

type EditPictureProps = {
    navigation: EditPictureScreenNavigationProp['navigation']
}


export default function EditPicture({ navigation }: EditPictureProps) {
    const { user, updateProfilePicture } = useContext(AuthContext);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [step, setStep] = useState(0);
    const theme = useTheme();
    const ref = useRef<BottomSheetRefProps>(null);
    const [imageUrl, setImageUrl] = useState<string | null | undefined>(user?.photoURL);

    const handleShowBottomSheet = useCallback(() => {
        const isActive = ref?.current?.isActive();
        if (isActive) {
            ref?.current?.scrollTo(0);
        } else {
            ref?.current?.scrollTo(-200);
        }
    }, []);

    const handleHideBottomSheet = useCallback(() => {
        ref?.current?.scrollTo(0);

    }, []);

    const uploadImage = async () => {
        launchImageLibrary({
            mediaType: 'photo'
        }, async (response) => {
            if (response.assets && response.assets.length > 0) {
                const { uri, fileName } = response.assets[0];

                const storageRef = storage().ref(`usersProfilePictures/${fileName}`);

                const blob = uri ? await fetch(uri).then((response) => response.blob()) : null;

                if (blob) {
                    const uploadTask = storageRef.put(blob);

                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            setUploadingImage(true);
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log(`Postęp przesyłania: ${progress}%`);
                        },
                        (error) => {
                            console.log(error);
                            setUploadingImage(false);
                            handleHideBottomSheet();
                        },
                        () => {
                            if (uploadTask.snapshot !== null) {
                                console.log('Upload is ' + uploadTask.snapshot.bytesTransferred + ' bytes done.');
                                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                    console.log('File available at', downloadURL);
                                    setUploadingImage(false);
                                    handleHideBottomSheet();
                                    setImageUrl(downloadURL);
                                    onSubmit(downloadURL);
                                });

                            } else {
                                console.log('Wystąpił błąd podczas przesyłania pliku.');
                                setUploadingImage(false);
                                handleHideBottomSheet();
                            }
                        }
                    )

                } else {
                    console.error('Błąd: brak danych pliku');
                }
            }
        });
    }

    const takePhoto = async () => {
        launchCamera({ mediaType: 'photo' }, async (response) => {
            if (response.assets && response.assets.length > 0) {
                const { uri, fileName } = response.assets[0];

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
                            console.log(`Postęp przesyłania: ${progress}%`);
                        },
                        (error) => {
                            console.log(error);
                            setUploadingImage(false);
                            handleHideBottomSheet();
                        },
                        () => {
                            if (uploadTask.snapshot !== null) {
                                console.log('Upload is ' + uploadTask.snapshot.bytesTransferred + ' bytes done.');
                                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                    setUploadingImage(false);
                                    handleHideBottomSheet();
                                    console.log('File available at', downloadURL);
                                    setImageUrl(downloadURL);
                                    onSubmit(downloadURL);
                                });
                            } else {
                                console.log('Wystąpił błąd podczas przesyłania pliku.');
                                setUploadingImage(false);
                                handleHideBottomSheet();
                            }
                        }
                    );
                } else {
                    console.error('Błąd: brak danych pliku');
                }
            }
        });
    };

    const deleteImage = async () => {
        if (imageUrl) {
            try {
                const ref = storage().refFromURL(imageUrl);

                await ref.delete().then(() => {
                    setUploadingImage(true);
                    setImageUrl(null);
                    onSubmit(null);
                });

                console.log('Plik został usunięty.');
                setUploadingImage(false);
                handleHideBottomSheet();
            } catch (error) {
                console.error('Wystąpił błąd podczas usuwania pliku:', error);
                setUploadingImage(false);
                handleHideBottomSheet();
            }
        }

    }


    const onSubmit = async (imageUrl: string | undefined | null) => {
        try {
            await updateProfilePicture(imageUrl)
        } catch (error: any) {
            console.log(error)
        }
    }


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
                            onPress={handleShowBottomSheet}
                            setImageUrl={setImageUrl}

                        />
                    </View>
                </View>
                <BottomSheet ref={ref} height={500}>
                    <View>
                        {uploadingImage ?
                            <View style={styles.progressBar}>
                                <ProgressBar step={step} steps={100} height={40} />
                            </View>
                            :
                            <View style={styles.bottomSheetActionContainer}>
                                <View style={[styles.iconButtonBottomSheet, imageUrl ? { opacity: 0.5 } : {}]}>
                                    <IconButton
                                        onPress={uploadImage}
                                        size={80}
                                    >
                                        <Gallery stroke={theme.TERTIARY} strokeWidth={1.5} />
                                    </IconButton>
                                    <Text style={[styles.iconButtonBottomSheetText, { color: theme.TERTIARY }]}>
                                        <FormattedMessage
                                            defaultMessage='Gallery'
                                            id='views.auth.signup.gallery'
                                        />
                                    </Text>
                                </View>

                                <View style={[styles.iconButtonBottomSheet, imageUrl ? { opacity: 0.5 } : {}]}>
                                    <IconButton
                                        onPress={takePhoto}
                                        size={80}
                                    >
                                        <Camera stroke={theme.TERTIARY} strokeWidth={1.5} />
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
                                            onPress={deleteImage}
                                            size={80}
                                        >
                                            <DeletePhoto strokeWidth={1.5} />
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
                            </View>}
                    </View>
                </BottomSheet>

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
        marginTop: spacing.SCALE_60,
    },
    bottomSheetActionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: spacing.SCALE_20,
    },
    iconButtonBottomSheetText: {
        textAlign: 'center',
        marginHorizontal: 150,
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