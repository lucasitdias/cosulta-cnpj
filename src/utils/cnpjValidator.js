/**
 * CNPJ Validation and Formatting Utility
 */

/**
 * Removes non-digit characters from a string
 * @param {string} value 
 * @returns {string}
 */
export function cleanCNPJ(value) {
  if (!value) return '';
  return String(value).replace(/\D/g, '');
}

/**
 * Formats a CNPJ string into 00.000.000/0000-00
 * @param {string} value 
 * @returns {string}
 */
export function formatCNPJ(value) {
  const digits = cleanCNPJ(value).slice(0, 14);
  
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

/**
 * Validates a CNPJ string using the official verification algorithm
 * @param {string} cnpj 
 * @returns {boolean}
 */
export function validateCNPJ(cnpj) {
  const digits = cleanCNPJ(cnpj);

  if (digits.length !== 14) return false;

  // Check for known invalid CNPJs (e.g., 00000000000000, 11111111111111, etc.)
  if (/^(\d)\1{13}$/.test(digits)) return false;

  // Validate 1st Check Digit
  let size = digits.length - 2;
  let numbers = digits.substring(0, size);
  const digitsVerifiers = digits.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digitsVerifiers.charAt(0), 10)) return false;

  // Validate 2nd Check Digit
  size = size + 1;
  numbers = digits.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digitsVerifiers.charAt(1), 10)) return false;

  return true;
}

/**
 * Generates a valid random CNPJ for testing purposes
 * @returns {string}
 */
export function generateRandomCNPJ() {
  const n = Array.from({ length: 8 }, () => Math.floor(Math.random() * 9));
  const base = [...n, 0, 0, 0, 1]; // Standard /0001 branch
  
  // Compute 1st digit
  let sum = 0;
  let weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 12; i++) {
    sum += base[i] * weights[i];
  }
  let d1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  base.push(d1);

  // Compute 2nd digit
  sum = 0;
  weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 13; i++) {
    sum += base[i] * weights[i];
  }
  let d2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  base.push(d2);

  return formatCNPJ(base.join(''));
}
