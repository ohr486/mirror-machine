#!/usr/bin/env node
/**
 * RED phase verification for Task 1.2
 */

import { existsSync } from 'fs';
import { join } from 'path';

console.log('Running RED phase verification for Task 1.2...\n');

const eslintrcPath = join(process.cwd(), '.eslintrc.json');
const prettierrcPath = join(process.cwd(), '.prettierrc.json');

let failures = 0;

// Test 1: .eslintrc.json should not exist yet
if (existsSync(eslintrcPath)) {
  console.log('❌ FAIL: .eslintrc.json already exists (expected to not exist in RED phase)');
  failures++;
} else {
  console.log('✅ PASS: .eslintrc.json does not exist (RED phase confirmed)');
}

// Test 2: .prettierrc.json should not exist yet
if (existsSync(prettierrcPath)) {
  console.log('❌ FAIL: .prettierrc.json already exists (expected to not exist in RED phase)');
  failures++;
} else {
  console.log('✅ PASS: .prettierrc.json does not exist (RED phase confirmed)');
}

console.log(`\nRED phase verification complete: ${failures === 0 ? 'Tests are ready to fail' : 'Unexpected state'}`);
process.exit(failures > 0 ? 1 : 0);
