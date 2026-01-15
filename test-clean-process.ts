import { cleanSentence } from './dist/utils/clean.js';

const raw = 'Averigüéis';
const cleaned = cleanSentence(raw, false);
console.log('After cleaning:', cleaned);

// Now simulate what happens in phonology before silabeador
let sentence = cleaned;

// Consonant replacements
sentence = sentence.replace(/gü([eiéí])/gi, 'gw$1');
console.log('After gü → gw:', sentence);

// The sentence then gets passed to splitVariables which calls silabeador
console.log('This is what silabeador will receive');
