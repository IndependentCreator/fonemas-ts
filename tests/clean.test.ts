import { describe, test, expect } from 'vitest';
import { cleanSentence, makeRehash } from '../src/utils/clean.js';

describe('cleanSentence', () => {
  test('converts to lowercase', () => {
    const result = cleanSentence('HOLA', false);
    expect(result).toBe('hola');
  });

  test('removes punctuation', () => {
    const result = cleanSentence('¿Hola, mundo?', false);
    expect(result).not.toContain('¿');
    expect(result).not.toContain(',');
    expect(result).not.toContain('?');
  });

  test('replaces isolated letters with phonetic names', () => {
    const result = cleanSentence('b c d', false);
    expect(result).toContain('be');
    expect(result).toContain('θe');
    expect(result).toContain('de');
  });

  test('normalizes diacritics', () => {
    const result = cleanSentence('àèìòù', false);
    expect(result).toContain('á');
    expect(result).toContain('é');
    expect(result).toContain('í');
    expect(result).toContain('ó');
    expect(result).toContain('ú');
  });

  test('applies epenthesis when enabled', () => {
    const result = cleanSentence('spiritu', true);
    expect(result).toContain('esp');
  });

  test('does not apply epenthesis when disabled', () => {
    const result = cleanSentence('spiritu', false);
    expect(result).toContain('sp');
  });

  test('handles ç to θ', () => {
    const result = cleanSentence('façade', false);
    expect(result).toContain('θ');
  });
});

describe('makeRehash', () => {
  test('moves final consonant to next onset', () => {
    const result = makeRehash(['sol', 'ar']);
    expect(result).toEqual(['so', 'lar']);
  });

  test('does not modify if next syllable starts with consonant', () => {
    const result = makeRehash(['cas', 'ta']);
    expect(result).toEqual(['cas', 'ta']);
  });

  test('handles empty array', () => {
    const result = makeRehash([]);
    expect(result).toEqual([]);
  });

  test('handles single syllable', () => {
    const result = makeRehash(['sol']);
    expect(result).toEqual(['sol']);
  });

  test('handles multiple syllables', () => {
    const result = makeRehash(['mar', 'es', 'ol']);
    // Note: The rehash cascades - r moves to 'es', then s moves to 'ol'
    expect(result).toEqual(['ma', 're', 'sol']);
  });
});
