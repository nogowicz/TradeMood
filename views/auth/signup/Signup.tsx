import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    SafeAreaView,
    StyleSheet,
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
    const { register } = useContext(AuthContext);
    const [page, setPage] = useState(0);

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



    const pages: SignupPagesArrayType = prepareSignupPages({ navigation, handleBack, handleNextPage, handlePageWithError, handleShowBottomSheet });



    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <SignupPanel
                    {...pages[page]}
                    page={page}
                    pages={pages}
                />
                <BottomSheet ref={ref} height={500}>
                    <View />
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
});