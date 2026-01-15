import { Transcription } from './dist/index.js';

console.log('=== fonemas-ts Verification ===\n');

// Example 1: Basic usage
console.log('1. Basic transcription:');
const t1 = new Transcription('casa', { mono: true });
console.log('   Input: casa');
console.log('   Phonology:', t1.phonology.words);
console.log('   Phonetics:', t1.phonetics.words);
console.log('   SAMPA:', t1.sampa.words);

// Example 2: Multiple words
console.log('\n2. Multiple words:');
const t2 = new Transcription('hola mundo');
console.log('   Input: hola mundo');
console.log('   Phonology:', t2.phonology.words);
console.log('   Phonetics:', t2.phonetics.words);

// Example 3: Allophones
console.log('\n3. Allophone demonstration (b → β):');
const t3 = new Transcription('cabo');
console.log('   Input: cabo');
console.log('   Phonology:', t3.phonology.words);
console.log('   Phonetics:', t3.phonetics.words, '(note β)');

// Example 4: Epenthesis
console.log('\n4. Epenthesis:');
const t4 = new Transcription('spiritu', { epenthesis: true });
console.log('   Input: spiritu');
console.log('   Cleaned:', t4.sentence);
console.log('   Phonology:', t4.phonology.words);

// Example 5: Custom stress marker
console.log('\n5. Custom stress marker:');
const t5 = new Transcription('casa', { mono: true, stress: '\'' });
console.log('   Input: casa');
console.log('   SAMPA:', t5.sampa.words);

console.log('\n✓ All examples completed successfully!');
