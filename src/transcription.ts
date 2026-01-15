import type {
  TranscriptionOptions,
  Values,
  TranscriptionResult
} from './types.js';
import { cleanSentence, makeRehash } from './utils/clean.js';
import { transcriptionPhonology } from './utils/phonology.js';
import { transcriptionPhonetics } from './utils/phonetics.js';
import { ipa2sampa } from './utils/sampa.js';

/**
 * Class for transcribing Spanish sentences into phonological, phonetic, and SAMPA representations
 *
 * This class provides a comprehensive transcription pipeline that converts Spanish text
 * into three parallel representations:
 * - Phonological: Abstract sound units using IPA symbols
 * - Phonetic: Actual pronunciation with allophones in IPA
 * - SAMPA: ASCII-safe phonetic representation
 *
 * @example
 * ```typescript
 * const t = new Transcription('Averigüéis');
 *
 * // Phonological transcription
 * console.log(t.phonology.words);      // ['abeɾiˈgwejs']
 * console.log(t.phonology.syllables);  // ['a', 'be', 'ɾi', 'ˈgwejs']
 *
 * // Phonetic transcription
 * console.log(t.phonetics.words);      // ['aβeɾiˈɣwejs']
 * console.log(t.phonetics.syllables);  // ['a', 'βe', 'ɾi', 'ˈɣwejs']
 *
 * // SAMPA transcription
 * console.log(t.sampa.words);          // ['aBeri"Gwejs']
 * console.log(t.sampa.syllables);      // ['a', 'Be', 'ri', '"Gwejs']
 * ```
 *
 * @example
 * ```typescript
 * // With options
 * const t = new Transcription('sol', {
 *   mono: true,        // Mark stress on monosyllables
 *   epenthesis: true,  // Apply epenthesis to s+consonant
 *   stress: '\''       // Use ' instead of " for stress
 * });
 * ```
 */
export class Transcription implements TranscriptionResult {
  /**
   * The cleaned input sentence
   */
  public readonly sentence: string;

  /**
   * Phonological transcription (abstract sound units in IPA)
   */
  public readonly phonology: Values;

  /**
   * Phonetic transcription in IPA (actual pronunciation with allophones)
   */
  public readonly phonetics: Values;

  /**
   * SAMPA transliteration (ASCII-safe phonetic representation)
   */
  public readonly sampa: Values;

  /**
   * Initialize the Transcription class and process the sentence through the transcription pipeline
   *
   * @param sentence - The Spanish sentence to be transcribed
   * @param options - Configuration options for the transcription
   *
   * @throws {Error} If the sentence is invalid or if silabeador encounters an error
   */
  constructor(sentence: string, options: TranscriptionOptions = {}) {
    const {
      mono = false,
      exceptions = 1,
      epenthesis = false,
      aspiration = false,
      rehash = false,
      stress = '"'
    } = options;

    // Step 1: Clean and normalize the sentence
    this.sentence = cleanSentence(sentence, epenthesis);

    // Step 2: Generate phonological transcription
    this.phonology = transcriptionPhonology(
      this.sentence,
      mono,
      aspiration,
      exceptions
    );

    // Step 3: Apply rehashing if requested
    if (rehash) {
      this.phonology.syllables = makeRehash(this.phonology.syllables);
    }

    // Step 4: Generate phonetic transcription
    this.phonetics = transcriptionPhonetics(this.phonology);

    // Step 5: Generate SAMPA transcription
    this.sampa = ipa2sampa(this.phonetics, stress);
  }

  /**
   * Get all transcriptions as a single object
   *
   * @returns Object containing phonology, phonetics, and sampa transcriptions
   *
   * @example
   * ```typescript
   * const t = new Transcription('casa');
   * const all = t.getAll();
   * console.log(all.phonology);  // { words: ['ˈkasa'], syllables: ['ˈka', 'sa'] }
   * console.log(all.phonetics);  // { words: ['ˈkasa'], syllables: ['ˈka', 'sa'] }
   * console.log(all.sampa);      // { words: ['"kasa'], syllables: ['"ka', 'sa'] }
   * ```
   */
  public getAll(): TranscriptionResult {
    return {
      phonology: this.phonology,
      phonetics: this.phonetics,
      sampa: this.sampa
    };
  }
}
