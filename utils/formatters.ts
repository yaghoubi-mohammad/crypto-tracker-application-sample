// Format the price of a cryptocurrency to include currency symbol and formatted decimal places
export const formatPrice = (value: string) =>
  `$${parseFloat(value).toLocaleString(undefined, {
    minimumFractionDigits: 2, // Ensure at least two decimal places
    maximumFractionDigits: 8, // Allow up to eight decimal places for precision
  })}`;

// Format large numbers (e.g., market cap) into billions with 'B' suffix
export const formatBigNumber = (value: string) =>
  `$${(parseFloat(value) / 1e9).toFixed(2)}B`; // Divide the number by 1 billion and round to 2 decimal places

// Format volume numbers with two decimal places for clarity
export const formatVolume = (value: string) =>
  `$${parseFloat(value).toLocaleString(undefined, {
    minimumFractionDigits: 2, // Always show two decimal places
    maximumFractionDigits: 2, // Restrict to two decimal places
  })}`;

// Format the supply of a cryptocurrency, ensuring clean formatting for large numbers
export const formatSupply = (value: string | null) => {
  if (!value || isNaN(parseFloat(value))) {
    // Return a dash if the value is null or not a valid number
    return "-";
  }
  return parseFloat(value).toLocaleString(undefined, {
    minimumFractionDigits: 0, // No decimal places for whole numbers
    maximumFractionDigits: 0, // Ensure integer-like representation
  });
};
