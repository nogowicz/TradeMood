import { Dispatch, SetStateAction, useContext } from "react";
import { FlexAlignType } from "react-native";
import { FormattedMessage } from "react-intl";

import AnalyticsSmartphone from 'assets/onboarding-screen/analytics-smartphone-screen1.svg';
import WomanInvestment from 'assets/onboarding-screen/woman-investment-screen2.svg'
import Notification from 'assets/onboarding-screen/notification-screen3.svg'
import GoBack from 'assets/icons/Go-back.svg'

import TextButton from "components/buttons/text-button";
import { OnBoardingScreenNavigationProp } from "./OnBoarding";
import IconButton from "components/buttons/icon-button";
import { SCREENS } from '../../../views/navigation/constants';
import { useTheme } from "store/ThemeContext";
import { constants } from "styles";

export type PreparePagesType = {
    navigation: OnBoardingScreenNavigationProp,
    handleBack: Dispatch<SetStateAction<number>>,
    handleNextPage: Dispatch<SetStateAction<number>>
}

export function preparePages({
    navigation,
    handleBack,
    handleNextPage,
}: PreparePagesType) {
    const theme = useTheme();
    return [
        {
            id: 'all-in-one',
            title: (
                <FormattedMessage
                    defaultMessage="Don't waste time searching through hundreds of financial pages"
                    id='views.auth.onboarding.all-in-one.title'
                />
            ),
            icon: (
                <AnalyticsSmartphone />
            ),
            subTitle: (
                <FormattedMessage
                    defaultMessage="Our app provides you with all the most important information about the sentiment of the financial market in one place."
                    id='views.auth.onboarding.all-in-one.subtitle'
                />
            ),
            submitButtonLabel: (
                <FormattedMessage
                    defaultMessage='Get Started'
                    id='views.auth.onboarding.all-in-one.get-started'
                />
            ),
            submitButtonAction: handleNextPage,
            action: (
                <TextButton
                    label={
                        <FormattedMessage
                            defaultMessage='Skip'
                            id='views.auth.onboarding.skip'
                        />
                    }
                    onPress={() => navigation.navigate(SCREENS.AUTH.WELCOME.ID)}
                />
            ),
            actionPosition: 'flex-end' as FlexAlignType
        },
        {
            id: 'learn-about',
            icon: (
                <WomanInvestment />
            ),
            title: (
                <FormattedMessage
                    defaultMessage='Learn about the sentiment of the financial market'
                    id='views.auth.onboarding.learn-about.title'
                />
            ),
            subTitle: (
                <FormattedMessage
                    defaultMessage='See what experts are saying and what the forecasts are for the next few days, weeks, and months.'
                    id='views.auth.onboarding.learn-about.subtitle'
                />
            ),
            submitButtonLabel: (
                <FormattedMessage
                    defaultMessage='Continue'
                    id='views.auth.onboarding.learn-about.continue'
                />
            ),
            submitButtonAction: handleNextPage,
            action: (
                <IconButton
                    onPress={handleBack}
                    size={constants.ICON_SIZE.GO_BACK}
                >
                    <GoBack fill={theme.TERTIARY} />
                </IconButton>
            ),
            actionPosition: 'flex-start' as FlexAlignType,
        },
        {
            id: 'up-to-date',
            icon: (
                <Notification />
            ),
            title: (
                <FormattedMessage
                    defaultMessage='Stay up-to-date with the sentiment of the financial market'
                    id='views.auth.onboarding.up-to-date.title'
                />
            ),
            subTitle: (
                <FormattedMessage
                    defaultMessage='Receive daily notifications and analysis to know what the trends are on the market.'
                    id='views.auth.onboarding.up-to-date.subtitle'
                />
            ),
            submitButtonLabel: (
                <FormattedMessage
                    defaultMessage='Join'
                    id='views.auth.onboarding.up-to-date.join'
                />
            ),
            submitButtonAction: () => navigation.navigate(SCREENS.AUTH.WELCOME.ID),
            action: (
                <IconButton onPress={handleBack}
                    size={constants.ICON_SIZE.GO_BACK}
                >
                    <GoBack fill={theme.TERTIARY} />
                </IconButton>
            ),
            actionPosition: 'flex-start' as FlexAlignType,
        }
    ]
}