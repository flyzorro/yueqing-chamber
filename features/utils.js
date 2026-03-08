/**
 * Format a date to YYYY-MM-DD format
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Capitalize the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} String with first letter capitalized
 */
function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate a string to a specified length
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated string with ellipsis if needed
 */
function truncate(str, length) {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

module.exports = { formatDate, capitalize, truncate };