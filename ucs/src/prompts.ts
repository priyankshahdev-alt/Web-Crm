import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export interface AskOptions {
  /** Default returned when the user just presses Enter. */
  default?: string;
  /** If true, the answer is hidden (passwords). */
  secret?: boolean;
  required?: boolean;
}

export async function ask(
  question: string,
  options: AskOptions = {},
): Promise<string> {
  if (options.secret && !output.isTTY) {
    throw new Error('A password is required but stdin is not a TTY.');
  }

  const rl = readline.createInterface({ input, output, terminal: output.isTTY });

  try {
    const suffix = options.default !== undefined ? ` [${options.default}]` : '';
    const raw = await rl.question(`${question}${suffix} `);
    const value = raw.trim() || options.default || '';
    if (options.required && !value) {
      throw new Error(`${question} is required.`);
    }
    return value;
  } finally {
    rl.close();
  }
}

export async function confirm(question: string, defaultYes = true): Promise<boolean> {
  const hint = defaultYes ? 'Y/n' : 'y/N';
  const answer = (await ask(`${question} (${hint})`, { default: defaultYes ? 'y' : 'n' })).toLowerCase();
  return answer.startsWith('y');
}

export async function select<T extends string>(
  question: string,
  options: readonly T[],
  defaultIndex = 0,
): Promise<T> {
  for (let i = 0; i < options.length; i += 1) {
    process.stdout.write(`  ${i + 1}. ${options[i]}\n`);
  }
  const answer = await ask(question, { default: String(defaultIndex + 1) });
  const parsed = Number.parseInt(answer, 10);
  if (Number.isInteger(parsed) && parsed >= 1 && parsed <= options.length) {
    return options[parsed - 1];
  }
  const direct = options.find((o) => o.toLowerCase() === answer.toLowerCase());
  return direct ?? options[defaultIndex];
}
