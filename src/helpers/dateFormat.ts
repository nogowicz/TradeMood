export function formatDateTime(dateTime: string): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  };

  const formattedDate: string = new Date(dateTime).toLocaleDateString(
    undefined,
    options,
  );
  return formattedDate.replace(',', '');
}
