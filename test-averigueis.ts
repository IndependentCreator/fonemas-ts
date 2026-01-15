import { Transcription } from './dist/index.js';
import { Syllabification } from 'silabeador';

console.log('=== Testing Averigüéis ===');
const t = new Transcription('Averigüéis');
console.log('phonology.words:', t.phonology.words);
console.log('phonology.syllables:', t.phonology.syllables);
console.log('phonetics.words:', t.phonetics.words);
console.log('sampa.words:', t.sampa.words);

console.log('\n=== Silabeador output for averigweis ===');
const syll = new Syllabification('averigweis', 1, true, true);
console.log('syllables:', syll.syllables);
console.log('stress:', syll.stress);
