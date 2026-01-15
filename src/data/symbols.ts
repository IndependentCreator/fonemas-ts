/**
 * Punctuation and symbols to remove during text cleaning
 */
export const SYMBOLS = [
  '(',
  ')',
  '¿',
  '?',
  '¡',
  '!',
  '«',
  '»',
  '"',
  '\u201c', // Left double quotation mark
  '\u2018', // Left single quotation mark
  '\u2019', // Right single quotation mark
  '[',
  ']',
  '—',
  '…',
  ',',
  ';',
  ':',
  "'",
  '.',
  '–',
  '\u201d', // Right double quotation mark
  '-'
] as const;
