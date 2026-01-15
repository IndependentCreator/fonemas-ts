import type { Values } from '../types.js';
import { IPA_TO_SAMPA } from '../data/sampa.js';

/**
 * Convert IPA transcription to SAMPA transcription
 *
 * @param ipa - Values object containing the IPA transcription
 * @param stressMark - The character to mark stress in SAMPA transcription
 * @returns Values object containing the SAMPA transcription
 *
 * @example
 * ```typescript
 * const ipa = { words: ['ˈkasa'], syllables: ['ˈka', 'sa'] };
 * ipa2sampa(ipa, '"')
 * // Returns: { words: ['"kasa'], syllables: ['"ka', 'sa'] }
 * ```
 */
export function ipa2sampa(ipa: Values, stressMark: string): Values {
  const result: Values = {
    words: [...ipa.words],
    syllables: [...ipa.syllables]
  };

  // Build transliteration map with custom stress marker
  const transliteration = { ...IPA_TO_SAMPA, 'ˈ': stressMark };

  // Apply transliteration
  for (const [key, value] of Object.entries(transliteration)) {
    result.words = result.words.map((w) => w.replace(new RegExp(key, 'g'), value));
    result.syllables = result.syllables.map((s) =>
      s.replace(new RegExp(key, 'g'), value)
    );
  }

  return result;
}
