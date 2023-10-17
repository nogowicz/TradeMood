import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    useWindowDimensions,
} from 'react-native'
import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@views/navigation/Navigation';
import { FormattedMessage } from 'react-intl';
import { constants, spacing, typography } from 'styles';
import storage from '@react-native-firebase/storage';
import { AuthContext } from '@views/navigation/AuthProvider';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from 'store/themeContext';

import ProfileImagePicker from 'components/profile-image-picker';
import BottomSheet from 'components/bottom-sheet';
import IconButton from 'components/buttons/icon-button';
import ProgressBar from 'components/progress-bar';
import { BottomSheetRefProps } from 'components/bottom-sheet/BottomSheet';

import Gallery from 'assets/icons/Gallery.svg'
import DeletePhoto from 'assets/icons/DeletePhoto.svg'
import Camera from 'assets/icons/Camera.svg'
import GoBack from 'assets/icons/Go-back.svg'
import SmallLogo from 'assets/logo/logo-smaller.svg'
import image from 'components/image';


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
    const [oldImageUrl, setOldImageUrl] = useState<string | null | undefined>();
    const { height } = useWindowDimensions();

    const handleShowBottomSheet = useCallback(() => {
        const isActive = ref?.current?.isActive();
        if (isActive) {
            ref?.current?.scrollTo(0);
        } else {
            ref?.current?.scrollTo(-(height - constants.BOTTOM_SHEET_HEIGHT.PICTURE_SELECTION));
        }
    }, []);

    const handleHideBottomSheet = useCallback(() => {
        ref?.current?.scrollTo(0);

    }, []);

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
                            console.log(`Uploading progress: ${progress}%`);
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
                                    setOldImageUrl(imageUrl);
                                    console.log('File available at', downloadURL);
                                    setUploadingImage(false);
                                    handleHideBottomSheet();
                                    setImageUrl(downloadURL);
                                    onSubmit(downloadURL);
                                });
                            } else {
                                console.log('Error occurred while uploading.');
                                setUploadingImage(false);
                                handleHideBottomSheet();
                            }
                        }
                    )

                } else {
                    console.error('Error no data in file');
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
                                    setOldImageUrl(imageUrl);
                                    setUploadingImage(false);
                                    handleHideBottomSheet();
                                    console.log('File available at', downloadURL);
                                    setImageUrl(downloadURL);
                                    onSubmit(downloadURL);
                                });
                            } else {
                                console.log('Error occurred while uploading image.');
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
                handleHideBottomSheet();
            } catch (error) {
                console.error('Error occurred while deleting:', error);
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
                            setImageUrl={setImageUrl}
                            size={250}
                        />
                    </View>
                </View>

                <View>
                    {uploadingImage ?
                        <View style={styles.progressBar}>
                            <ProgressBar step={step} steps={100} height={40} />
                        </View>
                        :
                        <View style={styles.bottomSheetActionContainer}>
                            <View style={[styles.iconButtonBottomSheet]}>
                                <IconButton
                                    onPress={uploadImage}
                                    size={80}
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
                                    size={80}
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
                                        size={80}
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
                        </View>}
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