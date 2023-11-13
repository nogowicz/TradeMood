import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import TextButton from 'components/buttons/text-button';
import Snackbar from 'react-native-snackbar';
import { LineChart } from 'react-native-chart-kit';
import { useIntl } from 'react-intl';
import { constants, spacing, typography } from 'styles';
import { formatDateToShortDate } from 'utils/dateFormat';
import { useTheme } from 'store/ThemeContext';
import { InstrumentProps } from 'store/InstrumentProvider';
import { YAHOO_FINANCE_API } from "@env";
import { SelectList } from 'react-native-dropdown-select-list';
import ArrowDownIcon from 'assets/icons/Arrow-down.svg';
import ActivityIndicator from 'components/activity-indicator';

type CustomChartProps = {
    instrument?: InstrumentProps;
};

type Dataset = {
    data: number[];
};

type DataSets = {
    datasets: Dataset[];
    labels: string[];
};

type StockData = {
    "Adj Close": string;
    "Close": string;
    "Date": string;
    "High": string;
    "Low": string;
    "Open": string;
    "Volume": string;
};

export default function CustomChart({ instrument }: CustomChartProps) {
    const [chartData, setChartData] = useState<DataSets>();
    const [chartDataError, setChartDataError] = useState(false);
    const [data, setData] = useState<StockData[]>();
    const theme = useTheme();
    const intl = useIntl();

    const lowestScale = 0.4;
    const scaleAnim = useRef(new Animated.Value(lowestScale)).current;

    const chartWidth = (Dimensions.get("window").width) - 50
    const chartHeight = 380;



    //translations:
    const chartLoadingErrorTranslation = intl.formatMessage({
        defaultMessage: "We couldn't load chart data",
        id: 'views.home.instrument-details.error.loading-chart-data'
    });
    const tryAgainTranslation = intl.formatMessage({
        defaultMessage: "Try again",
        id: 'views.home.instrument-details.error.try-again'
    });
    const networkErrorTranslation = intl.formatMessage({
        defaultMessage: "Network error occurred",
        id: 'views.home.instrument-details.error.network'
    });
    const fetchingDataErrorTranslation = intl.formatMessage({
        defaultMessage: "Error occurred while fetching data",
        id: 'views.home.instrument-details.error.fetching-data'
    });
    const lastWeekTranslation = intl.formatMessage({
        defaultMessage: "Last week",
        id: 'views.home.instrument-details.chart.last-week'
    });
    const lastMonthTranslation = intl.formatMessage({
        defaultMessage: "Last month",
        id: 'views.home.instrument-details.chart.last-month'
    });
    const lastYearTranslation = intl.formatMessage({
        defaultMessage: "Last year",
        id: 'views.home.instrument-details.chart.last-year'
    });
    const loadingChartTranslation = intl.formatMessage({
        defaultMessage: "Loading chart...",
        id: 'views.home.instrument-details.loading-chart'
    });


    const [selected, setSelected] = useState(lastWeekTranslation);

    const pickListData: { key: string, value: string }[] = [
        { key: '1', value: lastWeekTranslation },
        { key: '2', value: lastMonthTranslation },
        { key: '3', value: lastYearTranslation },
    ]


    useEffect(() => {
        if (data) {
            setChartData(convertData(data));
        }
    }, [data]);

    function selectDateForChart(timeRange: string) {
        let currentTimestamp = Math.floor(Date.now() / 1000);
        let date = new Date();
        let interval;

        if (timeRange === lastWeekTranslation) {
            date.setDate(date.getDate() - 7);
            interval = '1d';
        } else if (timeRange === lastMonthTranslation) {
            date.setMonth(date.getMonth() - 1);
            interval = '1wk';
        } else if (timeRange === lastYearTranslation) {
            date.setFullYear(date.getFullYear() - 1);
            interval = '3mo';
        }
        else {
            console.error('Unrecognized time range:', timeRange);
        }
        const timestamp = Math.floor(date.getTime() / 1000);
        console.log(interval)
        return {
            currentTimestamp,
            timestamp,
            interval: interval || '1d'
        }
    }


    async function fetchData() {
        setChartDataError(false);
        const { currentTimestamp, timestamp, interval } = selectDateForChart(selected);
        try {
            const URL = `${YAHOO_FINANCE_API}/${instrument?.cryptoSymbol}-USD?period1=${timestamp}&period2=${currentTimestamp}&interval=${interval}&events=history`
            console.log(URL);
            const response = await fetch(URL);

            if (!response.ok) {
                Snackbar.show({
                    text: networkErrorTranslation,
                    duration: Snackbar.LENGTH_SHORT,
                    action: {
                        text: tryAgainTranslation,
                        textColor: theme.PRIMARY,
                        onPress: fetchData
                    }
                });
                setChartDataError(true);
                console.warn(`Network response was not ok: ${response.status} - ${response.statusText}`);
            } else {
                const data = await response.text();
                const lines: string[] = data.split('\n');
                const headers: string[] = lines[0].split(',');
                const json: any[] = lines.slice(1).map((line: string) => {
                    const values: string[] = line.split(',');
                    return headers.reduce((object: { [key: string]: string }, header: string, index: number) => {
                        object[header] = values[index];
                        return object;
                    }, {});
                });
                setData(json);
            }
        } catch (error) {
            Snackbar.show({
                text: fetchingDataErrorTranslation,
                duration: Snackbar.LENGTH_SHORT,
                action: {
                    text: tryAgainTranslation,
                    textColor: theme.PRIMARY,
                    onPress: fetchData
                }
            });
            setChartDataError(true);
            console.warn('Error occurred while fetching data: ', error);
        }
    }

    useEffect(() => {
        if (instrument?.cryptoSymbol) {
            fetchData();
        }
    }, [selected]);


    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(
                    scaleAnim,
                    {
                        toValue: 1,
                        duration: 800,
                        easing: Easing.elastic(2),
                        useNativeDriver: true
                    }
                ),
                Animated.timing(
                    scaleAnim,
                    {
                        toValue: lowestScale,
                        duration: 800,
                        easing: Easing.back(2),
                        useNativeDriver: true
                    }
                )
            ])
        ).start();
    }, [scaleAnim]);

    function convertData(data: StockData[]) {
        let labels = [];
        let dataset = [];

        for (let i = 0; i < data.length; i++) {
            const date = data[i].Date;
            const close = data[i].Close;

            if (date === 'null' || close === 'null') {
                continue;
            }

            labels.push(date);
            dataset.push(parseFloat(close));
        }

        return {
            labels: labels,
            datasets: [{
                data: dataset
            }],
        };
    }


    return (
        <View>
            <View style={{
                marginBottom: spacing.SCALE_20,
            }}>
                <SelectList
                    setSelected={(val: any) => setSelected(val)}
                    data={pickListData}
                    save="value"
                    placeholder={lastWeekTranslation}
                    search={false}
                    arrowicon={<ArrowDownIcon fill={theme.LIGHT_HINT} />}
                    inputStyles={{
                        color: theme.TERTIARY,
                    }}
                    boxStyles={{
                        borderColor: theme.LIGHT_HINT,
                        borderRadius: constants.BORDER_RADIUS.INPUT,
                        alignItems: 'center'
                    }}
                    dropdownStyles={{
                        borderColor: theme.LIGHT_HINT,
                        borderRadius: constants.BORDER_RADIUS.INPUT,
                    }}
                    dropdownTextStyles={{
                        color: theme.TERTIARY,
                        backgroundColor: theme.BACKGROUND,
                    }}
                    dropdownItemStyles={{
                        backgroundColor: theme.BACKGROUND
                    }}
                    disabledItemStyles={{
                        backgroundColor: theme.BACKGROUND
                    }}
                />
            </View>
            {chartData
                ?
                <LineChart
                    data={chartData}
                    width={chartWidth}
                    height={chartHeight}
                    yAxisLabel="$"
                    yAxisInterval={1}
                    chartConfig={{
                        backgroundColor: theme.BACKGROUND,
                        backgroundGradientFrom: theme.BACKGROUND,
                        backgroundGradientTo: theme.BACKGROUND,
                        decimalPlaces: 2,
                        color: (opacity = 1) => theme.PRIMARY,
                        labelColor: (opacity = 1) => theme.TERTIARY,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            fill: theme.PRIMARY
                        },
                    }}
                    bezier
                    verticalLabelRotation={50}
                    horizontalLabelRotation={-50}
                    style={{
                        borderRadius: constants.BORDER_RADIUS.BOTTOM_SHEET,
                        borderWidth: 2,
                        borderColor: theme.LIGHT_HINT,
                        paddingTop: 20,
                    }}

                    formatXLabel={(xValue) => {
                        const date = new Date(xValue);
                        const isYear = selected === lastYearTranslation;
                        return formatDateToShortDate(date, intl, isYear);
                    }}


                /> :
                <View
                    style={{
                        width: chartWidth,
                        height: chartHeight,
                        borderRadius: constants.BORDER_RADIUS.BOTTOM_SHEET,
                        borderWidth: 2,
                        borderColor: theme.LIGHT_HINT,
                        paddingTop: spacing.SCALE_20,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {chartDataError ?
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: spacing.SCALE_12
                        }}>
                            <Text style={{
                                color: theme.TERTIARY,
                                fontSize: typography.FONT_SIZE_18,
                            }}>
                                {chartLoadingErrorTranslation}
                            </Text>
                            <TextButton
                                label={tryAgainTranslation}
                                onPress={fetchData}
                            />
                        </View>
                        :
                        <ActivityIndicator text={loadingChartTranslation} />
                    }

                </View>
            }
        </View >
    )
}

const styles = StyleSheet.create({
    indicator: {
        borderRadius: constants.BORDER_RADIUS.CIRCLE,
        width: constants.ICON_SIZE.ACTIVITY_INDICATOR,
        height: constants.ICON_SIZE.ACTIVITY_INDICATOR,
    },
})
