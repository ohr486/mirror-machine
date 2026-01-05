/**
 * .eslintrc.json validation tests
 * Requirements: ESLint configuration validation
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('.eslintrc.json', () => {
  const eslintrcPath = join(process.cwd(), '.eslintrc.json');
  let eslintrc: any;

  beforeAll(() => {
    expect(existsSync(eslintrcPath)).toBe(true);
    const content = readFileSync(eslintrcPath, 'utf-8');
    eslintrc = JSON.parse(content);
  });

  test('should use TypeScript parser', () => {
    expect(eslintrc.parser).toBe('@typescript-eslint/parser');
  });

  test('should have correct parser options', () => {
    expect(eslintrc.parserOptions).toBeDefined();
    expect(eslintrc.parserOptions.ecmaVersion).toBe(2022);
    expect(eslintrc.parserOptions.sourceType).toBe('module');
    expect(eslintrc.parserOptions.ecmaFeatures).toBeDefined();
    expect(eslintrc.parserOptions.ecmaFeatures.jsx).toBe(true);
    expect(eslintrc.parserOptions.project).toBe('./tsconfig.json');
  });

  test('should extend recommended configurations', () => {
    expect(eslintrc.extends).toBeDefined();
    expect(eslintrc.extends).toContain('eslint:recommended');
    expect(eslintrc.extends).toContain('plugin:@typescript-eslint/recommended');
    expect(eslintrc.extends).toContain(
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
    );
    expect(eslintrc.extends).toContain('plugin:react/recommended');
    expect(eslintrc.extends).toContain('plugin:react-hooks/recommended');
    expect(eslintrc.extends).toContain('plugin:prettier/recommended');
  });

  test('should have required plugins', () => {
    expect(eslintrc.plugins).toBeDefined();
    expect(eslintrc.plugins).toContain('@typescript-eslint');
    expect(eslintrc.plugins).toContain('react');
    expect(eslintrc.plugins).toContain('react-hooks');
  });

  test('should have TypeScript-specific rules', () => {
    expect(eslintrc.rules).toBeDefined();
    expect(eslintrc.rules['@typescript-eslint/no-explicit-any']).toBe('error');
    expect(eslintrc.rules['@typescript-eslint/explicit-function-return-type']).toBe('warn');
  });

  test('should disable react-in-jsx-scope rule for React 17+', () => {
    expect(eslintrc.rules['react/react-in-jsx-scope']).toBe('off');
  });

  test('should have React version detection', () => {
    expect(eslintrc.settings).toBeDefined();
    expect(eslintrc.settings.react).toBeDefined();
    expect(eslintrc.settings.react.version).toBe('detect');
  });
});
