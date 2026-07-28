/**
 * CNPJ Validation and Formatting Utility
 * Supports both traditional Numeric CNPJ and the New Alphanumeric CNPJ Format
 * (Instrução Normativa RFB nº 2.229)
 */

/**
 * Removes non-alphanumeric characters and converts letters to uppercase
 * @param {string} value 
 * @returns {string}
 */
export function cleanCNPJ(value) {
  if (!value) return '';
  return String(value).replace(/[^0-9A-Za-z]/g, '').toUpperCase();
}

/**
 * Formats an alphanumeric CNPJ string into XX.XXX.XXX/XXXX-XX
 * @param {string} value 
 * @returns {string}
 */
export function formatCNPJ(value) {
  const chars = cleanCNPJ(value).slice(0, 14);
  
  if (chars.length <= 2) return chars;
  if (chars.length <= 5) return `${chars.slice(0, 2)}.${chars.slice(2)}`;
  if (chars.length <= 8) return `${chars.slice(0, 2)}.${chars.slice(2, 5)}.${chars.slice(5)}`;
  if (chars.length <= 12) return `${chars.slice(0, 2)}.${chars.slice(2, 5)}.${chars.slice(5, 8)}/${chars.slice(8)}`;
  return `${chars.slice(0, 2)}.${chars.slice(2, 5)}.${chars.slice(5, 8)}/${chars.slice(8, 12)}-${chars.slice(12, 14)}`;
}

/**
 * Calculates the character value for Modulo 11 check digit (ASCII - 48)
 * 0..9 -> 0..9
 * A..Z -> 17..42 (ASCII 65 - 48 = 17)
 */
function getCharVal(char) {
  return char.charCodeAt(0) - 48;
}

/**
 * Validates a CNPJ string (numeric or alphanumeric) using RFB Modulo 11 algorithm
 * @param {string} cnpj 
 * @returns {boolean}
 */
export function validateCNPJ(cnpj) {
  const clean = cleanCNPJ(cnpj);

  if (clean.length !== 14) return false;

  // Reject sequence of identical characters (e.g. 00000000000000, AAAAAAAAAAAAAA)
  if (/^([0-9A-Z])\1{13}$/.test(clean)) return false;

  // The last 2 characters (check digits) MUST be numeric (0-9)
  const d1Char = clean.charAt(12);
  const d2Char = clean.charAt(13);
  if (!/[0-9]/.test(d1Char) || !/[0-9]/.test(d2Char)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum1 = 0;
  for (let i = 0; i < 12; i++) {
    sum1 += getCharVal(clean.charAt(i)) * weights1[i];
  }
  const rem1 = sum1 % 11;
  const expectedD1 = rem1 < 2 ? 0 : 11 - rem1;

  if (parseInt(d1Char, 10) !== expectedD1) return false;

  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum2 = 0;
  for (let i = 0; i < 12; i++) {
    sum2 += getCharVal(clean.charAt(i)) * weights2[i];
  }
  sum2 += expectedD1 * weights2[12];
  const rem2 = sum2 % 11;
  const expectedD2 = rem2 < 2 ? 0 : 11 - rem2;

  if (parseInt(d2Char, 10) !== expectedD2) return false;

  return true;
}

/**
 * Checks if a valid CNPJ contains alphanumeric characters (letters in base or branch)
 * @param {string} cnpj 
 * @returns {boolean}
 */
export function isAlphanumericCNPJ(cnpj) {
  const clean = cleanCNPJ(cnpj);
  return /[A-Z]/.test(clean);
}

/**
 * Generates a valid random traditional numeric CNPJ
 */
export function generateRandomCNPJ() {
  const n = Array.from({ length: 8 }, () => Math.floor(Math.random() * 9));
  const base = [...n, 0, 0, 0, 1]; // /0001
  
  let sum = 0;
  let weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 12; i++) {
    sum += base[i] * weights[i];
  }
  let d1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  base.push(d1);

  sum = 0;
  weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 13; i++) {
    sum += base[i] * weights[i];
  }
  let d2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  base.push(d2);

  return formatCNPJ(base.join(''));
}

/**
 * Generates a valid random Alphanumeric CNPJ for testing new RFB format
 */
export function generateRandomAlphanumericCNPJ() {
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  // Base with at least 1-2 letters
  let base = [];
  base.push(letterSet[Math.floor(Math.random() * letterSet.length)]);
  base.push(letterSet[Math.floor(Math.random() * letterSet.length)]);
  for (let i = 0; i < 6; i++) {
    base.push(charset[Math.floor(Math.random() * charset.length)]);
  }
  
  // Branch (4 chars, e.g. A001)
  base.push('A', '0', '0', '1');

  // Compute 1st digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum1 = 0;
  for (let i = 0; i < 12; i++) {
    sum1 += getCharVal(base[i]) * weights1[i];
  }
  const rem1 = sum1 % 11;
  const d1 = rem1 < 2 ? 0 : 11 - rem1;
  base.push(d1);

  // Compute 2nd digit
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum2 = 0;
  for (let i = 0; i < 13; i++) {
    sum2 += getCharVal(String(base[i])) * weights2[i];
  }
  const rem2 = sum2 % 11;
  const d2 = rem2 < 2 ? 0 : 11 - rem2;
  base.push(d2);

  return formatCNPJ(base.join(''));
}
