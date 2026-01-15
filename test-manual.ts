import { Transcription } from './dist/index.js';

const t = new Transcription('casa', { mono: true });
console.log('phonology.words:', t.phonology.words);
console.log('phonology.syllables:', t.phonology.syllables);
console.log('phonetics.words:', t.phonetics.words);
console.log('sampa.words:', t.sampa.words);
