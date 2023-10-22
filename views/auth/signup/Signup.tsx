import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { RootStackParamList } from '../../navigation/Navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { spacing } from 'styles';
import storage from '@react-native-firebase/storage';
import SignupPanel from './signup-panel/SignupPanel';
import { prepareSignUpPages } from './helpers';
import { useTheme } from 'store/themeContext';
import Snackbar from 'react-native-snackbar';
import { useIntl } from 'react-intl';



type SignUpPageType = {
    id: string;
    action: JSX.Element;
    logo: JSX.Element;
    title: JSX.Element;
    subTitle: JSX.Element;
    mainContent: JSX.Element;
    buttonLabel: JSX.Element;
    buttonAction: Dispatch<SetStateAction<number>> | any;
};

export type SignUpPagesArrayType = SignUpPageType[];


export type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SIGN_UP'>;

type SignupProps = {
    navigation: SignUpScreenNavigationProp
}


export default function Signup({ navigation }: SignupProps) {
    const [page, setPage] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null | undefined>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [step, setStep] = useState(0);
    const theme = useTheme();
    const intl = useIntl();

    //translations:
    const deletingImageErrorTranslation = intl.formatMessage({
        id: "views.home.profile.edit-picture.deleting-error",
        defaultMessage: "Error occurred while deleting image"
    });


    function handleNextPage() {
        setPage(prevPage => prevPage + 1);
    }
    function handleBack() {
        setPage(prevPage => prevPage - 1);
    }

    function handlePageWithError(page: number) {
        setPage(page);
    }


    const deleteImage = async (imageUrlToDelete: string) => {
        if (imageUrlToDelete) {
            try {
                const ref = storage().refFromURL(imageUrlToDelete);

                await ref.delete().then(() => {
                    setUploadingImage(true);
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

    const pages: SignUpPageType[] = prepareSignUpPages({
        navigation,
        handleBack,
        handleNextPage,
        handlePageWithError,
        imageUrl,
        setImageUrl,
        deleteImage,
        setStep,
        step,
        uploadingImage,
        setUploadingImage
    });

    return (
        <SafeAreaView style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <SignupPanel
                    {...pages[page]}
                    page={page}
                    pages={pages}
                />
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
    },
    actionContainer: {
        alignItems: 'flex-end',
    },

});