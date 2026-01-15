/**
 * Diacritic normalization for the cleaning phase
 * Converts alternative diacritics to standard Spanish forms
 */
export const CLEANING_DIACRITICS = {
  'à': 'á',
  'è': 'é',
  'ì': 'í',
  'ò': 'ó',
  'ù': 'ú',
  'æ': 'e',
  'ä': '_a',
  'ë': '_e',
  'ï': '_i',
  'ö': '_o',
  'ã': 'á',
  'õ': 'ó',
  'â': 'a',
  'ê': 'e',
  'î': 'i',
  'ô': 'o',
  'û': 'u',
  'ç': 'θ'
} as const;

/**
 * Diacritic removal for the phonological transcription phase
 * Removes stress marks and normalizes vowels after processing
 */
export const PHONOLOGY_DIACRITICS = {
  'á': 'a',
  'à': 'a',
  'ä': 'a',
  'é': 'e',
  'è': 'e',
  'ë': 'e',
  'ú': 'u',
  'ù': 'u',
  'ü': 'u',
  'í': 'i',
  'ì': 'i',
  'ï': 'i',
  'ó': 'o',
  'ò': 'o',
  'ö': 'o',
  '_': ''
} as const;
