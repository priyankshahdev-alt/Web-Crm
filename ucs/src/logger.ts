const useColor = process.stdout.isTTY === true && !process.env.NO_COLOR;

function wrap(code: string): (s: string) => string {
  return (s: string) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s);
}

export const cyan = wrap('36');
export const green = wrap('32');
export const yellow = wrap('33');
export const red = wrap('31');
export const dim = wrap('2');
export const bold = wrap('1');

export function log(message = ''): void {
  process.stdout.write(`${message}\n`);
}

export function info(message: string): void {
  log(cyan(message));
}

export function success(message: string): void {
  log(green(message));
}

export function warn(message: string): void {
  log(yellow(message));
}

export function error(message: string): void {
  log(red(message));
}

export function dimmed(message: string): void {
  log(dim(message));
}

export function section(title: string): void {
  log('');
  log(bold(`\u2500 ${title}`));
}
