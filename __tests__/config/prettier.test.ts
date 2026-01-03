/**
 * .prettierrc.json validation tests
 * Requirements: 5.1, 5.2, 5.3, 5.5, 6.1, 6.2, 6.4
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('.prettierrc.json', () => {
  const prettierrcPath = join(process.cwd(), '.prettierrc.json');
  let prettierrc: any;

  beforeAll(() => {
    expect(existsSync(prettierrcPath)).toBe(true);
    const content = readFileSync(prettierrcPath, 'utf-8');
    prettierrc = JSON.parse(content);
  });

  test('should use semicolons', () => {
    expect(prettierrc.semi).toBe(true);
  });

  test('should use trailing commas', () => {
    expect(prettierrc.trailingComma).toBe('all');
  });

  test('should use single quotes', () => {
    expect(prettierrc.singleQuote).toBe(true);
  });

  test('should have printWidth set to 100', () => {
    expect(prettierrc.printWidth).toBe(100);
  });

  test('should use 2 spaces for indentation', () => {
    expect(prettierrc.tabWidth).toBe(2);
    expect(prettierrc.useTabs).toBe(false);
  });

  test('should avoid arrow function parentheses when possible', () => {
    expect(prettierrc.arrowParens).toBe('avoid');
  });

  test('should use LF line endings', () => {
    expect(prettierrc.endOfLine).toBe('lf');
  });
});
