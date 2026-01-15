/**
 * Mappings for isolated letters to their phonetic names in Spanish
 * Used in text cleaning phase to convert isolated letters to their spoken form
 */
export const LETTERS = {
  'b': 'be',
  'c': 'θe',
  'ch': 'ʧe',
  'd': 'de',
  'f': 'efe',
  'g': 'ge',
  'h': 'haʧe',
  'j': 'jota',
  'k': 'ka',
  'l': 'ele',
  'll': 'eʎe',
  'm': 'eme',
  'n': 'ene',
  'p': 'pe',
  'q': 'ku',
  'r': 'erre',
  's': 'ese',
  't': 'te',
  'v': 'ube',
  'w': 'ubedoble',
  'x': 'ekis',
  'z': 'θeta'
} as const;
