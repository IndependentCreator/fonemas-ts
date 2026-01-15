import type { CoarticulationRule } from '../types.js';

/**
 * Coarticulation rules for phonetic transcription
 * Applied in order to simulate sound interactions between adjacent phonemes
 *
 * Rules include:
 * - Voicing assimilation (s/θ/f become voiced before voiced consonants)
 * - Nasal assimilation (n assimilates to place of following consonant)
 * - Fortition (fricatives become stops after nasals/laterals)
 * - Uvularization (x → χ before back vowels)
 */
export const COARTICULATION_RULES: readonly CoarticulationRule[] = [
  { pattern: /θ([\s\-ˈ]*)([bdgβðɣmnɲlʎrɾ])/g, replacement: 'ð$1$2' },
  { pattern: /s([\s\-ˈ]*)([bdgβðɣmnɲlʎrɾ])/g, replacement: 'z$1$2' },
  { pattern: /f([\s\-ˈ]*)([bdgβðɣmnɲʎ])/g, replacement: 'v$1$2' },
  { pattern: /([lmn])([\s\-ˈ]*)ð/g, replacement: '$1$2d' },
  { pattern: /n([\s\-ˈ]*)([bpm])/g, replacement: 'm$1$2' },
  { pattern: /n([\s\-ˈ]*)f/g, replacement: 'ɱ$1f' },
  { pattern: /n([\s\-ˈ]*)k/g, replacement: 'ŋ$1k' },
  { pattern: /n([\s\-ˈ]*)[gɣ]/g, replacement: 'ŋ$1g' },
  { pattern: /n([\s\-ˈ]*)x/g, replacement: 'ŋ$1x' },
  { pattern: /x([\s\-ˈ]*)(uow)/g, replacement: 'χ$1$2' }
] as const;
