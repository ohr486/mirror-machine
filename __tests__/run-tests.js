#!/usr/bin/env node
/**
 * Minimal test runner to verify RED phase
 * This will be replaced by Jest once package.json is created
 */

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Running RED phase verification...\n');

const packageJsonPath = join(process.cwd(), 'package.json');
const tsconfigPath = join(process.cwd(), 'tsconfig.json');

let failures = 0;

// Test 1: package.json should not exist yet
if (existsSync(packageJsonPath)) {
  console.log('❌ FAIL: package.json already exists (expected to not exist in RED phase)');
  failures++;
} else {
  console.log('✅ PASS: package.json does not exist (RED phase confirmed)');
}

// Test 2: tsconfig.json should not exist yet
if (existsSync(tsconfigPath)) {
  console.log('❌ FAIL: tsconfig.json already exists (expected to not exist in RED phase)');
  failures++;
} else {
  console.log('✅ PASS: tsconfig.json does not exist (RED phase confirmed)');
}

console.log(`\nRED phase verification complete: ${failures === 0 ? 'Tests are ready to fail' : 'Unexpected state'}`);
process.exit(failures > 0 ? 1 : 0);
