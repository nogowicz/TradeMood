import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors, spacing, typography } from 'styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { formatDateTime } from 'helpers/dateFormat';

export type NavigationWidgetProps = {
    title: string;
    content: string;
    date: string;
    activeOpacity?: number;
};

export default function NotificationWidget({ title, content, date, activeOpacity = 0.7 }: NavigationWidgetProps) {
    return (
        <TouchableOpacity activeOpacity={activeOpacity} style={styles.container}>
            <View style={styles.notificationTop}>
                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.dateText}>{formatDateTime(date)}</Text>
            </View>
            <Text style={styles.contentText}>{content}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.SCALE_12,
        paddingVertical: spacing.SCALE_12,
        borderBottomWidth: 1,
        borderBottomColor: colors.LIGHT_COLORS.LIGHT_HINT,
    },
    notificationTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleText: {
        fontWeight: typography.FONT_WEIGHT_BOLD,
        color: colors.LIGHT_COLORS.TERTIARY,
        fontSize: typography.FONT_SIZE_16,
    },
    contentText: {
        fontSize: typography.FONT_SIZE_14,
        color: colors.LIGHT_COLORS.TERTIARY,
    },
    dateText: {
        fontSize: typography.FONT_SIZE_12,
        color: colors.LIGHT_COLORS.HINT,
    }
})