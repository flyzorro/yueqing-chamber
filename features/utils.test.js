const { formatDate, capitalize, truncate } = require('./utils');

// Test formatDate
console.log('Testing formatDate...');
console.log('  formatDate(new Date(2024, 0, 15)):', formatDate(new Date(2024, 0, 15)) === '2024-01-15' ? '✓ PASS' : '✗ FAIL');
console.log('  formatDate("2024-12-25"):', formatDate('2024-12-25') === '2024-12-25' ? '✓ PASS' : '✗ FAIL');
console.log('  formatDate(new Date(2024, 11, 1)):', formatDate(new Date(2024, 11, 1)) === '2024-12-01' ? '✓ PASS' : '✗ FAIL');

// Test capitalize
console.log('\nTesting capitalize...');
console.log('  capitalize("hello"):', capitalize('hello') === 'Hello' ? '✓ PASS' : '✗ FAIL');
console.log('  capitalize("WORLD"):', capitalize('WORLD') === 'WORLD' ? '✓ PASS' : '✗ FAIL');
console.log('  capitalize(""):', capitalize('') === '' ? '✓ PASS' : '✗ FAIL');
console.log('  capitalize(null):', capitalize(null) === '' ? '✓ PASS' : '✗ FAIL');

// Test truncate
console.log('\nTesting truncate...');
console.log('  truncate("hello world", 5):', truncate('hello world', 5) === 'hello...' ? '✓ PASS' : '✗ FAIL');
console.log('  truncate("short", 10):', truncate('short', 10) === 'short' ? '✓ PASS' : '✗ FAIL');
console.log('  truncate("", 5):', truncate('', 5) === '' ? '✓ PASS' : '✗ FAIL');
console.log('  truncate(null, 5):', truncate(null, 5) === '' ? '✓ PASS' : '✗ FAIL');

console.log('\nAll tests completed!');