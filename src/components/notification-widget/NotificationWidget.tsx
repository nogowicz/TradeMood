import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { spacing, typography } from 'styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { formatDateTime } from 'helpers/dateFormat';
import { useTheme } from 'store/themeContext';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '@views/navigation/constants';

export type NavigationWidgetProps = {
    title: string;
    content: string;
    date: string;
    activeOpacity?: number;
};

export default function NotificationWidget({ title, content, date, activeOpacity = 0.7 }: NavigationWidgetProps) {
    const theme = useTheme();
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            style={[styles.container, { borderBottomColor: theme.LIGHT_HINT }]}
            onPress={() => navigation.navigate(SCREENS.HOME.SEARCH.ID as never)}
        >
            <View style={styles.notificationTop}>
                <Text style={[styles.titleText, { color: theme.TERTIARY }]}>{title}</Text>
                <Text style={[styles.dateText, { color: theme.HINT }]}>{formatDateTime(date)}</Text>
            </View>
            <Text style={[styles.contentText, { color: theme.TERTIARY }]}>{content}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.SCALE_12,
        paddingVertical: spacing.SCALE_12,
        borderBottomWidth: 1,
    },
    notificationTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleText: {
        fontWeight: typography.FONT_WEIGHT_BOLD,
        fontSize: typography.FONT_SIZE_16,
    },
    contentText: {
        fontSize: typography.FONT_SIZE_14,
    },
    dateText: {
        fontSize: typography.FONT_SIZE_12,
    }
})