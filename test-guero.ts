import { Transcription } from './dist/index.js';

const t = new Transcription('güero');
console.log('phonology.words:', t.phonology.words);
console.log('phonology.syllables:', t.phonology.syllables);

// Test the replacement manually
let test = 'güero';
console.log('\nManual test:');
console.log('Before:', test);
test = test.replace(/gü([eiéí])/gi, 'gw$1');
console.log('After gü→gw:', test);
test = test.replace(/g([eiéíëï])/g, 'x$1');
console.log('After g→x:', test);
