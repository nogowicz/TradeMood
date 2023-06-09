import React from 'react'

import { View, StyleSheet } from 'react-native'
import { colors, spacing } from '../../styles';
import { PagesArrayType } from '../../../views/auth/onboarding/OnBoarding';
import { SignupPagesArrayType } from '@views/auth/signup/Signup';

type PaginationProps = {
    pages: PagesArrayType | SignupPagesArrayType,
    activePage: number
}

export default function Pagination({ pages = [], activePage }: PaginationProps) {
    return (
        <View style={styles.container}>
            {pages.map((page, index: number) => (
                <View key={page.id} style={[styles.dot, index === activePage ? styles.activeDot : {}]} />
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
        backgroundColor: colors.LIGHT_COLORS.LIGHT_HINT,
        borderRadius: spacing.SCALE_8,
    },
    activeDot: {
        width: spacing.SCALE_16,
        backgroundColor: colors.LIGHT_COLORS.PRIMARY,
    },
});