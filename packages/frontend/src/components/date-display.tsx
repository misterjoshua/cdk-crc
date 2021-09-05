export interface DateDisplayProps {
  readonly date: Date;
}

export const DateDisplay: React.FC<DateDisplayProps> = (props) => {
  const { date } = props;

  // August 15th, 2021
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const ordinal = ord(day);
  const year = date.getFullYear();

  return (
    <>
      {month} {day}
      <sup>{ordinal}</sup> {year}
    </>
  );
};

function ord(num: number) {
  if (num === 1) return 'st';
  if (num === 2) return 'nd';
  if (num === 3) return 'rd';
  else return 'th';
}
