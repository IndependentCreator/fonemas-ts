import { Syllabification } from 'silabeador-ts';
import type { Values, ExceptionLevel } from '../types.js';
import { CONSONANTS } from '../data/consonants.js';
import { PHONOLOGY_DIACRITICS } from '../data/diacritics.js';
import { X_EXCEPTIONS } from '../data/x-exceptions.js';

/**
 * Apply diphthong transformations to syllables
 * Converts high vowels (i, u) to semivowels (j, w) in diphthong contexts
 *
 * @param syllables - The list of syllables to process
 * @returns The modified list of syllables
 */
function processDiphthongs(syllables: string[]): string[] {
  const result = [...syllables];

  for (let idx = 0; idx < result.length; idx++) {
    let syllable = result[idx];

    // V + high vowel → V + semivowel
    if (/[aeioáéó][ui]/.test(syllable)) {
      syllable = syllable.replace(/([aeoáéó])i/g, '$1j');
      syllable = syllable.replace(/([aeioáéó])u/g, '$1w');
    }

    // High vowel + V → semivowel + V
    if (/[ui][aeiouáéó]/.test(syllable)) {
      syllable = syllable.replace(/i([aeoáéó])/g, 'j$1');
      syllable = syllable.replace(/u([aeoiáéó])/g, 'w$1');
    }

    result[idx] = syllable;
  }

  return result;
}

/**
 * Split sentence into words and syllables, applying stress marks
 *
 * @param sentence - The cleaned sentence to split
 * @param mono - Whether to mark stress on monosyllabic words
 * @param exceptions - Level of exception handling
 * @returns Values object containing words and syllables
 */
function splitVariables(
  sentence: string,
  mono: boolean,
  exceptions: ExceptionLevel
): Values {
  const words: string[] = [];
  const syllablesSentence: string[] = [];

  for (const word of sentence.split(/\s+/).filter((w) => w.length > 0)) {
    let syllables: string[];
    let stress: number;

    // Handle -mente adverbs specially
    if (word.length > 5 && word.endsWith('mente')) {
      const root = word.slice(0, -5);
      const syllabification = new Syllabification(root, exceptions, true, true);
      syllables = syllabification.syllables;
      stress = syllables.length > 1 ? syllabification.stress - 2 : -2;
      syllables.push('ˌmen', 'te');
    } else {
      // Syllabify with accents present - silabeador handles them correctly
      const syllabification = new Syllabification(word, exceptions, true, true);
      syllables = syllabification.syllables;
      stress = syllabification.stress;
    }

    // Process diphthongs
    syllables = processDiphthongs(syllables);

    // Add primary stress marker
    // Handle negative indices (Python-style) - convert to positive
    const stressIndex = stress < 0 ? syllables.length + stress : stress;
    if (stressIndex >= 0 && stressIndex < syllables.length) {
      syllables[stressIndex] = `ˈ${syllables[stressIndex]}`;
    }

    let finalWord = syllables.join('');

    // Remove stress marker from monosyllables if mono=false
    if (!mono && syllables.length === 1) {
      finalWord = finalWord.replace('ˈ', '');
    }

    words.push(finalWord);
    syllablesSentence.push(...syllables);
  }

  return { words, syllables: syllablesSentence };
}

/**
 * Generate the phonological transcription of a sentence
 *
 * @param sentence - The cleaned sentence to transcribe
 * @param mono - Whether to mark stress on monosyllabic words
 * @param aspiration - Whether to mark aspiration
 * @param exceptions - Level of exception handling
 * @returns Values object containing the phonological transcription
 *
 * @example
 * ```typescript
 * transcriptionPhonology('casa', false, false, 1)
 * // Returns: { words: ['ˈkasa'], syllables: ['ˈka', 'sa'] }
 * ```
 */
export function transcriptionPhonology(
  sentence: string,
  mono: boolean,
  aspiration: boolean,
  exceptions: ExceptionLevel
): Values {
  // Handle 'x' specific cases before replacing 'j'
  if (sentence.includes('x')) {
    for (const word of sentence.split(/\s+/)) {
      if (X_EXCEPTIONS.includes(word as any)) {
        sentence = sentence.replace(word, word.replace(/x/g, 'j'));
      }
    }
    sentence = sentence.replace(/\bx/g, 's');
  }

  // Apply consonant replacements and handle aspiration
  // Note: Match r that should become R (trill):
  // - After n, l, or s
  // - At word start (but not after accented chars which JS \b treats as non-word)
  // - Double rr
  sentence = sentence.replace(/(?:([nls])r|(^|[\s])r|rr)/g, '$1$2R');

  if (aspiration) {
    sentence = sentence.replace(/\bh/g, 'ʰ');
  }

  // Apply consonant mappings (order matters!)
  for (const [consonant, replacement] of Object.entries(CONSONANTS)) {
    sentence = sentence.replace(new RegExp(consonant, 'g'), replacement);
  }

  // Handle 'y' specific cases
  if (sentence.includes('y')) {
    sentence = sentence.replace(/\by\b/g, 'i');
    sentence = sentence.replace(/uy(?=\s|$)/g, 'wi');
    sentence = sentence.replace(/y(?=\s|$)/g, 'j');
    sentence = sentence.replace(/y/g, 'ʝ');

    // Fix stressed vowel + ʝ at word end
    // Note: In JavaScript, \b doesn't work correctly with IPA characters like ʝ
    // We use (?=\s|$) to match word end instead
    for (const [accented, unaccented] of Object.entries(PHONOLOGY_DIACRITICS)) {
      if ('áéíóú'.includes(accented)) {
        sentence = sentence.replace(
          new RegExp(`${unaccented}ʝ(?=\\s|$)`, 'g'),
          `${accented}i`
        );
      }
    }

    sentence = sentence.replace(/ʝ((?![aeiouáéíóú]))/g, 'i$1');
  }

  // Handle 'g' specific cases
  if (sentence.includes('g')) {
    sentence = sentence.replace(/g([eiéíëï])/g, 'x$1');
    sentence = sentence.replace(/g[u]([eiéíëï])/g, 'g$1');
    sentence = sentence.replace(/gü([eiéí])/gi, 'gw$1');
    sentence = sentence.replace(/gu([aoáó])/gi, 'gw$1');
  }

  // Split sentence into words and syllables
  const transcription = splitVariables(sentence, mono, exceptions);

  // Apply diacritic replacements
  for (const [key, value] of Object.entries(PHONOLOGY_DIACRITICS)) {
    transcription.words = transcription.words.map((w) =>
      w.replace(new RegExp(key, 'g'), value)
    );
    transcription.syllables = transcription.syllables.map((s) =>
      s.replace(new RegExp(key, 'g'), value)
    );
  }

  return transcription;
}
