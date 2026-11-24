const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const pad = (number: number): string => String(number).padStart(2, '0');

// in the browser's time zone, e.g. "2 Nov 2026, 09:14"
export const formatDateTime = (iso: string): string => {
  const date = new Date(iso);

  // unparsable: as received, instead of "NaN undefined NaN, NaN:NaN"
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
