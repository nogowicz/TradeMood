import {
    Animated,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import React, { useRef } from 'react'
import IconButton from 'components/buttons/icon-button'

import { FormattedMessage } from 'react-intl'
import { constants, spacing, typography } from 'styles'

import GoBack from 'assets/icons/Go-back.svg'
import SmallLogo from 'assets/logo/logo-smaller.svg'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@views/navigation/Navigation'
import { useTheme } from 'store/ThemeContext'
import AnimatedNavigationBar from './AnimatedNavigationBar'


type AboutUsScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'AboutUs'>;

type AboutUsProps = {
    navigation: AboutUsScreenNavigationProp['navigation']
}

export default function AboutUs({ navigation }: AboutUsProps) {
    const theme = useTheme();
    const scrollY = useRef(new Animated.Value(0)).current;


    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
    );
    return (
        <SafeAreaView style={[styles.root, { backgroundColor: theme.BACKGROUND }]}>
            <View style={styles.container}>
                <AnimatedNavigationBar navigation={navigation} scrollY={scrollY} />
                <Animated.ScrollView
                    style={styles.mainContainer}
                    showsVerticalScrollIndicator={false}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                >
                    <View style={styles.content}>
                        <Text style={[{
                            ...styles.contentText,
                            color: theme.TERTIARY
                        }]}>
                            <FormattedMessage
                                defaultMessage='Welcome to our market sentiment analysis application! Our application is designed for investors, investment funds, and market analysts who are looking for a tool to enhance the effectiveness of their investment decisions.'
                                id='views.home.profile.about-us.first-paragraph'
                            />
                        </Text>
                        <Text style={[{
                            ...styles.subtitleText,
                            color: theme.TERTIARY
                        }]}>
                            <FormattedMessage
                                defaultMessage='Key Objectives of the Application:'
                                id='views.home.profile.about-us.first-subtitle'
                            />
                        </Text>
                        <Text style={[{
                            ...styles.contentText,
                            color: theme.TERTIARY
                        }]}>
                            <FormattedMessage
                                defaultMessage='Our application allows for the collection and analysis of vast amounts of data from various sources such as social media, websites, and discussion forums. This enables you to gauge investor sentiments and understand how they impact stock prices and market trends.'
                                id='views.home.profile.about-us.market-sentiment-analysis'
                            />
                        </Text>
                        <Text style={[{
                            ...styles.contentText,
                            color: theme.TERTIARY
                        }]}>
                            <FormattedMessage
                                defaultMessage='We provide information about market sentiment that helps investors make more informed investment decisions. Our application serves as a valuable source of knowledge for anyone who wants a deep understanding of the market.'
                                id='views.home.profile.about-us.decision-support'
                            />
                        </Text>
                        <Text style={[{
                            ...styles.contentText,
                            color: theme.TERTIARY
                        }]}>
                            <FormattedMessage
                                defaultMessage='The application can also be used for research purposes. It helps identify market sentiment trends and patterns, analyze the impact of events on investor sentiments, and evaluate the effectiveness of various sentiment analysis methods.'
                                id='views.home.profile.about-us.research-applications'
                            />
                        </Text>
                        <Text style={[{
                            ...styles.subtitleText,
                            color: theme.TERTIARY
                        }]}>
                            <FormattedMessage
                                defaultMessage='Application Features:'
                                id='views.home.profile.about-us.second-subtitle'
                            />
                        </Text>
                        <Text style={[{
                            ...styles.contentText,
                            color: theme.TERTIARY
                        }]}>
                            <FormattedMessage
                                defaultMessage='The application allows for real-time data collection and processing from various sources, enabling real-time market analysis.'
                                id='views.home.profile.about-us.data-collection-and-processing'
                            />
                        </Text>
                        <Text style={[{
                            ...styles.contentText,
                            color: theme.TERTIARY
                        }]}>
                            <FormattedMessage
                                defaultMessage='Using advanced sentiment analysis algorithms, we can determine whether investor sentiments are positive, neutral, or negative.'
                                id='views.home.profile.about-us.sentiment-analysis'
                            />
                        </Text>
                        <Text style={[{
                            ...styles.contentText,
                            color: theme.TERTIARY
                        }]}>
                            <FormattedMessage
                                defaultMessage='Our application tracks stock price changes, providing up-to-date information.'
                                id='views.home.profile.about-us.market-monitoring'
                            />
                        </Text>
                        <Text style={[{
                            ...styles.contentText,
                            color: theme.TERTIARY
                        }]}>
                            <FormattedMessage
                                defaultMessage='We offer reports and analyses regarding market sentiment to assist in making investment decisions.'
                                id='views.home.profile.about-us.market-report-delivery'
                            />
                        </Text>
                    </View>
                </Animated.ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.SCALE_20,
        paddingTop: spacing.SCALE_20,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionContainerComponent: {
        flex: 1 / 5
    },
    sectionTitle: {
        ...typography.FONT_BOLD,
        fontSize: typography.FONT_SIZE_28,
        fontWeight: typography.FONT_WEIGHT_BOLD,
    },
    mainContainer: {
        marginTop: spacing.SCALE_18,
    },
    sectionTitleContainer: {
        alignItems: 'center',
    },
    content: {
        marginVertical: spacing.SCALE_20,
    },
    contentText: {
        fontSize: typography.FONT_SIZE_16,
        marginVertical: spacing.SCALE_12,
        textAlign: 'justify'
    },
    subtitleText: {
        fontSize: typography.FONT_SIZE_18,
        ...typography.FONT_BOLD,
        fontWeight: typography.FONT_WEIGHT_BOLD,
        textAlign: 'justify',
    }

})