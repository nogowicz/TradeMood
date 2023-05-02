import {
    View,
    StyleSheet,
    Text,
    FlexAlignType,
} from 'react-native';

import { colors, spacing, typography } from '../../../../src/styles';

import Pagination from 'components/pagination';
import SubmitButton from 'components/buttons/submit-button';
import { Dispatch, SetStateAction } from 'react';
import { PagesArrayType } from '../OnBoarding';



export type PanelProps = {
    id: string;
    icon: JSX.Element;
    title: JSX.Element;
    subTitle: JSX.Element;
    submitButtonLabel: JSX.Element;
    submitButtonAction: Dispatch<SetStateAction<number>>;
    action: JSX.Element;
    actionPosition: FlexAlignType;
    page: number,
    pages: PagesArrayType,
}

export default function Panel({
    id,
    icon,
    title,
    subTitle,
    submitButtonLabel,
    submitButtonAction,
    action,
    actionPosition,
    page,
    pages,
}: PanelProps) {
    return (
        <>
            <View style={{ alignItems: actionPosition }}>
                {action}
            </View>
            <View style={styles.iconContainer}>
                {icon}
            </View>
            <View style={styles.textContainer}>

                <Text style={styles.title}>
                    {title}
                </Text>
                <Text style={styles.subTitle}>
                    {subTitle}
                </Text>
            </View>
            <Pagination activePage={page} pages={pages} />
            <View>
                <SubmitButton
                    label={submitButtonLabel}
                    isChevronDisplayed={true}
                    onPress={submitButtonAction}
                    mode='submit'
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    title: {
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        color: colors.LIGHT_COLORS.TERTIARY,
        fontSize: typography.FONT_SIZE_20,
        textAlign: 'center',
        marginBottom: spacing.SCALE_12,
    },
    subTitle: {
        ...typography.FONT_REGULAR,
        fontWeight: typography.FONT_WEIGHT_REGULAR,
        color: colors.LIGHT_COLORS.TERTIARY,
        fontSize: typography.FONT_SIZE_14,
        textAlign: 'center',
    },
    iconContainer: {
        alignItems: 'center',
    },
    textContainer: {
        marginHorizontal: spacing.SCALE_8
    }
});