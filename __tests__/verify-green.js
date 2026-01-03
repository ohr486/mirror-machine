#!/usr/bin/env node
/**
 * GREEN phase verification - run config validation tests
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { test, expect, getTestStats } from './test-helpers.js';

console.log('Running GREEN phase verification...\n');

// Test package.json
const packageJsonPath = join(process.cwd(), 'package.json');
if (!existsSync(packageJsonPath)) {
  console.log('❌ CRITICAL: package.json does not exist');
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

test('package.json has project metadata', () => {
  expect(packageJson.name).toBe('mirror-machine');
  expect(packageJson.version).toBeDefined();
  expect(packageJson.type).toBe('module');
});

test('package.json specifies Node.js version requirement', () => {
  expect(packageJson.engines).toBeDefined();
  expect(packageJson.engines.node).toBe('>=20.0.0');
});

test('package.json has all required npm scripts', () => {
  expect(packageJson.scripts.dev).toBe('tsx watch src/cli.tsx');
  expect(packageJson.scripts.build).toBe('tsc');
  expect(packageJson.scripts.test).toBe('jest');
});

test('package.json has React Ink dependencies', () => {
  expect(packageJson.dependencies.ink).toMatch(/^\^4\./);
  expect(packageJson.dependencies.react).toMatch(/^\^18\./);
});

test('package.json has AWS SDK dependency', () => {
  expect(packageJson.dependencies['@aws-sdk/client-s3']).toMatch(/^\^3\./);
});

test('package.json has TypeScript devDependencies', () => {
  expect(packageJson.devDependencies.typescript).toMatch(/^\^5\./);
  expect(packageJson.devDependencies.tsx).toMatch(/^\^4\./);
});

test('package.json has Jest dependencies', () => {
  expect(packageJson.devDependencies.jest).toMatch(/^\^29\./);
  expect(packageJson.devDependencies['ts-jest']).toMatch(/^\^29\./);
});

// Test tsconfig.json
const tsconfigPath = join(process.cwd(), 'tsconfig.json');
if (!existsSync(tsconfigPath)) {
  console.log('❌ CRITICAL: tsconfig.json does not exist');
  process.exit(1);
}

const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));

test('tsconfig.json has strict mode enabled', () => {
  expect(tsconfig.compilerOptions.strict).toBe(true);
});

test('tsconfig.json supports React JSX transformation', () => {
  expect(tsconfig.compilerOptions.jsx).toBe('react-jsx');
  expect(tsconfig.compilerOptions.jsxImportSource).toBe('react');
});

test('tsconfig.json has Node.js type definitions', () => {
  expect(tsconfig.compilerOptions.types).toContain('node');
  expect(tsconfig.compilerOptions.types).toContain('jest');
});

test('tsconfig.json includes src directory', () => {
  expect(tsconfig.include).toContain('src/**/*');
});

test('tsconfig.json excludes build directories', () => {
  expect(tsconfig.exclude).toContain('node_modules');
  expect(tsconfig.exclude).toContain('dist');
  expect(tsconfig.exclude).toContain('coverage');
});

const { passes, failures } = getTestStats();
console.log(`\n📊 Results: ${passes} passed, ${failures} failed`);
console.log(failures === 0 ? '✅ GREEN phase complete!' : '❌ GREEN phase failed');

process.exit(failures > 0 ? 1 : 0);
