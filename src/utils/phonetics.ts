import type { Values } from '../types.js';
import { ALLOPHONES } from '../data/allophones.js';
import { COARTICULATION_RULES } from '../data/coarticulations.js';

/**
 * Apply phonetic substitutions to simulate allophones and coarticulations
 *
 * @param text - The string of words/syllables to process
 * @returns The modified string with phonetic changes applied
 */
function phoneticSubstitute(text: string): string[] {
  let result = text;

  // Apply allophone rules
  for (const [allo, replacement] of Object.entries(ALLOPHONES)) {
    const regex = new RegExp(`([^mnɲ\\n\\-\\sˈ][\\-\\s]{0,1}ˈ{0,1})${allo}`, 'g');
    result = result.replace(regex, `$1${replacement}`);
  }

  // Apply coarticulation rules
  for (const rule of COARTICULATION_RULES) {
    result = result.replace(rule.pattern, rule.replacement);
  }

  return result.replace(/-/g, ' ').split(/\s+/).filter((w) => w.length > 0);
}

/**
 * Convert the phonological transcription to a phonetic transcription
 *
 * @param phonology - Values object containing the phonological transcription
 * @returns Values object containing the phonetic transcription
 *
 * @example
 * ```typescript
 * const phonology = { words: ['ˈkaba'], syllables: ['ˈka', 'ba'] };
 * transcriptionPhonetics(phonology)
 * // Returns: { words: ['ˈkaβa'], syllables: ['ˈka', 'βa'] }
 * ```
 */
export function transcriptionPhonetics(phonology: Values): Values {
  const words = phonology.words.join(' ');
  const syllables = phonology.syllables.join('-');

  return {
    words: phoneticSubstitute(words),
    syllables: phoneticSubstitute(syllables)
  };
}
