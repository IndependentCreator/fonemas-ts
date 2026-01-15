/**
 * Type definitions for the fonemas library
 * @packageDocumentation
 */

/**
 * Level of exception handling for syllabification
 * - 0: No exceptions
 * - 1: Basic exceptions
 * - 2: Extended exceptions with hiatus rules
 */
export type ExceptionLevel = 0 | 1 | 2;

/**
 * Values container holding parallel representations of words and syllables
 * This replaces Python's dataclass structure
 */
export interface Values {
  /**
   * List of transcribed words
   */
  words: string[];

  /**
   * List of transcribed syllables
   */
  syllables: string[];
}

/**
 * Configuration options for the Transcription class
 */
export interface TranscriptionOptions {
  /**
   * Mark stress on monosyllabic words
   * @default false
   */
  mono?: boolean;

  /**
   * Level of exceptions handling for syllabification
   * @default 1
   */
  exceptions?: ExceptionLevel;

  /**
   * Apply epenthesis to s+consonant clusters (e.g., 'spiritu' → 'espiritu')
   * @default false
   */
  epenthesis?: boolean;

  /**
   * Mark aspiration with ʰ in onset position
   * @default false
   */
  aspiration?: boolean;

  /**
   * Move final consonants to the onset of the next word
   * @default false
   */
  rehash?: boolean;

  /**
   * Stress marker character for SAMPA output
   * @default '"'
   */
  stress?: string;
}

/**
 * Complete transcription result containing all three representations
 */
export interface TranscriptionResult {
  /**
   * Phonological transcription using abstract sound units in IPA
   */
  phonology: Values;

  /**
   * Phonetic transcription in IPA with allophones (actual pronunciation)
   */
  phonetics: Values;

  /**
   * SAMPA transliteration (ASCII-safe phonetic representation)
   */
  sampa: Values;
}

/**
 * Type for consonant mapping records
 */
export type ConsonantMap = Record<string, string>;

/**
 * Type for coarticulation rule patterns
 * Each rule contains a regex pattern and its replacement string
 */
export interface CoarticulationRule {
  /**
   * Regular expression pattern to match
   */
  pattern: RegExp;

  /**
   * Replacement string for the matched pattern
   */
  replacement: string;
}
