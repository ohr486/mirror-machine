#!/usr/bin/env node
/**
 * GREEN phase verification for Task 1.2
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('Running GREEN phase verification for Task 1.2...\n');

let failures = 0;
let passes = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passes++;
  } catch (error) {
    console.log(`❌ FAIL: ${name}`);
    console.log(`   ${error.message}`);
    failures++;
  }
}

function expect(value) {
  return {
    toBe(expected) {
      if (value !== expected) {
        throw new Error(`Expected ${expected}, got ${value}`);
      }
    },
    toBeDefined() {
      if (value === undefined) {
        throw new Error('Expected value to be defined');
      }
    },
    toContain(item) {
      if (!Array.isArray(value) || !value.includes(item)) {
        throw new Error(`Expected array ${JSON.stringify(value)} to contain ${item}`);
      }
    }
  };
}

// Test .eslintrc.json
const eslintrcPath = join(process.cwd(), '.eslintrc.json');
if (!existsSync(eslintrcPath)) {
  console.log('❌ CRITICAL: .eslintrc.json does not exist');
  process.exit(1);
}

const eslintrc = JSON.parse(readFileSync(eslintrcPath, 'utf-8'));

test('.eslintrc.json uses TypeScript parser', () => {
  expect(eslintrc.parser).toBe('@typescript-eslint/parser');
});

test('.eslintrc.json has correct parser options', () => {
  expect(eslintrc.parserOptions).toBeDefined();
  expect(eslintrc.parserOptions.ecmaVersion).toBe(2022);
  expect(eslintrc.parserOptions.sourceType).toBe('module');
});

test('.eslintrc.json extends recommended configs', () => {
  expect(eslintrc.extends).toContain('eslint:recommended');
  expect(eslintrc.extends).toContain('plugin:@typescript-eslint/recommended');
  expect(eslintrc.extends).toContain('plugin:prettier/recommended');
});

test('.eslintrc.json has TypeScript-specific rules', () => {
  expect(eslintrc.rules['@typescript-eslint/no-explicit-any']).toBe('error');
  expect(eslintrc.rules['@typescript-eslint/explicit-function-return-type']).toBe('warn');
});

test('.eslintrc.json disables react-in-jsx-scope for React 17+', () => {
  expect(eslintrc.rules['react/react-in-jsx-scope']).toBe('off');
});

// Test .prettierrc.json
const prettierrcPath = join(process.cwd(), '.prettierrc.json');
if (!existsSync(prettierrcPath)) {
  console.log('❌ CRITICAL: .prettierrc.json does not exist');
  process.exit(1);
}

const prettierrc = JSON.parse(readFileSync(prettierrcPath, 'utf-8'));

test('.prettierrc.json uses semicolons', () => {
  expect(prettierrc.semi).toBe(true);
});

test('.prettierrc.json uses trailing commas', () => {
  expect(prettierrc.trailingComma).toBe('all');
});

test('.prettierrc.json uses single quotes', () => {
  expect(prettierrc.singleQuote).toBe(true);
});

test('.prettierrc.json has printWidth set to 100', () => {
  expect(prettierrc.printWidth).toBe(100);
});

test('.prettierrc.json uses 2 spaces for indentation', () => {
  expect(prettierrc.tabWidth).toBe(2);
  expect(prettierrc.useTabs).toBe(false);
});

console.log(`\n📊 Results: ${passes} passed, ${failures} failed`);
console.log(failures === 0 ? '✅ GREEN phase complete!' : '❌ GREEN phase failed');

process.exit(failures > 0 ? 1 : 0);
