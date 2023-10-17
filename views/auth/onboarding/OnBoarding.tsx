import { Dispatch, SetStateAction, useRef, useState } from 'react';
import {
    FlexAlignType,
    PanResponder,
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native'

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { spacing } from '../../../src/styles';
import { RootStackParamList } from '../../navigation/Navigation';


import Panel from './panel';
import { preparePages } from './helpers';
import { useTheme } from 'store/themeContext';

export type OnBoardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ONBOARDING'>;



type PageType = {
    id: string;
    title: JSX.Element;
    icon: JSX.Element;
    subTitle: JSX.Element;
    submitButtonLabel: JSX.Element;
    submitButtonAction: Dispatch<SetStateAction<number>>;
    action: JSX.Element;
    actionPosition: FlexAlignType;
};

export type PagesArrayType = PageType[];

type OnBoardingProps = {
    navigation: OnBoardingScreenNavigationProp;
}

export default function OnBoarding({ navigation }: OnBoardingProps) {
    const theme = useTheme();
    const [page, setPage] = useState(0);

    function handleNextPage() {
        setPage(prevPage => prevPage + 1);
    }
    function handleBack() {
        setPage(prevPage => prevPage - 1);
    }

    const pages: PagesArrayType = preparePages({ navigation, handleBack, handleNextPage })

    const swipeViewRef = useRef(null);
    const isSwipeHandled = useRef(false);

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
            return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        },
        onPanResponderMove: (_, gestureState) => {
            if (gestureState.dx < -100 && !isSwipeHandled.current) {
                if (page !== 2) {
                    handleNextPage();
                    isSwipeHandled.current = true;
                }
            } else if (gestureState.dx > 100 && !isSwipeHandled.current) {
                if (page !== 0) {
                    handleBack();
                    isSwipeHandled.current = true;
                }
            }
        },
        onPanResponderRelease: () => {
            isSwipeHandled.current = false;
        },
        onPanResponderTerminationRequest: () => true,
    });
    return (
        <SafeAreaView style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View
                ref={swipeViewRef}
                style={styles.container}
                {...panResponder.panHandlers}
            >
                <Panel
                    {...pages[page]}
                    page={page}
                    pages={pages}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        height: '100%',
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.SCALE_20,
        paddingVertical: spacing.SCALE_18,
        justifyContent: 'space-between',
    },

});