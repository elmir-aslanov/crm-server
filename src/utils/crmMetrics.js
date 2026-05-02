export const calculateConversionRate = (leadCount, studentCount) => {
  if (!leadCount) return 0;
  return Number(((studentCount / leadCount) * 100).toFixed(2));
};

export const sumNumericValues = (items, key) => {
  return items.reduce((total, item) => total + Number(item?.[key] || 0), 0);
};