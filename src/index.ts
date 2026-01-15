/**
 * Spanish phonological and phonetic transcription library
 *
 * This library provides comprehensive Spanish text transcription into three parallel representations:
 * - Phonological transcription using IPA (abstract sound units)
 * - Phonetic transcription using IPA with allophones (actual pronunciation)
 * - SAMPA transliteration (ASCII-safe phonetic representation)
 *
 * @packageDocumentation
 *
 * @example
 * ```typescript
 * import { Transcription } from 'fonemas';
 *
 * const t = new Transcription('Averigüéis');
 * console.log(t.phonology.words);   // ['abeɾiˈgwejs']
 * console.log(t.phonetics.words);   // ['aβeɾiˈɣwejs']
 * console.log(t.sampa.words);       // ['aBeri"Gwejs']
 * ```
 */

// Main class export
export { Transcription } from './transcription.js';

// Type exports
export type {
  Values,
  TranscriptionOptions,
  TranscriptionResult,
  ExceptionLevel,
  ConsonantMap,
  CoarticulationRule
} from './types.js';

// Re-export commonly used data for advanced users
export { LETTERS } from './data/letters.js';
export { SYMBOLS } from './data/symbols.js';
export { CLEANING_DIACRITICS, PHONOLOGY_DIACRITICS } from './data/diacritics.js';
export { CONSONANTS } from './data/consonants.js';
export { X_EXCEPTIONS } from './data/x-exceptions.js';
export { ALLOPHONES } from './data/allophones.js';
export { COARTICULATION_RULES } from './data/coarticulations.js';
export { IPA_TO_SAMPA } from './data/sampa.js';
