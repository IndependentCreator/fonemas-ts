# fonemas-ts

This is a TypeScript port of [fonemas](https://github.com/fsanzl/fonemas), a Spanish phonological and phonetic transcription library.

This library provides comprehensive transcription of Spanish text into three parallel representations:

- **Phonological transcription**: Abstract sound units using IPA symbols
- **Phonetic transcription**: Actual pronunciation with allophones in IPA
- **SAMPA transcription**: ASCII-safe phonetic representation

## Installation

```bash
npm install fonemas
# or
pnpm install fonemas
# or
yarn add fonemas
```

## Quick Start

```typescript
import { Transcription } from 'fonemas';

const t = new Transcription('Averigüéis');

// Phonological transcription
console.log(t.phonology.words);      // ['abeɾiˈgwejs']
console.log(t.phonology.syllables);  // ['a', 'be', 'ɾi', 'ˈgwejs']

// Phonetic transcription
console.log(t.phonetics.words);      // ['aβeɾiˈɣwejs']
console.log(t.phonetics.syllables);  // ['a', 'βe', 'ɾi', 'ˈɣwejs']

// SAMPA transcription
console.log(t.sampa.words);          // ['aBeri"Gwejs']
console.log(t.sampa.syllables);      // ['a', 'Be', 'ri', '"Gwejs']
```

## API Reference

### Constructor

```typescript
new Transcription(sentence: string, options?: TranscriptionOptions)
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mono` | `boolean` | `false` | Mark stress on monosyllabic words |
| `exceptions` | `0 \| 1 \| 2` | `1` | Level of syllabification exceptions (0: none, 1: basic, 2: extended) |
| `epenthesis` | `boolean` | `false` | Apply epenthesis to s+consonant clusters (e.g., 'spiritu' → 'espiritu') |
| `aspiration` | `boolean` | `false` | Mark aspiration with ʰ in onset position |
| `rehash` | `boolean` | `false` | Move final consonants to the onset of the next word |
| `stress` | `string` | `'"'` | Custom stress marker for SAMPA output |

### Properties

```typescript
// The cleaned input sentence
t.sentence: string

// Phonological transcription (abstract sound units)
t.phonology: Values  // { words: string[], syllables: string[] }

// Phonetic transcription (actual pronunciation with allophones)
t.phonetics: Values  // { words: string[], syllables: string[] }

// SAMPA transcription (ASCII-safe)
t.sampa: Values      // { words: string[], syllables: string[] }
```

### Methods

```typescript
// Get all three transcriptions as a single object
t.getAll(): TranscriptionResult
```

## Usage Examples

### Basic Transcription

```typescript
import { Transcription } from 'fonemas';

const t = new Transcription('casa');
console.log(t.phonology.words);   // ['kasa'] (no stress on monosyllables by default)
console.log(t.phonetics.words);   // ['kasa']
console.log(t.sampa.words);       // ['kasa']
```

### With Stress on Monosyllables

```typescript
const t = new Transcription('sol', { mono: true });
console.log(t.phonology.words);   // ['ˈsol']
console.log(t.sampa.words);       // ['"sol']
```

### Applying Epenthesis

```typescript
const t = new Transcription('spiritu', { epenthesis: true });
console.log(t.sentence);          // 'espiritu'
```

### Custom Stress Marker

```typescript
const t = new Transcription('casa', { stress: '\'' });
console.log(t.sampa.words);       // ['\'kasa']
```

### Processing Multiple Words

```typescript
const t = new Transcription('hola mundo');
console.log(t.phonology.words);   // ['ola', 'ˈmundo']
console.log(t.phonetics.words);   // ['ola', 'ˈmundo']
```

### Handling -mente Adverbs

```typescript
const t = new Transcription('rápidamente');
// Automatically handles secondary stress on the root
console.log(t.phonology.words);
// The root 'rápida' retains its stress with secondary marker (ˌ)
```

## Command Line Interface

The package includes a command-line tool for transcribing Spanish text directly from the terminal.

### Location

The CLI script is located at `bin/fonemas.js` and is automatically installed as the `fonemas` command when you install the package globally or use it with `npx`.

### Usage

```bash
# Basic usage - outputs phonological transcription
fonemas "hola mundo"
# Output: ˈola ˈmundo

# Structured JSON output
fonemas --structured "Averigüéis"
# Output: Complete JSON with phonology, phonetics, and SAMPA

# Select transcription format
fonemas --format phonetics "casa blanca"
# Output: ˈkasa ˈblanka

fonemas --format sampa "casa blanca"
# Output: "kasa "blaNka

# With options
fonemas --mono "sol"
# Output: ˈsol (with stress marker on monosyllable)

fonemas --epenthesis "spiritu"
# Output: esˈpiɾitu

# Using with pipes
echo "buenos días" | fonemas --structured

# Show help
fonemas --help
```

### Available Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--structured` | `-s` | Output complete JSON with all transcription formats |
| `--format <type>` | `-f` | Select output format: `phonology`, `phonetics`, or `sampa` (default: `phonology`) |
| `--mono` | `-m` | Mark stress on monosyllabic words |
| `--epenthesis` | `-e` | Add 'e' before s+consonant clusters |
| `--aspiration` | `-a` | Mark aspiration with ʰ |
| `--rehash` | `-r` | Move final consonants to next syllable onset |
| `--help` | `-h` | Show help message |

### Running Locally During Development

If you're working on the codebase and want to test the CLI:

```bash
# From the project root
./bin/fonemas.js "tu texto aquí"

# Or using npx with tsx (for development without building)
npx tsx src/cli.ts "tu texto aquí"
```

## Phonological Features

### Allophones

The library correctly handles Spanish allophonic variations:
- **b/d/g** → **β/ð/ɣ** (fricatives in intervocalic position)

```typescript
const t = new Transcription('cabo');
console.log(t.phonetics.words);   // ['ˈkaβo'] - b becomes β between vowels
```

### Coarticulations

- **Nasal assimilation**: n → m before p/b, n → ŋ before k/g
- **Voicing**: s/θ/f become voiced before voiced consonants
- **Fortition**: fricatives become stops after nasals/laterals

```typescript
const t = new Transcription('un beso');
console.log(t.phonetics.words);   // Shows 'm' instead of 'n' before 'b'
```

### Special Cases

- **Mexican place names**: 'x' pronounced as /x/ in words like 'México', 'Oaxaca', 'Texas'
- **Y handling**: Varies by position (word-initial, word-final, intervocalic)
- **G before e/i**: Becomes /x/ (velar fricative)
- **Diphthongs**: High vowels (i, u) become semivowels (j, w) in diphthong contexts

## Type Definitions

```typescript
interface Values {
  words: string[];
  syllables: string[];
}

interface TranscriptionOptions {
  mono?: boolean;
  exceptions?: 0 | 1 | 2;
  epenthesis?: boolean;
  aspiration?: boolean;
  rehash?: boolean;
  stress?: string;
}

interface TranscriptionResult {
  phonology: Values;
  phonetics: Values;
  sampa: Values;
}
```

## Technical Details

### Dependencies

- **silabeador-ts**: Spanish syllabification library (required for syllable detection)

### Requirements

- Node.js >= 18.0.0
- TypeScript >= 5.0 (for development)

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/fonemas-ts.git
cd fonemas-ts

# Install dependencies
pnpm install

# Build the TypeScript code
pnpm build
```

### Running Tests

The project uses [Vitest](https://vitest.dev/) for testing.

```bash
# Run all tests once
pnpm test run

# Run tests in watch mode (reruns on file changes)
pnpm test

# Run tests with interactive UI
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage
```

#### Test Files

- `tests/transcription.test.ts` - Main transcription tests (36 tests)
- `tests/clean.test.ts` - Text cleaning and normalization tests (12 tests)
- `src/transcription.test.ts` - Regression tests for bug fixes (10 tests)
- `tests/golden-data.test.ts` - Comprehensive validation against 700 reference entries (4200 tests)

#### Golden Data Tests

The project includes a comprehensive test suite with 700 golden data entries from the Python implementation:

```bash
# Run golden data validation tests
pnpm test run golden-data

# Generate a detailed failure analysis report
npx tsx tests/golden-data-summary.ts
```

**Current Golden Data Results:**
- Total entries: 700
- Total tests: 4,200 (700 entries × 6 assertions)
- Pass rate: **93.29%** (3,918 passed, 282 failed)
- Failed entries: 47 / 700


### Project Structure

```
fonemas-ts/
├── src/
│   ├── cli.ts              # Command-line interface
│   ├── transcription.ts    # Main Transcription class
│   ├── types.ts            # TypeScript type definitions
│   ├── data/               # Phonological data (consonants, allophones, etc.)
│   └── utils/              # Utility functions (clean, phonology, phonetics)
├── bin/
│   └── fonemas.js          # CLI entry point
├── dist/                   # Compiled JavaScript output
└── tests/                  # Test files
```

## Credits

- Original Python library: [fonemas](https://github.com/fsanzl/fonemas) by Fernando Sanz-Lázaro

```
Sanz-Lázaro, F. (2022). fonemas: A Python library for Spanish phonological
and phonetic transcription. Software available at:
https://github.com/fsanzl/fonemas
```
