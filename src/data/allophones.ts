/**
 * Allophone substitution rules
 * Stop consonants (b/d/g) become fricatives (β/ð/ɣ) in intervocalic contexts
 * and after certain consonants (but not after nasals)
 */
export const ALLOPHONES = {
  'b': 'β',
  'd': 'ð',
  'g': 'ɣ'
} as const;
