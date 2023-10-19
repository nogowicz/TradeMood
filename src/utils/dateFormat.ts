import { IntlShape } from 'react-intl';

function getShortMonthName(month: number, intl: IntlShape): string {
  const monthId: { [key: string]: string } = {
    '0': 'date.month.short.january',
    '1': 'date.month.short.february',
    '2': 'date.month.short.march',
    '3': 'date.month.short.april',
    '4': 'date.month.short.may',
    '5': 'date.month.short.june',
    '6': 'date.month.short.july',
    '7': 'date.month.short.august',
    '8': 'date.month.short.september',
    '9': 'date.month.short.october',
    '10': 'date.month.short.november',
    '11': 'date.month.short.december',
  };
  return intl.formatMessage({ id: monthId[month] });
}

function getDayName(day: number, intl: IntlShape): string {
  const dayId: { [key: string]: string } = {
    '0': 'date.day.sunday',
    '1': 'date.day.monday',
    '2': 'date.day.tuesday',
    '3': 'date.day.wednesday',
    '4': 'date.day.thursday',
    '5': 'date.day.friday',
    '6': 'date.day.saturday',
  };
  return intl.formatMessage({ id: dayId[day.toString()] });
}

export function formatDateToShortDate(date: Date, intl: IntlShape): string {
  const monthAbbreviation: string = getShortMonthName(date.getMonth(), intl);
  const day: number = date.getDate();

  return `${day} ${monthAbbreviation}`;
}

export function formatLongDate(date: Date, intl: IntlShape): string {
  const dayName: string = getDayName(date.getDay(), intl);
  const day: string = date.getDate().toString();
  const monthAbbreviation: string = getShortMonthName(date.getMonth(), intl);
  const year: string = date.getFullYear().toString();
  const hours: string = date.getHours().toString().padStart(2, '0');
  const minutes: string = date.getMinutes().toString().padStart(2, '0');

  return `${dayName}, ${day} ${monthAbbreviation} ${year}, ${hours}:${minutes}`;
}
