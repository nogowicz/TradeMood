import React from 'react'

import { View, StyleSheet } from 'react-native'
import { spacing } from '../../styles';
import { PagesArrayType } from '../../../views/auth/onboarding/OnBoarding';
import { SignupPagesArrayType } from '@views/auth/signup/Signup';
import { useTheme } from 'store/ThemeContext';

type PaginationProps = {
    pages: PagesArrayType | SignupPagesArrayType,
    activePage: number
}

export default function Pagination({ pages = [], activePage }: PaginationProps) {
    const theme = useTheme();
    return (
        <View style={styles.container}>
            {pages.map((page, index: number) => (
                <View key={page.id} style={[styles.dot, { backgroundColor: theme.LIGHT_HINT }, index === activePage ? [styles.activeDot, { backgroundColor: theme.PRIMARY }] : {}]} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.SCALE_20 / 2,
        marginVertical: spacing.SCALE_20,
    },
    dot: {
        width: spacing.SCALE_8,
        height: spacing.SCALE_8,
        borderRadius: spacing.SCALE_8,
    },
    activeDot: {
        width: spacing.SCALE_16,
    },
});