import {
    View,
    StyleSheet,
    Text,
    Keyboard,
    Animated
} from 'react-native';
import {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';

import { colors, spacing, typography } from 'styles';

import SubmitButton from 'components/buttons/submit-button';
import { SignupPagesArrayType } from '../Signup';
import Pagination from 'components/pagination/Pagination';


type SignupPanelProps = {
    id: string;
    action: JSX.Element;
    logo: JSX.Element;
    title: JSX.Element;
    subTitle: JSX.Element;
    mainContent: JSX.Element;
    buttonLabel: JSX.Element;
    buttonAction: Dispatch<SetStateAction<number>>;
    page: number;
    pages: SignupPagesArrayType;
}

export default function SignupPanel({
    id,
    action,
    logo,
    title,
    subTitle,
    mainContent,
    buttonLabel,
    buttonAction,
    page,
    pages
}: SignupPanelProps) {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const translateYValue = useRef(new Animated.Value(0)).current;
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const animationDuration = 400;
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
                handleKeyboardOut();
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
                handleKeyboardIn();
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const handleKeyboardIn = () => {
        Animated.parallel([
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: animationDuration,
                useNativeDriver: true,
            }),
            Animated.timing(translateYValue, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleKeyboardOut = () => {
        Animated.parallel([
            Animated.timing(scaleValue, {
                toValue: 0.5,
                duration: animationDuration,
                useNativeDriver: true,
            }),
            Animated.timing(translateYValue, {
                toValue: -70,
                duration: animationDuration,
                useNativeDriver: true,
            }),
        ]).start();
    };
    return (
        <>
            <View>
                <View style={styles.actionContainer}>
                    <View style={styles.actionContainerComponent} >
                        {action}
                    </View>
                    <Animated.View style={{ transform: [{ scale: scaleValue }, { translateY: translateYValue }] }}>
                        {logo}
                    </Animated.View>
                    <View style={styles.actionContainerComponent} />
                </View>
                <Animated.View style={[styles.textContainer, { transform: [{ translateY: translateYValue }] }]}>
                    <Animated.View style={styles.textContainer}>
                        <Text style={styles.title}>
                            {title}
                        </Text>
                        <Text style={styles.subTitle}>
                            {subTitle}
                        </Text>
                    </Animated.View>
                    <View style={styles.mainContent}>
                        {mainContent}
                    </View>
                </Animated.View>
                {isKeyboardVisible ? null :
                    <Pagination activePage={page} pages={pages} />}
            </View>

            <Animated.View style={[{ transform: [{ translateY: translateYValue }] }]}>
                <SubmitButton
                    isChevronDisplayed
                    label={buttonLabel}
                    onPress={buttonAction}
                />
            </Animated.View>
        </>
    )
}

const styles = StyleSheet.create({
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
        color: colors.LIGHT_COLORS.TERTIARY,
        textAlign: 'center',
        marginVertical: spacing.SCALE_4
    },
    subTitle: {
        ...typography.FONT_REGULAR,
        fontWeight: typography.FONT_WEIGHT_REGULAR,
        fontSize: typography.FONT_SIZE_12,
        color: colors.LIGHT_COLORS.TERTIARY,
        textAlign: 'center',
    },
    mainContent: {
        marginBottom: spacing.SCALE_4,
    }
});

