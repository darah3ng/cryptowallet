import numeral from 'numeral';

const formatValue = (number) => {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
};

const renderNumberToReadable = (number) => {
  return numeral(number).format('0.0a');
};

export { formatValue, renderNumberToReadable };
