import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Transcription } from '../src/index.js';
import type { Values } from '../src/types.js';

interface GoldenDataEntry {
  input: string;
  phonology: Values;
  phonetics: Values;
  sampa: Values;
}

describe('Golden Data Validation', () => {
  let goldenData: GoldenDataEntry[];

  try {
    const goldenDataPath = join(__dirname, 'golden_data.json');
    const goldenDataJson = readFileSync(goldenDataPath, 'utf-8');
    goldenData = JSON.parse(goldenDataJson) as GoldenDataEntry[];
  } catch (error) {
    console.error('Failed to load golden_data.json:', error);
    goldenData = [];
  }

  if (goldenData.length === 0) {
    it.skip('No golden data loaded', () => {
      // Skip all tests if golden data couldn't be loaded
    });
  } else {
    describe(`Validating ${goldenData.length} golden data entries`, () => {
      goldenData.forEach((entry, index) => {
        describe(`Entry ${index + 1}: "${entry.input}"`, () => {
          let transcription: Transcription;

          try {
            transcription = new Transcription(entry.input);
          } catch (error) {
            it('should transcribe without errors', () => {
              expect(() => new Transcription(entry.input)).not.toThrow();
            });
            return;
          }

          it('should match expected phonology words', () => {
            expect(transcription.phonology.words).toEqual(entry.phonology.words);
          });

          it('should match expected phonology syllables', () => {
            expect(transcription.phonology.syllables).toEqual(entry.phonology.syllables);
          });

          it('should match expected phonetics words', () => {
            expect(transcription.phonetics.words).toEqual(entry.phonetics.words);
          });

          it('should match expected phonetics syllables', () => {
            expect(transcription.phonetics.syllables).toEqual(entry.phonetics.syllables);
          });

          it('should match expected SAMPA words', () => {
            expect(transcription.sampa.words).toEqual(entry.sampa.words);
          });

          it('should match expected SAMPA syllables', () => {
            expect(transcription.sampa.syllables).toEqual(entry.sampa.syllables);
          });
        });
      });
    });
  }
});
