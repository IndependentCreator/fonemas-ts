/**
 * IPA to SAMPA transliteration mappings
 * Converts IPA phonetic symbols to ASCII-safe SAMPA equivalents
 *
 * Note: The stress marker 'ˈ' will be replaced with a custom marker
 * specified by the user (default is '"')
 */
export const IPA_TO_SAMPA = {
  'β': 'B',
  'ð': 'D',
  'ɣ': 'G',
  'ʎ': 'L',
  'r': 'rr',
  'ɾ': 'r',
  'ɱ': 'M',
  'ŋ': 'N',
  'ɲ': 'J',
  'ʧ': 'tS',
  'ʝ': 'y',
  'χ': '4',
  'θ': 'T',
  'ˈ': '"',  // Will be replaced with custom stress marker
  'ˌ': '%'
} as const;
