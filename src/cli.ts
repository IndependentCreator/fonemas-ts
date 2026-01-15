#!/usr/bin/env node

import { Transcription, TranscriptionOptions } from './index.js';
import { createInterface } from 'readline';

interface CliConfig {
  text: string | null;
  structured: boolean;
  format: 'phonology' | 'phonetics' | 'sampa';
  options: TranscriptionOptions;
}

function printHelp(): void {
  console.log(`
fonemas - Spanish phonological and phonetic transcription

Usage:
  fonemas [options] <text>
  echo <text> | fonemas [options]

Arguments:
  <text>              Text to transcribe

Options:
  -s, --structured    Output in structured JSON format
  -f, --format <type> Transcription format: phonology|phonetics|sampa (default: phonology)
  -m, --mono          Mark stress on monosyllables
  -e, --epenthesis    Add 'e' before s+consonant clusters
  -a, --aspiration    Mark aspiration with ʰ
  -r, --rehash        Move final consonants to next syllable onset
  -h, --help          Show this help message

Examples:
  fonemas "hola mundo"
  fonemas --structured "Averigüéis"
  fonemas --format phonetics "casa"
  echo "buenos días" | fonemas --structured

Output:
  Default (string):   Joined words from the selected format
  Structured (JSON):  Complete transcription with all formats and syllables
`);
  process.exit(0);
}

function parseArgs(args: string[]): CliConfig {
  const config: CliConfig = {
    text: null,
    structured: false,
    format: 'phonology',
    options: {}
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '-h':
      case '--help':
        printHelp();
        break;

      case '-s':
      case '--structured':
        config.structured = true;
        break;

      case '-f':
      case '--format':
        i++;
        if (i >= args.length) {
          console.error('Error: --format requires a value (phonology|phonetics|sampa)');
          process.exit(1);
        }
        const format = args[i];
        if (!['phonology', 'phonetics', 'sampa'].includes(format)) {
          console.error('Error: --format must be one of: phonology, phonetics, sampa');
          process.exit(1);
        }
        config.format = format as 'phonology' | 'phonetics' | 'sampa';
        break;

      case '-m':
      case '--mono':
        config.options.mono = true;
        break;

      case '-e':
      case '--epenthesis':
        config.options.epenthesis = true;
        break;

      case '-a':
      case '--aspiration':
        config.options.aspiration = true;
        break;

      case '-r':
      case '--rehash':
        config.options.rehash = true;
        break;

      default:
        if (arg.startsWith('-')) {
          console.error(`Error: Unknown option '${arg}'`);
          console.error('Use --help to see available options');
          process.exit(1);
        }
        if (config.text === null) {
          config.text = arg;
        } else {
          config.text += ' ' + arg;
        }
    }
  }

  return config;
}

async function readStdin(): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  const lines: string[] = [];
  for await (const line of rl) {
    lines.push(line);
  }

  return lines.join(' ').trim();
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const config = parseArgs(args);

  if (config.text === null) {
    if (process.stdin.isTTY) {
      console.error('Error: No text provided');
      console.error('Usage: fonemas [options] <text>');
      console.error('Use --help for more information');
      process.exit(1);
    } else {
      config.text = await readStdin();
      if (!config.text) {
        console.error('Error: No input provided');
        process.exit(1);
      }
    }
  }

  const transcription = new Transcription(config.text, config.options);

  if (config.structured) {
    const result = {
      sentence: transcription.sentence,
      phonology: transcription.phonology,
      phonetics: transcription.phonetics,
      sampa: transcription.sampa
    };
    console.log(JSON.stringify(result, null, 2));
  } else {
    const output = transcription[config.format].words.join(' ');
    console.log(output);
  }
}

main().catch((error: Error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
