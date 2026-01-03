/**
 * tsconfig.json validation tests
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('tsconfig.json', () => {
  const tsconfigPath = join(process.cwd(), 'tsconfig.json');
  let tsconfig: any;

  beforeAll(() => {
    expect(existsSync(tsconfigPath)).toBe(true);
    const content = readFileSync(tsconfigPath, 'utf-8');
    tsconfig = JSON.parse(content);
  });

  test('should have strict mode enabled', () => {
    expect(tsconfig.compilerOptions).toBeDefined();
    expect(tsconfig.compilerOptions.strict).toBe(true);
  });

  test('should support React JSX transformation', () => {
    expect(tsconfig.compilerOptions.jsx).toBe('react-jsx');
    expect(tsconfig.compilerOptions.jsxImportSource).toBe('react');
  });

  test('should have Node.js type definitions configured', () => {
    expect(tsconfig.compilerOptions.types).toContain('node');
    expect(tsconfig.compilerOptions.types).toContain('jest');
  });

  test('should have proper module settings', () => {
    expect(tsconfig.compilerOptions.target).toBe('ES2022');
    expect(tsconfig.compilerOptions.module).toBe('ESNext');
    expect(tsconfig.compilerOptions.moduleResolution).toBe('node');
  });

  test('should have strict type checking options', () => {
    expect(tsconfig.compilerOptions.noUnusedLocals).toBe(true);
    expect(tsconfig.compilerOptions.noUnusedParameters).toBe(true);
    expect(tsconfig.compilerOptions.noFallthroughCasesInSwitch).toBe(true);
  });

  test('should include src directory', () => {
    expect(tsconfig.include).toContain('src/**/*');
  });

  test('should exclude node_modules, dist, and coverage', () => {
    expect(tsconfig.exclude).toContain('node_modules');
    expect(tsconfig.exclude).toContain('dist');
    expect(tsconfig.exclude).toContain('coverage');
  });
});
