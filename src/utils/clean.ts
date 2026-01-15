import { LETTERS } from '../data/letters.js';
import { SYMBOLS } from '../data/symbols.js';
import { CLEANING_DIACRITICS } from '../data/diacritics.js';

/**
 * Clean and normalize a raw sentence for transcription
 *
 * @param rawSentence - The sentence to be cleaned
 * @param epenthesis - Whether to apply epenthesis to s+consonant clusters
 * @returns The cleaned sentence
 *
 * @example
 * ```typescript
 * cleanSentence('Hola, ¿cómo estás?', false)
 * // Returns: 'ola komo estas'
 * ```
 */
export function cleanSentence(rawSentence: string, epenthesis: boolean): string {
  let sentence = rawSentence.toLowerCase();

  // Replace isolated letters with their phonetic names
  // Note: Use negative lookahead/behind to avoid matching letters within words
  // that contain accented characters, since JS \b treats accented chars as non-word
  for (const [char, replacement] of Object.entries(LETTERS)) {
    // Match only when not preceded or followed by any letter (including accented)
    const regex = new RegExp(`(?<![a-záéíóúñü])${char}(?![a-záéíóúñü])`, 'gi');
    sentence = sentence.replace(regex, replacement);
  }

  // Remove symbols
  for (const symbol of SYMBOLS) {
    sentence = sentence.replace(new RegExp(`\\${symbol}`, 'g'), ' ');
  }

  // Replace diacritics
  for (const [char, replacement] of Object.entries(CLEANING_DIACRITICS)) {
    sentence = sentence.replace(new RegExp(char, 'g'), replacement);
  }

  // Apply epenthesis if necessary
  if (epenthesis) {
    sentence = sentence.replace(/\bs((?![aeiouáéíóú]))/g, 'es$1');
  }

  return sentence;
}

/**
 * Rehash syllables to adjust syllable boundaries based on phonological rules
 * Moves the final consonant of a syllable to the onset of the next syllable
 * if the next syllable begins with a vowel
 *
 * @param syllables - The list of syllables
 * @returns The rehashed list of syllables
 *
 * @example
 * ```typescript
 * makeRehash(['sol', 'ar'])
 * // Returns: ['so', 'lar']
 * ```
 */
export function makeRehash(syllables: string[]): string[] {
  const vowels = 'aeioujwăĕŏ';
  const result = [...syllables];

  for (let idx = 1; idx < result.length; idx++) {
    const syllable = result[idx];
    if (syllable.length > 1) {
      if (
        vowels.includes(syllable[0].toLowerCase()) &&
        !vowels.includes(result[idx - 1][result[idx - 1].length - 1].toLowerCase())
      ) {
        result[idx] = result[idx - 1][result[idx - 1].length - 1] + syllable;
        result[idx - 1] = result[idx - 1].slice(0, -1);
      }
    }
  }

  return result;
}
