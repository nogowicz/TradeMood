import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import { Dispatch, SetStateAction } from 'react';

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
    return (
        <>
            <View>
                <View style={styles.actionContainer}>
                    <View style={styles.actionContainerComponent} >
                        {action}
                    </View>
                    {logo}
                    <View style={styles.actionContainerComponent} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        {title}
                    </Text>
                    <Text style={styles.subTitle}>
                        {subTitle}
                    </Text>
                </View>
                <View style={styles.mainContent}>
                    {mainContent}
                </View>
                <Pagination activePage={page} pages={pages} />
            </View>
            <View>
                <SubmitButton
                    isChevronDisplayed
                    label={buttonLabel}
                    onPress={buttonAction}
                />
            </View>
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
        marginHorizontal: spacing.SCALE_20,
    },
    title: {
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_24,
        color: colors.LIGHT_COLORS.TERTIARY,
        textAlign: 'center',
        marginVertical: spacing.SCALE_12
    },
    subTitle: {
        ...typography.FONT_REGULAR,
        fontWeight: typography.FONT_WEIGHT_REGULAR,
        fontSize: typography.FONT_SIZE_12,
        color: colors.LIGHT_COLORS.TERTIARY,
        textAlign: 'center',
    },
    mainContent: {
        marginBottom: spacing.SCALE_20,
    }
});

