import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native'
import { RootStackParamList } from '../../navigation/Navigation';
import { Dispatch, SetStateAction, useCallback, useContext, useRef, useState } from 'react';
import { AuthContext } from '@views/navigation/AuthProvider';
import { colors, spacing } from 'styles';
import SignupPanel from './signup-panel/SignupPanel';
import { prepareSignupPages } from './helpers';
import BottomSheet from 'components/bottom-sheet';
import { BottomSheetRefProps } from 'components/bottom-sheet/BottomSheet';
import IconButton from 'components/buttons/icon-button';

import Gallery from 'assets/icons/Gallery.svg'
import DeletePhoto from 'assets/icons/DeletePhoto.svg'
import Camera from 'assets/icons/Camera.svg'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { FormattedMessage } from 'react-intl';


type SignupPageType = {
    id: string;
    action: JSX.Element;
    logo: JSX.Element;
    title: JSX.Element;
    subTitle: JSX.Element;
    mainContent: JSX.Element;
    buttonLabel: JSX.Element;
    buttonAction: Dispatch<SetStateAction<number>> | any;
};

export type SignupPagesArrayType = SignupPageType[];


export type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SIGN_UP'>;

type SignupProps = {
    navigation: SignupScreenNavigationProp
}


export default function Signup({ navigation }: SignupProps) {
    const [page, setPage] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    function handleNextPage() {
        setPage(prevPage => prevPage + 1);
    }
    function handleBack() {
        setPage(prevPage => prevPage - 1);
    }

    function handlePageWithError(page: number) {
        setPage(page);
    }

    const ref = useRef<BottomSheetRefProps>(null);

    const handleShowBottomSheet = useCallback(() => {
        const isActive = ref?.current?.isActive();
        if (isActive) {
            ref?.current?.scrollTo(0);
        } else {
            ref?.current?.scrollTo(-200);
        }
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
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log(`Postęp przesyłania: ${progress}%`);
                        },
                        (error) => {
                            console.log(error);
                        },
                        () => {
                            if (uploadTask.snapshot !== null) {
                                console.log('Upload is ' + uploadTask.snapshot.bytesTransferred + ' bytes done.');
                                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                    console.log('File available at', downloadURL);
                                    setImageUrl(downloadURL);
                                });

                            } else {
                                console.log('Wystąpił błąd podczas przesyłania pliku.');
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
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log(`Postęp przesyłania: ${progress}%`);
                        },
                        (error) => {
                            console.log(error);
                        },
                        () => {
                            if (uploadTask.snapshot !== null) {
                                console.log('Upload is ' + uploadTask.snapshot.bytesTransferred + ' bytes done.');
                                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                    console.log('File available at', downloadURL);
                                    setImageUrl(downloadURL);
                                });
                            } else {
                                console.log('Wystąpił błąd podczas przesyłania pliku.');
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
                    setImageUrl(null);
                });

                console.log('Plik został usunięty.');
            } catch (error) {
                console.error('Wystąpił błąd podczas usuwania pliku:', error);
            }
        }

    }

    const pages: SignupPagesArrayType = prepareSignupPages({
        navigation,
        handleBack,
        handleNextPage,
        handlePageWithError,
        handleShowBottomSheet,
        imageUrl,
        setImageUrl,
        deleteImage,
    });

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <SignupPanel
                    {...pages[page]}
                    page={page}
                    pages={pages}
                />
                <BottomSheet ref={ref} height={500}>
                    <View style={styles.bottomSheetActionContainer}>
                        <View style={[styles.iconButtonBottomSheet, imageUrl ? { opacity: 0.5 } : {}]}>
                            <IconButton
                                onPress={uploadImage}
                                size={80}
                            >
                                <Gallery />
                            </IconButton>
                            <Text style={styles.iconButtonBottomSheetText}>
                                <FormattedMessage
                                    defaultMessage='Gallery'
                                    id='views.auth.signup-gallery'
                                />
                            </Text>
                        </View>

                        <View style={[styles.iconButtonBottomSheet, imageUrl ? { opacity: 0.5 } : {}]}>
                            <IconButton
                                onPress={takePhoto}
                                size={80}
                            >
                                <Camera />
                            </IconButton>

                            <Text style={styles.iconButtonBottomSheetText}>
                                <FormattedMessage
                                    defaultMessage='Camera'
                                    id='views.auth.signup-camera'
                                />
                            </Text>
                        </View>
                        {imageUrl &&
                            <View style={styles.iconButtonBottomSheet}>
                                <IconButton
                                    onPress={deleteImage}
                                    size={80}
                                    color={colors.LIGHT_COLORS.NEGATIVE}
                                >
                                    <DeletePhoto />
                                </IconButton>
                                <Text
                                    style={[
                                        styles.iconButtonBottomSheetText,
                                        { color: colors.LIGHT_COLORS.NEGATIVE }
                                    ]}>
                                    <FormattedMessage
                                        defaultMessage='Delete'
                                        id='views.auth.signup-delete'
                                    />
                                </Text>
                            </View>
                        }
                    </View>
                </BottomSheet>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        height: '100%',
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.SCALE_18,
        paddingVertical: spacing.SCALE_18,
        justifyContent: 'space-between',
        backgroundColor: colors.LIGHT_COLORS.BACKGROUND,
    },
    actionContainer: {
        alignItems: 'flex-end',
    },
    bottomSheetActionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: spacing.SCALE_20,
    },
    iconButtonBottomSheetText: {
        color: colors.LIGHT_COLORS.BACKGROUND,
        textAlign: 'center',
        marginHorizontal: 150,
    },
    iconButtonBottomSheet: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.SCALE_8,
    }
});