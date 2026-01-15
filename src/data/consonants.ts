/**
 * Consonant mappings for phonological transcription
 * Maps Spanish orthography to IPA phonological symbols
 * Note: Order of application matters for some replacements
 */
export const CONSONANTS = {
  'w': 'b',
  'v': 'b',
  'z': 'θ',
  'ñ': 'ɲ',
  'x': 'ks',
  'j': 'x',
  'r': 'ɾ',
  'R': 'r',
  'ce': 'θe',
  'cé': 'θé',
  'cë': 'θë',
  'ci': 'θi',
  'cí': 'θí',
  'cï': 'θï',
  'cj': 'θj',
  'ch': 'ʧ',
  'c': 'k',
  'qu': 'k',
  'll': 'ʎ',
  'ph': 'f',
  'hie': 'ʝe',
  'h': ''
} as const;
