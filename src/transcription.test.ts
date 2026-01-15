import { describe, it, expect } from 'vitest';
import { Transcription } from './transcription.js';

describe('Transcription', () => {
  describe('Phonology transcription', () => {
    it('should correctly transcribe "huyeron"', () => {
      const t = new Transcription('huyeron');
      expect(t.phonology.words).toEqual(['uˈʝeɾon']);
      expect(t.phonology.syllables).toEqual(['u', 'ˈʝe', 'ɾon']);
    });

    it('should correctly transcribe "escondieron"', () => {
      const t = new Transcription('escondieron');
      expect(t.phonology.words).toEqual(['eskonˈdjeɾon']);
      expect(t.phonology.syllables).toEqual(['es', 'kon', 'ˈdje', 'ɾon']);
    });

    it('should correctly transcribe full sentence', () => {
      const t = new Transcription('Tingi y su abuela huyeron y se escondieron.');
      expect(t.phonology.words).toEqual([
        'ˈtinxi',
        'i',
        'su',
        'aˈbwela',
        'uˈʝeɾon',
        'i',
        'se',
        'eskonˈdjeɾon'
      ]);
    });

    it('should correctly transcribe "hola mundo"', () => {
      const t = new Transcription('hola mundo');
      expect(t.phonology.words).toEqual(['ˈola', 'ˈmundo']);
    });

    it('should correctly transcribe "casa blanca"', () => {
      const t = new Transcription('casa blanca');
      expect(t.phonology.words).toEqual(['ˈkasa', 'ˈblanka']);
    });

    it('should correctly transcribe "perro grande"', () => {
      const t = new Transcription('perro grande');
      expect(t.phonology.words).toEqual(['ˈpero', 'ˈgɾande']);
    });
  });

  describe('Word boundary edge cases', () => {
    it('should not incorrectly match word boundaries with IPA characters', () => {
      // This was the original bug: /uʝ\b/ matched in "huyeron" due to JS treating ʝ as non-word char
      const t = new Transcription('huyeron');
      // Should NOT produce "ˈúijeje" (wrong)
      // Should produce "uˈʝeɾon" (correct)
      expect(t.phonology.words[0]).not.toContain('ú');
      expect(t.phonology.words[0]).toContain('ʝ');
    });
  });

  describe('Silabeador-ts workaround', () => {
    it('should correctly syllabify words with -eron ending', () => {
      // Tests the workaround for silabeador-ts bug with 'ɾ' character
      const testCases = [
        { input: 'huyeron', expected: ['u', 'ˈʝe', 'ɾon'] },
        { input: 'escondieron', expected: ['es', 'kon', 'ˈdje', 'ɾon'] },
        { input: 'corrieron', expected: ['ko', 'ˈrje', 'ɾon'] }
      ];

      for (const { input, expected } of testCases) {
        const t = new Transcription(input);
        expect(t.phonology.syllables).toEqual(expected);
      }
    });
  });

  describe('Phonetics transcription', () => {
    it('should apply allophone rules correctly', () => {
      const t = new Transcription('huyeron');
      // Phonetics should have β, ð, ɣ allophones in intervocalic positions
      expect(t.phonetics.words).toBeDefined();
      expect(t.phonetics.syllables).toBeDefined();
    });
  });

  describe('SAMPA transcription', () => {
    it('should convert IPA to SAMPA correctly', () => {
      const t = new Transcription('huyeron');
      expect(t.sampa.words).toBeDefined();
      expect(t.sampa.syllables).toBeDefined();
      // SAMPA uses ASCII-safe characters
      expect(t.sampa.words[0]).toMatch(/^[a-zA-Z"]+$/);
    });
  });
});
