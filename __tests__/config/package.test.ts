/**
 * package.json validation tests
 * Requirements: 2.1, 2.2, 7.1, 7.2, 7.3, 7.5, 8.1, 8.2, 8.4, 8.5, 9.1
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('package.json', () => {
  const packageJsonPath = join(process.cwd(), 'package.json');
  let packageJson: any;

  beforeAll(() => {
    expect(existsSync(packageJsonPath)).toBe(true);
    const content = readFileSync(packageJsonPath, 'utf-8');
    packageJson = JSON.parse(content);
  });

  test('should have project metadata', () => {
    expect(packageJson.name).toBe('mirror-machine');
    expect(packageJson.version).toBeDefined();
    expect(packageJson.type).toBe('module');
  });

  test('should specify Node.js version requirement', () => {
    expect(packageJson.engines).toBeDefined();
    expect(packageJson.engines.node).toBe('>=20.0.0');
  });

  test('should have required npm scripts', () => {
    expect(packageJson.scripts).toBeDefined();
    expect(packageJson.scripts.dev).toBe('tsx watch src/cli.tsx');
    expect(packageJson.scripts.build).toBe('tsc');
    expect(packageJson.scripts.test).toBe('jest');
    expect(packageJson.scripts['test:watch']).toBe('jest --watch');
    expect(packageJson.scripts.lint).toBe('eslint . --ext .ts,.tsx');
    expect(packageJson.scripts['lint:fix']).toBe('eslint . --ext .ts,.tsx --fix');
    expect(packageJson.scripts.format).toBe('prettier --write "src/**/*.{ts,tsx,json,md}"');
    expect(packageJson.scripts['format:check']).toBe(
      'prettier --check "src/**/*.{ts,tsx,json,md}"',
    );
  });

  test('should have React Ink dependencies', () => {
    expect(packageJson.dependencies).toBeDefined();
    expect(packageJson.dependencies.ink).toMatch(/^\^4\./);
    expect(packageJson.dependencies.react).toMatch(/^\^18\./);
  });

  test('should have AWS SDK dependency', () => {
    expect(packageJson.dependencies['@aws-sdk/client-s3']).toMatch(/^\^3\./);
  });

  test('should have winston logger dependency', () => {
    expect(packageJson.dependencies.winston).toMatch(/^\^3\./);
  });

  test('should have TypeScript and tsx in devDependencies', () => {
    expect(packageJson.devDependencies).toBeDefined();
    expect(packageJson.devDependencies.typescript).toMatch(/^\^5\./);
    expect(packageJson.devDependencies.tsx).toMatch(/^\^4\./);
    expect(packageJson.devDependencies['@types/node']).toMatch(/^\^20\./);
    expect(packageJson.devDependencies['@types/react']).toMatch(/^\^18\./);
  });

  test('should have Jest and testing dependencies', () => {
    expect(packageJson.devDependencies.jest).toMatch(/^\^29\./);
    expect(packageJson.devDependencies['ts-jest']).toMatch(/^\^29\./);
    expect(packageJson.devDependencies['ink-testing-library']).toMatch(/^\^3\./);
    expect(packageJson.devDependencies['@testing-library/jest-dom']).toMatch(/^\^6\./);
  });

  test('should have ESLint dependencies', () => {
    expect(packageJson.devDependencies.eslint).toMatch(/^\^8\./);
    expect(packageJson.devDependencies['@typescript-eslint/eslint-plugin']).toMatch(/^\^6\./);
    expect(packageJson.devDependencies['@typescript-eslint/parser']).toMatch(/^\^6\./);
    expect(packageJson.devDependencies['eslint-config-prettier']).toMatch(/^\^9\./);
    expect(packageJson.devDependencies['eslint-plugin-prettier']).toMatch(/^\^5\./);
  });

  test('should have Prettier dependency', () => {
    expect(packageJson.devDependencies.prettier).toMatch(/^\^3\./);
  });
});
