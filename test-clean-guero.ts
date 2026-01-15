import { cleanSentence } from './dist/utils/clean.js';

const cleaned = cleanSentence('güero', false);
console.log('After cleaning:', cleaned);
console.log('Char codes:', Array.from(cleaned).map(c => c.charCodeAt(0)));
