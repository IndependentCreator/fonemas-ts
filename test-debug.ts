import { Syllabification } from 'silabeador';

const syll = new Syllabification('casa', 1, true, true);
console.log('syllables:', syll.syllables);
console.log('stress:', syll.stress);
