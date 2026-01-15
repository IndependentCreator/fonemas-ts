/**
 * Golden Data Analysis Script
 *
 * This script analyzes the differences between the TypeScript implementation
 * and the expected golden data from the Python implementation.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Transcription } from '../src/index.js';
import type { Values } from '../src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface GoldenDataEntry {
  input: string;
  phonology: Values;
  phonetics: Values;
  sampa: Values;
}

interface FailureReport {
  entry: number;
  input: string;
  failures: {
    phonologyWords?: { expected: string[]; actual: string[] };
    phonologySyllables?: { expected: string[]; actual: string[] };
    phoneticsWords?: { expected: string[]; actual: string[] };
    phoneticsSyllables?: { expected: string[]; actual: string[] };
    sampaWords?: { expected: string[]; actual: string[] };
    sampaSyllables?: { expected: string[]; actual: string[] };
  };
}

function arraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((val, idx) => val === b[idx]);
}

function main() {
  const goldenDataPath = join(__dirname, 'golden_data.json');
  const goldenData: GoldenDataEntry[] = JSON.parse(readFileSync(goldenDataPath, 'utf-8'));

  const failureReports: FailureReport[] = [];
  let totalTests = 0;
  let passedTests = 0;

  console.log(`Analyzing ${goldenData.length} golden data entries...\n`);

  for (let i = 0; i < goldenData.length; i++) {
    const entry = goldenData[i];
    const transcription = new Transcription(entry.input);
    const failures: FailureReport['failures'] = {};

    // Test phonology words
    totalTests++;
    if (!arraysEqual(transcription.phonology.words, entry.phonology.words)) {
      failures.phonologyWords = {
        expected: entry.phonology.words,
        actual: transcription.phonology.words
      };
    } else {
      passedTests++;
    }

    // Test phonology syllables
    totalTests++;
    if (!arraysEqual(transcription.phonology.syllables, entry.phonology.syllables)) {
      failures.phonologySyllables = {
        expected: entry.phonology.syllables,
        actual: transcription.phonology.syllables
      };
    } else {
      passedTests++;
    }

    // Test phonetics words
    totalTests++;
    if (!arraysEqual(transcription.phonetics.words, entry.phonetics.words)) {
      failures.phoneticsWords = {
        expected: entry.phonetics.words,
        actual: transcription.phonetics.words
      };
    } else {
      passedTests++;
    }

    // Test phonetics syllables
    totalTests++;
    if (!arraysEqual(transcription.phonetics.syllables, entry.phonetics.syllables)) {
      failures.phoneticsSyllables = {
        expected: entry.phonetics.syllables,
        actual: transcription.phonetics.syllables
      };
    } else {
      passedTests++;
    }

    // Test SAMPA words
    totalTests++;
    if (!arraysEqual(transcription.sampa.words, entry.sampa.words)) {
      failures.sampaWords = {
        expected: entry.sampa.words,
        actual: transcription.sampa.words
      };
    } else {
      passedTests++;
    }

    // Test SAMPA syllables
    totalTests++;
    if (!arraysEqual(transcription.sampa.syllables, entry.sampa.syllables)) {
      failures.sampaSyllables = {
        expected: entry.sampa.syllables,
        actual: transcription.sampa.syllables
      };
    } else {
      passedTests++;
    }

    if (Object.keys(failures).length > 0) {
      failureReports.push({
        entry: i + 1,
        input: entry.input,
        failures
      });
    }
  }

  // Generate summary
  const failedTests = totalTests - passedTests;
  const passRate = ((passedTests / totalTests) * 100).toFixed(2);

  console.log('═'.repeat(70));
  console.log('GOLDEN DATA TEST SUMMARY');
  console.log('═'.repeat(70));
  console.log(`Total entries:     ${goldenData.length}`);
  console.log(`Total tests:       ${totalTests}`);
  console.log(`Passed tests:      ${passedTests}`);
  console.log(`Failed tests:      ${failedTests}`);
  console.log(`Pass rate:         ${passRate}%`);
  console.log(`Failed entries:    ${failureReports.length} / ${goldenData.length}`);
  console.log('═'.repeat(70));

  // Categorize failures
  const categories = {
    phonologyWords: 0,
    phonologySyllables: 0,
    phoneticsWords: 0,
    phoneticsSyllables: 0,
    sampaWords: 0,
    sampaSyllables: 0
  };

  for (const report of failureReports) {
    if (report.failures.phonologyWords) categories.phonologyWords++;
    if (report.failures.phonologySyllables) categories.phonologySyllables++;
    if (report.failures.phoneticsWords) categories.phoneticsWords++;
    if (report.failures.phoneticsSyllables) categories.phoneticsSyllables++;
    if (report.failures.sampaWords) categories.sampaWords++;
    if (report.failures.sampaSyllables) categories.sampaSyllables++;
  }

  console.log('\nFAILURE CATEGORIES:');
  console.log('-'.repeat(70));
  console.log(`Phonology words:        ${categories.phonologyWords}`);
  console.log(`Phonology syllables:    ${categories.phonologySyllables}`);
  console.log(`Phonetics words:        ${categories.phoneticsWords}`);
  console.log(`Phonetics syllables:    ${categories.phoneticsSyllables}`);
  console.log(`SAMPA words:            ${categories.sampaWords}`);
  console.log(`SAMPA syllables:        ${categories.sampaSyllables}`);
  console.log('-'.repeat(70));

  // Show first 10 failures
  console.log('\nFIRST 10 FAILURES:');
  console.log('-'.repeat(70));

  for (let i = 0; i < Math.min(10, failureReports.length); i++) {
    const report = failureReports[i];
    console.log(`\n[${report.entry}] "${report.input}"`);

    if (report.failures.phonologyWords) {
      console.log('  Phonology words mismatch:');
      console.log(`    Expected: [${report.failures.phonologyWords.expected.join(', ')}]`);
      console.log(`    Actual:   [${report.failures.phonologyWords.actual.join(', ')}]`);
    }

    if (report.failures.phonologySyllables) {
      console.log('  Phonology syllables mismatch:');
      console.log(`    Expected: [${report.failures.phonologySyllables.expected.join(', ')}]`);
      console.log(`    Actual:   [${report.failures.phonologySyllables.actual.join(', ')}]`);
    }
  }

  // Save full report to JSON
  const reportPath = join(__dirname, 'golden-data-failures.json');
  writeFileSync(reportPath, JSON.stringify(failureReports, null, 2));
  console.log(`\n\nFull failure report saved to: ${reportPath}`);
  console.log(`Total failed entries: ${failureReports.length}`);
}

main();
